import { useCallback, useState } from 'react'
import { faceDetectionService, DetectedFace, FaceMatch } from '../services/faceDetectionService'

export const useFaceDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionError, setDetectionError] = useState<string | null>(null)

  const detectFaces = useCallback(
    async (imageFile: File): Promise<DetectedFace[] | null> => {
      setIsDetecting(true)
      setDetectionError(null)

      try {
        const detectedFaces = await faceDetectionService.detectFacesInImage(
          imageFile
        )

        if (detectedFaces.length === 0) {
          setDetectionError('Resimde yüz algılanamadı')
          return null
        }

        return detectedFaces
      } catch (error) {
        console.error('Face detection error:', error)
        const message =
          error instanceof Error ? error.message : 'Yüz algılama başarısız'
        setDetectionError(message)
        return null
      } finally {
        setIsDetecting(false)
      }
    },
    []
  )

  return {
    detectFaces,
    isDetecting,
    detectionError,
    clearError: () => setDetectionError(null),
  }
}

export const useFaceSearch = () => {
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const searchFaces = useCallback(
    async (
      sourceEmbedding: number[],
      photoEmbeddings: Array<{ photoId: string; embeddings: number[][] }>,
      threshold: number = 0.6
    ): Promise<FaceMatch[]> => {
      setIsSearching(true)
      setSearchError(null)

      try {
        const matches = await faceDetectionService.findMatchingFaces(
          sourceEmbedding,
          photoEmbeddings,
          threshold
        )

        return matches
      } catch (error) {
        console.error('Face search error:', error)
        const message =
          error instanceof Error ? error.message : 'Yüz arama başarısız'
        setSearchError(message)
        return []
      } finally {
        setIsSearching(false)
      }
    },
    []
  )

  return {
    searchFaces,
    isSearching,
    searchError,
    clearError: () => setSearchError(null),
  }
}
