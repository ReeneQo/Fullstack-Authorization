'use client'

import Link from 'next/link'

import { buttonVariants } from '@/shared/components/ui'

import { routes } from '@/core/configs/routes'

export default function Home() {
	return (
		<div className='space-y-5 text-center'>
			<h1 className='text-4xl font-bold'>Главная</h1>
			<Link href={routes.auth.login} className={buttonVariants()}>
				Войти в аккаунт
			</Link>
		</div>
	)
}
