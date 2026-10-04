import { useEffect, useRef, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type RowData,
  type SortingState
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Button } from '@/app/components/common/Button'
import {
  DEFAULT_OVERSCAN_ROWS,
  DEFAULT_ROW_HEIGHT_PX,
  DEFAULT_TABLE_HEIGHT_PX
} from './const'
import styles from './styles.module.css'
import type { VirtualizedTableProps } from './types'

export const VirtualizedTable = function <TData extends RowData>({
  label,
  columns,
  data,
  meta,
  globalFilter,
  globalFilterFn,
  enableSorting = true,
  rowHeight = DEFAULT_ROW_HEIGHT_PX,
  overscan = DEFAULT_OVERSCAN_ROWS,
  height = DEFAULT_TABLE_HEIGHT_PX,
  getRowId,
  emptyMessage,
  onVisibleRowCountChange
}: VirtualizedTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const table = useReactTable<TData>({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    enableSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn,
    meta,
    getRowId
  })

  const rows = table.getRowModel().rows
  const gridTemplateColumns = table
    .getVisibleLeafColumns()
    .map((column) => `minmax(0, ${column.getSize()}fr)`)
    .join(' ')

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => rowHeight,
    overscan
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalHeight = rowVirtualizer.getTotalSize()

  useEffect(() => {
    onVisibleRowCountChange?.(rows.length)
  }, [onVisibleRowCountChange, rows.length])

  const toAriaSort = function(
    direction: false | 'asc' | 'desc'
  ): 'ascending' | 'descending' | 'none' {
    switch (direction) {
      case 'asc':
        return 'ascending'
      case 'desc':
        return 'descending'
      default:
        return 'none'
    }
  }

  const getSortIndicator = function(direction: false | 'asc' | 'desc'): string {
    switch (direction) {
      case 'asc':
        return '▲'
      case 'desc':
        return '▼'
      default:
        return '↕'
    }
  }

  return (
    <div
      ref={scrollContainerRef}
      className={styles.scrollContainer}
      style={{ height }}
      role="table"
      aria-label={label}
      aria-rowcount={rows.length}
    >
      <div className={styles.table}>
        <div className={styles.header} role="rowgroup">
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              key={headerGroup.id}
              className={styles.headerRow}
              role="row"
              style={{ gridTemplateColumns }}
            >
              {headerGroup.headers.map((header) => {
                const sortDirection = header.column.getIsSorted()
                const canSort = enableSorting && header.column.getCanSort()

                return (
                  <div
                    key={header.id}
                    className={styles.headerCell}
                    role="columnheader"
                    aria-sort={toAriaSort(sortDirection)}
                  >
                    {header.isPlaceholder ? null : canSort ? (
                      <Button
                        variant="ghost"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span className={styles.sortIndicator} aria-hidden="true">
                          {getSortIndicator(sortDirection)}
                        </span>
                      </Button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        <div className={styles.body} role="rowgroup" style={{ height: totalHeight }}>
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index]
            if (row === undefined) {
              return null
            }

            return (
              <div
                key={row.id}
                className={styles.row}
                role="row"
                style={{
                  height: rowHeight,
                  gridTemplateColumns,
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className={styles.cell} role="cell">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
        {rows.length === 0 ? <p className={styles.empty}>{emptyMessage}</p> : null}
      </div>
    </div>
  )
}
