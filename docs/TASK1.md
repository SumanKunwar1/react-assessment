# Task 1: Reusable Component Library

## Goal
Build a comprehensive reusable component library featuring:
- **DataTable**: Advanced table with sorting, pagination, and filtering capabilities
- **Modal**: Accessible modal component with backdrop and keyboard navigation
- **Form Inputs**: Type-safe form input components (TextInput, NumberInput, SelectInput)

## Libraries/Tools Used
- **React 18** with TypeScript for type safety and modern React features
- **CSS Modules** for scoped styling and maintainability
- **React Hooks** (useState, useEffect, useCallback, useMemo) for state management
- **Custom CSS** with CSS Grid and Flexbox for responsive layouts
- **Accessibility APIs** for ARIA attributes and keyboard navigation

## Approach
### Reusability Strategy
- **Generic TypeScript interfaces** for flexible data structures
- **Configurable props** for customization without code duplication
- **Modular CSS classes** that can be overridden or extended
- **Composition pattern** allowing components to be combined flexibly

### TypeScript Implementation
\`\`\`typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortable?: boolean;
  filterable?: boolean;
  pagination?: boolean;
  pageSize?: number;
}
\`\`\`

## Accessibility Features
- **ARIA labels** and roles for screen readers
- **Keyboard navigation** support (Tab, Enter, Escape, Arrow keys)
- **Focus management** with proper focus trapping in modals
- **Semantic HTML** structure with proper heading hierarchy
- **High contrast** color schemes meeting WCAG AA standards

## Challenges & Solutions

### Challenge: Complex Table Sorting
**Solution**: Implemented generic sorting algorithm with type-safe comparisons
\`\`\`typescript
const sortData = useCallback((data: T[], column: string, direction: 'asc' | 'desc') => {
  return [...data].sort((a, b) => {
    const aVal = a[column as keyof T];
    const bVal = b[column as keyof T];
    // Type-safe comparison logic
  });
}, []);
\`\`\`

### Challenge: Modal Focus Management
**Solution**: Created custom hook for focus trapping and restoration
\`\`\`typescript
const useFocusTrap = (isOpen: boolean) => {
  // Focus management logic
};
\`\`\`

### Challenge: Pagination Performance
**Solution**: Used useMemo to prevent unnecessary re-calculations
\`\`\`typescript
const paginatedData = useMemo(() => {
  const startIndex = (currentPage - 1) * pageSize;
  return filteredData.slice(startIndex, startIndex + pageSize);
}, [filteredData, currentPage, pageSize]);
\`\`\`

## Example Usage

\`\`\`tsx
import { DataTable, Modal, TextInput } from './task1/components';

// DataTable Usage
const userColumns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', filterable: true }
];

<DataTable
  data={users}
  columns={userColumns}
  sortable
  filterable
  pagination
  pageSize={10}
/>

// Modal Usage
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Edit User"
>
  <TextInput
    label="Full Name"
    value={name}
    onChange={setName}
    required
  />
</Modal>
