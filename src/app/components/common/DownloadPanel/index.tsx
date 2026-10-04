import { Button } from '@/app/components/common/Button'
import type { DownloadStatus } from '@/types/download'
import { DownloadStatusContent } from './DownloadStatusContent'
import styles from './styles.module.css'
import type { DownloadPanelProps } from './types'

export const DownloadPanel = function <TItem>({
  state,
  onStart,
  onCancel
}: DownloadPanelProps<TItem>) {
  const getStartButtonLabel = function(status: DownloadStatus): string {
    switch (status) {
      case 'idle':
        return 'Загрузить данные'
      case 'success':
        return 'Обновить данные'
      case 'cancelled':
      case 'failure':
        return 'Повторить загрузку'
      case 'loading':
        return 'Загрузить данные'
    }
  }

  return (
    <section className={styles.panel} aria-label="Загрузка данных">
      <div className={styles.actions}>
        {state.status === 'loading' ? (
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
