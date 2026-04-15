import { apiClientManager } from '@/shared/utils/fetch'

import { routes } from '@/core/configs/routes'

class VerificationService {
	public async newVerification(token: string | null) {
		const response = await apiClientManager.post(routes.auth.emailConfirm, {
			body: token
		})

		return response
	}
}

export const verificationService = new VerificationService()
