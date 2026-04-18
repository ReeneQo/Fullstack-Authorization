import { Request } from 'express';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const user = createParamDecorator(
	(_data: unknown, context: ExecutionContext) => {
		const request = context.switchToHttp().getRequest<Request>();

		return request.headers['user'];
	}
);
