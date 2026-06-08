import { useMutation } from '@tanstack/react-query'

import { OauthProviders } from '@/features/auth/types'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { oauthLinkService } from '../services'

export const useOauthLinkMutation = (mutateKey: string) => {
	const { mutate: oauthLink, isPending: isLoadingOauthLink } = useMutation({
		mutationKey: [mutateKey],
		mutationFn: (provider: OauthProviders) =>
			oauthLinkService.getOauthLinkUrl(provider),
		onSuccess: response => {
			window.location.href = response.data.url
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})
	return { oauthLink, isLoadingOauthLink }
}
