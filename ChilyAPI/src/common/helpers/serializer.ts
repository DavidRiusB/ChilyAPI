/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/modules/user/entity/user.entity';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    private readonly userService: UserService,
  ) {
    super();
    console.log('testtetststst')
  }
  serializeUser(user: User, done: Function) {
    console.log('serializeUser', user);
    done(null, user);
  }
  async deserializeUser(payload: User, done: Function) {
    const user = await this.userService.findUserById(payload.id);
    console.log(user);
    return user ? done(null, user) : done(null, null);
  }
}