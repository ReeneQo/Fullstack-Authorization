import {Html} from '@react-email/html'
import * as React from 'react'
import {Body, Heading, Link, Tailwind, Text} from '@react-email/components'

interface TwoFactorAuthPROPS {
	token: string;
}

export const TwoFactorAuthTemplate = ({
	token
}: TwoFactorAuthPROPS) => {
	return (
		<Tailwind>
			<Html>
			<Body className='text-black'>
				<Heading>Двухфакторная аутентификация</Heading>
				<Text>
						Здравствуйте, ваш код двухфакторной аутентификации: <strong>{token}</strong> 
				</Text>
				<Text>
						Пожалуйста, введите этот код в приложении для завершения процесса аутентификации.
				</Text>
				<Text>
						Если вы не запрашивали этот код, просто проигнорируйте это сообщение.
				</Text>
			</Body>
		</Html>
		</Tailwind>
	)
};
