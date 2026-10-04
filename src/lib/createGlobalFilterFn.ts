import type { FilterFn, RowData } from '@tanstack/react-table'
import { matchesAnyQuery } from './matchesQuery'

/**
 * Создаёт функцию глобальной фильтрации (`globalFilterFn`) для TanStack Table.
 *
 * Фильтр проверяет только колонки с `meta.searchable` и использует общий
 * примитив {@link matchesAnyQuery}, поэтому результат совпадает с поиском
 * на странице с собственной фильтрацией.
 *
 * @typeParam TData — тип строки таблицы
 * @returns функция для опции `globalFilterFn` в `useReactTable`
 */
export const createSearchableColumnsFilter = function <TData extends RowData>(): FilterFn<TData> {
  const filterFn: FilterFn<TData> = (row, _columnId, filterValue) => {
    const query = String(filterValue ?? '')
    if (query.trim().length === 0) {
      return true
    }
    const searchableValues = row
      .getAllCells()
      .filter((cell) => cell.column.columnDef.meta?.searchable === true)
      .map((cell) => String(cell.getValue() ?? ''))
    return matchesAnyQuery(searchableValues, query)
  }

  filterFn.autoRemove = (filterValue: unknown) =>
    String(filterValue ?? '').trim().length === 0

  return filterFn
}
