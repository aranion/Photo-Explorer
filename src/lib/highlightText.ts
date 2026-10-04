/**
 * Сегмент текста с признаком совпадения с поисковым запросом.
 */
export interface HighlightSegment {
  text: string
  isMatch: boolean
}

/**
 * Разбивает текст на сегменты для подсветки поискового запроса.
 *
 * Совпадения ищутся без учёта регистра; запрос трактуется как обычная
 * подстрока, поэтому спецсимволы не имеют особого смысла.
 *
 * @param text — исходный текст
 * @param query — поисковый запрос
 * @returns сегменты текста с признаком совпадения
 */
export const highlightText = function (text: string, query: string): HighlightSegment[] {
  const normalizedQuery = query.trim()

  if (normalizedQuery.length === 0) {
    return [{ text, isMatch: false }]
  }

  const lowerText = text.toLowerCase()
  const lowerQuery = normalizedQuery.toLowerCase()
  const segments: HighlightSegment[] = []
  let offset = 0

  for (;;) {
    const matchIndex = lowerText.indexOf(lowerQuery, offset)
    if (matchIndex === -1) {
      break
    }
    if (matchIndex > offset) {
      segments.push({ text: text.slice(offset, matchIndex), isMatch: false })
    }
    segments.push({
      text: text.slice(matchIndex, matchIndex + normalizedQuery.length),
      isMatch: true
    })
    offset = matchIndex + normalizedQuery.length
  }

  if (offset < text.length) {
    segments.push({ text: text.slice(offset), isMatch: false })
  }

  return segments.length === 0 ? [{ text, isMatch: false }] : segments
}
