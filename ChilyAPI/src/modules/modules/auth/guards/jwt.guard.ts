import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from 'src/modules/jwt/jwt.service';
//
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly jwtService: JwtService) {
        super();
    }
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractJwtFromHeader(request.headers.authorization);
        request.jwtToken = token; 
        try {
            const payload = this.jwtService.verifyToken(token);
            request.user = payload;
            console.log(request.user);
            return true;
        } catch {
            return false;
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
