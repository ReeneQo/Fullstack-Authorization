import { FetchError } from './fetch.errors'
import {
	ApiResponse,
	RequestMethods,
	RequestOptions,
	ResponseInterceptor
} from './fetch.types'
import { routes } from '@/core/configs/routes'

class ApiClient {
	private baseUrl
	private responseInterceptors: ResponseInterceptor[] = []

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl
	}

	private buildUrl(
		endpoint: string,
		params?: Record<string, string>
	): string {
		const url = new URL(endpoint, this.baseUrl)
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				url.searchParams.append(key, value)
			})
		}

		return url.toString()
	}

	public onResponse(interceptor: ResponseInterceptor): void {
		this.responseInterceptors.push(interceptor)
	}

	private async runInterceptors(response: Response): Promise<void> {
		for (const interceptor of this.responseInterceptors) {
			await interceptor(response)
		}
	}

	private async request<T, R>(
		endpoint: string,
		method: RequestMethods,
		options: RequestOptions<T>
	): Promise<ApiResponse<R>> {
		const fullUrl = this.buildUrl(endpoint, options.params)

		const requestInit: RequestInit = {
			method,
			headers: {
				...options.headers
			},
			credentials: options.credentials ?? 'include',
			signal: options.signal
		}

		if (options.body !== undefined) {
			if (options.body instanceof FormData) {
				requestInit.body = options.body
			} else {
				requestInit.headers = {
					'Content-Type': 'application/json',
					...options.headers
				}
				requestInit.body = JSON.stringify(options.body)
			}
		}

		const response = await fetch(fullUrl, requestInit)

		await this.runInterceptors(response)

		if (!response.ok) {
			const errorBody = await response.json().catch(() => null)
			throw new FetchError(
				response.status,
				errorBody?.message ?? response.statusText
			)
		}

		const data = response.status === 204 ? null : await response.json()
		return {
			data: data,
			httpStatus: response.status
		}
	}

	public async get<T>(
		endpoint: string,
		options?: Omit<RequestOptions<T>, 'body'>
	): Promise<ApiResponse<T>> {
		return this.request(endpoint, 'GET', options ?? {})
	}

	public async post<T, R>(
		endpoint: string,
		options?: RequestOptions<T>
	): Promise<ApiResponse<R>> {
		return this.request(endpoint, 'POST', options ?? {})
	}

	public async patch<T, R>(
		endpoint: string,
		options?: RequestOptions<T>
	): Promise<ApiResponse<R>> {
		return this.request(endpoint, 'PATCH', options ?? {})
	}

	public async delete<T>(
		endpoint: string,
		options?: Omit<RequestOptions<T>, 'body'>
	): Promise<ApiResponse<T>> {
		return this.request(endpoint, 'DELETE', options ?? {})
	}
}

const baseUrl = process.env.SERVER_URL
if (!baseUrl) throw new Error('SERVER_URL не найден')

export const apiClientManager = new ApiClient(baseUrl)

apiClientManager.onResponse(response => {
	if (response.status === 401) {
		window.location.href = routes.auth.login
	}
})
