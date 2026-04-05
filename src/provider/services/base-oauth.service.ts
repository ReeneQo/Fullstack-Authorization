/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common';

import { type BaseProviderOptions } from './types/base-provider.options.types';
import { TypeUserInfo } from './types/user-info.types';

// базовый класс для описания oauth провайдеров
@Injectable()
export class BaseOauthService {
	// наш базовый URL сайта
	private BASE_URL: string;
	// в конструктов мы будем закидывать базовые опции нужного нам провайдера
	constructor(private readonly options: BaseProviderOptions) {}
	// здесь просто будем пробрасывать данные добавляя к ним еще имя провайдера
	// eslint-disable-next-line @typescript-eslint/require-await
	protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
		return { ...data, provider: this.options.name };
	}
	// метод getAuthUrl в которой мы будем получать сыллку для авторизации смешивая сыллку от провайдера и добавляя к ней наши query параметры
	public getAuthUrl() {
		const query = new URLSearchParams({
			response_type: 'code',
			client_id: this.options.client_id,
			redirect_uri: this.getRedirectUrl(),
			scope: (this.options.scopes ?? []).join(' '),
			access_type: 'offline',
			prompt: 'select_account'
		});

		return `${this.options.authorize_url}?${query}`;
	}

	// здесь мы получаем юзера по нашему коду
	public async findUserByCode(code: string): Promise<TypeUserInfo> {
		const client_id = this.options.client_id;
		const client_secret = this.options.client_secret;
		// создаем query параметры для отправки запроса на получение токена юзера
		const tokenQuery = new URLSearchParams({
			client_id,
			client_secret,
			code,
			redirect_uri: this.getRedirectUrl(),
			grant_type: 'authorization_code'
		});
		// здесь делаем сам запрос на получение токена доступа используя query параметры выше
		const tokenRequest = await fetch(this.options.access_url, {
			method: 'POST',
			body: tokenQuery,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json'
			}
		});

		if (!tokenRequest.ok) {
			throw new BadRequestException(
				`Не удалось получить пользователя ${this.options.profile_url}. Проверьте правильность токена данных`
			);
		}

		// форматируем ответ в json
		const tokenResponse = await tokenRequest.json();

		if (!tokenResponse.access_token) {
			throw new BadRequestException(
				`Не удалось получить пользователя ${this.options.profile_url}. Проверьте правильность токена данных`
			);
		}
		// запрос на получение пользователя по сыллке провайдера с базой данных о всех пользователях, передаем туда токен авторизации
		const userRequest = await fetch(this.options.profile_url, {
			headers: {
				Authorization: `Bearer ${tokenResponse.access_token}`
			}
		});

		if (!userRequest.ok) {
			throw new UnauthorizedException(
				`Не удалось получить пользователя ${this.options.profile_url}. Авторизируйтесь`
			);
		}
		// форматируем в json
		const user = await userRequest.json();
		// с помощью метода extractUserInfo возращаем данные вместе с провайдером
		const userData = await this.extractUserInfo(user);
		// и делаем return всех данных
		return {
			...userData,
			access_token: tokenResponse.access_token,
			refresh_token: tokenResponse.refresh_token,
			expires_at: tokenResponse.expires_at || tokenResponse.expires_in,
			provider: this.options.name
		};
	}

	public getRedirectUrl() {
		return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`;
	}

	set baseUrl(value: string) {
		this.BASE_URL = value;
	}

	get name() {
		return this.options.name;
	}

	get access_url() {
		return this.options.access_url;
	}

	get profile_url() {
		return this.options.profile_url;
	}

	get scopes() {
		return this.options.scopes;
	}
}
