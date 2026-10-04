import { useCallback, useEffect, useReducer, useRef } from 'react'
import { CancelledError } from '@/api/CancelledError'
import { fetchJsonWithProgress } from '@/api/fetchJsonWithProgress'
import { ESTIMATED_PHOTOS_RESPONSE_BYTES } from '@/app/constants/api'
import { createInitialDownloadState, downloadReducer } from '@/lib/downloadReducer'
import type { DownloadState } from '@/types/download'
import type { Photo } from '@/types/photo'
import { buildPhotosUrl } from './buildPhotosUrl'

export interface UsePhotoDownloadResult {
  state: DownloadState<Photo[]>
  start: () => void
  cancel: () => void
  reset: () => void
}

export const usePhotoDownload = function(): UsePhotoDownloadResult {
  const [state, dispatch] = useReducer(
    downloadReducer<Photo[]>,
    createInitialDownloadState<Photo[]>()
  )
  const abortControllerRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  const start = useCallback((): void => {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    dispatch({ type: 'start' })

    fetchJsonWithProgress<Photo[]>(buildPhotosUrl(), {
      signal: controller.signal,
      expectedTotalBytes: ESTIMATED_PHOTOS_RESPONSE_BYTES,
      onProgress: (progress) => {
        if (requestIdRef.current === requestId) {
          dispatch({ type: 'progress', progress })
        }
      }
    })
      .then((data) => {
        if (requestIdRef.current === requestId) {
          dispatch({ type: 'success', data })
        }
      })
      .catch((error: unknown) => {
        if (requestIdRef.current !== requestId) {
          return
        }
        if (error instanceof CancelledError) {
          dispatch({ type: 'cancel' })
          return
        }
        dispatch({
          type: 'failure',
          error: error instanceof Error ? error : new Error(String(error))
        })
      })
      .finally(() => {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null
        }
      })
  }, [])

  const cancel = useCallback((): void => {
    requestIdRef.current += 1
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    dispatch({ type: 'cancel' })
  }, [])

  const reset = useCallback((): void => {
    requestIdRef.current += 1
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    dispatch({ type: 'reset' })
  }, [])

  useEffect(
    () => () => {
      requestIdRef.current += 1
      abortControllerRef.current?.abort()
    },
    []
  )

  return { state, start, cancel, reset }
}
