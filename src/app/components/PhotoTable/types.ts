import type { RowData } from '@tanstack/react-table'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    searchable?: boolean
  }

  interface TableMeta<TData extends RowData> {
    searchTerm?: string
  }
}
