import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { RegisterUserDTO } from "../auth/dto/register.dto";
import { Role } from "src/common/enums/roles.enum";
import { Credential } from "../auth/auth.entity";

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

  async create(newUserData: RegisterUserDTO, credential: Credential) {
    try {
      const { email, name, address, phone, role = Role.User } = newUserData;
      const newUser = new User();
      newUser.email = email;
      newUser.name = name;
      newUser.address = address;
      newUser.credential = credential;
      newUser.phone = phone;
      newUser.role = role;
      await this.userRepository.create(newUser);
      return newUser;
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException(
          "Datos de Registro invalidos",
          error.detail
        );
      }
      throw new InternalServerErrorException(
        "Error inesperado al registrar al usuario, por favor intentelo de nuevo"
      );
    }
  }
}
