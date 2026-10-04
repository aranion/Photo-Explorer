export const DEFAULT_API_BASE_URL = 'https://jsonplaceholder.typicode.com'
export const PHOTOS_PATH = '/photos'
/**
 * Оценка размера ответа /photos в байтах.
 *
 * Используется как запасной «общий размер» для процентов, когда сервер
 * не отдаёт заголовок `Content-Length` (например, chunked-ответ за прокси).
 */
export const ESTIMATED_PHOTOS_RESPONSE_BYTES = 1_040_000
