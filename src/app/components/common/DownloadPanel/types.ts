import type { DownloadState } from '@/types/download'
import type { ReactElement } from 'react'

export interface DownloadPanelProps<TItem> {
  state: DownloadState<TItem[]>
  onStart: () => void
  onCancel: () => void
}

export type DownloadPanelComponent = <TItem>(props: DownloadPanelProps<TItem>) => ReactElement