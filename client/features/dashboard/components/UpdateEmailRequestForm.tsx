import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'

import { Button, FieldGroup, FormField } from '@/shared/components/ui'

import { useEmailUpdateRequestMutation } from '../hooks'
import {
	EmailUpdateRequestData,
	EmailUpdateRequestSchema
} from '../schemas/email-update.schema'

export const UpdateEmailRequestForm = ({setStep}: {
	setStep: Dispatch<SetStateAction<'email' | 'code'>>
}) => {
	const form = useForm<EmailUpdateRequestData>({
		resolver: zodResolver(EmailUpdateRequestSchema),
		defaultValues: {
			email: ''
		}
	})

	const { emailUpdateRequest, isLoadingUpdateEmailRequest } =
		useEmailUpdateRequestMutation(setStep)

	const onSubmit = (values: EmailUpdateRequestData) => {
		emailUpdateRequest(values)
	}
	return (
		<form onSubmit={form.handleSubmit(onSubmit)}>
			<FieldGroup>
				<FormField
					control={form.control}
					name='email'
					label='Почта'
					placeholder='Введите новую почту, пример example@mail.ru'
					isDisabled={isLoadingUpdateEmailRequest}
				/>
			</FieldGroup>
			<Button
				type='submit'
				disabled={isLoadingUpdateEmailRequest}
				className='mt-4 w-full'
				variant='outline'
			>
				Запросить код
			</Button>
		</form>
	)
}
