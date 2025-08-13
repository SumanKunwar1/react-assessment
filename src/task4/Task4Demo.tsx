"use client"

import type React from "react"
import { useState } from "react"
import WhiteLabelDataTable from "./components/WhiteLabelDataTable"
import type { ClientConfig } from "./types"

interface User {
  id: number
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  joinDate: string
}

const Task4Demo: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<string>("client-a")
  const [searchTerm, setSearchTerm] = useState("")

  // Sample data
  const users: User[] = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active", joinDate: "2023-01-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "active", joinDate: "2023-02-20" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "inactive", joinDate: "2023-03-10" },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "Moderator",
      status: "active",
      joinDate: "2023-04-05",
    },
    {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "User",
      status: "active",
      joinDate: "2023-05-12",
    },
  ]

  // Client configurations
  const clientConfigs: Record<string, ClientConfig> = {
    "client-a": {
      id: "client-a",
      name: "TechCorp Solutions",
      theme: {
        primaryColor: "#007bff",
        secondaryColor: "#6c757d",
        fontFamily: "Arial, sans-serif",
        borderRadius: "4px",
        spacing: {
          small: "8px",
          medium: "16px",
          large: "24px",
        },
      },
      features: {
        showPagination: true,
        allowSorting: true,
        showSearch: true,
        exportData: false,
        rowActions: ["edit", "delete"],
      },
    },
    "client-b": {
      id: "client-b",
      name: "GreenLeaf Enterprises",
      theme: {
        primaryColor: "#28a745",
        secondaryColor: "#dc3545",
        fontFamily: "Georgia, serif",
        borderRadius: "8px",
        spacing: {
          small: "12px",
          medium: "20px",
          large: "32px",
        },
      },
      features: {
        showPagination: false,
        allowSorting: false,
        showSearch: true,
        exportData: true,
        rowActions: ["view", "edit"],
      },
    },
    "client-c": {
      id: "client-c",
      name: "Purple Innovation Labs",
      theme: {
        primaryColor: "#6f42c1",
        secondaryColor: "#fd7e14",
        fontFamily: "Roboto, sans-serif",
        borderRadius: "12px",
        spacing: {
          small: "6px",
          medium: "14px",
          large: "28px",
        },
      },
      features: {
        showPagination: true,
        allowSorting: true,
        showSearch: false,
        exportData: true,
        rowActions: ["view", "edit", "delete"],
      },
    },
  }

  const currentConfig = clientConfigs[selectedClient]

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const columns = [
    { key: "name", label: "Full Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: false },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row: User) => <span className={`status-badge ${row.status}`}>{row.status}</span>,
    },
    { key: "joinDate", label: "Join Date", sortable: true },
  ]

  const handleSort = (key: string, direction: "asc" | "desc") => {
    console.log(`Sorting by ${key} in ${direction} order`)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  const handleExport = () => {
    console.log("Exporting data for", currentConfig.name)
    alert(`Exporting data for ${currentConfig.name}...`)
  }

  return (
    <div className="task-section">
      <h2 className="task-title">Task 4: White-Label Configuration</h2>

      {/* Client Selector */}
      <div
        style={{
          marginBottom: "24px",
          padding: "16px",
          background: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h3 style={{ margin: "0 0 16px 0", color: "#2c3e50" }}>Client Configuration</h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
          {Object.values(clientConfigs).map((config) => (
            <button
              key={config.id}
              className={`btn ${selectedClient === config.id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setSelectedClient(config.id)}
              style={{
                backgroundColor: selectedClient === config.id ? config.theme.primaryColor : undefined,
                fontFamily: config.theme.fontFamily,
                borderRadius: config.theme.borderRadius,
              }}
            >
              {config.name}
            </button>
          ))}
        </div>

        {/* Current Configuration Display */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "16px",
            fontSize: "14px",
          }}
        >
          <div>
            <h4 style={{ margin: "0 0 8px 0", color: "#34495e" }}>Theme Configuration</h4>
            <ul style={{ margin: 0, paddingLeft: "16px", color: "#7f8c8d" }}>
              <li>
                Primary Color:{" "}
                <span style={{ color: currentConfig.theme.primaryColor, fontWeight: "600" }}>
                  {currentConfig.theme.primaryColor}
                </span>
              </li>
              <li>
                Secondary Color:{" "}
                <span style={{ color: currentConfig.theme.secondaryColor, fontWeight: "600" }}>
                  {currentConfig.theme.secondaryColor}
                </span>
              </li>
              <li>Font Family: {currentConfig.theme.fontFamily}</li>
              <li>Border Radius: {currentConfig.theme.borderRadius}</li>
            </ul>
          </div>
          <div>
            <h4 style={{ margin: "0 0 8px 0", color: "#34495e" }}>Feature Configuration</h4>
            <ul style={{ margin: 0, paddingLeft: "16px", color: "#7f8c8d" }}>
              <li>Pagination: {currentConfig.features.showPagination ? "✅" : "❌"}</li>
              <li>Sorting: {currentConfig.features.allowSorting ? "✅" : "❌"}</li>
              <li>Search: {currentConfig.features.showSearch ? "✅" : "❌"}</li>
              <li>Export: {currentConfig.features.exportData ? "✅" : "❌"}</li>
              <li>Actions: {currentConfig.features.rowActions.join(", ")}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* White-Label DataTable */}
      <WhiteLabelDataTable
        data={filteredUsers}
        columns={columns}
        clientConfig={currentConfig}
        onSort={handleSort}
        pagination={{ page: 1, pageSize: 10, total: filteredUsers.length }}
        onPageChange={(page) => console.log(`Page changed to ${page}`)}
        onSearch={handleSearch}
        onExport={handleExport}
        loading={false}
        emptyMessage={`No users found for ${currentConfig.name}`}
      />

      {/* Implementation Notes */}
      <div
        style={{
          marginTop: "24px",
          padding: "16px",
          background: "#e8f4fd",
          borderRadius: "8px",
          border: "1px solid #3498db",
        }}
      >
        <h3 style={{ margin: "0 0 12px 0", color: "#2c3e50" }}>🏗️ White-Label Implementation</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "16px",
            fontSize: "14px",
          }}
        >
          <div>
            <strong>🎨 Dynamic Theming:</strong>
            <br />• CSS custom properties for colors and spacing
            <br />• Font family injection
            <br />• Border radius customization
            <br />• Responsive design maintained
          </div>
          <div>
            <strong>⚙️ Feature Toggles:</strong>
            <br />• Conditional rendering based on config
            <br />• Dynamic column generation
            <br />• Action button customization
            <br />• Search and export controls
          </div>
          <div>
            <strong>🔧 Maintainability:</strong>
            <br />• Single component, multiple configurations
            <br />• Type-safe configuration objects
            <br />• Easy to add new clients
            <br />• Consistent API regardless of config
          </div>
          <div>
            <strong>🚀 Scalability:</strong>
            <br />• Configuration-driven rendering
            <br />• No code changes for new clients
            <br />• Extensible theme and feature system
            <br />• Production-ready architecture
          </div>
        </div>
      </div>

      <style>{`
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .status-badge.active {
          background-color: #d4edda;
          color: #155724;
        }
        
        .status-badge.inactive {
          background-color: #f8d7da;
          color: #721c24;
        }
      `}</style>
    </div>
  )
}

export default Task4Demo
