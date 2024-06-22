import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CredentialsDto } from "./auth.dto";
import {
  hashPassword,
  validateUserPasword,
} from "src/utils/hashing/bcrypt.utils";
import { Credential } from "./auth.entity";

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>
  ) {}

  async signIn(credentials: CredentialsDto) {
    try {
      const { email, password } = credentials;

      const credential = await this.credentialRepository
        .createQueryBuilder("credential")
        .addSelect("credential.password")
        .where("credential.email = :email", { email })
        .getOne();

      if (!credential) {
        throw new UnauthorizedException(
          "Correo Electronico o Contraseña incorrectos"
        );
      }

      const isValidPassword = await validateUserPasword(
        password,
        credential.password
      );
      if (!isValidPassword) {
        throw new UnauthorizedException(
          "Correo Electronico o Contraseña incorrectos"
        );
      }
      if (!isValidPassword) {
        throw new UnauthorizedException(
          "Correo Electronico o Contraseña incorrectos"
        );
      }
      return credential.id;
    } catch (error) {
      throw error;
    }
  }

  async createCredentials(
    email: string,
    password: string
  ): Promise<Credential> {
    try {
      const hashedPassword = await hashPassword(password);
      const newCredential = new Credential();
      newCredential.email = email;
      newCredential.password = hashedPassword;
      await this.credentialRepository.create(newCredential);
      return newCredential;
    } catch (error) {
      if (error.code === "23505") {
        const detail = error.detail;
        throw new ConflictException("Datos de registro invalido", detail);
      }
      throw new InternalServerErrorException(
        "Error inesperado al registrar al usuario, por favor intentelo de nuevo"
      );
    }
  }
}
