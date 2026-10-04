import { describe, expect, it } from 'vitest'
import { ApiError } from '@/api/ApiError'
import { CancelledError } from '@/api/CancelledError'
import { HttpError } from '@/api/HttpError'

describe('иерархия ошибок API', () => {
  it('HttpError наследует ApiError и хранит метаданные', () => {
    const error = new HttpError('Не найдено', 404, 'https://example.com/photos')
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('HttpError')
    expect(error.status).toBe(404)
    expect(error.url).toBe('https://example.com/photos')
  })

  it('CancelledError наследует ApiError и хранит url', () => {
    const error = new CancelledError('https://example.com/photos')
    expect(error).toBeInstanceOf(ApiError)
    expect(error.name).toBe('CancelledError')
    expect(error.url).toBe('https://example.com/photos')
  })
})
