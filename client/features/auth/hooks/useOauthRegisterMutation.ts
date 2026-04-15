import { useMutation } from '@tanstack/react-query'

import { toastMessageHandler } from '@/shared/utils/toast-message-handler'

import { oauthService } from '../services'
import { OauthProviders } from '../types'

export const useOauthMutation = (mutateKey: string) => {
	const { mutate: oauth, isPending: isLoadingOauth } = useMutation({
		mutationKey: [mutateKey],
		mutationFn: (provider: OauthProviders) =>
			oauthService.getOauthLink(provider),
		onSuccess: response => {
			window.location.href = response.data.url
		},
		onError: error => {
			toastMessageHandler(error)
		}
	})

	return { oauth, isLoadingOauth }
}
