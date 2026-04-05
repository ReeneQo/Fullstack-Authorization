import { TypeOptions } from '@/provider/provider.constants';
import { GoogleProvider } from '@/provider/services/google.provider';
import { ConfigService } from '@nestjs/config';

export const providerConfig = async (
	configService: ConfigService
	// eslint-disable-next-line @typescript-eslint/require-await
): Promise<TypeOptions> => {
	return {
		baseUrl: configService.getOrThrow<string>('BASE_URL'),
		services: [
			new GoogleProvider({
				name: 'google',
				authorize_url: 'https://accounts.google.com/o/oauth2/v2/auth',
				access_url: 'https://oauth2.googleapis.com/token',
				profile_url: 'https://www.googleapis.com/oauth2/v3/userinfo',
				scopes: ['email', 'profile'],
				client_id: configService.getOrThrow('GOOGLE_CLIENT_ID'),
				client_secret: configService.getOrThrow('GOOGLE_CLIENT_SECRET')
			})
		]
	};
};
