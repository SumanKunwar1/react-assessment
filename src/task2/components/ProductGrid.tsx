"use client"

import type React from "react"
import type { Product } from "../types"
import "./ProductGrid.css"

interface ProductGridProps {
  products: Product[]
  onAddToCart: (product: Product) => void
  loading?: boolean
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, loading = false }) => {
  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="product-card skeleton">
            <div className="product-image skeleton-element" />
            <div className="product-info">
              <div className="skeleton-element skeleton-title" />
              <div className="skeleton-element skeleton-price" />
              <div className="skeleton-element skeleton-button" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <div className="product-image">
            <img src={product.image || "/placeholder.svg"} alt={product.name} />
            {!product.inStock && <div className="out-of-stock-overlay">Out of Stock</div>}
          </div>
          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
            <div className="product-footer">
              <span className="product-price">${product.price.toFixed(2)}</span>
              <button
                className="btn btn-primary add-to-cart-btn"
                onClick={() => onAddToCart(product)}
                disabled={!product.inStock}
              >
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProductGrid
