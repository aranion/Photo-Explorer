import { DownloadStatus, type DownloadState } from '@/types/download'
import type { Photo } from '@/types/photo'

export const getPhotoTableEmptyMessage = function (state: DownloadState<Photo[]>, hasSearchQuery: boolean): string {
  switch (state.status) {
    case DownloadStatus.Idle:
      return 'Нажмите «Загрузить данные», чтобы увидеть таблицу'
    case DownloadStatus.Loading:
      return 'Идёт загрузка данных…'
    case DownloadStatus.Cancelled:
      return 'Загрузка отменена'
    case DownloadStatus.Failure:
      return 'Не удалось загрузить данные'
    case DownloadStatus.Success:
      return hasSearchQuery ? 'Ничего не найдено по запросу' : 'Данные отсутствуют'
    default:
      throw new Error('Отсутствует указанные статус')
  }
}
