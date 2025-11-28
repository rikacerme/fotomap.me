export interface FaceDetectionResult {
  faceId: string
  confidence: number
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
  descriptor?: Float32Array
}

export interface ScanResult {
  photoIds: string[]
  facesFound: number
  matchedFaces: {
    [userId: string]: FaceDetectionResult[]
  }
  processingTime: number
}

export interface FaceDatabase {
  userId: string
  descriptors: Float32Array[]
  photoIds: string[]
}
