/**
 * Проверяет, содержит ли хотя бы одно из значений поисковый запрос.
 *
 * Поиск регистронезависимый, запрос обрезается по краям; пустой (или
 * состоящий из пробелов) запрос совпадает с любым набором значений.
 *
 * @param values — набор значений для проверки
 * @param query — поисковый запрос
 * @returns `true`, если найдено хотя бы одно совпадение
 */
export const matchesAnyQuery = function(values: readonly string[], query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()
  if (normalizedQuery.length === 0) {
    return true
  }
  return values.some((value) => value.toLowerCase().includes(normalizedQuery))
}
