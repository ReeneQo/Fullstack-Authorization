import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { render } from '@react-email/render';

import { ChangeEmailNotificationTemplate } from './templates/changeEmailNotification.template';
import { ConfirmEmailTemplate } from './templates/confirm.template';
import { ResetPasswordTemplate } from './templates/resetPassword.template';
import { TwoFactorAuthTemplate } from './templates/two-factor-auth.template';
import { UpdateEmailTemplate } from './templates/updateEmail.template';
import { UpdateEmailCallbackTemplate } from './templates/updateEmailCallback.template';

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name);

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

	public async sendTwoFactorAuthEmail(email: string, token: string) {
		const html = await render(TwoFactorAuthTemplate({ token }));

		return this.sendEmail(email, 'Подтверждение вашей личности', html);
	}

	public async sendUpdateEmailToken(email: string, token: string) {
		const html = await render(UpdateEmailTemplate({ token }));

		return this.sendEmail(email, 'Обновление почты', html);
	}

	public async sendUpdateEmailCallback(email: string, token: string) {
		const domain = this.configService.getOrThrow<string>('ALLOWED_ORIGIN');

		const html = await render(
			UpdateEmailCallbackTemplate({ domain, token })
		);

		return this.sendEmail(email, 'Изменение почты', html);
	}

	public async sendChangeEmailNotification(email: string, newEmail: string) {
		const html = await render(
			ChangeEmailNotificationTemplate({ email: newEmail })
		);

		return this.sendEmail(email, 'Обновление почты', html);
	}

	private async sendEmail(email: string, subject: string, html: string) {
		try {
			await this.mailerService.sendMail({
				to: email,
				subject,
				html
			});
		} catch (error) {
			this.logger.error('Ошибка отправки письма', {
				to: email,
				subject,
				error
			});
			throw new BadRequestException(
				'Указанная почта не существует, либо недоступна'
			);
		}
	}
}
