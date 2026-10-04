import type { DownloadState } from '@/types/download'
import type { Photo } from '@/types/photo'

export const getPhotoTableEmptyMessage = function(
  state: DownloadState<Photo[]>,
  hasSearchQuery: boolean
): string {
  switch (state.status) {
    case 'idle':
      return 'Нажмите «Загрузить данные», чтобы увидеть таблицу'
    case 'loading':
      return 'Идёт загрузка данных…'
    case 'cancelled':
      return 'Загрузка отменена'
    case 'failure':
      return 'Не удалось загрузить данные'
    case 'success':
      return hasSearchQuery ? 'Ничего не найдено по запросу' : 'Данные отсутствуют'
  }
}
