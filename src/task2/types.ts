// Task 2: Shopping Cart Types

export interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
  category: string
  inStock: boolean
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface CartTotals {
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
}

export interface CartState {
  items: CartItem[]
  discountCode: string
  discountAmount: number
  totals: CartTotals
  isLoading: boolean
  errors: string[]
  lastAction?: {
    type: "add" | "remove" | "update" | "discount"
    item?: CartItem
    timestamp: number
  }
}

export interface CartAction {
  type:
    | "ADD_ITEM"
    | "REMOVE_ITEM"
    | "UPDATE_QUANTITY"
    | "APPLY_DISCOUNT"
    | "CLEAR_CART"
    | "SET_LOADING"
    | "SET_ERROR"
    | "UNDO_ACTION"
  payload?: any
}
