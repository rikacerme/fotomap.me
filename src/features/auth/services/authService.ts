import { firebaseAuthService } from './firebaseAuthService'
import { storageClient } from '@/shared/services/storageClient'
import { User, LoginResponse, SignupPayload } from '../types'

class AuthService {
  /**
   * Sign in with Google via Firebase
   */
  async loginWithGoogle(): Promise<LoginResponse> {
    try {
      const result = await firebaseAuthService.signInWithGoogle()
      const user = await this.createOrUpdateUser({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        avatar: result.user.avatar,
      })
      const token = await firebaseAuthService.getIdToken()
      return {
        user,
        tokens: { accessToken: token || '' },
      }
    } catch (error) {
      console.error('Google login failed:', error)
      throw error
    }
  }

  /**
   * Sign in with Apple via Firebase
   */
  async loginWithApple(): Promise<LoginResponse> {
    try {
      const result = await firebaseAuthService.signInWithApple()
      const user = await this.createOrUpdateUser({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        avatar: result.user.avatar,
      })
      const token = await firebaseAuthService.getIdToken()
      return {
        user,
        tokens: { accessToken: token || '' },
      }
    } catch (error) {
      console.error('Apple login failed:', error)
      throw error
    }
  }

  /**
   * Sign in with email and password via Firebase
   */
  async loginWithEmail(email: string, password: string): Promise<LoginResponse> {
    try {
      const result = await firebaseAuthService.signInWithEmail(email, password)
      const user = await this.createOrUpdateUser({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        avatar: result.user.avatar,
      })
      const token = await firebaseAuthService.getIdToken()
      return {
        user,
        tokens: { accessToken: token || '' },
      }
    } catch (error) {
      console.error('Email login failed:', error)
      throw error
    }
  }

  /**
   * Sign up with email and password via Firebase
   */
  async signup(payload: SignupPayload): Promise<LoginResponse> {
    try {
      if (!payload.email || !('password' in payload)) {
        throw new Error('Email ve şifre gereklidir.')
      }

      const result = await firebaseAuthService.signUpWithEmail(
        payload.email,
        (payload as any).password,
        payload.name
      )
      const user = await this.createOrUpdateUser({
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        avatar: result.user.avatar,
      })
      const token = await firebaseAuthService.getIdToken()
      return {
        user,
        tokens: { accessToken: token || '' },
      }
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  /**
   * Get current user from Firebase or storage
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = firebaseAuthService.getCurrentUser()
      if (firebaseUser) {
        return await this.createOrUpdateUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User',
          avatar: firebaseUser.photoURL || undefined,
        })
      }

      const storedUser = storageClient.get<User>('user')
      return storedUser || null
    } catch (error) {
      console.error('Failed to get current user:', error)
      return null
    }
  }

  /**
   * Create or update user in storage (maps Firebase user to our User type)
   */
  private async createOrUpdateUser(data: {
    id: string
    email: string
    name: string
    avatar?: string
  }): Promise<User> {
    const user: User = {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.avatar,
      subscription: 'free',
      photoCount: 0,
      maxPhotos: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.storeUser(user)
    return user
  }

  /**
   * Logout user from Firebase and clear storage
   */
  async logout(): Promise<void> {
    try {
      await firebaseAuthService.signOut()
      storageClient.remove('user')
      storageClient.remove('access_token')
      storageClient.clear()
    } catch (error) {
      console.error('Logout failed:', error)
      throw error
    }
  }

  /**
   * Store user in local storage
   */
  private storeUser(user: User): void {
    storageClient.set('user', user)
  }

  /**
   * Get stored Firebase ID token
   */
  async getStoredToken(): Promise<string | null> {
    return await firebaseAuthService.getIdToken()
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return firebaseAuthService.isAuthenticated()
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: any | null) => void): () => void {
    return firebaseAuthService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        this.createOrUpdateUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || 'User',
          avatar: firebaseUser.photoURL || undefined,
        }).then(callback)
      } else {
        callback(null)
      }
    })
  }
}

export const authService = new AuthService()
