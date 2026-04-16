'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { passwordResetService } from '../services'

import { routes } from '@/core/configs/routes'

export const useChangePasswordMutation = () => {
	const router = useRouter()
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
			toast.success('Пароль успешно изменен', {
				duration: 3000,
				onAutoClose: () => router.push(routes.auth.login)
			})
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { change, isLoadingChange }
}
