"use client"

import { useReducer, useEffect, useCallback } from "react"
import type { CartState, CartAction, CartItem, Product } from "../types"

const TAX_RATE = 0.08 // 8% tax
const SHIPPING_THRESHOLD = 50 // Free shipping over $50
const SHIPPING_COST = 5.99

const initialState: CartState = {
  items: [],
  discountCode: "",
  discountAmount: 0,
  totals: {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
  },
  isLoading: false,
  errors: [],
}

const calculateTotals = (items: CartItem[], discountAmount: number) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = Math.min(discountAmount, subtotal)
  const discountedSubtotal = subtotal - discount
  const tax = discountedSubtotal * TAX_RATE
  const shipping = discountedSubtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = discountedSubtotal + tax + shipping

  return {
    subtotal,
    tax: Math.round(tax * 100) / 100,
    shipping,
    discount,
    total: Math.round(total * 100) / 100,
  }
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState

  switch (action.type) {
    case "ADD_ITEM": {
      const product: Product = action.payload
      const existingItem = state.items.find((item) => item.id === product.id)

      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
        }
        newItems = [...state.items, newItem]
      }

      newState = {
        ...state,
        items: newItems,
        totals: calculateTotals(newItems, state.discountAmount),
        lastAction: {
          type: "add",
          item: existingItem || {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
          },
          timestamp: Date.now(),
        },
      }
      break
    }

    case "REMOVE_ITEM": {
      const itemId: string = action.payload
      const removedItem = state.items.find((item) => item.id === itemId)
      const newItems = state.items.filter((item) => item.id !== itemId)

      newState = {
        ...state,
        items: newItems,
        totals: calculateTotals(newItems, state.discountAmount),
        lastAction: removedItem
          ? {
              type: "remove",
              item: removedItem,
              timestamp: Date.now(),
            }
          : state.lastAction,
      }
      break
    }

    case "UPDATE_QUANTITY": {
      const { itemId, quantity }: { itemId: string; quantity: number } = action.payload
      const oldItem = state.items.find((item) => item.id === itemId)

      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: itemId })
      }

      const newItems = state.items.map((item) => (item.id === itemId ? { ...item, quantity } : item))

      newState = {
        ...state,
        items: newItems,
        totals: calculateTotals(newItems, state.discountAmount),
        lastAction: oldItem
          ? {
              type: "update",
              item: oldItem,
              timestamp: Date.now(),
            }
          : state.lastAction,
      }
      break
    }

    case "APPLY_DISCOUNT": {
      const { code, amount }: { code: string; amount: number } = action.payload

      newState = {
        ...state,
        discountCode: code,
        discountAmount: amount,
        totals: calculateTotals(state.items, amount),
        lastAction: {
          type: "discount",
          timestamp: Date.now(),
        },
      }
      break
    }

    case "CLEAR_CART":
      newState = {
        ...initialState,
        lastAction: {
          type: "remove",
          timestamp: Date.now(),
        },
      }
      break

    case "SET_LOADING":
      newState = {
        ...state,
        isLoading: action.payload,
      }
      break

    case "SET_ERROR":
      newState = {
        ...state,
        errors: [...state.errors, action.payload],
      }
      break

    case "UNDO_ACTION": {
      if (!state.lastAction) return state

      const { type, item } = state.lastAction

      switch (type) {
        case "add":
          if (item) {
            const existingItem = state.items.find((i) => i.id === item.id)
            if (existingItem && existingItem.quantity > 1) {
              return cartReducer(state, {
                type: "UPDATE_QUANTITY",
                payload: { itemId: item.id, quantity: existingItem.quantity - 1 },
              })
            } else {
              return cartReducer(state, { type: "REMOVE_ITEM", payload: item.id })
            }
          }
          break
        case "remove":
          if (item) {
            return cartReducer(state, { type: "ADD_ITEM", payload: item })
          }
          break
        case "update":
          if (item) {
            return cartReducer(state, {
              type: "UPDATE_QUANTITY",
              payload: { itemId: item.id, quantity: item.quantity },
            })
          }
          break
      }
      return state
    }

    default:
      return state
  }

  return newState
}

export const useCart = () => {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("shopping-cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        parsedCart.items.forEach((item: CartItem) => {
          dispatch({ type: "ADD_ITEM", payload: item })
        })
        if (parsedCart.discountCode && parsedCart.discountAmount) {
          dispatch({
            type: "APPLY_DISCOUNT",
            payload: { code: parsedCart.discountCode, amount: parsedCart.discountAmount },
          })
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "shopping-cart",
      JSON.stringify({
        items: state.items,
        discountCode: state.discountCode,
        discountAmount: state.discountAmount,
      }),
    )
  }, [state.items, state.discountCode, state.discountAmount])

  const addToCart = useCallback(async (product: Product) => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 300))
      dispatch({ type: "ADD_ITEM", payload: product })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to add item to cart" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const removeFromCart = useCallback(async (itemId: string) => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200))
      dispatch({ type: "REMOVE_ITEM", payload: itemId })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to remove item from cart" })
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    // Optimistic update
    dispatch({ type: "UPDATE_QUANTITY", payload: { itemId, quantity } })

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 200))
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update quantity" })
      // Could revert the optimistic update here
    }
  }, [])

  const applyDiscount = useCallback(async (code: string) => {
    dispatch({ type: "SET_LOADING", payload: true })

    try {
      // Simulate API call to validate discount code
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mock discount validation
      const discounts: Record<string, number> = {
        SAVE10: 10,
        SAVE20: 20,
        WELCOME: 15,
        STUDENT: 25,
      }

      const discountAmount = discounts[code.toUpperCase()]
      if (discountAmount) {
        dispatch({ type: "APPLY_DISCOUNT", payload: { code, amount: discountAmount } })
        return { success: true, message: `Discount applied: $${discountAmount} off` }
      } else {
        return { success: false, message: "Invalid discount code" }
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to apply discount" })
      return { success: false, message: "Failed to apply discount" }
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }, [])

  const undoLastAction = useCallback(() => {
    dispatch({ type: "UNDO_ACTION" })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" })
  }, [])

  return {
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyDiscount,
    undoLastAction,
    clearCart,
  }
}
