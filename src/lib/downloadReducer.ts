import type { DownloadAction, DownloadState } from '@/types/download'

/**
 * Создаёт начальное состояние загрузки.
 *
 * @typeParam TData — тип загружаемых данных
 * @returns состояние `idle` без данных и прогресса
 */
export const createInitialDownloadState = function <TData>(): DownloadState<TData> {
  return { status: 'idle' }
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
export const downloadReducer = function <TData>(
  state: DownloadState<TData>,
  action: DownloadAction<TData>
): DownloadState<TData> {
  switch (action.type) {
    case 'start':
      return {
        status: 'loading',
        progress: { receivedBytes: 0, totalBytes: null, percent: null }
      }
    case 'progress':
      return state.status === 'loading' ? { ...state, progress: action.progress } : state
    case 'success':
      return { status: 'success', data: action.data }
    case 'cancel':
      return state.status === 'loading' ? { status: 'cancelled' } : state
    case 'failure':
      return { status: 'failure', error: action.error }
    case 'reset':
      return createInitialDownloadState()
  }
}
