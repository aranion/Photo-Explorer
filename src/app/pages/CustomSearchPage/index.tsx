import { useMemo } from 'react'
import { VirtualizedTable } from '@/app/components/common/VirtualizedTable'
import { EMPTY_PHOTOS } from '@/app/components/PhotoTable/const'
import { photoColumns } from '@/app/components/PhotoTable/columns'
import { getPhotoTableEmptyMessage } from '@/app/components/PhotoTable/getPhotoTableEmptyMessage'
import { PhotoSearchPage } from '@/app/components/PhotoSearchPage'
import { usePhotoData } from '@/app/providers/PhotoDataProvider/usePhotoData'
import { useCustomSearch } from './useCustomSearch'

export const CustomSearchPage = function() {
  const { state } = usePhotoData()
  const photos = state.status === 'success' ? state.data : EMPTY_PHOTOS
  const { searchTerm, setSearchTerm, debouncedSearchTerm, filteredPhotos } =
    useCustomSearch(photos)

  const meta = useMemo(() => ({ searchTerm: debouncedSearchTerm }), [debouncedSearchTerm])
  const hasSearchQuery = debouncedSearchTerm.trim().length > 0
  const resultSummary = hasSearchQuery
    ? `Найдено: ${filteredPhotos.length} из ${photos.length}`
    : null

  return (
    <PhotoSearchPage
      title="Поиск собственными средствами"
      description="Массив фильтруется вручную чистой функцией filterByQuery до передачи в таблицу. TanStack Table в этом режиме отвечает только за сортировку и виртуализацию."
      search={{ term: searchTerm, onTermChange: setSearchTerm, resultSummary }}
    >
      <VirtualizedTable
        label="Таблица фотографий, собственный поиск"
        columns={photoColumns}
        data={filteredPhotos}
        meta={meta}
        emptyMessage={getPhotoTableEmptyMessage(state, hasSearchQuery)}
      />
    </PhotoSearchPage>
  )
}
