import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { UserRepository } from "./user.repositiry";
import { User } from "./user.entity";
import { RegisterUserDTO } from "../auth/dto/register.dto";
import { Credential } from "../auth/auth.entity";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByCredentialsId(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findByCredentialsId(id);
      if (!user) {
        throw new InternalServerErrorException(
          "Error inesperado al iniciar sesion."
        );
      }
      return user;
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;
    }
  }

  async createUser(newUserData: RegisterUserDTO, credential: Credential) {
    try {
      return await this.userRepository.create(newUserData, credential);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error al registrar al usuario",
        error.detail
      );
    }
  }
}
