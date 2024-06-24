import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthRepository } from './auth.repository';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env.development' });


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_REPOSITORY') private readonly authRepository: AuthRepository,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    const user = this.authRepository.validateUser({
      email: profile.emails[0].value,
      displayName: profile.displayName,
    });
    console.log('Validate');
    console.log(user);
    return user || null;
  }
}
