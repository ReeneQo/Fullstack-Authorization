import { AuthWrapper } from './AuthWrapper'
import { routes } from '@/core/configs/routes'

export const RegisterForm = () => {
	return (
		<AuthWrapper
			heading='регистрация'
			description='Чтобы войти на сайт введите ваш email и пароль'
			backButtonLabel='Уже есть аккаунт? Войти'
			backButtonHref={routes.auth.login}
			isShowSocial
		>
			Регистрация
		</AuthWrapper>
	)
}
