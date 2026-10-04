import type { DownloadProgress } from '@/types/download'
import { CancelledError } from './CancelledError'
import { HttpError } from './HttpError'

export type FetchProgressHandler = (progress: DownloadProgress) => void

export interface FetchJsonOptions {
  signal?: AbortSignal
  onProgress?: FetchProgressHandler
  /**
   * Ожидаемый общий размер ответа в байтах (несжатый).
   * Имеет наивысший приоритет, если указан.
   */
  expectedTotalBytes?: number
}

export const fetchJsonWithProgress = async function <TData>(url: string, options: FetchJsonOptions = {}): Promise<TData> {
  const { signal, onProgress, expectedTotalBytes } = options

  try {
    const response = await fetch(url, { signal })

    if (!response.ok) {
      throw new HttpError(`Не удалось получить данные: HTTP ${response.status}`, response.status, url)
    }

    // 1. Умно определяем общий размер (в байтах)
    const totalBytes = resolveTotalBytes(response, expectedTotalBytes)

    onProgress?.({ receivedBytes: 0, totalBytes, percent: totalBytes === null ? null : 0 })

    const body = response.body
    if (body === null) {
      // Фоллбэк для сред, где body недоступен (например, старые полифилы или специфичные ответы)
      const fallbackData = (await response.json()) as TData
      onProgress?.({ receivedBytes: 0, totalBytes: totalBytes ?? 0, percent: 100 })
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
          percent: toPercent(receivedBytes, totalBytes),
        })
      }
    } finally {
      reader.releaseLock()
    }

    const text = new TextDecoder().decode(concatChunks(chunks, receivedBytes))
    const data = JSON.parse(text) as TData

    // Финальный прогресс: если totalBytes не был известен, теперь мы его знаем
    const finalTotalBytes = totalBytes ?? receivedBytes
    onProgress?.({ receivedBytes, totalBytes: finalTotalBytes, percent: 100 })

    return data
  } catch (error) {
    if (isAbortError(error)) {
      throw new CancelledError(url)
    }
    throw error
  }
}

const isAbortError = function (error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError'
}

/**
 * Пытается извлечь несжатый размер из ETag в формате Express.js: W/"<hex>-<hash>"
 * Например: W/"fde1a-s3i5rcBnolvx6b55KvBZMAI4YhE" -> 1039898
 */
const parseUncompressedSizeFromEtag = function (etag: string | null): number | null {
  if (!etag) return null

  const match = etag.match(/^(?:W\/)?"([0-9a-fA-F]+)-/i)
  if (match) {
    const size = parseInt(match[1]!, 16)
    return Number.isFinite(size) && size > 0 ? size : null
  }
  return null
}

/**
 * Умное определение общего размера байтов.
 * ВАЖНО: Если используется сжатие (gzip, br), Content-Length содержит размер
 * СЖАТЫХ данных, а стрим (response.body) отдает РАСПАКОВАННЫЕ байты.
 * Использование Content-Length в этом случае сломает прогресс-бар (>100%).
 */
const resolveTotalBytes = function (response: Response, expectedTotalBytes?: number): number | null {
  // 1. Явно переданный размер имеет высший приоритет
  if (expectedTotalBytes !== undefined && expectedTotalBytes > 0) {
    return expectedTotalBytes
  }

  const contentEncoding = response.headers.get('content-encoding')?.toLowerCase() || ''
  const isCompressed = ['gzip', 'deflate', 'br', 'zstd'].some((enc) => contentEncoding.includes(enc))

  // 2. Если данные сжаты, Content-Length нам не подходит для прогресса распаковки.
  // Пытаемся получить реальный размер из ETag.
  if (isCompressed) {
    return parseUncompressedSizeFromEtag(response.headers.get('etag'))
  }

  // 3. Если данные не сжаты, можно доверять Content-Length, а если его нет — снова смотрим в ETag.
  const contentLength = readContentLength(response)
  if (contentLength !== null) {
    return contentLength
  }

  return parseUncompressedSizeFromEtag(response.headers.get('etag'))
}

const readContentLength = function (response: Response): number | null {
  const header = response.headers.get('content-length')
  if (header === null) {
    return null
  }
  const parsed = Number.parseInt(header, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null
}

const toPercent = function (receivedBytes: number, totalBytes: number | null): number | null {
  if (totalBytes === null || totalBytes === 0) {
    return null
  }
  const percent = (receivedBytes / totalBytes) * 100
  return Math.min(100, Math.max(0, Math.round(percent)))
}

const concatChunks = function (chunks: readonly Uint8Array[], totalLength: number): Uint8Array {
  const result = new Uint8Array(totalLength)
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.byteLength
  }
  return result
}
