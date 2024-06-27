import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterUserDTO } from "./dto/register.dto";
import { AuthRepository } from "./auth.repository";
import { UserService } from "../user/user.service";
import { DataSource, EntityManager } from "typeorm";
import { User } from "../user/entity/user.entity";
import { LogoutDTO } from "./dto/logout.dto";
import { usersSeed } from "./users-seed";
import { hashPassword } from "src/utils/hashing/bcrypt.utils";
import { Credential } from "./entities/auth.entity";
import { UserLoginDTO } from "./dto/login.dto";
import { UserLoginGoogleDto } from "./dto/loginGoogle.dto";
import { JwtService } from "@nestjs/jwt";
import { NotificationEmailsService } from "../../utils/shared/notification-register-emails/notificationEmails";

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
        newUser.NIN = userData.NIN;
        newUser.phone = userData.phone;
        newUser.role = userData.role;
        newUser.credential = newCredential;
        await manager.save(User, newUser);
      }
    });
  }

  async singIn(
    credentials: UserLoginDTO,
  ): Promise<{ access_token: string; user: User }> {
    try {
      const credentialId = await this.authRepository.signIn(credentials);
      if (!credentialId) {
        throw new BadRequestException(
          "Correo Electronico o Contraseña incorrectos",
        );
      }
      const user = await this.userService.findByCredentialsId(credentialId);
      console.log("auth.serv fetch user:", user);
      const payload = {
        id: user.id,
        email: user.email,
        rol: user.role,
      };
      const access_token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
      });
      console.log(access_token);
      return {
        access_token: access_token,
        user: user,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error al durante el login, intentelo nuevamente por favor.",
        error,
      );
    }
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
    } catch (error) {
      if (error.code === "23505") {
        throw new BadRequestException(
          "Datos de registro invalido",
          error.detail,
        );
      } else if (error instanceof InternalServerErrorException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          "Error inesperado al generar credenciales",
        );
      }
    }
  }

  async googleLogin(data: UserLoginGoogleDto) {
    try {
      const user = await this.userService.createUserGoogle(data);
      const access_token = this.jwtService.sign({
        id: user.id,
        email: user.email,
        rol: "google",
      });
      return {
        access_token: access_token,
        user: user,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
