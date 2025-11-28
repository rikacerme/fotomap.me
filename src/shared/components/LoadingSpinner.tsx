import React from 'react'
import { Loader } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <Loader
        className={`${sizeClasses[size]} text-primary-600 animate-spin`}
      />
      {message && <p className="text-gray-600">{message}</p>}
    </div>
  )
}
