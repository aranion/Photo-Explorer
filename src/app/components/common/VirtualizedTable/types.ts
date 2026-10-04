import type { ColumnDef, FilterFn, RowData, TableMeta } from '@tanstack/react-table'
import type { ReactNode } from 'react'

export interface VirtualizedTableProps<TData extends RowData> {
  label: string
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  meta?: TableMeta<TData>
  globalFilter?: string
  globalFilterFn?: FilterFn<TData>
  enableSorting?: boolean
  rowHeight?: number
  overscan?: number
  height?: number
  getRowId?: (row: TData, index: number) => string
  emptyMessage: ReactNode
  onVisibleRowCountChange?: (count: number) => void
}
