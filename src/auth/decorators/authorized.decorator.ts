/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { User } from 'generated/prisma/client';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Authorized = createParamDecorator(
	// декоратор для получения всего юзера либо его ключа
	(data: keyof User, context: ExecutionContext) => {
		// получаем request из контекста
		const request = context.switchToHttp().getRequest();
		// достаем оттуда юзера
		const user = request.user;
		// и возвращаем либо значение по ключу либо юзера
		return data ? user[data] : user;
	}
);
