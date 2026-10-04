import type { DownloadState } from '@/types/download'

export interface DownloadStatusContentProps<TItem> {
  state: DownloadState<TItem[]>
}
