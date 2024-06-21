import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { CredentialsDto } from "./auth.dto";
import { RegisterUserDTO } from "./dto/register.dto";
import { AuthRepository } from "./auth.repository";
import { UserService } from "../user/user.service";
import { DataSource } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly userService: UserService,
    private readonly dataSource: DataSource
  ) {}

  async singIn(credentials: CredentialsDto) {
    try {
      const credentialId = await this.authRepository.signIn(credentials);
      if (!credentialId) {
        throw new BadRequestException(
          "Correo Electronico o Contraseña incorrectos"
        );
      }
      const user = await this.userService.findByCredentialsId(credentialId);
      return {};
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error al durante el login, intentelo nuevamente por favor."
      );
    }
  }

  register(userData: RegisterUserDTO) {
    throw new Error("Method not implemented.");
  }
}
