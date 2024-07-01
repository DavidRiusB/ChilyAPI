import {
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
    const hashedPassword = await hashPassword(password);
    const newCredential = new Credential();
    newCredential.email = email;
    newCredential.password = hashedPassword;
    newCredential.NIN = NIN;
    newCredential.phone = phone;
    this.credentialRepository.create(newCredential);
    return newCredential;
  }

  async findUser(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user)
      throw new NotFoundException(`Usuario con email ${email}, no encontrado`);
    return user;
  }

  async findByEmailInCredentials(email: string): Promise<Credential> {
    return this.credentialRepository.findOneBy({ email });
  }

  async createResetToken(email: string): Promise<string> {
    const user = await this.findByEmailInCredentials(email);

    const token = randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 600000); // 10 min

    await this.credentialRepository.save(user);
    return token;
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.credentialRepository.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new Error("El token ha expirado, genere uno nuevo");
    }

    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.credentialRepository.save(user);
  }
}
