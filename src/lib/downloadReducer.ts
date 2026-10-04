import { DownloadStatus, type DownloadAction, type DownloadState, DownloadActionType } from '@/types/download'

/**
 * Создаёт начальное состояние загрузки.
 *
 * @typeParam TData — тип загружаемых данных
 * @returns состояние `idle` без данных и прогресса
 */
export const createInitialDownloadState = <TData>(): DownloadState<TData> => {
  return { status: DownloadStatus.Idle }
}

/**
 * Конечный автомат загрузки данных.
 *
 * Гарантирует допустимые переходы: прогресс обновляется и отмена выполняется
 * только из состояния `loading`, а `reset` возвращает автомат в `idle`.
 *
 * @typeParam TData — тип загружаемых данных
 * @param state — текущее состояние загрузки
 * @param action — действие автомата
 * @returns новое состояние загрузки
 */
export const downloadReducer = <TData>(state: DownloadState<TData>, action: DownloadAction<TData>): DownloadState<TData> => {
  switch (action.type) {
    case DownloadActionType.Start:
      return {
        status: DownloadStatus.Loading,
        progress: { receivedBytes: 0, totalBytes: null, percent: null },
      }
    case DownloadActionType.Progress:
      return state.status === DownloadStatus.Loading ? { ...state, progress: action.progress } : state
    case DownloadActionType.Success:
      return { status: DownloadStatus.Success, data: action.data }
    case DownloadActionType.Cancel:
      return state.status === DownloadStatus.Loading ? { status: DownloadStatus.Cancelled } : state
    case DownloadActionType.Failure:
      return { status: DownloadStatus.Failure, error: action.error }
    case DownloadActionType.Reset:
      // Возвращаем начальное состояние, явно указывая дженерик,
      // чтобы TS не потерял тип TData
      return createInitialDownloadState<TData>()
    // Защита от добавления новых action в будущем (Exhaustiveness check)
    default: {
      const _exhaustiveCheck: never = action
      return _exhaustiveCheck
    }
  }
}
