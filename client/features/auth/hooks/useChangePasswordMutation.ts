import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { passwordResetService } from '../services'

import { routes } from '@/core/configs/routes'

export const useChangePasswordMutation = () => {
	const { mutate: change, isPending: isLoadingChange } = useMutation({
		mutationKey: ['change password user'],
		mutationFn: ({
			token,
			password
		}: {
			token: string
			password: string
		}) => passwordResetService.change(token, password),
		onSuccess: () => {
			toast.success('Пароль успешно изменен')
			window.location.href = routes.auth.login
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { change, isLoadingChange }
}
