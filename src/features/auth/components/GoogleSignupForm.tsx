import React, { useState } from 'react'
import { Mail, Eye, EyeOff } from 'lucide-react'

interface GoogleSignupFormProps {
  email: string
  onSubmit: (email: string, name: string) => Promise<void>
  isLoading?: boolean
}

export function GoogleSignupForm({
  email,
  onSubmit,
  isLoading = false,
}: GoogleSignupFormProps) {
  const [name, setName] = useState('')
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      await onSubmit(email, name)
    }
  }

  if (!showForm) {
    return (
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          {email} adresine hoş geldiniz
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Devam Et
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ad Soyad
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adınız ve soyadınız"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !name.trim()}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'İşlem yapılıyor...' : 'Kayıt Ol'}
      </button>
    </form>
  )
}
