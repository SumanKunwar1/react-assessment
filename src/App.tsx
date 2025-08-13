"use client"

import type React from "react"
import { useState } from "react"
import Task1Demo from "./task1/Task1Demo"
import Task2Demo from "./task2/Task2Demo"
import Task3Demo from "./task3/Task3Demo"
import Task4Demo from "./task4/Task4Demo"

const App: React.FC = () => {
  const [activeTask, setActiveTask] = useState<number>(1)

  const tasks = [
    { id: 1, title: "Task 1: Reusable Component Library", component: <Task1Demo /> },
    { id: 2, title: "Task 2: Complex State Management", component: <Task2Demo /> },
    { id: 3, title: "Task 3: Performance Optimization", component: <Task3Demo /> },
    { id: 4, title: "Task 4: White-Label Configuration", component: <Task4Demo /> },
  ]

  return (
    <div className="container">
      <header style={{ textAlign: "center", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "32px", color: "#2c3e50", marginBottom: "8px" }}>React Developer Assessment</h1>
        <p style={{ color: "#7f8c8d", fontSize: "16px" }}>Data Saturn - Technical Evaluation</p>
      </header>

      <nav style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
          {tasks.map((task) => (
            <button
              key={task.id}
              className={`btn ${activeTask === task.id ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setActiveTask(task.id)}
            >
              {task.title}
            </button>
          ))}
        </div>
      </nav>

      <main>{tasks.find((task) => task.id === activeTask)?.component}</main>
    </div>
  )
}

export default App
