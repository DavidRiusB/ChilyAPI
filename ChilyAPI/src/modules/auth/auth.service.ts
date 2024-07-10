import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { RegisterUserDTO } from "./dto/register.dto";
import { AuthRepository } from "./auth.repository";
import { UserService } from "../user/user.service";
import { DataSource, EntityManager } from "typeorm";
import { User } from "../user/entity/user.entity";
import { usersSeed } from "./users-seed";
import { hashPassword } from "src/utils/hashing/bcrypt.utils";
import { Credential } from "./entities/auth.entity";
import { UserLoginGoogleDto } from "./dto/loginGoogle.dto";
import { JwtService } from "@nestjs/jwt";
import { NotificationEmailsService } from "../notifications/notificationEmails.service";
import * as bcrypt from "bcryptjs";
import { config as dotenvConfig } from "dotenv";
dotenvConfig({
  path: ".env.development",
});

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    private jwtService: JwtService,
    private readonly notificationEmailsService: NotificationEmailsService,
  ) {}

  async onModuleInit() {
    await this.seedUsers(usersSeed);
  }

  async seedUsers(usersSeed: any[]) {
    const users = await this.userService.findAll({ page: 1, limit: 10 });
    if (users.total !== 0) {
      return "DB has users";
    }

    return this.dataSource.transaction(async (manager: EntityManager) => {
      for (const userData of usersSeed) {
        const hashedPassword = await hashPassword(userData.password);

        const newCredential = new Credential();
        newCredential.email = userData.email;
        newCredential.password = hashedPassword;
        newCredential.NIN = userData.NIN;
        newCredential.phone = userData.phone;
        await manager.save(Credential, newCredential);

        const newUser = new User();
        newUser.name = userData.name;
        newUser.email = userData.email;
        newUser.role = userData.role;
        newUser.credential = newCredential;
        await manager.save(User, newUser);
      }
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const credential = await this.authRepository.signIn({ email, password });
    if (!credential) {
      return null;
    }
    const user = await this.userService.findByCredentialsId(credential);
    return user;
  }

  async generateToken(
    user: User,
  ): Promise<{ access_token: string; user: User }> {
    const payload = {
      id: user.id,
      email: user.email,
      rol: user.role,
    };
    const access_token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return {
      access_token: access_token,
      user: user,
    };
  }

  async register(newUserData: RegisterUserDTO): Promise<User> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const { email, password, NIN, phone, name } = newUserData;

        const credential = await this.authRepository.createCredentials(
          email,
          password,
          NIN,
          phone,
        );
        await manager.save(credential);

        const user = await this.userService.createUser(newUserData, credential);
        await manager.save(user);

        await this.notificationEmailsService.sendRegistrationEmail(email, name);

        return user;
      });
    }catch (error) {
      console.log(error.detail);
    
      const match1 = error.detail.match(/Ya existe la llave \((.+?)\)=\((.+?)\)/);
      const match2 = error.detail.match(/Key \((.+?)\)=\((.+?)\) already exists/);
      
      console.log("error service");
      console.log(match1, match2);
    
      const translations = {
        phone: 'teléfono',
        email: 'correo electrónico',
        NIN: 'Número de Identificación Nacional',
      };
    
      const match = match1 || match2;
    
      if (match) {
        console.log("Match");
        let [_, key, value] = match;
    
        key = translations[key] || key;
    
        throw new BadRequestException(`el ${key} ${value} ya fue usado anteriormente`);
      } else {
        throw error;
      }
    }
  }

  async googleLogin(data: UserLoginGoogleDto) {
    try {
      const user = await this.userService.createUserGoogle(data);
      console.log(user);
      const access_token = this.jwtService.sign(
        {
          id: user.id,
          email: user.email,
          rol: "google",
        },
        {
          secret: process.env.JWT_SECRET,
        },
      );

      console.log(access_token);

      return {
        access_token: access_token,
        user: user,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      console.log("Email no encontrado");
      throw new NotFoundException("Email no encontrado");
    }

    const payload = { userId: user.id };
    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: "1h", // Asegúrate de que el token tiene un tiempo de expiración adecuado
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.notificationEmailsService.sendPasswordResetEmail(
      email,
      resetLink,
    );

    return { message: "Link para cambiar contraseña enviado" };
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      const userId = payload.userId;
      console.log(`User ID from token: ${userId}`);

      const updateResult = await this.authRepository.updatePassword(
        userId,
        newPassword,
      );
      console.log(`Password update result: ${JSON.stringify(updateResult)}`);

      const user = await this.userService.findUserById(userId);
      if (user.email && user.name) {
        await this.notificationEmailsService.sendPasswordChangeSuccessEmail(
          user.email,
          user.name,
        );
      } else {
        console.error("Email or username is missing from user object");
      }
      return { message: "Contraseña restablecida exitosamente" };
    } catch (error) {
      console.error(`Error during password reset: ${error.message}`);
      throw new BadRequestException("Token invalido o expirado");
    }
  }
}
