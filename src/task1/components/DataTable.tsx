"use client"

import { useState } from "react"
import type { DataTableProps } from "../types"
import "./DataTable.css"

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  onSort,
  pagination,
  onPageChange,
  loading = false,
  emptyMessage = "No data available",
  className = "",
}: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(null)

  const handleSort = (key: string) => {
    const column = columns.find((col) => col.key === key)
    if (!column?.sortable) return

    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }

    setSortConfig({ key, direction })
    onSort?.(key, direction)
  }

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <span className="sort-icon">↕️</span>
    }
    return <span className="sort-icon active">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
  }

  const renderPagination = () => {
    if (!pagination || !onPageChange) return null

    const { page, pageSize, total } = pagination
    const totalPages = Math.ceil(total / pageSize)
    const startItem = (page - 1) * pageSize + 1
    const endItem = Math.min(page * pageSize, total)

    return (
      <div className="pagination">
        <div className="pagination-info">
          Showing {startItem}-{endItem} of {total} items
        </div>
        <div className="pagination-controls">
          <button className="btn btn-secondary" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button className="btn btn-secondary" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
            Next
          </button>
        </div>
      </div>
    )
  }

  const renderLoadingSkeleton = () => (
    <div className="loading-skeleton">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="skeleton-row">
          {columns.map((column) => (
            <div key={column.key} className="skeleton-cell" />
          ))}
        </div>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className={`data-table ${className}`}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>{column.label}</th>
                ))}
              </tr>
            </thead>
          </table>
          {renderLoadingSkeleton()}
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={`data-table ${className}`}>
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`data-table ${className}`}>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.sortable ? "sortable" : ""}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="th-content">
                    {column.label}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  )
}

export default DataTable
