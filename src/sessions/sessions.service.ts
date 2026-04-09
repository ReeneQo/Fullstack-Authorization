import { Request, Response } from 'express';
import { User } from 'generated/prisma/browser';

import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SessionsService {
	public constructor(private readonly configService: ConfigService) {}

	async destroySession(req: Request, res: Response): Promise<void> {
		return new Promise((resolve, reject) => {
			req.session.destroy(err => {
				if (err) {
					reject(
						new InternalServerErrorException(
							'Ошибка во время удалении сессии. Попробуйте еще раз'
						)
					);
				}

				res.clearCookie(this.configService.getOrThrow('SESSION_NAME'));
				resolve();
			});
		});
	}

	public saveSession(req: Request, user: User) {
		return new Promise((resolve, reject) => {
			req.session.regenerate(err => {
				if (err) {
					return reject(
						new InternalServerErrorException(
							'Ошибка во время регенерации токена. Попробуйте еще раз'
						)
					);
				}
				req.session.userId = user.id;

				req.session.save(err => {
					if (err) {
						return reject(
							new InternalServerErrorException(
								'Ошибка сохранения сессии. Попробуйте еще раз'
							)
						);
					}

					resolve({ user });
				});
			});
		});
	}
}
