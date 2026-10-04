import type { DownloadState } from '@/types/download'

export interface DownloadPanelProps<TItem> {
  state: DownloadState<TItem[]>
  onStart: () => void
  onCancel: () => void
}
