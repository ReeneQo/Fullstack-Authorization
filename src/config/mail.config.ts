/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { isDev } from '@/libs/utils/isDev.util';
import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export const getMailerConfig = async (
	configService: ConfigService
	// eslint-disable-next-line @typescript-eslint/require-await
): Promise<MailerOptions> => ({
	transport: {
		host: configService.getOrThrow<string>('MAIL_HOST'),
		port: configService.getOrThrow<number>('MAIL_PORT'),
		secure: !isDev,
		auth: {
			user: configService.getOrThrow<string>('MAIL_LOGIN'),
			pass: configService.getOrThrow<string>('MAIL_PASSWORD')
		}
	},
	defaults: {
		from: `"Renee Team" ${configService.getOrThrow<string>('MAIL_LOGIN')}`
	}
});
