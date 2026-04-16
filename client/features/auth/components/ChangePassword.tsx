'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, FieldGroup, FormField } from '@/shared/components/ui'

import { useChangePasswordMutation } from '../hooks/useChangePasswordMutation'
import { ChangePasswordData, ChangePasswordSchema } from '../schemas'

import { AuthWrapper } from './AuthWrapper'
import { routes } from '@/core/configs/routes'

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
		<AuthWrapper
			heading='Новый пароль'
			description='Придумайте новый пароль для аккаунта'
			backButtonLabel='Войти в аккаунт'
			backButtonHref={routes.auth.login}
		>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FieldGroup>
					<FormField
						control={form.control}
						placeholder='******'
						name='password'
						label='Пароль'
						type='password'
						isDisabled={isLoadingChange}
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
