export enum UserRole {
	Regular = 'REGULAR',
	Admin = 'ADMIN'
}

export enum EnumAuthMethod {
	Credentials = 'CREDENTIALS',
	Google = 'GOOGLE',
	GITHUB = 'GITHUB',
	TELEGRAM = 'TELEGRAM'
}

export interface IAccount {
	id: string
	createdAt: string
	updatedAt: string
	type: string
	provider: string
	providerId: string
	refreshToken: string | null
	accessToken: string | null
	expiresAt: number | null
	userId: string
}

export interface IUser {
	id: string
	createdAt: string
	updatedAt: string
	email: string
	password: string | null
	avatarKey: string | null
	displayName: string
	picture: string | null
	role: UserRole
	isVerified: boolean
	isTwoFactorEnabled: boolean
	method: EnumAuthMethod
	accounts: IAccount[]
}
