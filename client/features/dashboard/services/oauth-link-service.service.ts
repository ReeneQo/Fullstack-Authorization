import { OauthProviders } from '@/features/auth/types'

import { apiClientManager } from '@/shared/utils/fetch'

import { routes } from '@/core/configs/routes'

interface OauthLinkResponse {
	url: string
}

class OauthLinkService {
	public async getOauthLinkUrl(provider: OauthProviders) {
		const response = await apiClientManager.get<OauthLinkResponse>(
			routes.user.oauth.link(provider)
		)
		return response
	}

	public async unlinkProvider(provider: OauthProviders) {
		const response = await apiClientManager.delete(
			routes.user.oauth.unlink(provider)
		)
		return response
	}
}

export const oauthLinkService = new OauthLinkService()
