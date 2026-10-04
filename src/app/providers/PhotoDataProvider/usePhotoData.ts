import { useContext } from 'react'
import { PhotoDataContext } from './context'
import type { PhotoDataContextValue } from './types'

export const usePhotoData = function(): PhotoDataContextValue {
  const value = useContext(PhotoDataContext)
  if (value === null) {
    throw new Error('usePhotoData должен вызываться внутри PhotoDataProvider')
  }
  return value
}
