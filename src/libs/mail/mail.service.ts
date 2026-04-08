import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/render';

import { ConfirmEmailTemplate } from './templates/confirm.template';
import { ResetPasswordTemplate } from './templates/resetPassword.template';

@Injectable()
export class MailService {
	public constructor(
		private readonly mailerService: MailerService,
		private readonly configService: ConfigService
	) {}

	public async sendConfirmationEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
		const html = await render(ConfirmEmailTemplate({ domain, token }));

		return this.sendEmail(email, 'Подтверждение почты', html);
	}

	public async sendResetPasswordEmail(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');
		const html = await render(ResetPasswordTemplate({ domain, token }));

		return this.sendEmail(email, 'Сброс пароля', html);
	}

	private sendEmail(email: string, subject: string, html: string) {
		return this.mailerService.sendMail({
			to: email,
			subject,
			html
		});
	}
}
