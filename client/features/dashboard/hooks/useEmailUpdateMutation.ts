'use client'

import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'
import { toast } from 'sonner'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import {
	EmailUpdateConfirmData,
	EmailUpdateRequestData
} from '../schemas/email-update.schema'
import { emailUpdateService } from '../services'

import { routes } from '@/core/configs/routes'

export const useEmailUpdateRequestMutation = (
	setStep: Dispatch<SetStateAction<'email' | 'code'>>
) => {
	const {
		mutate: emailUpdateRequest,
		isPending: isLoadingUpdateEmailRequest
	} = useMutation({
		mutationKey: ['email update request'],
		mutationFn: (values: EmailUpdateRequestData) =>
			emailUpdateService.requestToken(values),
		onSuccess: () => {
			toast.success(
				'Код подтверждения для смены почты был отправлен вам на почту'
			)
			setStep('code')
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { emailUpdateRequest, isLoadingUpdateEmailRequest }
}

export const useEmailUpdateConfirmMutation = () => {
	const router = useRouter()

	const {
		mutate: emailUpdateConfirm,
		isPending: isLoadingUpdateEmailConfirm
	} = useMutation({
		mutationKey: ['email update confirm'],
		mutationFn: (values: EmailUpdateConfirmData) =>
			emailUpdateService.confirmUpdate(values),
		onSuccess: () => {
			toast.success(
				'Почта была успешно изменена, перезайдите пожалуйста в аккаунт'
			)
			router.push(routes.auth.login)
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { emailUpdateConfirm, isLoadingUpdateEmailConfirm }
}
