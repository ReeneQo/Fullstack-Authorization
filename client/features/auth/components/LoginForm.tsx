'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button, FieldGroup, FormField } from '@/shared/components/ui'

import { useLoginMutation } from '../hooks'
import { LoginFormData, LoginSchema } from '../schemas'

import { AuthWrapper } from './AuthWrapper'
import { routes } from '@/core/configs/routes'

export const LoginForm = () => {
	const { theme } = useTheme()
	const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
	const [show2FA, setShow2FA] = useState<boolean>(false)

	const form = useForm<LoginFormData>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: '',
			password: '',
			code: ''
		}
	})

	const { login, isLoadingLogin } = useLoginMutation(setShow2FA)

	const onSubmit = (values: LoginFormData) => {
		if (show2FA) {
			login({ values, recaptcha: recaptchaValue ?? '' })
			return
		}

		if (!recaptchaValue) {
			toast.error('Пожалуйста пройдите recaptcha')
			return
		}

		login({ values, recaptcha: recaptchaValue })
	}

	return (
		<AuthWrapper
			heading='Войти'
			description='Чтобы войти на сайт введите ваш email и пароль'
			backButtonLabel='Нету аккаунта? Зарегистрируйтесь'
			backButtonHref={routes.auth.register}
			isShowSocial
		>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FieldGroup>
					<div className={show2FA ? 'hidden' : ''}>
						<FormField
							control={form.control}
							name='email'
							label='Почта'
							type='email'
							isDisabled={isLoadingLogin}
						/>
						<FormField
							control={form.control}
							name='password'
							label='Пароль'
							type='password'
							isDisabled={isLoadingLogin}
							forgetPassword={true}
						/>
					</div>

					{show2FA && (
						<FormField
							control={form.control}
							name='code'
							label='Код двухфакторной аутентификации'
							placeholder='123456'
							isDisabled={isLoadingLogin}
						/>
					)}
				</FieldGroup>

				{!show2FA && (
					<div className='mt-4 flex justify-center'>
						<ReCAPTCHA
							sitekey={
								process.env
									.GOOGLE_RECAPTCHA_PUBLIC_KEY as string
							}
							onChange={setRecaptchaValue}
							theme={theme === 'light' ? 'light' : 'dark'}
						/>
					</div>
				)}
				<Button
					type='submit'
					disabled={isLoadingLogin}
					className='mt-4 w-full'
					variant='outline'
				>
					Войти
				</Button>
			</form>
		</AuthWrapper>
	)
}
