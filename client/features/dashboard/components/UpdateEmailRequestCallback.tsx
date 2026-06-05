'use client'

import { Button } from '@/shared/components/ui'

import { useEmailUpdateRequestCallbackMutation } from '../hooks'

export const UpdateEmailRequestCallback = () => {
	const { emailUpdateRequest, isLoadingUpdateEmailRequest } =
		useEmailUpdateRequestCallbackMutation()

	return (
		<Button
			type='button'
			onClick={() => emailUpdateRequest()}
			disabled={isLoadingUpdateEmailRequest}
			className='mt-4 w-full'
			variant='outline'
		>
			Запросить изменение почты
		</Button>
	)
}
