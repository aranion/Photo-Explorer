import { ProgressBar } from '@/app/components/common/ProgressBar'
import { formatBytes } from '@/lib/formatBytes'
import { DownloadStatus, type DownloadProgress } from '@/types/download'
import styles from './styles.module.css'
import type { DownloadStatusContentProps } from './types'

export const DownloadStatusContent = function <TItem>({ state }: DownloadStatusContentProps<TItem>) {
  const getProgressText = function (progress: DownloadProgress): string {
    if (progress.percent === null || progress.totalBytes === null) {
      return `Загружено ${formatBytes(progress.receivedBytes)}`
    }
    return `${progress.percent}% · ${formatBytes(progress.receivedBytes)} из ${formatBytes(progress.totalBytes)}`
  }

  switch (state.status) {
    case DownloadStatus.Idle:
      return <span className={styles.hint}>Данные ещё не загружены</span>
    case DownloadStatus.Loading:
      return (
        <div className={styles.progress}>
          <ProgressBar percent={state.progress.percent} label="Прогресс загрузки данных" />
          <span className={styles.progressText}>{getProgressText(state.progress)}</span>
        </div>
      )
    case DownloadStatus.Success:
      return <span>Загружено записей: {state.data.length}</span>
    case DownloadStatus.Cancelled:
      return <span className={styles.hint}>Загрузка отменена</span>
    case DownloadStatus.Failure:
      return <span className={styles.error}>Ошибка: {state.error.message}</span>
  }
}
