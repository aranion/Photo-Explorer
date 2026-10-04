import type { ReactNode } from 'react'

export interface PhotoSearchControls {
  term: string
  onTermChange: (value: string) => void
  resultSummary: string | null
}

export interface PhotoSearchPageProps {
  title: string
  description: string
  search: PhotoSearchControls
  children: ReactNode
}
