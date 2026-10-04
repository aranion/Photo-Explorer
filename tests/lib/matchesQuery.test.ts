import { describe, expect, it } from 'vitest'
import { matchesAnyQuery } from '@/lib/matchesQuery'

describe('matchesAnyQuery', () => {
  it('пропускает всё при пустом или пробельном запросе', () => {
    expect(matchesAnyQuery(['abc'], '')).toBe(true)
    expect(matchesAnyQuery(['abc'], '   ')).toBe(true)
  })

  it('ищет без учёта регистра', () => {
    expect(matchesAnyQuery(['Sunt qui'], 'SUNT')).toBe(true)
  })

  it('проверяет все переданные значения', () => {
    expect(matchesAnyQuery(['первое', 'второе'], 'ВТО')).toBe(true)
  })

  it('возвращает false, если совпадений нет', () => {
    expect(matchesAnyQuery(['первое', 'второе'], 'третье')).toBe(false)
  })
})
