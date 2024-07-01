import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
//
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {
    }
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractJwtFromHeader(request.headers.authorization);
        request.jwtToken = token; 
        try {
            const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
            request.user = payload;
            return true;
        } catch (error){
            console.log(error)
            throw new UnauthorizedException("Invalid token");
        }
    }

    private extractJwtFromHeader(authHeader: string): string {
        if (!authHeader) {
            return null;
        }
        const [type, bearerToken] = authHeader.split(' ');
        if (type !== 'Bearer') {
            throw new UnauthorizedException('Invalid token type');
        }
        return bearerToken;
    }

}
