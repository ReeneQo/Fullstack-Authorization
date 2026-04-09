import {Html} from '@react-email/html'
import * as React from 'react'
import {Body, Heading, Link, Tailwind, Text} from '@react-email/components'

interface ConfirmEmailTemplateProps {
	domain: string;
	token: string;
}

export const ConfirmEmailTemplate = ({
	domain,
	token
}: ConfirmEmailTemplateProps) => {
	const activationLink = `${domain}/auth/new-verification?token=${token}`;

	return (
		<Tailwind>
			<Html>
			<Body className='text-black'>
				<Heading>Подтверждение почты</Heading>
				<Text>
						Здравствуйте, что бы подтвердить свой адрес электронной почты, пожалуйста, перейдите по следующей ссылке:
				</Text>
				<Link href={activationLink}>Подтвердить почту</Link>
				<Text>
						Эта ссылка действительная в течение 1 часа. Если вы не запрашивали подтверждение, просто проигнорируйте это сообщение.
				</Text>
				<Text>
						Спасибо за использование нашего сервиса!
				</Text>
			</Body>
		</Html>
		</Tailwind>
	)
};
