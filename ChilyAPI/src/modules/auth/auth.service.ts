import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterUserDTO } from './dto/register.dto';
import { AuthRepository } from './auth.repository';
import { UserService } from '../user/user.service';
import { DataSource, EntityManager } from 'typeorm';
import { User } from '../user/entity/user.entity';
import { LogoutDTO } from './dto/logout.dto';
import { SessionsService } from '../sessions/sessions.service';
import { JwtService } from '../jwt/jwt.service';
import { usersSeed } from './users-seed';
import { hashPassword } from 'src/utils/hashing/bcrypt.utils';
import { Credential } from './entities/auth.entity';
import { UserLoginDTO } from './dto/login.dto';
import { UserDataGoogle } from './types';
import { UserLoginGoogleDto } from './dto/loginGoogle.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    private readonly sessionService: SessionsService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.seedUsers(usersSeed);
  }

  async seedUsers(usersSeed: any[]) {
    const users = await this.userService.findAll({ page: 1, limit: 10 });
    if (users.total !== 0) {
      return 'DB has users';
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
        newUser.address = userData.address;
        newUser.country = userData.country;
        newUser.city = userData.city;
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
          'Correo Electronico o Contraseña incorrectos',
        );
      }
      const user = await this.userService.findByCredentialsId(credentialId);
      console.log("auth.serv fetch user:", user);
      const access_token = this.jwtService.generateToken({
        id: user.id,
        email: user.email
      });
      const date = new Date();
      const expiresAt = new Date(date.getTime() + 1 * 60 * 1000); // Le consedemos que expire dentro de una hora y se borre
      this.sessionService.createSession(access_token, expiresAt, false); // Creamos la sesión
      return {
        access_token: access_token,
        user: user,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al durante el login, intentelo nuevamente por favor.',
        error,
      );
    }
  }

  async register(newUserData: RegisterUserDTO): Promise<User> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const { email, password, NIN, phone } = newUserData;

        const credential = await this.authRepository.createCredentials(
          email,
          password,
          NIN,
          phone,
        );
        await manager.save(credential);

        const user = await this.userService.createUser(newUserData, credential);
        await manager.save(user);

        return user;
      });
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(
          'Datos de registro invalido',
          error.detail,
        );
      } else if (error instanceof InternalServerErrorException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error inesperado al generar credenciales',
        );
      }
    }
  }
  async logout(user: LogoutDTO) {
    return await this.sessionService.blacklistSession(user.access_token);
  }


  async googleLogin(data: UserLoginGoogleDto) {
    try {
      const user = await this.userService.createUserGoogle(data);
        const access_token = this.jwtService.generateToken({
        id: user.id,
        email: user.email
        })
     return {
      access_token: access_token,
      user: user
     };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
