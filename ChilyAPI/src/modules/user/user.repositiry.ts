import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entity/user.entity";
import { Repository } from "typeorm";
import { RegisterUserDTO } from "../auth/dto/register.dto";
import { Role } from "src/common/enums/roles.enum";
import { Credential } from "../auth/entities/auth.entity";
import { UserLoginGoogleDto } from "../auth/dto/loginGoogle.dto";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
          `Usuario con credencial ${credentialId}, no encontrado`,
        );
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error inesperado del servidor al buscar usuario",
      );
    }
  }

  async create(newUserData: RegisterUserDTO, credential: Credential) {
    try {
      const { email, name, phone, role = Role.User, NIN } = newUserData;
      const newUser = new User();
      newUser.NIN = NIN;
      newUser.email = email;
      newUser.name = name;
      // newUser.address = address;
      newUser.credential = credential;
      newUser.phone = phone;
      newUser.role = role;
      await this.userRepository.create(newUser);
      return newUser;
    } catch (error) {
      if (error.code === "23505") {
        throw new ConflictException(
          "Datos de Registro invalidos",
          error.detail,
        );
      }
      throw new InternalServerErrorException(
        "Error inesperado al registrar al usuario, por favor intentelo de nuevo",
      );
    }
  }

  async findAll(pagination: { page: number; limit: number }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAndCount({
      skip: offset,
      take: limit,
    });
    return { data, total };
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    // missing relations
    return user;
  }

  async update(user: User): Promise<User> {
    try {
      const updatedUser = await this.userRepository.save(user);
      return updatedUser;
    } catch (error) {
      if (error.code === "23505") {
        throw new BadRequestException("Numero de telefono ya registrado");
      }
      throw new InternalServerErrorException(
        "Error inesperado del servidor al modificar datos del usuario",
      );
    }
  }

  async delete(id: number) {
    const result = await this.userRepository.softDelete(id);
    return result;
  }

  async createGoogle(newUserData: UserLoginGoogleDto): Promise<User> {
    try {
      const newUser = new User();
      newUser.email = newUserData.email;
      newUser.name = newUserData.name;
      newUser.role = Role.User;
      newUser.googleAuth = true;
      return await this.userRepository.save(newUser);
    } catch {
      throw new InternalServerErrorException(
        "Error inesperado al registrar al usuario",
      );
    }
  }
  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    return user;
  }


}
