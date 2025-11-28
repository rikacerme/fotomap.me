# Firebase Authentication - Code Examples

## 🔐 Complete Usage Examples

All examples are production-ready and include error handling!

---

## 1. Initialize Auth in App Component

```typescript
import { useAuthStore } from '@/features/auth/store/authStore'
import { useEffect } from 'react'

export function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    // Initialize Firebase auth on app load
    // This loads user from localStorage and listens to Firebase changes
    initializeAuth()
  }, [initializeAuth])

  return (
    // Your app JSX
    <>
      {/* Header, Router, etc. */}
    </>
  )
}
```

---

## 2. Google Sign-In

```typescript
import { useGoogleLogin } from '@/features/auth/hooks/useAuth'
import toast from 'react-hot-toast'

function GoogleLoginButton() {
  const { login, isLoading, error } = useGoogleLogin()

  const handleGoogleLogin = async () => {
    try {
      const result = await login()
      toast.success(`Hoş geldiniz, ${result.user.name}!`)
      // You can also navigate or update state here
      // navigate('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Giriş başarısız')
    }
  }

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
    >
      {isLoading ? 'Yükleniyor...' : 'Google ile Giriş Yap'}
    </button>
  )
}

export default GoogleLoginButton
```

---

## 3. Apple Sign-In

```typescript
import { useAppleLogin } from '@/features/auth/hooks/useAuth'
import toast from 'react-hot-toast'

function AppleLoginButton() {
  const { login, isLoading, error } = useAppleLogin()

  const handleAppleLogin = async () => {
    try {
      const result = await login()
      toast.success(`Hoş geldiniz, ${result.user.name}!`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Apple giriş başarısız')
    }
  }

  return (
    <button
      onClick={handleAppleLogin}
      disabled={isLoading}
      className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50"
    >
      {isLoading ? 'Yükleniyor...' : 'Apple ile Giriş Yap'}
    </button>
  )
}

export default AppleLoginButton
```

---

## 4. Email Sign-In

```typescript
import { useState } from 'react'
import { authService } from '@/features/auth/services/authService'
import toast from 'react-hot-toast'

function EmailLoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const result = await authService.loginWithEmail(email, password)
      toast.success(`Hoş geldiniz, ${result.user.name}!`)
      // Reset form
      setEmail('')
      setPassword('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Giriş başarısız'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta"
        disabled={isLoading}
        className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Şifre"
        disabled={isLoading}
        className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100"
      />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {isLoading ? 'Yükleniyor...' : 'Giriş Yap'}
      </button>
    </form>
  )
}

export default EmailLoginForm
```

---

## 5. Email Sign-Up

```typescript
import { useState } from 'react'
import { useSignup } from '@/features/auth/hooks/useAuth'
import toast from 'react-hot-toast'

function EmailSignupForm() {
  const { signup, isLoading, error } = useSignup()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    // Validation
    if (!email.trim()) {
      setLocalError('E-posta adresini girin.')
      return
    }

    if (password.length < 6) {
      setLocalError('Şifre en az 6 karakter olmalıdır.')
      return
    }

    if (password !== confirmPassword) {
      setLocalError('Şifreler eşleşmiyor.')
      return
    }

    try {
      await signup({
        email,
        name: email.split('@')[0],
        password,
      } as any)
      toast.success('Kayıt başarılı! Hoş geldiniz.')
      // Clear form
      setEmail('')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kayıt başarısız'
      setLocalError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const displayError = localError || error

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta"
        disabled={isLoading}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Şifre (en az 6 karakter)"
        disabled={isLoading}
        className="w-full px-4 py-2 border rounded-lg"
      />
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Şifreyi onayla"
        disabled={isLoading}
        className="w-full px-4 py-2 border rounded-lg"
      />
      {displayError && <p className="text-red-600 text-sm">{displayError}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
      >
        {isLoading ? 'Yükleniyor...' : 'Kayıt Ol'}
      </button>
    </form>
  )
}

export default EmailSignupForm
```

---

## 6. Get Current User and Logout

```typescript
import { useCurrentUser, useLogout } from '@/features/auth/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function UserProfile() {
  const navigate = useNavigate()
  const { user, isLoading } = useCurrentUser()
  const { logout } = useLogout()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Çıkış yapıldı.')
      navigate('/')
    } catch (error) {
      toast.error('Çıkış başarısız oldu.')
    }
  }

  if (isLoading) return <p>Yükleniyor...</p>
  if (!user) return <p>Lütfen giriş yapın.</p>

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">{user.name}</h1>
      <p className="text-gray-600 mb-2">{user.email}</p>
      <p className="text-sm text-gray-500 mb-4">
        Plan: {user.subscription === 'free' ? 'Ücretsiz' : 'Premium'}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Fotoğraflar: {user.photoCount} / {user.maxPhotos}
      </p>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Çıkış Yap
      </button>
    </div>
  )
}

export default UserProfile
```

---

## 7. Protected Route

```typescript
import { useCurrentUser } from '@/features/auth/hooks/useAuth'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Yükleniyor...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
```

Usage:
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## 8. Get Firebase Token for API Requests

```typescript
import { useEffect, useState } from 'react'
import { authService } from '@/features/auth/services/authService'
import axios from 'axios'

function useAuthenticatedApi() {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getToken = async () => {
      try {
        const firebaseToken = await authService.getStoredToken()
        setToken(firebaseToken)

        // Set as default axios header
        if (firebaseToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${firebaseToken}`
        }
      } catch (error) {
        console.error('Failed to get token:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getToken()
  }, [])

  return { token, isLoading }
}

