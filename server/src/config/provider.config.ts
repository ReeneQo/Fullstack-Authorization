import { TypeOptions } from '@/provider/provider.constants';
import { GithubProvider } from '@/provider/services/github.provider';
import { GoogleProvider } from '@/provider/services/google.provider';
import { ConfigService } from '@nestjs/config';

export const providerConfig = async (
	configService: ConfigService
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
			}),
			new GithubProvider({
				name: 'github',
				authorize_url: 'https://github.com/login/oauth/authorize',
				access_url: 'https://github.com/login/oauth/access_token',
				profile_url: 'https://api.github.com/user',
				scopes: ['user:email', 'read:user'],
				client_id: configService.getOrThrow('GITHUB_CLIENT_ID'),
				client_secret: configService.getOrThrow('GITHUB_SECRET_ID')
			})
		]
	};
};
