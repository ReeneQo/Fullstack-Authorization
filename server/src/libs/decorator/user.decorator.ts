import { Request } from 'express';

import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const user = createParamDecorator(
	(_data: unknown, context: ExecutionContext) => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
		const request = context.switchToHttp().getRequest() as Request;

		return request.headers['user'];
	}
);
