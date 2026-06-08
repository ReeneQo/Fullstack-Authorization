import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: {
		default: 'Профиль пользователя',
		template: '%s | Профиль'
	}
}

export default function Layout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className='flex min-h-screen w-full flex-col items-center justify-center px-4'>
			{children}
		</div>
	)
}
