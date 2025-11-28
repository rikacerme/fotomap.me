import React, { useState, useCallback } from 'react'
import { Upload, X } from 'lucide-react'

interface PhotoUploadProps {
  onUpload: (file: File) => Promise<void>
  isLoading?: boolean
  maxSize?: number // in MB
  accept?: string
}

export function PhotoUpload({
  onUpload,
  isLoading = false,
  maxSize = 10,
  accept = 'image/*',
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = useCallback(
    async (file: File) => {
      setError(null)

      // File size validation
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > maxSize) {
        setError(`Dosya boyutu ${maxSize}MB'ı geçemez`)
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload file
      try {
        await onUpload(file)
        setPreview(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed'
        setError(errorMessage)
      }
    },
    [onUpload, maxSize]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = e.dataTransfer.files
      if (files[0]) {
        handleFileSelect(files[0])
      }
    },
    [handleFileSelect]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files?.[0]) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto rounded-lg max-h-96 object-cover"
          />
          <button
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 p-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            Fotoğraf seçin veya sürükleyin
          </p>
          <p className="text-xs text-gray-500 mb-4">
            PNG, JPG, GIF (Max {maxSize}MB)
          </p>
          <input
            type="file"
            accept={accept}
            onChange={handleInputChange}
            disabled={isLoading}
            className="hidden"
          />
        </label>
      )}

      {error && (
        <div className="p-3 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-primary-600">
          <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Yükleniyor...</span>
        </div>
      )}
    </div>
  )
}
