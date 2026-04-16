import { NextRequest, NextResponse } from 'next/server'

import { routes } from './core/configs/routes'

export default function middleware(request: NextRequest) {
	const { nextUrl, cookies } = request

	const session = cookies.get('session')?.value

	const isChangePasswordPage =
		nextUrl.pathname === '/auth/reset-password/change'
	const token = nextUrl.searchParams.get('token')

	if (isChangePasswordPage) {
		if (!token) {
			return NextResponse.redirect(
				new URL(routes.passwordReset.page, nextUrl)
			)
		}
		return NextResponse.next()
	}

	const isAuthPage = nextUrl.pathname.startsWith('/auth')

	if (isAuthPage && session) {
		return NextResponse.redirect(
			new URL(routes.dashboard.settings, nextUrl)
		)
	}

	if (!isAuthPage && !session) {
		return NextResponse.redirect(new URL(routes.auth.login, nextUrl))
	}

	return NextResponse.next()
}

export const config = {
	matcher: ['/auth/:path*', '/dashboard/:path*']
}
