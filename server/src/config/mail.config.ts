import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export const getMailerConfig = async (
	configService: ConfigService
): Promise<MailerOptions> => {
	const port = Number(configService.getOrThrow<number>('MAIL_PORT'));
	return {
		transport: {
			host: configService.getOrThrow<string>('MAIL_HOST'),
			port,
			secure: port === 465,
			auth: {
				user: configService.getOrThrow<string>('MAIL_LOGIN'),
				pass: configService.getOrThrow<string>('MAIL_PASSWORD')
			}
		},
		defaults: {
			from: `"Renee Team" ${configService.getOrThrow<string>('MAIL_FROM')}`
		}
	};
};
