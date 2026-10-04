/**
 * Базовая ошибка слоя API.
 *
 * Позволяет отличать сетевые сбои через `instanceof` и служит общим предком
 * для {@link HttpError} и {@link CancelledError}.
 */
export class ApiError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ApiError'
  }
}
