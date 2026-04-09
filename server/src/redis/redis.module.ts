import { createClient } from 'redis';

import { Module } from '@nestjs/common';

export const REDIS_CLIENT = 'REDIS_CLIENT';
// Создаем редис конфиг с редис uri
@Module({
	providers: [
		{
			provide: REDIS_CLIENT,
			useFactory: async () => {
				const client = createClient({
					url: 'redis://:pass12345@localhost:6379'
				});

				client.on('error', err => {
					console.error('Redis Client Error', err);
				});

				await client.connect();
				return client;
			}
		}
	],
	exports: [REDIS_CLIENT]
})
export class RedisModule {}
