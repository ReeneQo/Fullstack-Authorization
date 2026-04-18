'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/shared/components/ui'

import { pages } from '@/core/configs/dashboardPages'

export const DashboardNav = () => {
	const pathname = usePathname()

	return (
		<nav className='mb-2 w-full max-w-125'>
			<ul className='flex w-full gap-1 max-md:flex-col md:flex-row'>
				{pages.map(item => {
					const isActive = pathname === item.href
					return (
						<li key={item.href} className='w-full min-w-0'>
							<Button
								variant={isActive ? 'default' : 'outline'}
								className='w-full'
								asChild
							>
								<Link href={item.href}>{item.label}</Link>
							</Button>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}