import React from 'react'
import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  onDismiss?: () => void
}

export function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-danger-700">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-danger-600 hover:text-danger-700 flex-shrink-0"
        >
          ×
        </button>
      )}
    </div>
  )
}
