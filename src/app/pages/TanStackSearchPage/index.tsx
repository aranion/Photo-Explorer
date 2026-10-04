import { useMemo, useState } from 'react'
import { VirtualizedTable } from '@/app/components/common/VirtualizedTable'
import { EMPTY_PHOTOS } from '@/app/components/PhotoTable/const'
import { photoColumns } from '@/app/components/PhotoTable/columns'
import { getPhotoTableEmptyMessage } from '@/app/components/PhotoTable/getPhotoTableEmptyMessage'
import { PhotoSearchPage } from '@/app/components/PhotoSearchPage'
import { SEARCH_DEBOUNCE_MS } from '@/app/constants/search'
import { usePhotoData } from '@/app/providers/PhotoDataProvider/usePhotoData'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { createSearchableColumnsFilter } from '@/lib/createGlobalFilterFn'
import type { Photo } from '@/types/photo'

export const TanStackSearchPage = function() {
  const { state } = usePhotoData()
  const [searchTerm, setSearchTerm] = useState('')
  const [visibleRowCount, setVisibleRowCount] = useState(0)
  const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS)

  const photos = state.status === 'success' ? state.data : EMPTY_PHOTOS
  const globalFilterFn = useMemo(() => createSearchableColumnsFilter<Photo>(), [])
  const meta = useMemo(() => ({ searchTerm: debouncedSearchTerm }), [debouncedSearchTerm])

  const hasSearchQuery = debouncedSearchTerm.trim().length > 0
  const resultSummary = hasSearchQuery
    ? `Найдено: ${visibleRowCount} из ${photos.length}`
    : null

  return (
    <PhotoSearchPage
      title="Поиск средствами TanStack Table"
      description="Данные фильтрует сам движок таблицы: getFilteredRowModel и globalFilterFn, который ищет по колонкам с meta.searchable. Внешний код только передаёт значение globalFilter."
      search={{ term: searchTerm, onTermChange: setSearchTerm, resultSummary }}
    >
      <VirtualizedTable
        label="Таблица фотографий, поиск средствами TanStack Table"
        columns={photoColumns}
        data={photos}
        meta={meta}
        globalFilter={debouncedSearchTerm}
        globalFilterFn={globalFilterFn}
        emptyMessage={getPhotoTableEmptyMessage(state, hasSearchQuery)}
        onVisibleRowCountChange={setVisibleRowCount}
      />
    </PhotoSearchPage>
  )
}
