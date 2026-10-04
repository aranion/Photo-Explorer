import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/app/components/common/Button'
import styles from './styles.module.css'
import type { ErrorBoundaryProps, ErrorBoundaryState } from './types'

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Необработанная ошибка интерфейса', error, errorInfo)
  }

  onReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    const { error } = this.state
    if (error === null) {
      return this.props.children
    }

    return (
      <div className={styles.fallback} role="alert">
        <h1 className={styles.title}>Что-то пошло не так</h1>
        <p className={styles.message}>{error.message}</p>
        <Button variant="primary" onClick={this.onReload}>
          Перезагрузить страницу
        </Button>
      </div>
    )
  }
}
