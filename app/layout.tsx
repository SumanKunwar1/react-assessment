import type React from "react"
import type { Metadata } from "next"
import "./globals.css" // Import globals.css at the top of the file

export const metadata: Metadata = {
  title: "React Developer Assessment - Data Saturn",
  description:
    "Comprehensive React TypeScript assessment showcasing advanced component architecture, state management, performance optimization, and white-label configuration.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
