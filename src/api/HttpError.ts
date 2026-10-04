import { ApiError } from './ApiError'

/**
 * Ошибка HTTP-ответа с кодом вне диапазона 2xx.
 */
export class HttpError extends ApiError {
  readonly status: number
  readonly url: string

  constructor(message: string, status: number, url: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.url = url
  }
}
