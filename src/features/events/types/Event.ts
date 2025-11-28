export interface Event {
  id: string
  title: string
  description: string
  organizerId: string
  createdBy: {
    id: string
    name: string
    email: string
  }
  status: 'draft' | 'active' | 'completed'
  shareLink: string
  qrCode: string
  participants: string[]
  photoIds: string[]
  createdAt: string
  updatedAt: string
}

export interface EventPhoto {
  id: string
  eventId: string
  userId: string
  uploadedBy: string
  url: string
  imageUrl: string
  fileName: string
  size: number
  uploadedAt: string
}

export interface FaceMatch {
  photoId: string
  confidence: number
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
}

export interface EventParticipantPhotos {
  userId: string
  userName: string
  userEmail: string
  photos: FaceMatch[]
}
