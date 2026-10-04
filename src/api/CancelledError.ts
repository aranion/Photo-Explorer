import { ApiError } from './ApiError'

/**
 * Ошибка отмены запроса.
 *
 * Бросается вместо нативного `AbortError`, чтобы отмена определялась
 * через `instanceof`, а не по строковому имени ошибки.
 */
export class CancelledError extends ApiError {
  readonly url: string

  constructor(url: string) {
    super(`Загрузка отменена: ${url}`)
    this.name = 'CancelledError'
    this.url = url
  }
}
