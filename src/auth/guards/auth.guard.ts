import { Request } from 'express';

import { UserService } from '@/user/user.service';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';

//Auth guard для проверки авторизации
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private userService: UserService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		//получаем request из контекста
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const request = context.switchToHttp().getRequest();
		//здесь проверяем авторизован ли пользователь
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (typeof request.session.userId === 'undefined') {
			throw new UnauthorizedException('User unauthorized pls login');
		}
		// получаем юзера по айдишнику из запроса
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
		const user = await this.userService.findById(request.session.userId);
		// присваиваем запросу юзера
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		request.user = user;
		// и возвращаем тру если все проверки пройдены и пользователь авторизован
		return true;
	}
}
