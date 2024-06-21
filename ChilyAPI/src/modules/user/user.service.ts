import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserRepository } from "./user.repositiry";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findByCredentialsId(id: any) {
    try {
      const user = await this.userRepository.findByCredentialsId(id);
      if (!user) {
        throw new InternalServerErrorException(
          "Error inesperado al iniciar sesion."
        );
      }
    } catch (error) {
      if (error instanceof InternalServerErrorException) throw error;
    }
  }
}
