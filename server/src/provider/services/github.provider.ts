import { BaseOauthService } from './base-oauth.service';
import { BaseProviderOptions } from './types/base-provider.options.types';
import { TypeUserInfo } from './types/user-info.types';

export class GithubProvider extends BaseOauthService {
	constructor(options: BaseProviderOptions) {
		super({
			name: 'github',
			authorize_url: 'https://github.com/login/oauth/authorize',
			access_url: 'https://github.com/login/oauth/access_token',
			profile_url: 'https://api.github.com/user',
			scopes: options.scopes,
			client_id: options.client_id,
			client_secret: options.client_secret
		});
	}

	public async extractUserInfo(data: GithubProfile): Promise<TypeUserInfo> {
		return super.extractUserInfo({
			email: data.email,
			name: data.name || data.login,
			picture: data.avatar_url
		});
	}
}

interface GithubProfile extends Record<string, any> {
	login: string;
	id: number;
	node_id: string;
	avatar_url: string;
	gravatar_id: string;
	url: string;
	html_url: string;
	type: string;
	site_admin: boolean;
	name: string | null;
	company: string | null;
	blog: string;
	location: string | null;
	email: string | null;
	hireable: boolean | null;
	bio: string | null;
	twitter_username: string | null;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
	access_token: string;
	refresh_token?: string;
}
