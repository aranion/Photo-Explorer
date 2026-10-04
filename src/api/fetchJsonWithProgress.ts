import type { DownloadProgress } from '@/types/download'
import { CancelledError } from './CancelledError'
import { HttpError } from './HttpError'

export type FetchProgressHandler = (progress: DownloadProgress) => void

export interface FetchJsonOptions {
  signal?: AbortSignal
  onProgress?: FetchProgressHandler
  /**
   * Ожидаемый общий размер ответа в байтах. Применяется, только если сервер
   * не вернул `Content-Length`, чтобы прогресс можно было показать в процентах.
   */
  expectedTotalBytes?: number
}

export const fetchJsonWithProgress = async function <TData>(
  url: string,
  options: FetchJsonOptions = {}
): Promise<TData> {
  const { signal, onProgress, expectedTotalBytes } = options

  try {
    const response = await fetch(url, { signal })

    if (!response.ok) {
      throw new HttpError(
        `Не удалось получить данные: HTTP ${response.status}`,
        response.status,
        url
      )
    }

    const totalBytes = readContentLength(response) ?? expectedTotalBytes ?? null
    onProgress?.({ receivedBytes: 0, totalBytes, percent: totalBytes === null ? null : 0 })

    const body = response.body
    if (body === null) {
      const fallbackData = (await response.json()) as TData
      onProgress?.({ receivedBytes: 0, totalBytes, percent: 100 })
      return fallbackData
    }

    const reader = body.getReader()
    const chunks: Uint8Array[] = []
    let receivedBytes = 0

    try {
      for (;;) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        chunks.push(value)
        receivedBytes += value.byteLength
        onProgress?.({
          receivedBytes,
          totalBytes,
          percent: toPercent(receivedBytes, totalBytes)
        })
      }
    } finally {
      reader.releaseLock()
    }

    const text = new TextDecoder().decode(concatChunks(chunks, receivedBytes))
    const data = JSON.parse(text) as TData
    onProgress?.({ receivedBytes, totalBytes: totalBytes ?? receivedBytes, percent: 100 })
    return data
  } catch (error) {
    if (isAbortError(error)) {
      throw new CancelledError(url)
    }
    throw error
  }
}

const isAbortError = function(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

const readContentLength = function(response: Response): number | null {
  const header = response.headers.get('content-length')
  if (header === null) {
    return null
  }
  const parsed = Number.parseInt(header, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const toPercent = function(receivedBytes: number, totalBytes: number | null): number | null {
  if (totalBytes === null) {
    return null
  }
  const percent = (receivedBytes / totalBytes) * 100
  return Math.min(100, Math.max(0, Math.round(percent)))
}

const concatChunks = function(chunks: readonly Uint8Array[], totalLength: number): Uint8Array {
  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.byteLength
  }
  return result
}
