"use client"

import type React from "react"
import type { DatePickerProps } from "../types"
import "./FormInputs.css"

const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  helperText,
  format = "YYYY-MM-DD",
  className = "",
}) => {
  const inputId = `date-${Math.random().toString(36).substr(2, 9)}`

  const formatDate = (dateString: string): string => {
    if (!dateString) return ""

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    switch (format) {
      case "MM/DD/YYYY":
        return date.toLocaleDateString("en-US")
      case "DD/MM/YYYY":
        return date.toLocaleDateString("en-GB")
      case "YYYY-MM-DD":
      default:
        return date.toISOString().split("T")[0]
    }
  }

  const parseDate = (dateString: string): string => {
    if (!dateString) return ""

    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    return date.toISOString().split("T")[0]
  }

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type="date"
        value={parseDate(value)}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required={required}
        className={`form-input date-input ${error ? "error" : ""}`}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <div id={`${inputId}-error`} className="form-error" role="alert">
          {error}
        </div>
      )}
      {helperText && !error && (
        <div id={`${inputId}-helper`} className="form-helper">
          {helperText}
        </div>
      )}
    </div>
  )
}

export default DatePicker
