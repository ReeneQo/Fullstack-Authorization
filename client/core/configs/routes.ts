class Routes {
	auth = {
		login: '/auth/login',
		register: '/auth/register',
		logout: '/auth/logout',
		emailConfirm: '/mail/confirmation/verification'
	}
	dashboard = {
		settings: '/dashboard/settings'
	}
	oauth = {
		google: '/auth/oauth/connect/google',
		github: '/auth/oauth/connect/github'
	}
	passwordReset = {
		request: '/password-reset/request',
		reset: '/password-reset/reset',
		page: '/auth/reset-password'
	}
	user = {
		profile: '/user/profile',
		update: {
			profile: '/user/update/profile',
			email: '/user/update/email',
			password: '/user/update/password'
		}
	}
}

export const routes = new Routes()
