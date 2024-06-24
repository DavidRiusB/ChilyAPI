import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthRepository } from './auth.repository';
import { UserGoogle } from './auth-google.entity';

@Injectable()
export class SessionSerialize extends PassportSerializer {
  constructor(
    @Inject('AUTH_REPOSITORY') private readonly authRepository: AuthRepository,
  ) {
    super();
  }

  serializeUser(user: UserGoogle, done: Function) {
    console.log('Serialize user');
    done(null, user);
  }

  async deserializeUser(payload: any, done: Function) {
    const user = await this.authRepository.findUser(payload.id);
    console.log('Deserialize User');
    console.log(user);
    return user ? done(null, user) : done(null, null);
  }
}
