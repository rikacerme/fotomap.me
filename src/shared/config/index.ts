// Subscription package configurations
export const SUBSCRIPTION_PACKAGES = {
  FREE: {
    id: 'free',
    name: 'Ücretsiz',
    price: 0,
    maxPhotos: 3,
    maxFacesPerScan: 1,
    maxEvents: 1,
    features: ['Sınırlı tarama', '3 fotoğraf, 1 yüz'],
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    maxPhotos: 500,
    maxFacesPerScan: -1, // unlimited
    maxEvents: -1, // unlimited
    features: [
      'Sınırsız tarama',
      '500 fotoğraf',
      'Sınırsız etkinlik',
      'QR kod paylaşım',
    ],
  },
} as const

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export const GOOGLE_AUTH_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  redirectUri: `${window.location.origin}/auth/callback`,
}

export const FACE_DETECTION_CONFIG = {
  minConfidence: 0.6,
  detectionModel: 'tiny',
  facesPerImage: 5,
}
