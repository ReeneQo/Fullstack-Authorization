import { Metadata } from 'next'
import { Suspense } from 'react'

import { UpdateEmailForm } from '@/features/dashboard/components'
import { Loading } from '@/shared/components/ui'

export const metadata: Metadata = {
	title: 'Смена email'
}

export default function Home() {
	return (
		<Suspense fallback={<Loading />}>
			<UpdateEmailForm />
		</Suspense>
	)
}
