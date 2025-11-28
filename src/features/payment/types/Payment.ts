export interface Package {
  id: 'free' | 'premium'
  name: string
  price: number
  currency: string
  features: string[]
  maxPhotos: number
  maxFacesPerScan: number
  maxEvents: number
}

export interface Payment {
  id: string
  userId: string
  packageId: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  transactionId?: string
  createdAt: string
  updatedAt: string
}

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  clientSecret: string
}
