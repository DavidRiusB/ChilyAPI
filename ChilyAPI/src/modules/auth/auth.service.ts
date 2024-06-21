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

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly dataSource: DataSource
  ) {}

  async singIn(credentials: CredentialsDto): Promise<User> {
    try {
      const credentialId = await this.authRepository.signIn(credentials);
      if (!credentialId) {
        throw new BadRequestException(
          "Correo Electronico o Contraseña incorrectos"
        );
      }
      const user = await this.userService.findByCredentialsId(credentialId);
      return user;
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
}
