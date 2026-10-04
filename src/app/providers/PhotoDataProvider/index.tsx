import { useMemo } from 'react'
import { PhotoDataContext } from './context'
import { usePhotoDownload } from './usePhotoDownload'
import type { PhotoDataContextValue, PhotoDataProviderProps } from './types'

export const PhotoDataProvider = function({ children }: PhotoDataProviderProps) {
  const { state, start, cancel, reset } = usePhotoDownload()

  const value = useMemo<PhotoDataContextValue>(
    () => ({ state, start, cancel, reset }),
    [state, start, cancel, reset]
  )

  return <PhotoDataContext.Provider value={value}>{children}</PhotoDataContext.Provider>
}
