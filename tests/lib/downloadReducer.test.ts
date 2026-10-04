import { describe, expect, it } from 'vitest'
import { createInitialDownloadState, downloadReducer } from '@/lib/downloadReducer'

const PROGRESS = { receivedBytes: 10, totalBytes: 100, percent: 10 }

describe('downloadReducer', () => {
  it('создаёт начальное состояние', () => {
    expect(createInitialDownloadState<string[]>()).toEqual({ status: 'idle' })
  })

  it('переводит состояние в loading по действию start', () => {
    const state = downloadReducer(createInitialDownloadState<string[]>(), { type: 'start' })
    expect(state).toEqual({
      status: 'loading',
      progress: { receivedBytes: 0, totalBytes: null, percent: null }
    })
  })

  it('обновляет прогресс во время загрузки', () => {
    const loading = downloadReducer(createInitialDownloadState<string[]>(), {
      type: 'start'
    })
    const updated = downloadReducer(loading, { type: 'progress', progress: PROGRESS })
    expect(updated).toEqual({ status: 'loading', progress: PROGRESS })
  })

  it('игнорирует прогресс вне состояния loading', () => {
    const idle = downloadReducer(createInitialDownloadState<string[]>(), {
      type: 'progress',
      progress: PROGRESS
    })
    expect(idle).toEqual({ status: 'idle' })
  })

  it('сохраняет данные по действию success', () => {
    const loading = downloadReducer(createInitialDownloadState<string[]>(), {
      type: 'start'
    })
    const success = downloadReducer(loading, { type: 'success', data: ['a', 'b'] })
    expect(success).toEqual({ status: 'success', data: ['a', 'b'] })
  })

  it('отменяет загрузку только из состояния loading', () => {
    const loading = downloadReducer(createInitialDownloadState<string[]>(), {
      type: 'start'
    })
    expect(downloadReducer(loading, { type: 'cancel' })).toEqual({ status: 'cancelled' })
    expect(downloadReducer(createInitialDownloadState<string[]>(), { type: 'cancel' })).toEqual({
      status: 'idle'
    })
  })

  it('сохраняет ошибку по действию failure', () => {
    const error = new Error('сеть недоступна')
    const failure = downloadReducer(createInitialDownloadState<string[]>(), {
      type: 'failure',
      error
    })
    expect(failure).toEqual({ status: 'failure', error })
  })

  it('сбрасывает состояние по действию reset', () => {
    const failure = downloadReducer(createInitialDownloadState<string[]>(), {
      type: 'failure',
      error: new Error('ошибка')
    })
    expect(downloadReducer(failure, { type: 'reset' })).toEqual({ status: 'idle' })
  })
})
