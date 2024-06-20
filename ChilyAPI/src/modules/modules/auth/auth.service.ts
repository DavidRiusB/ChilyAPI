import { Injectable } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}
     validateUser(username: string, pass: string) {//
        const user = {
          id: 1,
          username: 'luka',
          email: "Lukaelcapo2017@gmail.com",
          password:"luka123",
          role: 'admin',
          name: 'Luka',
          surname: 'Chili',
        }
        if (user.password ===  pass) { // Reemplazar con una comparación de hash seguro
          return user;
        }
        return null;
      }

      async login(email: string, password: string) {
        const user = this.validateUser(email, password);
        console.log(user);

        if (!user) {
          return null;
        }
        return {
            access_token: this.jwtService.generateToken(user),
            user: user
        };
      }
}
