import { apiClientManager } from '@/shared/utils/fetch'

import {
	EmailUpdateConfirmData,
	EmailUpdateRequestData
} from '../schemas/email-update.schema'

import { routes } from '@/core/configs/routes'

class EmailUpdateService {
	public async requestToken(values: EmailUpdateRequestData) {
		const response = await apiClientManager.post(
			routes.user.update.email.request,
			{
				body: values
			}
		)

		return response
	}

	public async confirmUpdate(values: EmailUpdateConfirmData) {
		const response = await apiClientManager.patch(
			routes.user.update.email.confirmUpdate,
			{
				body: values
			}
		)

		return response
	}
}

export const emailUpdateService = new EmailUpdateService()
