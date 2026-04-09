import { Request, Response } from 'express';

import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	UnauthorizedException
} from '@nestjs/common';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		response.status(status).json({
			message: 'unathorized',
			statusCode: status,
			timestamp: new Date().toISOString(),
			path: request.url
		});
	}
}
