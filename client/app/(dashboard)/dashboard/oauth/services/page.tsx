import { Metadata } from 'next'

import { OauthServices } from '@/features/dashboard/components'

export const metadata: Metadata = {
	title: 'Подключенные сервисы'
}

export default function Home() {
	return <OauthServices />
}
