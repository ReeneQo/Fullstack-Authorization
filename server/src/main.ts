import { RedisStore } from 'connect-redis';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { RedisClientType } from 'redis';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { parseMs } from './libs/utils/ms.util';
import { parseBoolean } from './libs/utils/parse-boolean';
import { REDIS_CLIENT } from './redis/redis.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = app.get(ConfigService);

	const redisClient = app.get<RedisClientType>(REDIS_CLIENT);

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	);

	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			resave: true,
			saveUninitialized: false,
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				maxAge: parseMs(config.getOrThrow<string>('SESSION_MAX_AGE')),
				httpOnly: parseBoolean(
					config.getOrThrow<string>('SESSION_HTTP_ONLY')
				),
				secure: parseBoolean(
					config.getOrThrow<string>('SESSION_SECURE')
				),
				sameSite: 'lax'
			},
			store: new RedisStore({
				client: redisClient,
				prefix: config.getOrThrow<string>('SESSION_FOLDER'),
				ttl: parseMs(config.getOrThrow<string>('SESSION_MAX_AGE'))
			})
		})
	);

	app.enableCors({
		origin: true,
		methods: ['GET', 'POST', 'PATCH'],
		allowedHeaders: ['Content-Type', 'Authorization', 'recaptcha'],
		credentials: true,
		exposedHeaders: ['set-cookie']
	});

	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'), () => {
		console.log('server started');
	});
}

void bootstrap();
