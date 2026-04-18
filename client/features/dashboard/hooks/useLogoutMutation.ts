'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { userService } from '../services'

import { routes } from '@/core/configs/routes'

export const useLogoutMutation = () => {
	const router = useRouter()

	const { mutate: logout, isPending: isLoadingLogout } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => userService.logout(),
		onSuccess: () => {
			toast.success('Вы успешно вышли из системы')
			router.push(routes.auth.login)
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { logout, isLoadingLogout }
}
