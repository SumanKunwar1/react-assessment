import type React from "react"
// Task 4: White-Label Configuration Types

export interface ThemeConfig {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  borderRadius: string
  spacing: {
    small: string
    medium: string
    large: string
  }
}

export interface FeatureConfig {
  showPagination: boolean
  allowSorting: boolean
  showSearch: boolean
  exportData: boolean
  rowActions: string[]
}

export interface ClientConfig {
  id: string
  name: string
  theme: ThemeConfig
  features: FeatureConfig
}

export interface WhiteLabelDataTableProps<T = any> {
  data: T[]
  columns: Array<{
    key: string
    label: string
    sortable?: boolean
    render?: (row: T) => React.ReactNode
  }>
  clientConfig: ClientConfig
  onSort?: (key: string, direction: "asc" | "desc") => void
  pagination?: {
    page: number
    pageSize: number
    total: number
  }
  onPageChange?: (page: number) => void
  onSearch?: (term: string) => void
  onExport?: () => void
  loading?: boolean
  emptyMessage?: string
}
