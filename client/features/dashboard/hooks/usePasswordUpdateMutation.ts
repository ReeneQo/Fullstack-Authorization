'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { PasswordUpdateData } from '../schemas'
import { passwordUpdateService } from '../services'

import { routes } from '@/core/configs/routes'

export const usePasswordUpdateMutation = () => {
	const router = useRouter()

	const { mutate: passwordUpdate, isPending: isLoadingPasswordUpdate } =
		useMutation({
			mutationKey: ['password update'],
			mutationFn: (values: PasswordUpdateData) =>
				passwordUpdateService.changePassword(values),
			onSuccess: () => {
				toast.success(
					'Вы успешно обновили пароль, пожалуйсте авторизуйтесь заново'
				)
				router.push(routes.auth.login)
			},
			onError: error => {
				toastMessageHandler(error)
			}
		})

	return { passwordUpdate, isLoadingPasswordUpdate }
}
