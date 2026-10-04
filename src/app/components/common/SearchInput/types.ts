export interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  resultSummary: string | null
  disabled?: boolean
}
