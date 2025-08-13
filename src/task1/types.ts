import type React from "react"
// Task 1: Component Library Types

export interface Column<T = any> {
  key: string
  label: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
}

export interface PaginationInfo {
  page: number
  pageSize: number
  total: number
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  onSort?: (key: string, direction: "asc" | "desc") => void
  pagination?: PaginationInfo
  onPageChange?: (page: number) => void
  loading?: boolean
  emptyMessage?: string
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: "small" | "medium" | "large"
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  children: React.ReactNode
  className?: string
}

export interface BaseInputProps {
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  helperText?: string
  className?: string
}

export interface TextInputProps extends BaseInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: "text" | "email" | "password" | "number"
}

export interface SelectOption {
  value: string
  label: string
}

export interface SelectInputProps extends BaseInputProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  searchable?: boolean
}

export interface FileUploadProps extends BaseInputProps {
  onChange: (files: FileList | null) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
}

export interface DatePickerProps extends BaseInputProps {
  value: string
  onChange: (value: string) => void
  format?: string
}
