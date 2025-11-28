// Mock API responses for development/testing

export const mockAuthResponse = {
  user: {
    id: '123',
    email: 'user@example.com',
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/40',
    subscription: 'free' as const,
    photoCount: 0,
    maxPhotos: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  tokens: {
    accessToken: 'mock_token_123',
    refreshToken: 'mock_refresh_token_123',
    expiresIn: 3600,
  },
}

export const mockEvent = {
  id: 'event_123',
  title: 'My Birthday Party',
  description: 'A fun birthday celebration with friends',
  organizerId: '123',
  status: 'active' as const,
  shareLink: 'https://eventphotos.app/join/abc123',
  qrCode: 'https://via.placeholder.com/256',
  participants: ['123', '456', '789'],
  photoIds: ['photo_1', 'photo_2', 'photo_3'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockPaymentPackages = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    currency: 'USD',
    features: ['Limited scanning', '3 photos per scan'],
    maxPhotos: 3,
    maxFacesPerScan: 1,
    maxEvents: 1,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 9.99,
    currency: 'USD',
    features: [
      'Unlimited scanning',
      '500 photos',
      'Unlimited events',
      'QR code sharing',
    ],
    maxPhotos: 500,
    maxFacesPerScan: -1,
    maxEvents: -1,
  },
]

export const mockFaceDetectionResult = {
  photoIds: ['photo_1', 'photo_2', 'photo_3'],
  facesFound: 5,
  matchedFaces: {
    '123': [
      {
        photoId: 'photo_1',
        confidence: 0.95,
        boundingBox: {
          x: 100,
          y: 150,
          width: 80,
          height: 100,
        },
      },
      {
        photoId: 'photo_3',
        confidence: 0.87,
        boundingBox: {
          x: 120,
          y: 200,
          width: 75,
          height: 95,
        },
      },
    ],
  },
  processingTime: 2500,
}
