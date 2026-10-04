import { matchesAnyQuery } from './matchesQuery'

/**
 * Фильтрует коллекцию по поисковому запросу через пользовательский аксессор.
 *
 * @typeParam TItem — тип элемента коллекции
 * @param items — исходная коллекция
 * @param query — поисковый запрос
 * @param getSearchableValues — возвращает значения элемента, по которым идёт поиск
 * @returns новый массив с элементами, удовлетворяющими запросу
 */
export const filterByQuery = function <TItem>(
  items: readonly TItem[],
  query: string,
  getSearchableValues: (item: TItem) => readonly string[]
): TItem[] {
  if (query.trim().length === 0) {
    return [...items]
  }
  return items.filter((item) => matchesAnyQuery(getSearchableValues(item), query))
}
