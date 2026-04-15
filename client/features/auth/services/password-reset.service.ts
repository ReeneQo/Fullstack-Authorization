import { apiClientManager } from '@/shared/utils/fetch'

import { PasswordResetData } from '../schemas'

import { routes } from '@/core/configs/routes'

class PasswordReset {
	public async reset(body: PasswordResetData, recaptcha: string) {
		const headers = recaptcha ? { recaptcha } : undefined

		const response = await apiClientManager.post(
			routes.passwordReset.request,
			{
				headers,
				body
			}
		)

		return response
	}

	public async change(token: string, password: string) {
		const responce = await apiClientManager.post(
			routes.passwordReset.reset,
			{
				body: {
					token,
					password
				}
			}
		)

		return responce
	}
}

export const passwordResetService = new PasswordReset()
