"use client"

import type React from "react"
import { useState } from "react"
import { useCart } from "./hooks/useCart"
import ProductGrid from "./components/ProductGrid"
import CartSidebar from "./components/CartSidebar"
import type { Product } from "./types"

const Task2Demo: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cart = useCart()

  // Sample products
  const products: Product[] = [
    {
      id: "1",
      name: "Wireless Headphones",
      price: 99.99,
      image: "/placeholder.svg?height=200&width=200",
      description: "High-quality wireless headphones with noise cancellation",
      category: "Electronics",
      inStock: true,
    },
    {
      id: "2",
      name: "Smart Watch",
      price: 199.99,
      image: "/placeholder.svg?height=200&width=200",
      description: "Feature-rich smartwatch with health tracking",
      category: "Electronics",
      inStock: true,
    },
    {
      id: "3",
      name: "Coffee Maker",
      price: 79.99,
      image: "/placeholder.svg?height=200&width=200",
      description: "Automatic drip coffee maker with programmable timer",
      category: "Appliances",
      inStock: false,
    },
    {
      id: "4",
      name: "Yoga Mat",
      price: 29.99,
      image: "/placeholder.svg?height=200&width=200",
      description: "Non-slip yoga mat perfect for home workouts",
      category: "Fitness",
      inStock: true,
    },
    {
      id: "5",
      name: "Desk Lamp",
      price: 49.99,
      image: "/placeholder.svg?height=200&width=200",
      description: "Adjustable LED desk lamp with USB charging port",
      category: "Home",
      inStock: true,
    },
    {
      id: "6",
      name: "Bluetooth Speaker",
      price: 59.99,
      image: "/placeholder.svg?height=200&width=200",
      description: "Portable Bluetooth speaker with excellent sound quality",
      category: "Electronics",
      inStock: true,
    },
  ]

  const handleCheckout = () => {
    alert("Proceeding to checkout...")
    setIsCartOpen(false)
  }

  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="task-section">
      <h2 className="task-title">Task 2: Complex State Management - Shopping Cart</h2>

      {/* Cart Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          padding: "16px",
          background: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 8px 0", color: "#2c3e50" }}>Product Catalog</h3>
          <p style={{ margin: 0, color: "#7f8c8d", fontSize: "14px" }}>
            Add items to your cart and test the advanced state management features
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {cart.lastAction && (
            <button className="btn btn-secondary" onClick={cart.undoLastAction} style={{ fontSize: "14px" }}>
              ↶ Undo
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setIsCartOpen(true)} style={{ position: "relative" }}>
            🛒 Cart
            {cartItemCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  background: "#e74c3c",
                  color: "white",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "600",
                }}
              >
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Features Demo */}
      <div
        style={{
          marginBottom: "24px",
          padding: "16px",
          background: "#e8f4fd",
          borderRadius: "8px",
          border: "1px solid #3498db",
        }}
      >
        <h4 style={{ margin: "0 0 12px 0", color: "#2c3e50" }}>🚀 Advanced Features Demo</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            fontSize: "14px",
          }}
        >
          <div>
            <strong>✨ Optimistic Updates:</strong>
            <br />
            UI updates immediately, syncs with server
          </div>
          <div>
            <strong>🔄 Undo Functionality:</strong>
            <br />
            Undo your last cart action
          </div>
          <div>
            <strong>💾 Persistence:</strong>
            <br />
            Cart data saved to localStorage
          </div>
          <div>
            <strong>🏷️ Discount Codes:</strong>
            <br />
            Try: SAVE10, SAVE20, WELCOME, STUDENT
          </div>
          <div>
            <strong>📊 Real-time Calculations:</strong>
            <br />
            Totals update as you type
          </div>
          <div>
            <strong>🚚 Smart Shipping:</strong>
            <br />
            Free shipping over $50
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} onAddToCart={cart.addToCart} loading={cart.isLoading} />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        items={cart.items}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeFromCart}
        onApplyDiscount={cart.applyDiscount}
        onCheckout={handleCheckout}
        onClose={() => setIsCartOpen(false)}
        subtotal={cart.totals.subtotal}
        tax={cart.totals.tax}
        shipping={cart.totals.shipping}
        discount={cart.totals.discount}
        total={cart.totals.total}
        discountCode={cart.discountCode}
      />

      {/* Error Display */}
      {cart.errors.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#f8d7da",
            color: "#721c24",
            padding: "12px 16px",
            borderRadius: "8px",
            border: "1px solid #f5c6cb",
            maxWidth: "300px",
            zIndex: 1001,
          }}
        >
          <strong>Error:</strong> {cart.errors[cart.errors.length - 1]}
        </div>
      )}
    </div>
  )
}

export default Task2Demo
