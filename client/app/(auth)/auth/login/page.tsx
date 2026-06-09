import { Metadata } from 'next'
import { Suspense } from 'react'

import { LoginForm } from '@/features/auth/components'
import { Loading } from '@/shared/components/ui'

export const metadata: Metadata = {
	title: 'Войти в аккаунт'
}

export default function RegisterPage() {
	return (
		<Suspense fallback={<Loading />}>
			<LoginForm />
		</Suspense>
	)
}
