import {Html} from '@react-email/html'
import * as React from 'react'
import {Body, Heading, Link, Tailwind, Text} from '@react-email/components'

interface ConfirmEmailTemplateProps {
	domain: string;
	token: string;
}

export const ResetPasswordTemplate = ({
	domain,
	token
}: ConfirmEmailTemplateProps) => {
	const resetPasswordLink = `${domain}/auth/new-verification?token=${token}`;

	return (
		<Tailwind>
			<Html>
			<Body className='text-black'>
				<Heading>Сброс пароля</Heading>
				<Text>
						Здравствуйте, что бы сбросить свой пароль, пожалуйста, перейдите по следующей ссылке:
				</Text>
				<Link href={resetPasswordLink}>Подтвердить почту</Link>
				<Text>
						Эта ссылка действительная в течение 15 минут. Если вы не запрашивали сброс пароля, просто проигнорируйте это сообщение.
				</Text>
				<Text>
						Спасибо за использование нашего сервиса!
				</Text>
			</Body>
		</Html>
		</Tailwind>
	)
};
