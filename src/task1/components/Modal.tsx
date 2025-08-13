"use client"

import type React from "react"
import { useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import type { ModalProps } from "../types"
import "./Modal.css"

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = "medium",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)

  // Handle escape key
  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        onClose()
      }
    },
    [onClose, closeOnEscape],
  )

  // Handle overlay click
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget && closeOnOverlayClick) {
        onClose()
      }
    },
    [onClose, closeOnOverlayClick],
  )

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement

      // Focus the modal
      modalRef.current?.focus()

      // Lock body scroll
      document.body.style.overflow = "hidden"

      // Add escape listener
      document.addEventListener("keydown", handleEscape)

      // Focus trap
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        const handleTabKey = (event: KeyboardEvent) => {
          if (event.key === "Tab") {
            if (event.shiftKey) {
              if (document.activeElement === firstElement) {
                event.preventDefault()
                lastElement.focus()
              }
            } else {
              if (document.activeElement === lastElement) {
                event.preventDefault()
                firstElement.focus()
              }
            }
          }
        }

        document.addEventListener("keydown", handleTabKey)

        return () => {
          document.removeEventListener("keydown", handleTabKey)
        }
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = ""

      // Remove escape listener
      document.removeEventListener("keydown", handleEscape)

      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus()
      }
    }
  }, [isOpen, handleEscape])

  if (!isOpen) return null

  const modalContent = (
    <div
      className={`modal-overlay ${isOpen ? "modal-open" : ""}`}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div ref={modalRef} className={`modal-content modal-${size} ${className}`} tabIndex={-1}>
        {title && (
          <div className="modal-header">
            <h2 id="modal-title" className="modal-title">
              {title}
            </h2>
            <button className="modal-close" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export default Modal
