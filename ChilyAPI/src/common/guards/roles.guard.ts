import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums';  

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}
	
	canActivate(context: ExecutionContext): boolean {
				const requiredRoles = 
			this.reflector.getAllAndOverride<Role[]>('roles', [
				context.getHandler(),
				context.getClass(),
			]);
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		console.log(user)
		const hasRole = () => requiredRoles.some((role) => user?.rol?.includes(role));
		const valid = user && user.rol && hasRole();
		if (!valid) throw new ForbiddenException('No tienes permisos para acceder a este recurso');
		return valid;
	}
} 