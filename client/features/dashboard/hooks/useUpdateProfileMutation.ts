import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { SettingsUserData } from '../schemas'
import { userService } from '../services'

export const useUpdateProfileMutation = () => {
	const queryClient = useQueryClient()
	const { mutate: updateProfile, isPending: isLoadingUpdate } = useMutation({
		mutationKey: ['update profile'],
		mutationFn: (values: SettingsUserData) =>
			userService.updateProfile(values),
		onSuccess() {
			queryClient.invalidateQueries({ queryKey: ['get profile'] })
			toast.success('Профиль успешно обновлен')
		},
		onError(error) {
			toastMessageHandler(error)
		}
	})

	return { updateProfile, isLoadingUpdate }
}
