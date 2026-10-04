import { ProgressBar } from '@/app/components/common/ProgressBar'
import { formatBytes } from '@/lib/formatBytes'
import type { DownloadProgress } from '@/types/download'
import styles from './styles.module.css'
import type { DownloadStatusContentProps } from './types'

export const DownloadStatusContent = function <TItem>({
  state
}: DownloadStatusContentProps<TItem>) {
  const getProgressText = function(progress: DownloadProgress): string {
    if (progress.percent === null || progress.totalBytes === null) {
      return `Загружено ${formatBytes(progress.receivedBytes)}`
    }
    return `${progress.percent}% · ${formatBytes(progress.receivedBytes)} из ${formatBytes(progress.totalBytes)}`
  }

  switch (state.status) {
    case 'idle':
      return <span className={styles.hint}>Данные ещё не загружены</span>
    case 'loading':
      return (
        <div className={styles.progress}>
          <ProgressBar percent={state.progress.percent} label="Прогресс загрузки данных" />
          <span className={styles.progressText}>{getProgressText(state.progress)}</span>
        </div>
      )
    case 'success':
      return <span>Загружено записей: {state.data.length}</span>
    case 'cancelled':
      return <span className={styles.hint}>Загрузка отменена</span>
    case 'failure':
      return <span className={styles.error}>Ошибка: {state.error.message}</span>
  }
}
