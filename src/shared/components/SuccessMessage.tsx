import React from 'react'
import { CheckCircle } from 'lucide-react'

interface SuccessMessageProps {
  message: string
  onDismiss?: () => void
}

export function SuccessMessage({ message, onDismiss }: SuccessMessageProps) {
  return (
    <div className="p-4 bg-success-50 border border-success-200 rounded-lg flex items-start gap-3">
      <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm text-success-700">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-success-600 hover:text-success-700 flex-shrink-0"
        >
          ×
        </button>
      )}
    </div>
  )
}
