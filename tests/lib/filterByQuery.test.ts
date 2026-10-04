import { describe, expect, it } from 'vitest'
import { filterByQuery } from '@/lib/filterByQuery'

interface TestItem {
  title: string
  url: string
}

const ITEMS: TestItem[] = [
  { title: 'Sunt qui excepturi', url: 'https://example.com/1' },
  { title: 'Iusto aliquam', url: 'https://example.com/2' }
]

const getSearchableValues = function(item: TestItem): string[] {
  return [item.title, item.url]
}

describe('filterByQuery', () => {
  it('возвращает копию массива при пустом запросе', () => {
    const result = filterByQuery(ITEMS, '  ', getSearchableValues)
    expect(result).toEqual(ITEMS)
    expect(result).not.toBe(ITEMS)
  })

  it('фильтрует по названию без учёта регистра', () => {
    expect(filterByQuery(ITEMS, 'SUNT', getSearchableValues)).toEqual([ITEMS[0]])
  })

  it('фильтрует по любому из переданных полей', () => {
    expect(filterByQuery(ITEMS, 'example.com/2', getSearchableValues)).toEqual([ITEMS[1]])
  })

  it('возвращает пустой массив, если совпадений нет', () => {
    expect(filterByQuery(ITEMS, 'нет-такого', getSearchableValues)).toEqual([])
  })
})
