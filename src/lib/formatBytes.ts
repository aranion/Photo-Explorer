const BYTE_UNITS = ['Б', 'КБ', 'МБ', 'ГБ'] as const

/**
 * Форматирует размер в байтах в человекочитаемую строку (Б, КБ, МБ, ГБ).
 *
 * @param bytes — размер в байтах
 * @returns строка вида `12.3 КБ`
 */
export const formatBytes = function (bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return `0 ${BYTE_UNITS[0]}`
  }

  let value = bytes
  let unitIndex = 0

  while (value >= 1024 && unitIndex < BYTE_UNITS.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  const fractionDigits = unitIndex === 0 ? 0 : 1

  return `${value.toFixed(fractionDigits)} ${BYTE_UNITS[unitIndex] ?? BYTE_UNITS[0]}`
}
