import { NextRequest, NextResponse } from 'next/server'

import { routes } from './core/configs/routes'

export default function middleware(request: NextRequest) {
	const { url, cookies } = request

	const session = cookies.get('session')?.value

	const isAuthPage = url.includes('/auth')

	if (isAuthPage) {
		if (session) {
			return NextResponse.redirect(
				new URL(routes.dashboard.settings, url)
			)
		}

		return NextResponse.next()
	}

	if (!session) {
		return NextResponse.redirect(new URL(routes.auth.login, url))
	}
}

export const config = {
	matcher: ['/auth/:path*', '/dashboard/:path*']
}
