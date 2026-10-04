import { useMemo, useState } from 'react'
import { getPhotoSearchableValues } from '@/app/components/PhotoTable/columns'
import { SEARCH_DEBOUNCE_MS } from '@/app/constants/search'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { filterByQuery } from '@/lib/filterByQuery'
import type { Photo } from '@/types/photo'
import type { UseCustomSearchResult } from './types'

export const useCustomSearch = function (photos: Photo[]): UseCustomSearchResult {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS)

  const filteredPhotos = useMemo(() => filterByQuery(photos, debouncedSearchTerm, getPhotoSearchableValues), [photos, debouncedSearchTerm])

  return { searchTerm, setSearchTerm, debouncedSearchTerm, filteredPhotos }
}
