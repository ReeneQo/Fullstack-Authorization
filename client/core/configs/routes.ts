class Routes {
	auth = {
		login: '/auth/login',
		register: '/auth/register',
		logout: '/auth/logout',
		emailConfirm: '/auth/email-confirmation'
	}
	dashboard = {
		settings: '/dashboard/settings'
	}
	oauth = {
		google: 'auth/oauth/connect/google',
		github: 'auth/oauth/connect/github'
	}
}

export const routes = new Routes()
