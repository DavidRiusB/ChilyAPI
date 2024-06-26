import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service"; //

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      emailField: "email", // email del campo del usuario
      passwordField: "password", // Nombre del campo de la contraseña
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
      secretOrKey: "secretKey",
    });
  }

  async validate(credentials: {
    email: string;
    password: string;
  }): Promise<any> {
    const user = await this.authService.singIn(credentials);
    console.log("peteee");
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
