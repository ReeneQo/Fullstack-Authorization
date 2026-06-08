'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { OauthProviders } from '@/features/auth/types'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { oauthLinkService } from '../services'

export const useUnlinkMutation = () => {
	const queryClient = useQueryClient()

	const { mutate: unlink, isPending: isLoadingUnlink } = useMutation({
		mutationKey: ['oauth unlink'],
		mutationFn: (provider: OauthProviders) =>
			oauthLinkService.unlinkProvider(provider),
		onSuccess: () => {
			toast.success('Сервис успешно отвязан')
			queryClient.invalidateQueries({ queryKey: ['get profile'] })
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { unlink, isLoadingUnlink }
}
