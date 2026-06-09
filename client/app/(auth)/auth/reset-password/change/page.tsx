import { Metadata } from 'next'
import { Suspense } from 'react'

import { ChangePassword } from '@/features/auth/components'
import { Loading } from '@/shared/components/ui'

export const metadata: Metadata = {
	title: 'Смена пароля'
}

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={<Loading />}>
			<ChangePassword />
		</Suspense>
	)
}
