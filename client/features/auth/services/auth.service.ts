import { apiClientManager } from '@/shared/utils/fetch'

import { LoginFormData, RegisterFormData } from '../schemas'
import { IUser } from '../types'

import { routes } from '@/core/configs/routes'

class AuthService {
	public async register(body: RegisterFormData, recaptcha?: string) {
		const headers = recaptcha ? { recaptcha } : undefined

		const response = await apiClientManager.post<RegisterFormData, IUser>(
			routes.auth.register,
			{
				headers,
				body
			}
		)

		return response
	}

	public async login(body: LoginFormData, recaptcha?: string) {
		const headers = recaptcha ? { recaptcha } : undefined

		const response = await apiClientManager.post<
			LoginFormData,
			IUser | { message: string }
		>(routes.auth.login, {
			headers,
			body
		})

		return response
	}

	public async logout() {
		const response = await apiClientManager.post(routes.auth.logout)

		return response
	}
}

export const authService = new AuthService()
