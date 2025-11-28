import { apiClient } from '@/shared/services/apiClient'
import { ScanResult } from '../types'

class FaceDetectionService {
  async detectFacesInPhoto(photoUrl: string) {
    return apiClient.post('/face-detection/detect', { photoUrl })
  }

  async scanEventPhotos(eventId: string): Promise<ScanResult> {
    return apiClient.post<ScanResult>('/face-detection/scan-event', {
      eventId,
    })
  }

  async matchFace(
    eventId: string,
    userId: string,
    photoFile: File
  ): Promise<ScanResult> {
    const formData = new FormData()
    formData.append('file', photoFile)
    formData.append('eventId', eventId)
    formData.append('userId', userId)

    return apiClient.post<ScanResult>(
      '/face-detection/match',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  }

  async getUserFacePhotos(eventId: string, userId: string) {
    return apiClient.get(
      `/face-detection/user-photos?eventId=${eventId}&userId=${userId}`
    )
  }
}

export const faceDetectionService = new FaceDetectionService()
