"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { OriginalSlowUserList, OptimizedUserList } from "./SlowUserList"
import PerformanceMonitor from "./PerformanceMonitor"

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

const Task3Demo: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showOptimized, setShowOptimized] = useState(false)
  const [dataSize, setDataSize] = useState<"small" | "large">("small")

  // Generate sample data
  const { users, departments } = useMemo(() => {
    const departments: Department[] = [
      { id: "eng", name: "Engineering" },
      { id: "design", name: "Design" },
      { id: "marketing", name: "Marketing" },
      { id: "sales", name: "Sales" },
      { id: "hr", name: "Human Resources" },
      { id: "finance", name: "Finance" },
    ]

    const firstNames = ["John", "Jane", "Bob", "Alice", "Charlie", "Diana", "Eve", "Frank", "Grace", "Henry"]
    const lastNames = [
      "Smith",
      "Johnson",
      "Williams",
      "Brown",
      "Jones",
      "Garcia",
      "Miller",
      "Davis",
      "Rodriguez",
      "Martinez",
    ]

    const userCount = dataSize === "small" ? 50 : 1000
    const users: User[] = []

    for (let i = 0; i < userCount; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const department = departments[Math.floor(Math.random() * departments.length)]

      // Generate random last login date (within last 90 days)
      const lastLogin = new Date()
      lastLogin.setDate(lastLogin.getDate() - Math.floor(Math.random() * 90))

      users.push({
        id: `user-${i}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        department: department.id,
        lastLogin: lastLogin.toISOString(),
      })
    }

    return { users, departments }
  }, [dataSize])

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
  }

  return (
    <div className="task-section">
      <h2 className="task-title">Task 3: Performance Optimization</h2>

      {/* Performance Issues Explanation */}
      <div
        style={{
          marginBottom: "24px",
          padding: "16px",
          background: "#fff3cd",
          borderRadius: "8px",
          border: "1px solid #ffeaa7",
        }}
      >
        <h3 style={{ margin: "0 0 12px 0", color: "#856404" }}>🐌 Performance Issues Identified</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
            fontSize: "14px",
          }}
        >
          <div>
            <strong>1. Expensive calculations on every render:</strong>
            <br />• Filtering and sorting runs on every render
            <br />• Date calculations in UserCard component
            <br />• Department lookup using Array.find()
          </div>
          <div>
            <strong>2. Unnecessary re-renders:</strong>
            <br />• UserCard re-renders when parent updates
            <br />• Inline functions created on every render
            <br />• No memoization of expensive operations
          </div>
          <div>
            <strong>3. Inefficient data structures:</strong>
            <br />• O(n) department lookup for each user
            <br />• Repeated date parsing and formatting
            <br />• No caching of computed values
          </div>
          <div>
            <strong>4. Missing optimization opportunities:</strong>
            <br />• No React.memo for child components
            <br />• No useMemo for expensive calculations
            <br />• No useCallback for event handlers
          </div>
        </div>
      </div>

      {/* Optimizations Applied */}
      <div
        style={{
          marginBottom: "24px",
          padding: "16px",
          background: "#d4edda",
          borderRadius: "8px",
          border: "1px solid #c3e6cb",
        }}
      >
        <h3 style={{ margin: "0 0 12px 0", color: "#155724" }}>⚡ Optimizations Applied</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
            fontSize: "14px",
          }}
        >
          <div>
            <strong>1. Memoization:</strong>
            <br />• useMemo for filtered/sorted users
            <br />• useMemo for department lookup map
            <br />• useMemo for expensive date calculations
          </div>
          <div>
            <strong>2. Component optimization:</strong>
            <br />• React.memo for UserCard component
            <br />• useCallback for event handlers
            <br />• Stable key props for list items
          </div>
          <div>
            <strong>3. Data structure improvements:</strong>
            <br />• O(1) department lookup using Map
            <br />• Pre-computed date formatting
            <br />• Efficient filtering conditions
          </div>
          <div>
            <strong>4. Performance monitoring:</strong>
            <br />• Real-time render time tracking
            <br />• Component update counting
            <br />• Memory usage monitoring
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "24px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div>
          <label style={{ marginRight: "8px", fontWeight: "500" }}>Version:</label>
          <button
            className={`btn ${!showOptimized ? "btn-danger" : "btn-secondary"}`}
            onClick={() => setShowOptimized(false)}
            style={{ marginRight: "8px" }}
          >
            🐌 Original (Slow)
          </button>
          <button
            className={`btn ${showOptimized ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setShowOptimized(true)}
          >
            ⚡ Optimized
          </button>
        </div>

        <div>
          <label style={{ marginRight: "8px", fontWeight: "500" }}>Data Size:</label>
          <button
            className={`btn ${dataSize === "small" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setDataSize("small")}
            style={{ marginRight: "8px" }}
          >
            Small (50 users)
          </button>
          <button
            className={`btn ${dataSize === "large" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setDataSize("large")}
          >
            Large (1000 users)
          </button>
        </div>
      </div>

      {/* Performance Comparison */}
      <PerformanceMonitor componentName={showOptimized ? "Optimized UserList" : "Original UserList"}>
        {showOptimized ? (
          <OptimizedUserList users={users} departments={departments} onUserSelect={handleUserSelect} />
        ) : (
          <OriginalSlowUserList users={users} departments={departments} onUserSelect={handleUserSelect} />
        )}
      </PerformanceMonitor>

      {/* Selected User Display */}
      {selectedUser && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "white",
            padding: "16px",
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e0e0e0",
            maxWidth: "300px",
            zIndex: 1000,
          }}
        >
          <h4 style={{ margin: "0 0 8px 0" }}>Selected User</h4>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Name:</strong> {selectedUser.name}
          </p>
          <p style={{ margin: "4px 0", fontSize: "14px" }}>
            <strong>Email:</strong> {selectedUser.email}
          </p>
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedUser(null)}
            style={{ marginTop: "8px", fontSize: "12px", padding: "4px 8px" }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}

export default Task3Demo
