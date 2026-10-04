export enum DownloadStatus {
  Idle = 'idle',
  Loading = 'loading',
  Success = 'success',
  Cancelled = 'cancelled',
  Failure = 'failure',
}

export enum DownloadActionType {
  Start = 'start',
  Progress = 'progress',
  Success = 'success',
  Cancel = 'cancel',
  Failure = 'failure',
  Reset = 'reset',
}

export interface DownloadProgress {
  receivedBytes: number
  totalBytes: number | null
  percent: number | null
}

export type DownloadState<TData> =
  | { status: DownloadStatus.Idle }
  | { status: DownloadStatus.Loading; progress: DownloadProgress }
  | { status: DownloadStatus.Success; data: TData }
  | { status: DownloadStatus.Cancelled }
  | { status: DownloadStatus.Failure; error: Error }

export type DownloadAction<TData> =
  | { type: DownloadActionType.Start }
  | { type: DownloadActionType.Progress; progress: DownloadProgress }
  | { type: DownloadActionType.Success; data: TData }
  | { type: DownloadActionType.Cancel }
  | { type: DownloadActionType.Failure; error: Error }
  | { type: DownloadActionType.Reset }
