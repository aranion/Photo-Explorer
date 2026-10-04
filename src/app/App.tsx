import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from '@/app/components/common/ErrorBoundary'
import { CustomSearchPage } from '@/app/pages/CustomSearchPage'
import { TanStackSearchPage } from '@/app/pages/TanStackSearchPage'
import { PhotoDataProvider } from '@/app/providers/PhotoDataProvider'
import { ROUTES } from './constants/routes'
import styles from './App.module.css'

export const App = function() {
  return (
    <ErrorBoundary>
      <PhotoDataProvider>
        <div className={styles.app}>
          <header className={styles.header}>
            <span className={styles.brand}>Photo Explorer</span>
            <nav className={styles.nav} aria-label="Режимы поиска">
              <NavLink
                to={ROUTES.tanStackSearch}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
              >
                Поиск на TanStack
              </NavLink>
              <NavLink
                to={ROUTES.customSearch}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
                }
              >
                Собственный поиск
              </NavLink>
            </nav>
          </header>
          <main className={styles.main}>
            <Routes>
              <Route path={ROUTES.tanStackSearch} element={<TanStackSearchPage />} />
              <Route path={ROUTES.customSearch} element={<CustomSearchPage />} />
              <Route path="*" element={<Navigate to={ROUTES.tanStackSearch} replace />} />
            </Routes>
          </main>
        </div>
      </PhotoDataProvider>
    </ErrorBoundary>
  )
}
