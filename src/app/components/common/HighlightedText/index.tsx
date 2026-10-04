import { useMemo } from 'react'
import { highlightText } from '@/lib/highlightText'
import styles from './styles.module.css'
import type { HighlightedTextProps } from './types'

export const HighlightedText = function({ text, query }: HighlightedTextProps) {
  const segments = useMemo(() => highlightText(text, query), [text, query])

  if (query.trim().length === 0) {
    return <>{text}</>
  }

  return (
    <>
      {segments.map((segment, index) =>
        segment.isMatch ? (
          <mark key={index} className={styles.mark}>
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      )}
    </>
  )
}
