import { useMemo, useState } from 'react'
import { getPhotoSearchableValues } from '@/app/components/PhotoTable/columns'
import { SEARCH_DEBOUNCE_MS } from '@/app/constants/search'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { filterByQuery } from '@/lib/filterByQuery'
import type { Photo } from '@/types/photo'

export interface UseCustomSearchResult {
  searchTerm: string
  setSearchTerm: (value: string) => void
  debouncedSearchTerm: string
  filteredPhotos: Photo[]
}

export const useCustomSearch = function(photos: Photo[]): UseCustomSearchResult {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, SEARCH_DEBOUNCE_MS)

  const filteredPhotos = useMemo(
    () => filterByQuery(photos, debouncedSearchTerm, getPhotoSearchableValues),
    [photos, debouncedSearchTerm]
  )

  return { searchTerm, setSearchTerm, debouncedSearchTerm, filteredPhotos }
}
