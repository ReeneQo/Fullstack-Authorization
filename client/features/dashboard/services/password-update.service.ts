import { apiClientManager } from '@/shared/utils/fetch'

import { PasswordUpdateData } from '../schemas'

import { routes } from '@/core/configs/routes'

class PasswordUpdateService {
	public async changePassword(values: PasswordUpdateData) {
		const response = await apiClientManager.patch(
			routes.user.update.password,
			{
				body: values
			}
		)

		return response
	}
}

export const passwordUpdateService = new PasswordUpdateService()
