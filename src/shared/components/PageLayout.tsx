import React from 'react'
import { Toaster } from 'react-hot-toast'

interface LayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster position="top-right" />
    </div>
  )
}
