import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Geist, Geist_Mono } from 'next/font/google'

import { ToggleTheme } from '@/shared/components/ui'
import { MainProvider } from '@/shared/providers'
import '@/shared/styles/globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
})

export const metadata: Metadata = {
	title: {
		absolute: 'Авторизация',
		template: '%s | Авторизация'
	},
	description:
		'Это учебный проект, созданный для демонстрации полного цикла авторизации пользователей'
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='en'
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
			suppressHydrationWarning
		>
			<body className='flex min-h-full flex-col'>
				<ThemeProvider attribute='class'>
					<MainProvider>
						<div className='relative flex min-h-screen flex-col font-mono'>
							<ToggleTheme />
							<div className='flex h-screen w-full items-center justify-center px-4'>
								{children}
							</div>
						</div>
					</MainProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
