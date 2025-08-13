"use client"

import type React from "react"
import { useState } from "react"
import DataTable from "./components/DataTable"
import Modal from "./components/Modal"
import TextInput from "./components/TextInput"
import SelectInput from "./components/SelectInput"
import FileUpload from "./components/FileUpload"
import DatePicker from "./components/DatePicker"
import type { Column } from "./types"

interface User {
  id: number
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  joinDate: string
}

const Task1Demo: React.FC = () => {
  // Sample data
  const [users] = useState<User[]>([
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
  ])

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSize, setModalSize] = useState<"small" | "medium" | "large">("medium")

  // Form states
  const [textValue, setTextValue] = useState("")
  const [selectValue, setSelectValue] = useState("")
  const [dateValue, setDateValue] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)

  // DataTable configuration
  const columns: Column<User>[] = [
    { key: "name", label: "Full Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: false },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => <span className={`status-badge ${row.status}`}>{row.status}</span>,
    },
    { key: "joinDate", label: "Join Date", sortable: true },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-primary" style={{ fontSize: "12px", padding: "4px 8px" }}>
            Edit
          </button>
          <button className="btn btn-danger" style={{ fontSize: "12px", padding: "4px 8px" }}>
            Delete
          </button>
        </div>
      ),
    },
  ]

  const selectOptions = [
    { value: "admin", label: "Administrator" },
    { value: "user", label: "Regular User" },
    { value: "moderator", label: "Moderator" },
    { value: "guest", label: "Guest User" },
  ]

  const handleSort = (key: string, direction: "asc" | "desc") => {
    console.log(`Sorting by ${key} in ${direction} order`)
  }

  const handlePageChange = (page: number) => {
    console.log(`Changing to page ${page}`)
  }

  return (
    <div className="task-section">
      <h2 className="task-title">Task 1: Reusable Component Library</h2>

      {/* DataTable Demo */}
      <div className="demo-section">
        <h3 className="demo-title">1.1 DataTable Component</h3>
        <DataTable
          data={users}
          columns={columns}
          onSort={handleSort}
          pagination={{ page: 1, pageSize: 10, total: users.length }}
          onPageChange={handlePageChange}
          loading={false}
          emptyMessage="No users found"
        />
      </div>

      {/* Modal Demo */}
      <div className="demo-section">
        <h3 className="demo-title">1.2 Modal Component</h3>
        <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              setModalSize("small")
              setIsModalOpen(true)
            }}
          >
            Small Modal
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setModalSize("medium")
              setIsModalOpen(true)
            }}
          >
            Medium Modal
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setModalSize("large")
              setIsModalOpen(true)
            }}
          >
            Large Modal
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Demo Modal"
          size={modalSize}
          closeOnOverlayClick={true}
          closeOnEscape={true}
        >
          <div>
            <p>This is a {modalSize} modal with the following features:</p>
            <ul style={{ marginLeft: "20px", marginTop: "12px" }}>
              <li>Portal rendering (outside parent DOM)</li>
              <li>Accessibility (ARIA labels, focus management)</li>
              <li>Keyboard navigation (Escape to close, Tab trapping)</li>
              <li>Multiple sizes</li>
              <li>Animation/transition effects</li>
              <li>Body scroll lock when open</li>
            </ul>
            <div style={{ marginTop: "20px", display: "flex", gap: "8px" }}>
              <button className="btn btn-primary" onClick={() => setIsModalOpen(false)}>
                Close Modal
              </button>
              <button className="btn btn-secondary">Another Action</button>
            </div>
          </div>
        </Modal>
      </div>

      {/* Form Inputs Demo */}
      <div className="demo-section">
        <h3 className="demo-title">1.3 Form Input Components</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          <div>
            <h4 style={{ marginBottom: "16px", color: "#34495e" }}>Text Input</h4>
            <TextInput
              label="Full Name"
              value={textValue}
              onChange={setTextValue}
              placeholder="Enter your full name"
              required={true}
              helperText="This field is required"
            />
            <TextInput
              label="Email Address"
              value=""
              onChange={() => {}}
              placeholder="Enter your email"
              type="email"
              error="Please enter a valid email address"
            />
          </div>

          <div>
            <h4 style={{ marginBottom: "16px", color: "#34495e" }}>Select Input</h4>
            <SelectInput
              label="User Role"
              value={selectValue}
              onChange={setSelectValue}
              options={selectOptions}
              placeholder="Select a role"
              searchable={true}
              required={true}
            />
            <SelectInput
              label="Department"
              value=""
              onChange={() => {}}
              options={[
                { value: "it", label: "Information Technology" },
                { value: "hr", label: "Human Resources" },
                { value: "finance", label: "Finance" },
                { value: "marketing", label: "Marketing" },
              ]}
              disabled={true}
              helperText="This field is currently disabled"
            />
          </div>

          <div>
            <h4 style={{ marginBottom: "16px", color: "#34495e" }}>Date Picker</h4>
            <DatePicker
              label="Join Date"
              value={dateValue}
              onChange={setDateValue}
              required={true}
              helperText="Select your join date"
            />
          </div>

          <div>
            <h4 style={{ marginBottom: "16px", color: "#34495e" }}>File Upload</h4>
            <FileUpload
              label="Profile Picture"
              onChange={setFiles}
              accept="image/*"
              maxSize={2 * 1024 * 1024} // 2MB
              helperText="Upload your profile picture (max 2MB)"
            />
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

export default Task1Demo
