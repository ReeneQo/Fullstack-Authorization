import { Metadata } from 'next'

import { RegisterForm } from '@/features/auth/components/RegisterForm'

export const metadata: Metadata = {
	title: 'Регистрация аккаунта'
}

export default function RegisterPage() {
	return <RegisterForm />
}
