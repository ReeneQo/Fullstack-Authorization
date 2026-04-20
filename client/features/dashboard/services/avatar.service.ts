import { apiClientManager } from '@/shared/utils/fetch'

import { routes } from '@/core/configs/routes'

class AvatarService {
	public async upload(formData: FormData) {
		const response = await apiClientManager.post<FormData, string>(
			routes.user.avatar.upload,
			{
				body: formData
			}
		)

		return response
	}

	public async delete(): Promise<void> {
		await apiClientManager.delete(routes.user.avatar.delete)
	}
}

export const avatarService = new AvatarService()
