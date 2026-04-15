import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { PasswordResetData } from '../schemas'
import { passwordResetService } from '../services'

export const useResetPassowordMutation = () => {
	const { mutate: reset, isPending: isLoadingReset } = useMutation({
		mutationKey: ['reset password user'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: PasswordResetData
			recaptcha: string
		}) => passwordResetService.reset(values, recaptcha),
		onSuccess: () => {
			toast.success('Проверьте вашу почту', {
				description: 'Письмо для сброса пароля было отправлено'
			})
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { reset, isLoadingReset }
}
