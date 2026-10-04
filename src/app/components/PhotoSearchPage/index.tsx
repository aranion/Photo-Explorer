import { DownloadPanel } from '@/app/components/common/DownloadPanel'
import { SearchInput } from '@/app/components/common/SearchInput'
import { usePhotoData } from '@/app/providers/PhotoDataProvider/usePhotoData'
import styles from './styles.module.css'
import type { PhotoSearchPageProps } from './types'
import { DownloadStatus } from '@/types/download'

export const PhotoSearchPage = function ({ title, description, search, children }: PhotoSearchPageProps) {
  const { state, start, cancel } = usePhotoData()

  return (
    <section className={styles.page}>
      <header>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </header>
      <DownloadPanel state={state} onStart={start} onCancel={cancel} />
      <SearchInput
        value={search.term}
        onChange={search.onTermChange}
        resultSummary={search.resultSummary}
        disabled={state.status !== DownloadStatus.Success}
      />
      {children}
    </section>
  )
}
