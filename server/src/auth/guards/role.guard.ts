import { Request } from 'express';

import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from '../../../generated/prisma/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		const request = context.switchToHttp().getRequest<Request>();
		if (!roles) {
			return true;
		}
		if (!request.user) {
			throw new UnauthorizedException('Пользователь не найден');
		}

		if (!roles.includes(request.user.role)) {
			throw new ForbiddenException(
				'Not enought rights, you dont have enough right to access this source'
			);
		}
		return true;
	}
}
