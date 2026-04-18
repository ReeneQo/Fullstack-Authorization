import { Metadata } from 'next'

import { LoginForm } from '@/features/auth/components'

export const metadata: Metadata = {
	title: 'Войти в аккаунт'
}

export default function RegisterPage() {
	return <LoginForm />
}
