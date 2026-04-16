'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { LoginFormData } from '../schemas'
import { authService } from '../services'

import { routes } from '@/core/configs/routes'

export const useLoginMutation = (
	setShow2FA: Dispatch<SetStateAction<boolean>>
) => {
	const router = useRouter()
	const { mutate: login, isPending: isLoadingLogin } = useMutation({
		mutationKey: ['login user'],
		mutationFn: ({
			values,
			recaptcha
		}: {
			values: LoginFormData
			recaptcha: string
		}) => authService.login(values, recaptcha),
		onSuccess: response => {
			if ('message' in response.data) {
				toast.warning(response.data.message)
				setShow2FA(true)
			} else {
				toast.success('Успешная авторизация')
				router.push(routes.dashboard.settings)
			}
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { login, isLoadingLogin }
}
