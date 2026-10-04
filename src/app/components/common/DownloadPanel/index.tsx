import { Button } from '@/app/components/common/Button'
import { DownloadStatus } from '@/types/download'
import { DownloadStatusContent } from './DownloadStatusContent'
import styles from './styles.module.css'
import type { DownloadPanelProps } from './types'

export const DownloadPanel = <TItem,>({ state, onStart, onCancel }: DownloadPanelProps<TItem>) => {
  const getStartButtonLabel = (status: DownloadStatus): string => {
    switch (status) {
      case DownloadStatus.Idle:
        return 'Загрузить данные'
      case DownloadStatus.Success:
        return 'Обновить данные'
      case DownloadStatus.Cancelled:
      case DownloadStatus.Failure:
        return 'Повторить загрузку'
      case DownloadStatus.Loading:
        return 'Загрузить данные'
      default: {
        // Защита от добавления новых статусов в enum
        const _exhaustiveCheck: never = status
        return _exhaustiveCheck
      }
    }
  }

  return (
    <section className={styles.panel} aria-label="Загрузка данных">
      <div className={styles.actions}>
        {state.status === DownloadStatus.Loading ? (
          <Button variant="danger" onClick={onCancel}>
            Отменить загрузку
          </Button>
        ) : (
          <Button variant="primary" onClick={onStart}>
            {getStartButtonLabel(state.status)}
          </Button>
        )}
      </div>
      <div className={styles.status} aria-live="polite">
        <DownloadStatusContent state={state} />
      </div>
    </section>
  )
}
