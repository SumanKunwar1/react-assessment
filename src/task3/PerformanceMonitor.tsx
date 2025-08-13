"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"

interface PerformanceMetrics {
  renderTime: number
  renderCount: number
  memoryUsage?: number
  componentUpdates: number
}

interface PerformanceMonitorProps {
  children: React.ReactNode
  componentName: string
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ children, componentName, onMetricsUpdate }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    renderCount: 0,
    componentUpdates: 0,
  })

  const renderStartTime = useRef<number>(0)
  const renderCountRef = useRef<number>(0)
  const updateCountRef = useRef<number>(0)

  const stableOnMetricsUpdate = useCallback(onMetricsUpdate || (() => {}), [onMetricsUpdate])

  // Instead, capture render start time in a ref that updates before each render
  const captureRenderStart = useCallback(() => {
    renderStartTime.current = performance.now()
  }, [])

  useEffect(() => {
    captureRenderStart()
  })

  useEffect(() => {
    const renderEndTime = performance.now()
    const renderTime = renderEndTime - renderStartTime.current

    renderCountRef.current += 1
    updateCountRef.current += 1

    const newMetrics: PerformanceMetrics = {
      renderTime: Math.round(renderTime * 100) / 100,
      renderCount: renderCountRef.current,
      componentUpdates: updateCountRef.current,
      memoryUsage: (performance as any).memory
        ? Math.round(((performance as any).memory.usedJSHeapSize / 1024 / 1024) * 100) / 100
        : undefined,
    }

    setMetrics((prevMetrics) => {
      // Only update if metrics actually changed to prevent unnecessary re-renders
      if (
        prevMetrics.renderTime !== newMetrics.renderTime ||
        prevMetrics.renderCount !== newMetrics.renderCount ||
        prevMetrics.componentUpdates !== newMetrics.componentUpdates
      ) {
        stableOnMetricsUpdate(newMetrics)
        return newMetrics
      }
      return prevMetrics
    })
  }, [stableOnMetricsUpdate]) // Add dependency array with stable callback

  return (
    <div>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "8px 16px",
          fontSize: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <strong>{componentName} Performance Monitor</strong>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <span>Render Time: {metrics.renderTime}ms</span>
          <span>Renders: {metrics.renderCount}</span>
          <span>Updates: {metrics.componentUpdates}</span>
          {metrics.memoryUsage && <span>Memory: {metrics.memoryUsage}MB</span>}
        </div>
      </div>
      {children}
    </div>
  )
}

export default PerformanceMonitor
