import { useCallback, useEffect, useReducer, useRef } from 'react'
import { CancelledError } from '@/api/CancelledError'
import { fetchJsonWithProgress } from '@/api/fetchJsonWithProgress'
import { ESTIMATED_PHOTOS_RESPONSE_BYTES } from '@/app/constants/api'
import { createInitialDownloadState, downloadReducer } from '@/lib/downloadReducer'
import { DownloadActionType } from '@/types/download'
import { buildPhotosUrl } from './buildPhotosUrl'
import type { Photo } from '@/types/photo'
import type { PhotoDataContextValue } from './types'

export const usePhotoDownload = function (): PhotoDataContextValue {
  const [state, dispatch] = useReducer(downloadReducer<Photo[]>, createInitialDownloadState<Photo[]>())
  const abortControllerRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)

  const start = useCallback((): void => {
    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId
    dispatch({ type: DownloadActionType.Start })
    dispatch({
      type: DownloadActionType.Progress,
      progress: {
        receivedBytes: 0,
        totalBytes: ESTIMATED_PHOTOS_RESPONSE_BYTES,
        percent: 0
      }
    })

    fetchJsonWithProgress<Photo[]>(buildPhotosUrl(), {
      signal: controller.signal,
      expectedTotalBytes: ESTIMATED_PHOTOS_RESPONSE_BYTES,
      onProgress: (progress) => {
        if (requestIdRef.current === requestId) {
          dispatch({ type: DownloadActionType.Progress, progress })
        }
      }
    })
      .then((data) => {
        if (requestIdRef.current === requestId) {
          dispatch({ type: DownloadActionType.Success, data })
        }
      })
      .catch((error: unknown) => {
        if (requestIdRef.current !== requestId) {
          return
        }
        if (error instanceof CancelledError) {
          dispatch({ type: DownloadActionType.Cancel })
          return
        }
        dispatch({
          type: DownloadActionType.Failure,
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
    dispatch({ type: DownloadActionType.Cancel })
  }, [])

  const reset = useCallback((): void => {
    requestIdRef.current += 1
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    dispatch({ type: DownloadActionType.Reset })
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
