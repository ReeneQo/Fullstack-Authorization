'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { verificationService } from '../services'

import { routes } from '@/core/configs/routes'

export const useVerificationMutation = () => {
	const router = useRouter()
	const { mutate: verification } = useMutation({
		mutationKey: ['verification user'],
		mutationFn: (token: string | null) =>
			verificationService.newVerification(token),
		onSuccess: () => {
			toast.success('Почта успешно подтверждена')
			router.push(routes.dashboard.settings)
		},
		onError: () => {
			router.push(routes.auth.login)
		}
	})

	return { verification }
}
