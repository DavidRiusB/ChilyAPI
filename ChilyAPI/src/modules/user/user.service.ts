import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "./user.repositiry";
import { User } from "./entity/user.entity";
import { RegisterUserDTO } from "../auth/dto/register.dto";
import { Credential } from "../auth/entities/auth.entity";
import { UserUpdateDto } from "./user-update.dto";
import { UserDataGoogle } from "../auth/types";
import { UserLoginGoogleDto } from "../auth/dto/loginGoogle.dto";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByCredentialsId(id: number): Promise<User> {
    try {
      const user = await this.userRepository.findByCredentialsId(id);
      console.log();
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

  async createUser(newUserData: RegisterUserDTO, credential?: Credential) {
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
  async createUserGoogle(newUserData: UserLoginGoogleDto): Promise<User>{
    const user = await this.userRepository.findByEmail(newUserData.email);
    if(user) return user
    return await this.userRepository.createGoogle(newUserData);
  }

  async findAll(pagination: { page: number; limit: number }) {
    return await this.userRepository.findAll(pagination);
  }

  async findUserById(id: number) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        throw new NotFoundException(`Usuario con id ${id}, no encontrado`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error inesperado del servidor al buscar usuario"
      );
    }
  }

  async update(userData: UserUpdateDto, id: number): Promise<User> {
    try {
      const user = await this.findUserById(id);

      // Merge userData into the existing user entity
      const updatedUser = Object.assign(user, userData);

      // Call the repository method to save the updated user
      const savedUser = await this.userRepository.update(updatedUser);

      if (!savedUser) {
        throw new InternalServerErrorException(
          "Error inesperado del servidor al actualizar usuario, por favor intentelo de nuevo"
        );
      }

      return savedUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof InternalServerErrorException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          "Error inesperado del servidor al actualizar datos del usuario",
          error
        );
      }
    }
  }

  async softDelete(id: number): Promise<User> {
    try {
      const user = await this.findUserById(id);
      console.log(user);
      const result = await this.userRepository.delete(user.id);

      if (result.affected === 0) {
        throw new InternalServerErrorException(`Error al borrar usuario ${id}`);
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error inesperado del servidor al intentar borrar usuario ${id}`,
        error.message
      );
    }
  }
  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findByEmail(email);
      console.log(user)
      if (!user) {
        throw new NotFoundException(`Usuario con email ${email}, no encontrado`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error inesperado del servidor al buscar usuario"
      );
    }
  }
}
