import { Metadata } from 'next'

import { ResetPassword } from '@/features/auth/components'

export const metadata: Metadata = {
	title: 'Сброс пароля'
}

export default function ResetPasswordPage() {
	return <ResetPassword />
}
