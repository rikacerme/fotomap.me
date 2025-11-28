import { create } from 'zustand'
import { User } from '../types'
import { authService } from '../services/authService'

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  loadUser: () => Promise<void>
  logout: () => void
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  setUser: (user) => {
    // Save user to localStorage for persistence
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
    set({ user, error: null })
  },

  setError: (error) => set({ error }),

  setLoading: (isLoading) => set({ isLoading }),

  loadUser: async () => {
    set({ isLoading: true })
    try {
      const user = await authService.getCurrentUser()
      // Save to localStorage
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      }
      set({ user, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      })
    }
  },

  logout: () => {
    // Clear localStorage
    localStorage.removeItem('user')
    set({ user: null, error: null })
  },

  /**
   * Initialize auth by listening to Firebase auth state
   */
  initializeAuth: async () => {
    set({ isLoading: true })
    try {
      // First check localStorage for cached user
      const cachedUser = localStorage.getItem('user')
      if (cachedUser) {
        try {
          set({ user: JSON.parse(cachedUser), isLoading: false })
        } catch (e) {
          console.warn('Failed to parse cached user')
        }
      }

      // Get current user from Firebase
      const user = await authService.getCurrentUser()
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        set({ user, isLoading: false })
      } else {
        localStorage.removeItem('user')
        set({ user: null, isLoading: false })
      }

      // Listen to auth state changes
      authService.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          authService.getCurrentUser().then((user) => {
            if (user) {
              localStorage.setItem('user', JSON.stringify(user))
            }
            set({ user })
          })
        } else {
          localStorage.removeItem('user')
          set({ user: null })
        }
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to initialize auth',
        isLoading: false,
      })
    }
  },
}))
