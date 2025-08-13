"use client"

import type React from "react"
import { useState, useMemo } from "react"
import type { WhiteLabelDataTableProps } from "../types"
import "./WhiteLabelDataTable.css"

const WhiteLabelDataTable = <T extends Record<string, any>>({
  data,
  columns,
  clientConfig,
  onSort,
  pagination,
  onPageChange,
  onSearch,
  onExport,
  loading = false,
  emptyMessage = "No data available",
}: WhiteLabelDataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: "asc" | "desc"
  } | null>(null)

  const { theme, features } = clientConfig

  // Generate CSS custom properties for theming
  const themeStyles = useMemo(
    () =>
      ({
        "--primary-color": theme.primaryColor,
        "--secondary-color": theme.secondaryColor,
        "--font-family": theme.fontFamily,
        "--border-radius": theme.borderRadius,
        "--spacing-small": theme.spacing.small,
        "--spacing-medium": theme.spacing.medium,
        "--spacing-large": theme.spacing.large,
      }) as React.CSSProperties,
    [theme],
  )

  // Filter columns based on feature configuration
  const visibleColumns = useMemo(() => {
    const cols = [...columns]

    // Add actions column if configured
    if (features.rowActions.length > 0) {
      cols.push({
        key: "actions",
        label: "Actions",
        sortable: false,
        render: (row: T) => (
          <div className="action-buttons">
            {features.rowActions.map((action) => (
              <button
                key={action}
                className={`action-btn action-${action.toLowerCase()}`}
                onClick={(e) => {
                  e.stopPropagation()
                  console.log(`${action} action for:`, row)
                }}
              >
                {action}
              </button>
            ))}
          </div>
        ),
      })
    }

    return cols
  }, [columns, features.rowActions])

  const handleSort = (key: string) => {
    if (!features.allowSorting) return

    const column = visibleColumns.find((col) => col.key === key)
    if (!column?.sortable) return

    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }

    setSortConfig({ key, direction })
    onSort?.(key, direction)
  }

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    onSearch?.(value)
  }

  const getSortIcon = (key: string) => {
    if (!features.allowSorting || !sortConfig || sortConfig.key !== key) {
      return <span className="sort-icon">↕️</span>
    }
    return <span className="sort-icon active">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
  }

  const renderPagination = () => {
    if (!features.showPagination || !pagination || !onPageChange) return null

    const { page, pageSize, total } = pagination
    const totalPages = Math.ceil(total / pageSize)
    const startItem = (page - 1) * pageSize + 1
    const endItem = Math.min(page * pageSize, total)

    return (
      <div className="white-label-pagination">
        <div className="pagination-info">
          Showing {startItem}-{endItem} of {total} items
        </div>
        <div className="pagination-controls">
          <button className="pagination-btn" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
            Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button className="pagination-btn" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
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
          {visibleColumns.map((column) => (
            <div key={column.key} className="skeleton-cell" />
          ))}
        </div>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="white-label-data-table" style={themeStyles}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                {visibleColumns.map((column) => (
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
      <div className="white-label-data-table" style={themeStyles}>
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="white-label-data-table" style={themeStyles}>
      {/* Header Controls */}
      {(features.showSearch || features.exportData) && (
        <div className="table-header">
          {features.showSearch && (
            <div className="search-container">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search..."
                className="search-input"
              />
            </div>
          )}
          {features.exportData && (
            <button className="export-btn" onClick={onExport}>
              📊 Export Data
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.key}
                  className={features.allowSorting && column.sortable ? "sortable" : ""}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="th-content">
                    {column.label}
                    {features.allowSorting && column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {visibleColumns.map((column) => (
                  <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  )
}

export default WhiteLabelDataTable
