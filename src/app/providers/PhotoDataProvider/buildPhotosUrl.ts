import { DEFAULT_API_BASE_URL, PHOTOS_PATH } from '@/app/constants/api'

export const buildPhotosUrl = function(): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
  return `${baseUrl.replace(/\/+$/, '')}${PHOTOS_PATH}`
}
