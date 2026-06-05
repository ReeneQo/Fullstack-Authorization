'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dispatch, SetStateAction } from 'react'
import { useForm } from 'react-hook-form'

import { Button, FieldGroup, FormField } from '@/shared/components/ui'

import { useEmailUpdateRequestMutation } from '../hooks'
import {
	EmailUpdateRequestFormData,
	EmailUpdateRequestSchema
} from '../schemas/email-update.schema'

export const UpdateEmailRequestForm = ({
	setStep,
	tokenCallback
}: {
	setStep: Dispatch<SetStateAction<'email' | 'code'>>
	tokenCallback: string
}) => {
	const form = useForm<EmailUpdateRequestFormData>({
		resolver: zodResolver(EmailUpdateRequestSchema),
		defaultValues: { email: '' }
	})
	const { emailUpdateRequest, isLoadingUpdateEmailRequest } =
		useEmailUpdateRequestMutation(setStep)

	const onSubmit = (values: EmailUpdateRequestFormData) => {
		emailUpdateRequest({ ...values, tokenCallback })
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
