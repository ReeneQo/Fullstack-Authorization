import { Metadata } from 'next'

import { ChangePassword } from '@/features/auth/components'

export const metadata: Metadata = {
	title: 'Смена пароля'
}

export default function ResetPasswordPage() {
	return <ChangePassword />
}
