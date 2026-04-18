import { Request } from 'express';

import { UserService } from '@/user/user.service';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();
		if (!request.session.userId) {
			throw new UnauthorizedException('Пользователь не авторизован');
		}
		const user = await this.userService.findById(request.session.userId);

		if (!user) {
			throw new UnauthorizedException('Пользователь не найден');
		}

		request.user = user;
		return true;
	}
}
