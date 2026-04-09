import { RedisStore } from 'connect-redis';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { createClient } from 'redis';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { parseMs } from './libs/utils/ms.util';
import { parseBoolean } from './libs/utils/parse-boolean';

async function bootstrap() {
	// создание сервера nest js default
	const app = await NestFactory.create(AppModule);

	// делаем конфиг что бы обращаться к системным переменным вместо process env
	const config = app.get(ConfigService);

	const redisClient = createClient({
		url: 'redis://:pass12345@localhost:6379'
	});

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

	// пайпы для глобальной валидации и трансформации данных
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true
		})
	);

	await redisClient.connect();

	// для управления сессиями, их запоминания и сохранения данных в куках
	app.use(
		session({
			secret: config.getOrThrow<string>('SESSION_SECRET'),
			name: config.getOrThrow<string>('SESSION_NAME'),
			//пересохраняет сессию даже без изменений
			resave: true,
			// не создает новую сессию при каждом заходе юзера, а только после регистрации
			saveUninitialized: false,
			//cookies
			cookie: {
				domain: config.getOrThrow<string>('SESSION_DOMAIN'),
				// c помощью своей утилиты parseMs которая преобразует строковое время в милисекунды задаем макс возраст куки
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
	// Применяем CORS ДЛЯ CROSS-ORIGIN RESOURSE SHARING ДЛЯ ПЕРЕДАЧИ ДАННЫХ
	app.enableCors({
		origin: true,
		// origin: [
		// 	config.getOrThrow<string>('ALLOWED_ORIGIN'),
		// 	'http://192.168.42.133:3000',
		// 	'http://localhost:3000',
		// 	'https://xg1wjk2c-4000.euw.devtunnels.ms/',
		// 	'https://xg1wjk2c-4000.euw.devtunnels.ms',
		// ],
		methods: ['GET', 'POST'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
		exposedHeaders: ['set-cookie']
	});
	// Запускаем сервер
	await app.listen(config.getOrThrow<number>('APPLICATION_PORT'), () => {
		console.log('server started');
	});
}

void bootstrap();
