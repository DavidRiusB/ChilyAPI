import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CredentialsDto } from "./auth.dto";
import { validateUserPasword } from "src/utils/hashing/bcrypt.utils";
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
}
