import { apiClient } from '@/shared/services/apiClient'
import { Payment, PaymentIntent } from '../types'
import { SUBSCRIPTION_PACKAGES } from '@/shared/config'

class PaymentService {
  async getPackages() {
    return Object.values(SUBSCRIPTION_PACKAGES)
  }

  async initializePayment(
    packageId: string
  ): Promise<PaymentIntent> {
    return apiClient.post<PaymentIntent>('/payments/initialize', {
      packageId,
    })
  }

  async confirmPayment(
    paymentIntentId: string,
    token: string
  ): Promise<Payment> {
    return apiClient.post<Payment>('/payments/confirm', {
      paymentIntentId,
      token,
    })
  }

  async getPaymentHistory(): Promise<Payment[]> {
    return apiClient.get<Payment[]>('/payments/history')
  }

  async getPaymentStatus(paymentId: string): Promise<Payment> {
    return apiClient.get<Payment>(`/payments/${paymentId}`)
  }
}

export const paymentService = new PaymentService()
