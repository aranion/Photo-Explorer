import type { ColumnDef } from '@tanstack/react-table'
import { HighlightedText } from '@/app/components/common/HighlightedText'
import type { Photo } from '@/types/photo'
import './types'
import styles from './styles.module.css'

export const getPhotoSearchableValues = function(photo: Photo): string[] {
  return [
    String(photo.id),
    String(photo.albumId),
    photo.title,
    photo.url,
    photo.thumbnailUrl
  ]
}

export const photoColumns: ColumnDef<Photo>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
    size: 8,
    meta: { searchable: true }
  },
  {
    id: 'albumId',
    accessorKey: 'albumId',
    header: 'Альбом',
    size: 10,
    meta: { searchable: true }
  },
  {
    id: 'title',
    accessorKey: 'title',
    header: 'Название',
    size: 52,
    meta: { searchable: true },
    cell: ({ row, table }) => (
      <HighlightedText
        text={row.original.title}
        query={table.options.meta?.searchTerm ?? ''}
      />
    )
  },
  {
    id: 'url',
    accessorKey: 'url',
    header: 'URL',
    size: 30,
    meta: { searchable: true },
    cell: ({ row, table }) => (
      <a
        className={styles.urlLink}
        href={row.original.url}
        target="_blank"
        rel="noreferrer"
      >
        <HighlightedText
          text={row.original.url}
          query={table.options.meta?.searchTerm ?? ''}
        />
      </a>
    )
  }
]
