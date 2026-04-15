'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { verificationService } from '../services'

import { routes } from '@/core/configs/routes'

export const useVerificationMutation = () => {
	const { mutate: verification } = useMutation({
		mutationKey: ['verification user'],
		mutationFn: (token: string | null) =>
			verificationService.newVerification(token),
		onSuccess: () => {
			toast.success('Почта успешно подтверждена')
			window.location.href = routes.dashboard.settings
		},
		onError: () => {
			window.location.href = routes.auth.login
		}
	})

	return { verification }
}
