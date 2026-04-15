'use client'

import Link from 'next/link'

import { buttonVariants } from '@/shared/components/ui'

import { routes } from '@/core/configs/routes'

export default function Home() {
	return (
		<div className='space-y-5 text-center'>
			<h1 className='text-4xl font-bold'>dashboard</h1>
			<Link href={routes.auth.login} className={buttonVariants()}>
				dashboard
			</Link>
		</div>
	)
}
