import type { ReactNode } from 'react'
import type { DownloadState } from '@/types/download'
import type { Photo } from '@/types/photo'

export interface PhotoDataContextValue {
  state: DownloadState<Photo[]>
  start: () => void
  cancel: () => void
  reset: () => void
}

export interface UsePhotoDownloadResult extends PhotoDataContextValue {}

export interface PhotoDataProviderProps {
  children: ReactNode
}
