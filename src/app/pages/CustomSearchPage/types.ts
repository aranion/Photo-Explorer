import type { Photo } from '@/types/photo'

export interface UseCustomSearchResult {
  searchTerm: string
  setSearchTerm: (value: string) => void
  debouncedSearchTerm: string
  filteredPhotos: Photo[]
}
