import type { Row } from '@tanstack/react-table'
import { describe, expect, it } from 'vitest'
import { createSearchableColumnsFilter } from '@/lib/createGlobalFilterFn'
import type { Photo } from '@/types/photo'

interface FakeCellDefinition {
  value: string
  searchable?: boolean
}

const createFakeRow = function(cells: readonly FakeCellDefinition[]): Row<Photo> {
  return {
    getAllCells: () =>
      cells.map((cell) => ({
        column: {
          columnDef: { meta: cell.searchable === true ? { searchable: true } : {} }
        },
        getValue: () => cell.value
      }))
  } as unknown as Row<Photo>
}

const noopAddMeta = (): void => undefined

describe('createSearchableColumnsFilter', () => {
  it('пропускает строку при пустом запросе', () => {
    const filterFn = createSearchableColumnsFilter<Photo>()
    const row = createFakeRow([{ value: 'Sunt qui', searchable: true }])
    expect(filterFn(row, '', '   ', noopAddMeta)).toBe(true)
  })

  it('находит совпадение по колонке с meta.searchable', () => {
    const filterFn = createSearchableColumnsFilter<Photo>()
    const row = createFakeRow([
      { value: '1', searchable: true },
      { value: 'Sunt qui excepturi', searchable: true }
    ])
    expect(filterFn(row, '', 'SUNT', noopAddMeta)).toBe(true)
  })

  it('игнорирует колонки без meta.searchable', () => {
    const filterFn = createSearchableColumnsFilter<Photo>()
    const row = createFakeRow([{ value: 'секретное значение' }])
    expect(filterFn(row, '', 'секретное', noopAddMeta)).toBe(false)
  })

  it('возвращает false, если совпадений нет', () => {
    const filterFn = createSearchableColumnsFilter<Photo>()
    const row = createFakeRow([{ value: 'abc', searchable: true }])
    expect(filterFn(row, '', 'xyz', noopAddMeta)).toBe(false)
  })

  it('удаляет фильтр для пустого значения через autoRemove', () => {
    const filterFn = createSearchableColumnsFilter<Photo>()
    expect(filterFn.autoRemove?.('   ')).toBe(true)
    expect(filterFn.autoRemove?.('abc')).toBe(false)
  })
})
