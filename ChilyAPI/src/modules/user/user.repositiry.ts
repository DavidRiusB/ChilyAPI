import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findByCredentialsId(credentialId: number): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder("user")
        .innerJoinAndSelect("user.credential", "credential")
        .where("credential.id = :credentialId", { credentialId })
        .getOne();

      if (!user) {
        throw new NotFoundException(
          `Usuario con credencial ${credentialId}, no encontrado`
        );
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
