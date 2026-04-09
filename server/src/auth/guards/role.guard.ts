import { Request } from 'express';
import { UserRole } from 'generated/prisma/enums';

import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLES_KEY } from '../decorators/roles.decorator';

// role guard на проверку ролей
@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		//получаем массив ролей из методов и класса контролера в котором вызываем
		const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass()
		]);
		// получаем запрос
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const request = context.switchToHttp().getRequest();
		// если роли не указаны пропускаем всех
		if (!roles) {
			return true;
		}
		// если роль не находится в ролях пользователя то кидаем ошибку что нету прав
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
		if (!roles.includes(request.user.role)) {
			throw new ForbiddenException(
				'Not enought rights, you dont have enough right to access this source'
			);
		}
		// если все проверки пройдены по итогу кидаем true и пропускаем
		return true;
	}
}
