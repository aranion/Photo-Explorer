import { describe, expect, it } from 'vitest'
import { createInitialDownloadState, downloadReducer } from '@/lib/downloadReducer'
import { DownloadActionType, DownloadStatus } from '@/types/download'

const PROGRESS = { receivedBytes: 10, totalBytes: 100, percent: 10 }

describe('downloadReducer', () => {
  it('создаёт начальное состояние', () => {
    expect(createInitialDownloadState<string[]>()).toEqual({ status: DownloadStatus.Idle })
  })

  it('переводит состояние в loading по действию start', () => {
    const state = downloadReducer(createInitialDownloadState<string[]>(), { type: DownloadActionType.Start })
    expect(state).toEqual({
      status: DownloadStatus.Loading,
      progress: { receivedBytes: 0, totalBytes: null, percent: null },
    })
  })

  it('обновляет прогресс во время загрузки', () => {
    const loading = downloadReducer(createInitialDownloadState<string[]>(), {
      type: DownloadActionType.Start,
    })
    const updated = downloadReducer(loading, { type: DownloadActionType.Progress, progress: PROGRESS })
    expect(updated).toEqual({ status: DownloadStatus.Loading, progress: PROGRESS })
  })

  it('игнорирует прогресс вне состояния loading', () => {
    const idle = downloadReducer(createInitialDownloadState<string[]>(), {
      type: DownloadActionType.Progress,
      progress: PROGRESS,
    })
    expect(idle).toEqual({ status: DownloadStatus.Idle })
  })

  it('сохраняет данные по действию success', () => {
    const loading = downloadReducer(createInitialDownloadState<string[]>(), {
      type: DownloadActionType.Start,
    })
    const success = downloadReducer(loading, { type: DownloadActionType.Success, data: ['a', 'b'] })
    expect(success).toEqual({ status: DownloadStatus.Success, data: ['a', 'b'] })
  })

  it('отменяет загрузку только из состояния loading', () => {
    const loading = downloadReducer(createInitialDownloadState<string[]>(), {
      type: DownloadActionType.Start,
    })
    expect(downloadReducer(loading, { type: DownloadActionType.Cancel })).toEqual({ status: DownloadStatus.Cancelled })
    expect(downloadReducer(createInitialDownloadState<string[]>(), { type: DownloadActionType.Cancel })).toEqual({
      status: DownloadStatus.Idle,
    })
  })

  it('сохраняет ошибку по действию failure', () => {
    const error = new Error('сеть недоступна')
    const failure = downloadReducer(createInitialDownloadState<string[]>(), {
      type: DownloadActionType.Failure,
      error,
    })
    expect(failure).toEqual({ status: DownloadStatus.Failure, error })
  })

  it('сбрасывает состояние по действию reset', () => {
    const failure = downloadReducer(createInitialDownloadState<string[]>(), {
      type: DownloadActionType.Failure,
      error: new Error('ошибка'),
    })
    expect(downloadReducer(failure, { type: DownloadActionType.Reset })).toEqual({ status: DownloadStatus.Idle })
  })
})
