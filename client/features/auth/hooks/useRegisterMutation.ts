import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { RegisterFormData } from '../schemas'
import { authService } from '../services'

export const useRegisterMutation = () => {
	const { mutate: register, isPending: isLoadingRegister } = useMutation({
		mutationKey: ['register user'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: RegisterFormData
			recaptcha: string
		}) => authService.register(values, recaptcha),
		onSuccess: () => {
			toast.success('Успешная регистрация', {
				description:
					'Подтвердите почту, письмо было выслано на вашу почту'
			})
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { register, isLoadingRegister }
}
