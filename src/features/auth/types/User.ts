export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  subscription: 'free' | 'premium'
  photoCount: number
  maxPhotos: number
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
}

export interface LoginResponse {
  user: User
  tokens: AuthTokens
}

export interface SignupPayload {
  email: string
  name: string
  googleId?: string
}

export type AuthError = 'invalid_credentials' | 'user_not_found' | 'network_error' | 'unknown_error'
