'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, FieldGroup, FormField } from '@/shared/components/ui'

import { useRegisterMutation } from '../hooks/useRegisterMutation'
import { RegisterFormData, RegisterSchema } from '../schemas'

import { AuthWrapper } from './AuthWrapper'
import { routes } from '@/core/configs/routes'

export const RegisterForm = () => {
	const { theme } = useTheme()
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(RegisterSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
			passwordRepeat: ''
		}
	})

	const { register, isLoadingRegister } = useRegisterMutation()

	const onSubmit = (values: RegisterFormData) => {
		if (recaptchaValue) {
			register({ values, recaptcha: recaptchaValue })
		} else {
			toast.error('Пожалуйсте пройдите recaptcha')
		}
	}

	return (
		<AuthWrapper
			heading='Регистрация'
			description='Чтобы войти на сайт введите ваш email и пароль'
			backButtonLabel='Уже есть аккаунт? Войти'
			backButtonHref={routes.auth.login}
			isShowSocial
		>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FieldGroup>
					<FormField
						control={form.control}
						name='name'
						label='Имя'
						placeholder='Ваше имя'
						autoComplete='name'
						isDisabled={isLoadingRegister}
					/>
					<FormField
						control={form.control}
						name='email'
						label='Email'
						type='email'
						placeholder='example@mail.com'
						autoComplete='email'
						isDisabled={isLoadingRegister}
					/>
					<FormField
						control={form.control}
						name='password'
						label='Пароль'
						type='password'
						placeholder='Минимум 6 символов'
						autoComplete='new-password'
						isDisabled={isLoadingRegister}
					/>
					<FormField
						control={form.control}
						name='passwordRepeat'
						label='Подтверждение пароля'
						type='password'
						placeholder='Повторите пароль'
						autoComplete='new-password'
						isDisabled={isLoadingRegister}
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
					disabled={isLoadingRegister}
					className='mt-4 w-full'
					variant='outline'
				>
					Зарегистрироваться
				</Button>
			</form>
		</AuthWrapper>
	)
}
