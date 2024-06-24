import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  hashPassword,
  validateUserPasword,
} from 'src/utils/hashing/bcrypt.utils';
import { Credential } from './auth.entity';
import { UserLoginDTO } from './dto/login.dto';
import { UserGoogle } from './auth-google.entity';
import { UserDataGoogle } from './types';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,

    @InjectRepository(UserGoogle)
    private readonly userDataGoogle: Repository<UserGoogle>,
  ) {}

  async signIn(credentials: UserLoginDTO) {
    try {
      const { email, password } = credentials;

      const credential = await this.credentialRepository
        .createQueryBuilder('credential')
        .addSelect('credential.password')
        .where('credential.email = :email', { email })
        .getOne();
      console.log("auth.repo credential", credential);
      if (!credential) {
        throw new UnauthorizedException(
          'Correo Electronico o Contraseña incorrectos',
        );
      }

      const isValidPassword = await validateUserPasword(
        password,
        credential.password,
      );
      if (!isValidPassword) {
        throw new UnauthorizedException(
          'Correo Electronico o Contraseña incorrectos',
        );
      }
      if (!isValidPassword) {
        throw new UnauthorizedException(
          'Correo Electronico o Contraseña incorrectos',
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
    await this.credentialRepository.create(newCredential);
    return newCredential;
  }

  // OAuth with google
  async validateUser(details: UserDataGoogle) {
    console.log('AuthService');
    console.log(details);
    const user = await this.userDataGoogle.findOneBy({ email: details.email });

    if (user) return user;

    const newUser = this.userDataGoogle.create(details);
    return this.userDataGoogle.save(newUser);
  }

  async findUser(id: number) {
    const user = await this.userDataGoogle.findOneBy({
      id,
    });
    return user;
  }
}
