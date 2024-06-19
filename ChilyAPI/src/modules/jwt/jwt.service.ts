import { Injectable, PayloadTooLargeException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtGenerateService {
    constructor(private jwtService: JwtService) {}
    generateToken(payload: any) {
        const token = this.jwtService.sign(payload);
        return token;
    }
    verifyToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token); // Verifica el token y retorna
            return decoded;
        } catch (error) {
            throw new PayloadTooLargeException(); // Lanza un error si el token es inválido
        }
    }
}
