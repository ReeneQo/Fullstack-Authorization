import { apiClientManager } from '@/shared/utils/fetch'

import { AddPassowordOauthData } from '../schemas/addPasswordOauth.schema'

import { routes } from '@/core/configs/routes'

class OauthService {
	public async addOauthPassword(values: AddPassowordOauthData) {
		const response = await apiClientManager.post<
			AddPassowordOauthData,
			void
		>(routes.oauth.password, {
			body: values
		})

		return response
	}
}

export const oauthService = new OauthService()
