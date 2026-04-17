import { IUser } from '@/features/auth/types'

import { apiClientManager } from '@/shared/utils/fetch'

import { SettingsUserData } from '../schemas'

import { routes } from '@/core/configs/routes'

class UserService {
	public async getProfile() {
		const response = await apiClientManager.get<IUser>(routes.user.profile)

		return response
	}

	public async updateProfile(values: SettingsUserData) {
		const response = await apiClientManager.patch<SettingsUserData, IUser>(
			routes.user.update.profile,
			{
				body: values
			}
		)

		return response
	}
}

export const userService = new UserService()
