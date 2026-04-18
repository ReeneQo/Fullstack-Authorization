import { Request } from 'express';

import { UserService } from '@/user/user.service';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';

import { UserRole } from '../../../generated/prisma/enums';

@Injectable()
export class IsAdmin implements CanActivate {
	constructor(private readonly userService: UserService) {}
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();

		if (!request.session.userId) {
			throw new UnauthorizedException('Пользователь не найден');
		}

		const user = await this.userService.findById(request.session.userId);

		if (!user?.role.includes(UserRole.ADMIN)) {
			return false;
		}

		return true;
	}
}
