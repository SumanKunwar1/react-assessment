"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { SelectInputProps } from "../types"
import "./FormInputs.css"

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  helperText,
  placeholder = "Select an option",
  searchable = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const selectRef = useRef<HTMLDivElement>(null)
  const inputId = `select-${Math.random().toString(36).substr(2, 9)}`

  const filteredOptions = searchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setIsOpen(!isOpen)
    } else if (event.key === "Escape") {
      setIsOpen(false)
      setSearchTerm("")
    }
  }

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <div ref={selectRef} className="select-container">
        <div
          id={inputId}
          className={`select-trigger ${error ? "error" : ""} ${isOpen ? "open" : ""}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          aria-invalid={!!error}
        >
          <span className={selectedOption ? "selected" : "placeholder"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="select-arrow">▼</span>
        </div>

        {isOpen && (
          <div className="select-dropdown" role="listbox">
            {searchable && (
              <div className="select-search">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="search-input"
                  autoFocus
                />
              </div>
            )}
            <div className="select-options">
              {filteredOptions.length === 0 ? (
                <div className="select-option disabled">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`select-option ${option.value === value ? "selected" : ""}`}
                    onClick={() => handleSelect(option.value)}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    {option.label}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

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

export default SelectInput
