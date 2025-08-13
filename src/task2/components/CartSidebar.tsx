"use client"

import type React from "react"
import { useState } from "react"
import type { CartItem } from "../types"
import "./CartSidebar.css"

interface CartSidebarProps {
  isOpen: boolean
  items: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onApplyDiscount: (code: string) => Promise<{ success: boolean; message: string }>
  onCheckout: () => void
  onClose: () => void
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  discountCode: string
}

const CartSidebar: React.FC<CartSidebarProps> = ({
  isOpen,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onApplyDiscount,
  onCheckout,
  onClose,
  subtotal,
  tax,
  shipping,
  discount,
  total,
  discountCode,
}) => {
  const [discountInput, setDiscountInput] = useState("")
  const [discountMessage, setDiscountMessage] = useState("")
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)

  const handleApplyDiscount = async () => {
    if (!discountInput.trim()) return

    setIsApplyingDiscount(true)
    const result = await onApplyDiscount(discountInput.trim())
    setDiscountMessage(result.message)

    if (result.success) {
      setDiscountInput("")
    }

    setIsApplyingDiscount(false)

    // Clear message after 3 seconds
    setTimeout(() => setDiscountMessage(""), 3000)
  }

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      onRemoveItem(itemId)
    } else {
      onUpdateQuantity(itemId, newQuantity)
    }
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="cart-overlay" onClick={onClose} />}

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Shopping Cart ({items.length})</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close cart">
            ✕
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <p>Your cart is empty</p>
              <button className="btn btn-primary" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="cart-items">
                {items.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="item-image">
                      <img src={item.image || "/placeholder.svg"} alt={item.name} />
                    </div>
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="item-actions">
                      <div className="item-total">${(item.price * item.quantity).toFixed(2)}</div>
                      <button
                        className="remove-btn"
                        onClick={() => onRemoveItem(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="discount-section">
                <div className="discount-input-group">
                  <input
                    type="text"
                    value={discountInput}
                    onChange={(e) => setDiscountInput(e.target.value)}
                    placeholder="Enter discount code"
                    className="discount-input"
                    disabled={isApplyingDiscount}
                  />
                  <button
                    className="btn btn-secondary"
                    onClick={handleApplyDiscount}
                    disabled={isApplyingDiscount || !discountInput.trim()}
                  >
                    {isApplyingDiscount ? "Applying..." : "Apply"}
                  </button>
                </div>
                {discountMessage && (
                  <div className={`discount-message ${discountMessage.includes("applied") ? "success" : "error"}`}>
                    {discountMessage}
                  </div>
                )}
                {discountCode && (
                  <div className="active-discount">
                    Active discount: <strong>{discountCode}</strong>
                  </div>
                )}
              </div>

              {/* Cart Summary */}
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="btn btn-primary checkout-btn" onClick={onCheckout}>
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default CartSidebar
