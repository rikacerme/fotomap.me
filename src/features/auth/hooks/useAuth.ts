import { useCallback, useState } from 'react'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { SignupPayload, LoginResponse } from '../types'

/**
 * Hook for Google login
 */
export function useGoogleLogin() {
  const setUser = useAuthStore((state) => state.setUser)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (token?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authService.loginWithGoogle()
      setUser(response.user)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Google giriş başarısız oldu.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setUser])

  return { login, isLoading, error }
}

/**
 * Hook for Apple login
 */
export function useAppleLogin() {
  const setUser = useAuthStore((state) => state.setUser)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authService.loginWithApple()
      setUser(response.user)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Apple giriş başarısız oldu.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setUser])

  return { login, isLoading, error }
}

/**
 * Hook for email login
 */
export function useEmailLogin() {
  const setUser = useAuthStore((state) => state.setUser)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await authService.loginWithEmail(email, password)
      setUser(response.user)
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'E-posta giriş başarısız oldu.'
      setError(errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [setUser])

  return { login, isLoading, error }
}

/**
 * Hook for signup
 */
export function useSignup() {
  const setUser = useAuthStore((state) => state.setUser)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signup = useCallback(
    async (payload: SignupPayload & { password?: string }): Promise<LoginResponse> => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await authService.signup(payload)
        setUser(response.user)
        return response
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Kayıt başarısız oldu.'
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [setUser]
  )

  return { signup, isLoading, error }
}

/**
 * Hook for logout
 */
export function useLogout() {
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = useCallback(async () => {
    try {
      await authService.logout()
      logout()
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }, [logout])

  return { logout: handleLogout }
}

/**
 * Hook to get current user
 */
export function useCurrentUser() {
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const loadUser = useAuthStore((state) => state.loadUser)

  return { user, isLoading, loadUser }
}
