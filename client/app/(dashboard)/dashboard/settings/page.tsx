import { Metadata } from 'next'

import { SettingsForm } from '@/features/dashboard/components'

export const metadata: Metadata = {
	title: 'Настройки профиля'
}

export default function Home() {
	return <SettingsForm />
}
