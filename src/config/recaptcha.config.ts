/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ConfigService } from '@nestjs/config';
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha';

export const getRecaptchaConfig = async (
	configService: ConfigService
	// eslint-disable-next-line @typescript-eslint/require-await
): Promise<GoogleRecaptchaModuleOptions> => ({
	secretKey: configService.getOrThrow<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	response: req => req.headers.recaptcha,
	skipIf: true
});
