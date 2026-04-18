import { Request } from 'express';

import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException
} from '@nestjs/common';

import { User } from '../../../generated/prisma/client';

export const Authorized = createParamDecorator(
	(data: keyof User, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<Request>();
		const user = request.user;

		if (!user) {
			throw new UnauthorizedException('Пользователь не авторизован');
		}

		return data ? user[data] : user;
	}
);
