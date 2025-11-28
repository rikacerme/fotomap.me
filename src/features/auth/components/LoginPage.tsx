import React, { useState } from 'react'
import { useGoogleLogin, useSignup } from '../hooks/useAuth'
import { GoogleSignupForm } from './GoogleSignupForm'

export function LoginPage() {
  const { login: googleLogin, isLoading, error } = useGoogleLogin()
  const { signup, isLoading: signupLoading } = useSignup()
  const [showSignup, setShowSignup] = useState(false)
  const [googleEmail, setGoogleEmail] = useState<string | null>(null)

  const handleGoogleAuth = async (token: string) => {
    try {
      setGoogleEmail(null)
      await googleLogin(token)
    } catch (error) {
      setShowSignup(true)
      setGoogleEmail(token)
    }
  }

  const handleSignup = async (email: string, name: string) => {
    try {
      await signup({ email, name, googleId: googleEmail || undefined })
    } catch (error) {
      console.error('Signup error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Event Photos
          </h1>
          <p className="text-gray-600">
            Etkinlik fotoğraflarınızı kişi bazlı paylaşın
          </p>
        </div>

        {googleEmail && showSignup ? (
          <GoogleSignupForm
            email={googleEmail}
            onSubmit={handleSignup}
            isLoading={signupLoading}
          />
        ) : (
          <>
            <button
              onClick={() => handleGoogleAuth('demo-token')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-primary-500 transition-colors disabled:opacity-50"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {isLoading ? 'İşlem yapılıyor...' : 'Google ile Giriş Yap'}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg text-sm">
                {error}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
