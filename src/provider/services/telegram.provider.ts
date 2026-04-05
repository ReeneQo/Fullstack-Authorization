import { BaseOauthService } from './base-oauth.service';
import { BaseProviderOptions } from './types/base-provider.options.types';
import { TypeUserInfo } from './types/user-info.types';

export class TelegramProvider extends BaseOauthService {
	constructor(options: BaseProviderOptions) {
		super({
			name: 'telegram',
			authorize_url: '',
			access_url: '',
			profile_url: '',
			scopes: options.scopes,
			client_id: options.client_id,
			client_secret: options.client_secret
		});
	}

	public async extractUserInfo(data: TelegramProfile): Promise<TypeUserInfo> {
		return super.extractUserInfo({
			email: data.email,
			name: data.name,
			picture: data.picture
		});
	}
}

interface TelegramProfile extends Record<string, any> {
	aud: string;
	azp: string;
	email: string;
	email_verified: boolean;
	exp: number;
	family_name?: string;
	given_name: string;
	hd?: string;
	iat: number;
	iss: string;
	jti?: string;
	locale: string;
	name: string;
	nbf?: number;
	picture: string;
	sub: string;
	access_token: string;
	refresh_token?: string;
}
