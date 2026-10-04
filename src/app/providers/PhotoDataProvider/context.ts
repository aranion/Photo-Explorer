import { createContext } from 'react'
import type { PhotoDataContextValue } from './types'

export const PhotoDataContext = createContext<PhotoDataContextValue | null>(null)
