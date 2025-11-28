import { useState, useCallback } from 'react'
import { paymentService } from '../services/paymentService'

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initializePayment = useCallback(async (packageId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const paymentIntent = await paymentService.initializePayment(
        packageId
      )
      return paymentIntent
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize payment'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const confirmPayment = useCallback(async (intentId: string, token: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const payment = await paymentService.confirmPayment(
        intentId,
        token
      )
      return payment
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to confirm payment'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { initializePayment, confirmPayment, isLoading, error }
}
