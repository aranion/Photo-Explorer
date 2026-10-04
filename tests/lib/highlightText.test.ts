import { describe, expect, it } from 'vitest'
import { highlightText } from '@/lib/highlightText'

describe('highlightText', () => {
  it('возвращает один сегмент при пустом запросе', () => {
    expect(highlightText('Sunt qui', '   ')).toEqual([
      { text: 'Sunt qui', isMatch: false }
    ])
  })

  it('находит совпадение без учёта регистра', () => {
    expect(highlightText('Sunt qui', 'sunt')).toEqual([
      { text: 'Sunt', isMatch: true },
      { text: ' qui', isMatch: false }
    ])
  })

  it('находит несколько вхождений', () => {
    expect(highlightText('abABab', 'ab')).toEqual([
      { text: 'ab', isMatch: true },
      { text: 'AB', isMatch: true },
      { text: 'ab', isMatch: true }
    ])
  })

  it('обрабатывает спецсимволы как обычный текст', () => {
    expect(highlightText('a.b(c)', '.b(')).toEqual([
      { text: 'a', isMatch: false },
      { text: '.b(', isMatch: true },
      { text: 'c)', isMatch: false }
    ])
  })

  it('подсвечивает совпадение в начале и в конце строки', () => {
    expect(highlightText('abcabc', 'abc')).toEqual([
      { text: 'abc', isMatch: true },
      { text: 'abc', isMatch: true }
    ])
  })

  it('возвращает исходный текст, если совпадений нет', () => {
    expect(highlightText('abc', 'xyz')).toEqual([{ text: 'abc', isMatch: false }])
  })
})