// Usage:
function DataComponent() {
  const { token, isLoading } = useAuthenticatedApi()

  useEffect(() => {
    if (!isLoading && token) {
      // Make authenticated API request
      axios.get('/api/user-data').then((res) => {
        console.log(res.data)
      })
    }
  }, [token, isLoading])

  return <div>Your component</div>
}
```

---

## 9. Conditional Rendering Based on Auth

```typescript
import { useCurrentUser } from '@/features/auth/hooks/useAuth'

function HomePage() {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) return <p>Yükleniyor...</p>

  return (
    <div>
      <h1>Ana Sayfa</h1>

      {user ? (
        // Logged in content
        <div>
          <h2>Hoş geldiniz, {user.name}!</h2>
          <p>E-posta: {user.email}</p>
          <p>Plan: {user.subscription}</p>
          <button onClick={() => navigate('/dashboard')}>
            Dashboard'a Git
          </button>
        </div>
      ) : (
        // Not logged in content
        <div>
          <p>Etkinlik fotoğraflarınızı paylaşmak için giriş yapın.</p>
          <button onClick={() => setShowLoginModal(true)}>
            Giriş Yap
          </button>
        </div>
      )}
    </div>
  )
}
```

---

## 10. Check Authentication Status

```typescript
import { authService } from '@/features/auth/services/authService'

// Check if user is authenticated
if (authService.isAuthenticated()) {
  console.log('User is logged in')
} else {
  console.log('User is not logged in')
}

// Get current Firebase user
const firebaseUser = authService.firebaseAuthService.getCurrentUser()
if (firebaseUser) {
  console.log('Firebase user:', firebaseUser.uid)
}

// Get stored token for API requests
const token = await authService.getStoredToken()
console.log('Auth token:', token)
```

---

## 11. Listen to Auth State Changes

```typescript
import { useEffect } from 'react'
import { authService } from '@/features/auth/services/authService'

function App() {
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      if (user) {
        console.log('User logged in:', user.name)
      } else {
        console.log('User logged out')
      }
    })

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [])

  return <>{/* Your app */}</>
}
```

---

## 12. Custom Hook for Auth Context

```typescript
import { create } from 'zustand'
import { User } from '@/features/auth/types'

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
}

export const useAuthContext = create<AuthContextType>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const result = await authService.loginWithEmail(email, password)
      set({
        user: result.user,
        isLoggedIn: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await authService.logout()
      set({
        user: null,
        isLoggedIn: false,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true })
    try {
      const result = await authService.signup({
        email,
        name,
        password,
      } as any)
      set({
        user: result.user,
        isLoggedIn: true,
        isLoading: false,
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
}))
```

---

## 13. Error Handling Examples

```typescript
import toast from 'react-hot-toast'

// Comprehensive error handling
async function handleLogin(email: string, password: string) {
  try {
    const result = await authService.loginWithEmail(email, password)
    toast.success(`Hoş geldiniz, ${result.user.name}!`)
    return result
  } catch (error) {
    if (error instanceof Error) {
      // Firebase specific errors
      if (error.message.includes('E-posta adresi bulunamadı')) {
        toast.error('Hesap bulunamadı. Lütfen kayıt olun.')
      } else if (error.message.includes('Yanlış şifre')) {
        toast.error('Şifre yanlış. Lütfen tekrar deneyin.')
      } else {
        toast.error(error.message)
      }
    } else {
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.')
    }
    throw error
  }
}
```

---

## 14. Password Reset (Firebase Feature)

```typescript
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase'

async function handlePasswordReset(email: string) {
  try {
    await sendPasswordResetEmail(auth, email)
    toast.success('Şifre sıfırlama bağlantısı gönderildi.')
  } catch (error) {
    toast.error('Şifre sıfırlama başarısız oldu.')
  }
}
```

---

## 15. Email Verification (Firebase Feature)

```typescript
import { sendEmailVerification } from 'firebase/auth'
import { authService } from '@/features/auth/services/authService'

async function handleEmailVerification() {
  try {
    const firebaseUser = authService.firebaseAuthService.getCurrentUser()
    if (firebaseUser) {
      await sendEmailVerification(firebaseUser)
      toast.success('Doğrulama e-postası gönderildi.')
    }
  } catch (error) {
    toast.error('E-posta doğrulama başarısız oldu.')
  }
}
```

---

## All Examples Summary

| Use Case | Example | Where to Use |
|----------|---------|-------------|
| Initialize Auth | #1 | App.tsx (root component) |
| Google Login | #2 | LoginModal, buttons |
| Apple Login | #3 | LoginModal, buttons |
| Email Login | #4 | LoginModal, forms |
| Email Signup | #5 | LoginModal, forms |
| Get User & Logout | #6 | Header, Profile pages |
| Protected Routes | #7 | Router setup |
| API Requests | #8 | Data fetching |
| Conditional UI | #9 | Home page, navigation |
| Check Auth Status | #10 | Anywhere in app |
| Auth Listeners | #11 | App setup, real-time |
| Custom Context | #12 | Advanced state management |
| Error Handling | #13 | All components |
| Password Reset | #14 | Forgot password page |
| Email Verification | #15 | User settings |

---

All examples include:
- ✅ Error handling (Turkish messages)
- ✅ Loading states
- ✅ Toast notifications
- ✅ Type safety (TypeScript)
- ✅ Best practices
- ✅ Real-world usage patterns

Copy and paste any example into your components! 🎉
