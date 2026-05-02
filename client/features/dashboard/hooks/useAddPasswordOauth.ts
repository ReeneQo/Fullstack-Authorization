'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { AddPassowordOauthData } from '../schemas'
import { oauthService } from '../services'

import { routes } from '@/core/configs/routes'

export const useAddPasswordOauthMutation = () => {
	const router = useRouter()

	const { mutate: passwordAdd, isPending: isLoadingPasswordAdd } =
		useMutation({
			mutationKey: ['password add ouath'],
			mutationFn: (values: AddPassowordOauthData) =>
				oauthService.addOauthPassword(values),
			onSuccess: () => {
				toast.success(
					'Вы успешно добавили пароль, пожалуйсте авторизуйтесь заново'
				)
				router.push(routes.auth.login)
			},
			onError: error => {
				toastMessageHandler(error)
			}
		})

	return { passwordAdd, isLoadingPasswordAdd }
}
