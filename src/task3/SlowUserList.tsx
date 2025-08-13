"use client"

import type React from "react"
import { useState, useMemo, useCallback, memo } from "react"

// Types
interface User {
  id: string
  name: string
  email: string
  department: string
  lastLogin: string
}

interface Department {
  id: string
  name: string
}

interface SlowUserListProps {
  users: User[]
  departments: Department[]
  onUserSelect: (user: User) => void
}

// ORIGINAL SLOW COMPONENT (for reference)
const OriginalSlowUserList: React.FC<SlowUserListProps> = ({ users, departments, onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || user.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const sortedUsers = filteredUsers.sort((a, b) => {
    return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
  })

  return (
    <div>
      <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..." />

      <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
        <option value="all">All Departments</option>
        {departments.map((dept) => (
          <option key={dept.id} value={dept.id}>
            {dept.name}
          </option>
        ))}
      </select>

      <div>
        {sortedUsers.map((user) => (
          <OriginalUserCard
            key={user.id}
            user={user}
            onClick={() => onUserSelect(user)}
            department={departments.find((d) => d.id === user.department)}
          />
        ))}
      </div>
    </div>
  )
}

const OriginalUserCard: React.FC<{
  user: User
  onClick: () => void
  department?: Department
}> = ({ user, onClick, department }) => {
  const isActive = new Date().getTime() - new Date(user.lastLogin).getTime() < 30 * 24 * 60 * 60 * 1000

  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "5px",
        backgroundColor: isActive ? "#e8f5e8" : "#f5f5f5",
      }}
    >
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p>Department: {department?.name}</p>
      <p>Last Login: {new Date(user.lastLogin).toLocaleDateString()}</p>
      <span>{isActive ? "Active" : "Inactive"}</span>
    </div>
  )
}

// OPTIMIZED COMPONENTS

// Memoized UserCard component to prevent unnecessary re-renders
const OptimizedUserCard = memo<{
  user: User
  onClick: () => void
  department?: Department
}>(({ user, onClick, department }) => {
  // Memoize expensive calculations
  const { isActive, formattedDate } = useMemo(() => {
    const lastLoginDate = new Date(user.lastLogin)
    const isActive = Date.now() - lastLoginDate.getTime() < 30 * 24 * 60 * 60 * 1000
    const formattedDate = lastLoginDate.toLocaleDateString()

    return { isActive, formattedDate }
  }, [user.lastLogin])

  // Memoize click handler to prevent recreation
  const handleClick = useCallback(() => {
    onClick()
  }, [onClick])

  return (
    <div
      onClick={handleClick}
      className="user-card"
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "5px",
        backgroundColor: isActive ? "#e8f5e8" : "#f5f5f5",
        cursor: "pointer",
        borderRadius: "4px",
        transition: "background-color 0.2s ease",
      }}
    >
      <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>{user.name}</h3>
      <p style={{ margin: "4px 0", color: "#666" }}>{user.email}</p>
      <p style={{ margin: "4px 0", color: "#666" }}>Department: {department?.name || "Unknown"}</p>
      <p style={{ margin: "4px 0", color: "#666" }}>Last Login: {formattedDate}</p>
      <span
        style={{
          padding: "2px 8px",
          borderRadius: "12px",
          fontSize: "12px",
          backgroundColor: isActive ? "#4CAF50" : "#f44336",
          color: "white",
        }}
      >
        {isActive ? "Active" : "Inactive"}
      </span>
    </div>
  )
})

OptimizedUserCard.displayName = "OptimizedUserCard"

// Main optimized component
const OptimizedUserList: React.FC<SlowUserListProps> = ({ users, departments, onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  // Create department lookup map for O(1) access instead of O(n) find operations
  const departmentMap = useMemo(() => {
    return departments.reduce(
      (map, dept) => {
        map[dept.id] = dept
        return map
      },
      {} as Record<string, Department>,
    )
  }, [departments])

  // Memoize filtered and sorted users to prevent recalculation on every render
  const processedUsers = useMemo(() => {
    // Filter users
    const filtered = users.filter((user) => {
      const matchesSearch =
        searchTerm === "" ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = selectedDepartment === "all" || user.department === selectedDepartment

      return matchesSearch && matchesDepartment
    })

    // Sort users by last login (most recent first)
    return filtered.sort((a, b) => {
      return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
    })
  }, [users, searchTerm, selectedDepartment])

  // Memoize search handler to prevent recreation
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  // Memoize department change handler
  const handleDepartmentChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value)
  }, [])

  // Memoize user selection handler
  const handleUserSelect = useCallback(
    (user: User) => {
      onUserSelect(user)
    },
    [onUserSelect],
  )

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ marginBottom: "16px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search users..."
          style={{
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
            minWidth: "200px",
          }}
        />

        <select
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          style={{
            padding: "8px 12px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "14px",
            minWidth: "150px",
          }}
        >
          <option value="all">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "grid", gap: "8px" }}>
        {processedUsers.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#666",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            No users found matching your criteria
          </div>
        ) : (
          processedUsers.map((user) => (
            <OptimizedUserCard
              key={user.id}
              user={user}
              onClick={() => handleUserSelect(user)}
              department={departmentMap[user.department]}
            />
          ))
        )}
      </div>

      <div
        style={{
          marginTop: "16px",
          padding: "12px",
          backgroundColor: "#f0f8ff",
          borderRadius: "4px",
          fontSize: "14px",
          color: "#666",
        }}
      >
        Showing {processedUsers.length} of {users.length} users
      </div>
    </div>
  )
}

export { OriginalSlowUserList, OptimizedUserList }
