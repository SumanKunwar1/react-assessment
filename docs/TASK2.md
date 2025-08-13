# Task 2: Complex State Management (Shopping Cart)

## Goal
Implement a comprehensive shopping cart system with advanced features:
- Add/remove items with quantity management
- Apply discount codes and calculate totals
- Persistent storage using localStorage
- Optimistic updates with undo functionality
- Real-time price calculations and tax handling

## State Management Choice
**Selected: useReducer with Context API**

### Why useReducer?
- **Predictable state updates** through pure reducer functions
- **Complex state logic** centralized in one place
- **Better debugging** with clear action types
- **Scalability** for future cart features
- **Time-travel debugging** capabilities

### Alternative Considered: Zustand
While Zustand offers simpler syntax, useReducer was chosen for:
- Better integration with React DevTools
- More explicit state transitions
- Educational value in demonstrating React patterns

## State Structure

\`\`\`typescript
interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountAmount: number;
  subtotal: number;
  tax: number;
  total: number;
  isLoading: boolean;
  lastAction: CartAction | null; // For undo functionality
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category: string;
}
\`\`\`

## Main Functions

### addToCart
\`\`\`typescript
case 'ADD_ITEM':
  const existingItem = state.items.find(item => item.id === action.payload.id);
  if (existingItem) {
    // Update quantity of existing item
    return updateQuantities(state, action.payload.id, existingItem.quantity + 1);
  }
  // Add new item
  return calculateTotals({
    ...state,
    items: [...state.items, { ...action.payload, quantity: 1 }]
  });
\`\`\`

### updateQuantity
\`\`\`typescript
case 'UPDATE_QUANTITY':
  return calculateTotals({
    ...state,
    items: state.items.map(item =>
      item.id === action.payload.id
        ? { ...item, quantity: Math.max(0, action.payload.quantity) }
        : item
    ).filter(item => item.quantity > 0)
  });
\`\`\`

### applyDiscount
\`\`\`typescript
case 'APPLY_DISCOUNT':
  const discount = validateDiscountCode(action.payload);
  return calculateTotals({
    ...state,
    discountCode: discount.code,
    discountAmount: discount.amount
  });
\`\`\`

## Persistence
**localStorage Integration**:
- **Automatic saving** on every state change
- **Hydration** on app initialization
- **Error handling** for storage quota exceeded
- **Serialization** of complex state objects

\`\`\`typescript
const saveToStorage = (state: CartState) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
  }
};
\`\`\`

## Optimistic Updates & Undo

### Optimistic Updates
- **Immediate UI feedback** before server confirmation
- **Rollback mechanism** for failed operations
- **Loading states** for better UX

### Undo Functionality
\`\`\`typescript
case 'UNDO_LAST_ACTION':
  if (state.lastAction) {
    // Reverse the last action
    return applyReverseAction(state, state.lastAction);
  }
  return state;
\`\`\`

**Features**:
- **5-second undo window** with toast notification
- **Action history** tracking for complex undo chains
- **Automatic cleanup** of undo history

## Performance Optimizations
- **Memoized calculations** for totals and tax
- **Debounced localStorage** writes to prevent excessive I/O
- **Optimized re-renders** using React.memo and useCallback
- **Lazy loading** of discount validation logic
