import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface EmailAuthFormProps {
  isLoading?: boolean
  error?: string | null
  onSubmit: (email: string, password: string) => Promise<void>
  isSignup?: boolean
  onToggleMode?: () => void
}

export function EmailAuthForm({
  isLoading = false,
  error = null,
  onSubmit,
  isSignup = false,
  onToggleMode,
}: EmailAuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    // Validation
    if (!email.trim()) {
      setLocalError('E-posta adresini girin.')
      return
    }

    if (!password.trim()) {
      setLocalError('Şifreyi girin.')
      return
    }

    if (isSignup) {
      if (password.length < 6) {
        setLocalError('Şifre en az 6 karakter olmalıdır.')
        return
      }

      if (password !== confirmPassword) {
        setLocalError('Şifreler eşleşmiyor.')
        return
      }
    }

    try {
      await onSubmit(email, password)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Bir hata oluştu.'
      setLocalError(errorMessage)
    }
  }

  const displayError = localError || error

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Input */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-posta Adresi
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          placeholder="ornek@email.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>

      {/* Password Input */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Şifre
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            placeholder={isSignup ? 'En az 6 karakter' : ''}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Confirm Password Input (Signup Only) */}
      {isSignup && (
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Şifreyi Onayla
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Şifreyi tekrar girin"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {displayError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{displayError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Yükleniyor...' : isSignup ? 'Kayıt Ol' : 'Giriş Yap'}
      </button>

      {/* Toggle Mode Link */}
      {onToggleMode && (
        <div className="text-center text-sm text-gray-600">
          {isSignup ? 'Zaten hesabınız var mı? ' : 'Hesabınız yok mu? '}
          <button
            type="button"
            onClick={onToggleMode}
            disabled={isLoading}
            className="text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
          >
            {isSignup ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </div>
      )}
    </form>
  )
}
