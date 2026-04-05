import { Request } from 'express';

import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';

@Injectable()
export class TestAuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		const request = context.switchToHttp().getRequest() as Request;

		const token = request.headers['authorization'];

		if (!token || !token.startsWith('Bearer ')) {
			throw new UnauthorizedException('erro when login');
		}
		return true;
	}
}
