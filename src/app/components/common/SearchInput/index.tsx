import { useId } from 'react'
import styles from './styles.module.css'
import type { SearchInputProps } from './types'

export const SearchInput = function({
  value,
  onChange,
  resultSummary,
  disabled = false
}: SearchInputProps) {
  const inputId = useId()

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor={inputId}>
        Поиск по таблице
      </label>
      <input
        id={inputId}
        className={styles.input}
        type="search"
        value={value}
        placeholder="Например: sunt qui"
        disabled={disabled}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
      <p className={styles.summary} aria-live="polite">
        {resultSummary ?? ''}
      </p>
    </div>
  )
}
