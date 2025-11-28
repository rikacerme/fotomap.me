import React, { useState } from 'react'
import { X, Mail, Apple } from 'lucide-react'
import { useGoogleLogin, useSignup } from '@/features/auth/hooks/useAuth'
import { authService } from '@/features/auth/services/authService'
import { EmailAuthForm } from '@/features/auth/components/EmailAuthForm'
import toast from 'react-hot-toast'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'main' | 'email' | 'signup'

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login: googleLogin, isLoading: googleLoading, error: googleError } = useGoogleLogin()
  const { signup, isLoading: signupLoading, error: signupError } = useSignup()
  const [authMode, setAuthMode] = useState<AuthMode>('main')
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    try {
      await googleLogin('google')
      toast.success('Google ile giriş başarılı!')
      onClose()
    } catch (error) {
      console.error('Google auth failed:', error)
      toast.error('Google giriş başarısız oldu.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppleAuth = async () => {
    setIsLoading(true)
    try {
      const result = await authService.loginWithApple()
      toast.success('Apple ile giriş başarılı!')
      onClose()
    } catch (error) {
      console.error('Apple auth failed:', error)
      toast.error(error instanceof Error ? error.message : 'Apple giriş başarısız oldu.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignIn = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await authService.loginWithEmail(email, password)
      toast.success('E-posta ile giriş başarılı!')
      setAuthMode('main')
      onClose()
    } catch (error) {
      console.error('Email login failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailSignUp = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      await authService.signup({
        email,
        name: email.split('@')[0],
        password,
      } as any)
      toast.success('Kayıt başarılı! Hoş geldiniz.')
      setAuthMode('main')
      onClose()
    } catch (error) {
      console.error('Email signup failed:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Photos</h1>
          <p className="text-gray-600">Etkinlik fotoğraflarınızı kişi bazlı paylaşın</p>
        </div>

        {/* Main Auth Options */}
        {authMode === 'main' && (
          <div className="space-y-3">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading || googleLoading}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google ile Giriş Yap
            </button>

            {/* Apple Sign In */}
            <button
              onClick={handleAppleAuth}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Apple className="w-5 h-5" />
              Apple ile Giriş Yap
            </button>

            {/* Email Sign In */}
            <button
              onClick={() => setAuthMode('email')}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              E-posta ile Giriş Yap
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-sm text-gray-600 pt-2">
              Hesabınız yok mu?{' '}
              <button
                onClick={() => setAuthMode('signup')}
                disabled={isLoading}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Kayıt Ol
              </button>
            </div>
          </div>
        )}

        {/* Email Sign In Form */}
        {authMode === 'email' && (
          <div>
            <EmailAuthForm
              isLoading={isLoading}
              error={signupError}
              onSubmit={handleEmailSignIn}
              isSignup={false}
              onToggleMode={() => setAuthMode('signup')}
            />
            <button
              onClick={() => setAuthMode('main')}
              disabled={isLoading}
              className="w-full mt-4 text-center text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              Diğer seçenekleri gör
            </button>
          </div>
        )}

        {/* Email Sign Up Form */}
        {authMode === 'signup' && (
          <div>
            <EmailAuthForm
              isLoading={isLoading}
              error={signupError}
              onSubmit={handleEmailSignUp}
              isSignup={true}
              onToggleMode={() => setAuthMode('email')}
            />
            <button
              onClick={() => setAuthMode('main')}
              disabled={isLoading}
              className="w-full mt-4 text-center text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              Diğer seçenekleri gör
            </button>
          </div>
        )}

        {/* Terms */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Giriş yaparak hizmet şartlarımızı kabul etmiş olursunuz</p>
        </div>
      </div>
    </div>
  )
}

