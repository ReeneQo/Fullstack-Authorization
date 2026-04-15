import { apiClientManager } from '@/shared/utils/fetch'

import { OauthProviders } from '../types'

import { routes } from '@/core/configs/routes'

class OauthService {
	public async getOauthLink(provider: OauthProviders) {
		const response = await apiClientManager.get<{ url: string }>(
			routes.oauth[provider]
		)

		return response
	}
}

export const oauthService = new OauthService()
