export type RequestMethods = 'GET' | 'POST' | 'PATCH' | 'DELETE'

export interface RequestOptions<T> {
	headers?: HeadersInit
	body?: T
	credentials?: RequestCredentials
	params?: Record<string, string>
	signal?: AbortSignal
}

export interface ApiResponse<T> {
	data: T
	httpStatus: number
}

export type ResponseInterceptor = (response: Response) => void | Promise<void>
