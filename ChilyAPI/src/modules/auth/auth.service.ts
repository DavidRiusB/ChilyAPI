import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { CredentialsDto } from "./auth.dto";
import { RegisterUserDTO } from "./dto/register.dto";
import { AuthRepository } from "./auth.repository";
import { UserService } from "../user/user.service";
import { DataSource } from "typeorm";
import { User } from "../user/user.entity";
import { JwtService } from "../jwt/jwt.service";
import { SessionsService } from "../sessions/sessions.service";
import { UserDTO } from "./dto/user.dto";
import { LogoutDTO } from "./dto/logout.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    private readonly jwtService:  JwtService,
    private readonly sessionService: SessionsService
  ) {}

  async singIn(credentials: CredentialsDto): Promise<{access_token: string, user: User}> {
    try {
      const credentialId = await this.authRepository.signIn(credentials);
      if (!credentialId) {
        throw new BadRequestException(
          "Correo Electronico o Contraseña incorrectos"
        );
      }
      const user = await this.userService.findByCredentialsId(credentialId);
      const access_token = this.jwtService.generateToken(user);
      this.sessionService.createSession(access_token, false); // Creamos la sesión
      return {
        access_token: access_token,
        user: user,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error al durante el login, intentelo nuevamente por favor.",
        error
      );
    }
  }

  async register(newUserData: RegisterUserDTO): Promise<User> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const { email, password } = newUserData;

        const credential = await this.authRepository.createCredentials(
          email,
          password
        );
        await manager.save(credential);

        const user = await this.userService.createUser(newUserData, credential);
        await manager.save(user);

        return user;
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      } else if (error instanceof InternalServerErrorException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          "Error inesperado al generar credenciales"
        );
      }
    }
  }
  async logout(user: LogoutDTO) {
    return await this.sessionService.blacklistSession(user.access_token)
  }//
}
