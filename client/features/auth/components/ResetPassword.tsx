'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, FieldGroup, FormField } from '@/shared/components/ui'

import { useResetPassowordMutation } from '../hooks'
import { PasswordResetData, PasswordResetSchema } from '../schemas'

import { AuthWrapper } from './AuthWrapper'
import { routes } from '@/core/configs/routes'

export const ResetPassword = () => {
	const { theme } = useTheme()
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

	const form = useForm<PasswordResetData>({
		resolver: zodResolver(PasswordResetSchema),
		defaultValues: {
			email: ''
		}
	})

	const { reset, isLoadingReset } = useResetPassowordMutation()

	const onSubmit = (values: PasswordResetData) => {
		if (recaptchaValue) {
			reset({ values, recaptcha: recaptchaValue })
		} else {
			toast.error('Пожалуйсте пройдите recaptcha')
		}
	}

	return (
		<AuthWrapper
			heading='Сброс пароля'
			description='Для сброса пароля введите вашу почту'
			backButtonLabel='Нету аккаунта? Зарегистрируйтесь'
			backButtonHref={routes.auth.register}
		>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FieldGroup>
					<FormField
						control={form.control}
						name='email'
						label='Почта'
						type='email'
						isDisabled={isLoadingReset}
					/>
				</FieldGroup>
				<div className='mt-4 flex justify-center'>
					<ReCAPTCHA
						sitekey={
							process.env.GOOGLE_RECAPTCHA_PUBLIC_KEY as string
						}
						onChange={setRecaptchaValue}
						theme={theme === 'light' ? 'light' : 'dark'}
					/>
				</div>
				<Button
					type='submit'
					disabled={isLoadingReset}
					className='mt-4 w-full'
					variant='outline'
				>
					Войти
				</Button>
			</form>
		</AuthWrapper>
	)
}
