import { useState, useCallback } from 'react'
import { faceDetectionService } from '../services/faceDetectionService'

export function useFaceDetection() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)

  const scanEventPhotos = useCallback(async (eventId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const scanResult = await faceDetectionService.scanEventPhotos(
        eventId
      )
      setResult(scanResult)
      return scanResult
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to scan photos'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const matchUserFace = useCallback(
    async (eventId: string, userId: string, photoFile: File) => {
      setIsLoading(true)
      setError(null)
      try {
        const matchResult = await faceDetectionService.matchFace(
          eventId,
          userId,
          photoFile
        )
        setResult(matchResult)
        return matchResult
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to match face'
        setError(errorMessage)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return { scanEventPhotos, matchUserFace, isLoading, error, result }
}
