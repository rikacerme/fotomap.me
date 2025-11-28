import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  OAuthProvider,
  User as FirebaseUser,
  updateProfile,
  onAuthStateChanged,
  Unsubscribe,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export interface AuthResult {
  user: {
    id: string
    email: string
    name: string
    avatar?: string
  }
  provider: 'google' | 'apple' | 'email'
}

class FirebaseAuthService {
  private unsubscribe: Unsubscribe | null = null

  /**
   * Sign in with Google using Firebase
   */
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      return this.mapFirebaseUserToAuthResult(result.user, 'google')
    } catch (error) {
      console.error('Google sign-in error:', error)
      throw this.handleAuthError(error)
    }
  }

  /**
   * Sign in with Apple using Firebase
   */
  async signInWithApple(): Promise<AuthResult> {
    try {
      const provider = new OAuthProvider('apple.com')
      provider.addScope('email')
      provider.addScope('name')

      const result = await signInWithPopup(auth, provider)
      return this.mapFirebaseUserToAuthResult(result.user, 'apple')
    } catch (error) {
      console.error('Apple sign-in error:', error)
      throw this.handleAuthError(error)
    }
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(email: string, password: string, name: string): Promise<AuthResult> {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)

      // Update profile with name
      await updateProfile(result.user, {
        displayName: name,
      })

      return this.mapFirebaseUserToAuthResult(result.user, 'email')
    } catch (error) {
      console.error('Email sign-up error:', error)
      throw this.handleAuthError(error)
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<AuthResult> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return this.mapFirebaseUserToAuthResult(result.user, 'email')
    } catch (error) {
      console.error('Email sign-in error:', error)
      throw this.handleAuthError(error)
    }
  }

  /**
   * Sign out from Firebase
   */
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Sign-out error:', error)
      throw this.handleAuthError(error)
    }
  }

  /**
   * Get current authenticated user
   */
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void): Unsubscribe {
    this.unsubscribe = onAuthStateChanged(auth, callback)
    return this.unsubscribe
  }

  /**
   * Get ID token for API requests
   */
  async getIdToken(): Promise<string | null> {
    try {
      if (auth.currentUser) {
        return await auth.currentUser.getIdToken()
      }
      return null
    } catch (error) {
      console.error('Failed to get ID token:', error)
      return null
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return auth.currentUser !== null
  }

  /**
   * Map Firebase User to our AuthResult format
   */
  private mapFirebaseUserToAuthResult(firebaseUser: FirebaseUser, provider: 'google' | 'apple' | 'email'): AuthResult {
    return {
      user: {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        avatar: firebaseUser.photoURL || undefined,
      },
      provider,
    }
  }

  /**
   * Handle Firebase authentication errors
   */
  private handleAuthError(error: unknown): Error {
    if (error instanceof Error) {
      const firebaseError = error as any
      const code = firebaseError.code

      const errorMessages: Record<string, string> = {
        'auth/user-not-found': 'E-posta adresi bulunamadı.',
        'auth/wrong-password': 'Yanlış şifre.',
        'auth/email-already-in-use': 'Bu e-posta adresi zaten kullanılıyor.',
        'auth/weak-password': 'Şifre en az 6 karakter olmalıdır.',
        'auth/invalid-email': 'Geçersiz e-posta adresi.',
        'auth/user-cancelled': 'Giriş işlemi iptal edildi.',
        'auth/popup-blocked': 'Açılır pencere engellendi. Lütfen tarayıcı ayarlarını kontrol edin.',
        'auth/operation-not-allowed': 'Bu giriş yöntemi şu anda devre dışıdır.',
      }

      return new Error(errorMessages[code] || error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.')
    }

    return new Error('Bir hata oluştu. Lütfen tekrar deneyin.')
  }
}

export const firebaseAuthService = new FirebaseAuthService()
