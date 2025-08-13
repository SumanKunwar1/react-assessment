"use client"

import type React from "react"
import type { TextInputProps } from "../types"
import "./FormInputs.css"

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  helperText,
  placeholder,
  type = "text",
  className = "",
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`

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
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`form-input ${error ? "error" : ""}`}
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

export default TextInput
