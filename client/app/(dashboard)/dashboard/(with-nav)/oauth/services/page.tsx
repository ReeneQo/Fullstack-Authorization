import { Metadata } from 'next'
import { Suspense } from 'react'

import { OauthServices } from '@/features/dashboard/components'
import { Loading } from '@/shared/components/ui'

export const metadata: Metadata = {
	title: 'Подключенные сервисы'
}

export default function Home() {
	return (
		<Suspense fallback={<Loading />}>
			<OauthServices />
		</Suspense>
	)
}
