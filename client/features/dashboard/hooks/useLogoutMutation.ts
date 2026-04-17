'use client'

import { useMutation } from '@tanstack/react-query'
import { error } from 'console'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { authService } from '@/features/auth/services'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { routes } from '@/core/configs/routes'

export const useLogoutMutation = () => {
	const router = useRouter()

	const { mutate: logout, isPending: isLoadingLogout } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			toast.success('Вы успешно вышли из системы')
			router.push(routes.auth.login)
		},
		onError: error => {
			console.log(error)
			toastMessageHandler(error)
		}
	})

	return { logout, isLoadingLogout }
}
