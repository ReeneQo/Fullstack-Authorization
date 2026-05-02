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
				confirmUpdate: '/user/update/email/confirm-update'
			},
			password: '/user/update/password'
		}
	}
}

export const routes = new Routes()
