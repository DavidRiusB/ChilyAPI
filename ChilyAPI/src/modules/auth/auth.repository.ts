import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";
import {
  hashPassword,
  validateUserPasword,
} from "src/utils/hashing/bcrypt.utils";
import { Credential } from "./entities/auth.entity";
import { UserLoginDTO } from "./dto/login.dto";
import { UserService } from "../user/user.service";
import { randomBytes } from "crypto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,

    private readonly usersService: UserService,
  ) {}

  async signIn(credentials: UserLoginDTO) {
    try {
      const { email, password } = credentials;

      const credential = await this.credentialRepository
        .createQueryBuilder("credential")
        .addSelect("credential.password")
        .where("credential.email = :email", { email })
        .getOne();
      console.log("auth.repo credential", credential);
      if (!credential) {
        throw new UnauthorizedException(
          "Correo Electronico o Contraseña incorrectos",
        );
      }

      const isValidPassword = await validateUserPasword(
        password,
        credential.password,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException(
          "Correo Electronico o Contraseña incorrectos",
        );
      }
      console.log("isvalidpass:", isValidPassword);
      return credential.id;
    } catch (error) {
      throw error;
    }
  }

  async createCredentials(
    email: string,
    password: string,
    NIN: string,
    phone: string,
  ): Promise<Credential> {
    try {
      const hashedPassword = await hashPassword(password);
      const newCredential = new Credential();
      newCredential.email = email;
      newCredential.password = hashedPassword;
      newCredential.NIN = NIN;
      newCredential.phone = phone;
      this.credentialRepository.create(newCredential);
      return newCredential;
    } catch (error) {
      if (error.code === "23505") {
        const match = error.detail.match(/Key \(([^)]+)\)=\(([^)]+)\) already exists./);
        let message = "";
        if (match) {
          const field = match[1];
          const value = match[2];
          message = `El valor '${value}' para el campo '${field}' ya está registrado.`;
        }
        throw new BadRequestException(message);
      }
      throw new InternalServerErrorException(
        "Error inesperado al registrar al usuario, por favor intentelo de nuevo",
      );
    }
  }

  async findUser(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user)
      throw new NotFoundException(`Usuario con email ${email}, no encontrado`);
    return user;
  }

  async findByEmailInCredentials(email: string): Promise<Credential> {
    const credential = await this.credentialRepository.findOneBy({ email });
    console.log(`Found credential: ${JSON.stringify(credential)}`);
    return credential;
  }

  async updatePassword(id: string, newPassword: string) {
    const updateResult = await this.credentialRepository.update(id, {
      password: newPassword,
    });
    console.log(
      `Update password result for ID ${id}: ${JSON.stringify(updateResult)}`,
    );
  }
}
