class Routes {
	auth = {
		login: '/auth/login',
		register: '/auth/register',
		logout: '/auth/logout',
		emailConfirm: '/mail/confirmation/verification'
	}
	dashboard = {
		settings: '/dashboard/settings',
		update: {
			password: '/dashboard/update/password',
			email: '/dashboard/update/email'
		},
		oauth: {
			services: '/dashboard/oauth/services'
		}
	}
	oauth = {
		google: '/auth/oauth/connect/google',
		github: '/auth/oauth/connect/github',
		password: '/auth/oauth/add/password'
	}
	passwordReset = {
		request: '/password-reset/request',
		reset: '/password-reset/reset',
		page: '/auth/reset-password'
	}
	user = {
		avatar: {
			upload: 'user/avatar/upload',
			delete: 'user/avatar/delete'
		},
		profile: '/user/profile',
		update: {
			profile: '/user/update/profile',
			email: {
				request: '/user/update/email/request',
				confirmUpdate: '/user/update/email/confirm-update',
				cancel: '/user/update/email/cancel',
				callback: '/user/update/email/request/callback'
			},
			password: '/user/update/password'
		},
		oauth: {
			unlink: (provider: string) => `/auth/oauth/link/unlink/${provider}`,
			link: (provider: string) => `/auth/oauth/link/connect/${provider}`
		}
	}
}

export const routes = new Routes()
