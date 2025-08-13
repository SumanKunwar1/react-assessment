"use client"

import type React from "react"
import { useState, useRef } from "react"
import type { FileUploadProps } from "../types"
import "./FormInputs.css"

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onChange,
  error,
  required = false,
  disabled = false,
  helperText,
  accept,
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB default
  className = "",
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputId = `file-${Math.random().toString(36).substr(2, 9)}`

  const validateFiles = (fileList: FileList): { valid: File[]; errors: string[] } => {
    const validFiles: File[] = []
    const errors: string[] = []

    Array.from(fileList).forEach((file) => {
      if (maxSize && file.size > maxSize) {
        errors.push(`${file.name} is too large (max ${formatFileSize(maxSize)})`)
      } else if (
        accept &&
        !accept
          .split(",")
          .some((type) => file.type.match(type.trim()) || file.name.match(new RegExp(type.trim().replace("*", ".*"))))
      ) {
        errors.push(`${file.name} is not an accepted file type`)
      } else {
        validFiles.push(file)
      }
    })

    return { valid: validFiles, errors }
  }

  const handleFileChange = (fileList: FileList | null) => {
    if (!fileList) return

    const { valid, errors } = validateFiles(fileList)

    if (errors.length > 0) {
      // Handle validation errors
      console.error("File validation errors:", errors)
      return
    }

    setFiles(valid)
    onChange(fileList)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    if (!disabled) {
      handleFileChange(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)

    // Create new FileList-like object
    const dt = new DataTransfer()
    newFiles.forEach((file) => dt.items.add(file))
    onChange(dt.files)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      <div
        className={`file-upload-area ${isDragOver ? "drag-over" : ""} ${error ? "error" : ""} ${disabled ? "disabled" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
      >
        <input
          ref={fileInputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={disabled}
          required={required}
          style={{ display: "none" }}
        />

        <div className="file-upload-content">
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            <p>Drag and drop files here, or click to select</p>
            {accept && <p className="upload-hint">Accepted: {accept}</p>}
            {maxSize && <p className="upload-hint">Max size: {formatFileSize(maxSize)}</p>}
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <div className="file-info">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatFileSize(file.size)}</span>
              </div>
              <button
                type="button"
                className="file-remove"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                aria-label={`Remove ${file.name}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

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

export default FileUpload
