'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button, FieldGroup, FormField } from '@/shared/components/ui'

import { useEmailUpdateConfirmMutation } from '../hooks'
import {
	EmailConfirmSchema,
	EmailUpdateConfirmData
} from '../schemas/email-update.schema'

export const UpdateEmailConfirmForm = () => {
	const form = useForm<EmailUpdateConfirmData>({
		resolver: zodResolver(EmailConfirmSchema),
		defaultValues: {
			token: ''
		}
	})

	const { emailUpdateConfirm, isLoadingUpdateEmailConfirm } =
		useEmailUpdateConfirmMutation()

	const onSubmitConfirm = (values: EmailUpdateConfirmData) => {
		emailUpdateConfirm(values)
	}

	return (
		<form onSubmit={form.handleSubmit(onSubmitConfirm)}>
			<FieldGroup>
				<FormField
					control={form.control}
					name='token'
					label='Код подтверждения'
					placeholder='Введите код подтверждения для смены почты ******'
				/>
			</FieldGroup>
			<Button
				type='submit'
				disabled={isLoadingUpdateEmailConfirm}
				className='mt-4 w-full'
				variant='outline'
			>
				Обновить почту
			</Button>
		</form>
	)
}
