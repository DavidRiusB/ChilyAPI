import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthRepository } from './auth.repository';
import { config as dotenvConfig } from 'dotenv';
import { AuthService } from './auth.service';
dotenvConfig({ path: '.env.development' });


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.BACKEND_URL+'/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    const user = this.authService.googleLogin({
      email: profile.emails[0].value,
      name: profile.displayName,
    });
    console.log('Validate');
    console.log(user);
    return user || null;
  }
}