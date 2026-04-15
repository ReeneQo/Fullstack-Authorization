'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, FieldGroup, FormField, Loading } from '@/shared/components/ui'

import { useVerificationMutation } from '../hooks'
import { useChangePasswordMutation } from '../hooks/useChangePasswordMutation'
import {
	ChangePasswordData,
	ChangePasswordSchema,
	LoginFormData
} from '../schemas'

import { AuthWrapper } from './AuthWrapper'

export function ChangePassword() {
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const form = useForm<ChangePasswordData>({
		resolver: zodResolver(ChangePasswordSchema),
		defaultValues: {
			password: ''
		}
	})

	const { change, isLoadingChange } = useChangePasswordMutation()

	const onSubmit = (values: ChangePasswordData) => {
		if (token) {
			change({ token: token, password: values.password })
		} else {
			toast.error('Токен не передан, попробуйте еще раз')
		}
	}

	return (
		<AuthWrapper heading='Подтверждение почты'>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FieldGroup>
					<FormField
						control={form.control}
						name='password'
						label='Пароль'
						type='password'
						isDisabled={isLoadingChange}
						forgetPassword={true}
					/>
				</FieldGroup>

				<Button
					type='submit'
					disabled={isLoadingChange}
					className='mt-4 w-full'
					variant='outline'
				>
					Поменять пароль
				</Button>
			</form>
		</AuthWrapper>
	)
}
