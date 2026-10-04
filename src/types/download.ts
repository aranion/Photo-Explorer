export interface DownloadProgress {
  receivedBytes: number
  totalBytes: number | null
  percent: number | null
}

export type DownloadStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'cancelled'
  | 'failure'

export type DownloadState<TData> =
  | { status: 'idle' }
  | { status: 'loading', progress: DownloadProgress }
  | { status: 'success', data: TData }
  | { status: 'cancelled' }
  | { status: 'failure', error: Error }

export type DownloadAction<TData> =
  | { type: 'start' }
  | { type: 'progress', progress: DownloadProgress }
  | { type: 'success', data: TData }
  | { type: 'cancel' }
  | { type: 'failure', error: Error }
  | { type: 'reset' }
