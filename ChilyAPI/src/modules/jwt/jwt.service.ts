import { Injectable, PayloadTooLargeException } from '@nestjs/common';
import { JwtService as JwtServiceNest } from '@nestjs/jwt';
//
@Injectable()
export class JwtService {
    constructor(private jwtService: JwtServiceNest) {}
    generateToken(payload: any) {
        const token = this.jwtService.sign(payload, {
            expiresIn: '1h',
            secret: 'secretKey',
        });
        return token;
    }
    verifyToken(token: string) {
        try {
            const decoded = this.jwtService.verify(token, {
                secret: 'secretKey'
            }); // Verifica el token y retorna
            return decoded;
        } catch (error) {
            throw new PayloadTooLargeException(); // Lanza un error si el token es inválido
        }
    }
}
