import * as faceapi from 'face-api.js'

export interface DetectedFace {
  embeddings: number[]
  landmarks: any
  imageData?: ImageData
}

export interface FaceMatch {
  photoId: string
  confidence: number
  embeddings: number[]
}

/**
 * Face Detection Service
 * Handles face detection and recognition using face-api.js
 */
class FaceDetectionService {
  private modelsLoaded = false

  /**
   * Load face-api models (must be called once before detection)
   */
  async loadModels(): Promise<void> {
    if (this.modelsLoaded) return

    try {
      // Use CDN for models instead of local files
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ])

      this.modelsLoaded = true
      console.log('Face detection models loaded successfully')
    } catch (error) {
      console.error('Error loading face detection models:', error)
      throw new Error('Yüz tanıma modelleri yüklenemedi')
    }
  }

  /**
   * Detect faces in an image file and extract face embeddings
   */
  async detectFacesInImage(
    imageFile: File
  ): Promise<DetectedFace[]> {
    try {
      await this.loadModels()

      // Convert file to image element
      const img = await this.fileToImage(imageFile)

      // Detect faces with landmarks
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions()

      if (detections.length === 0) {
        console.warn('No faces detected in image')
        return []
      }

      // Extract embeddings from detections
      const detectedFaces: DetectedFace[] = detections.map((detection) => ({
        embeddings: Array.from(detection.descriptor),
        landmarks: {
          detection: detection.detection,
          landmarks: detection.landmarks,
        },
      }))

      return detectedFaces
    } catch (error) {
      console.error('Error detecting faces:', error)
      throw new Error('Yüz algılama işlemi başarısız')
    }
  }

  /**
   * Compare two face embeddings and return similarity score (0-1)
   * Higher score = more similar
   */
  compareFaceEmbeddings(
    embedding1: number[],
    embedding2: number[]
  ): number {
    try {
      // Calculate Euclidean distance
      let sum = 0
      for (let i = 0; i < embedding1.length; i++) {
        const diff = embedding1[i] - embedding2[i]
        sum += diff * diff
      }
      const distance = Math.sqrt(sum)

      // Convert distance to similarity score (0-1)
      // Lower distance = higher similarity
      // Using sigmoid-like conversion: 1 / (1 + distance)
      const similarity = 1 / (1 + distance)

      return similarity
    } catch (error) {
      console.error('Error comparing embeddings:', error)
      return 0
    }
  }

  /**
   * Find matching faces in a collection of photos
   * Returns photos that contain faces similar to the source embedding
   */
  async findMatchingFaces(
    sourceEmbedding: number[],
    photoEmbeddings: Array<{ photoId: string; embeddings: number[][] }>,
    threshold: number = 0.6
  ): Promise<FaceMatch[]> {
    try {
      const matches: FaceMatch[] = []

      for (const photo of photoEmbeddings) {
        // Compare source embedding with all faces in this photo
        for (const embedding of photo.embeddings) {
          const similarity = this.compareFaceEmbeddings(
            sourceEmbedding,
            embedding
          )

          // If similarity exceeds threshold, add to matches
          if (similarity >= threshold) {
            matches.push({
              photoId: photo.photoId,
              confidence: similarity,
              embeddings: embedding,
            })
          }
        }
      }

      // Sort by confidence (highest first)
      matches.sort((a, b) => b.confidence - a.confidence)

      return matches
    } catch (error) {
      console.error('Error finding matching faces:', error)
      return []
    }
  }

  /**
   * Convert File to HTMLImageElement
   */
  private fileToImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Extract face embeddings from image data URL
   */
  async extractEmbeddingsFromDataUrl(
    dataUrl: string
  ): Promise<DetectedFace[]> {
    try {
      await this.loadModels()

      const img = new Image()
      img.src = dataUrl

      return new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            const detections = await faceapi
              .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
              .withFaceLandmarks()
              .withFaceDescriptors()

            const detectedFaces: DetectedFace[] = detections.map(
              (detection) => ({
                embeddings: Array.from(detection.descriptor),
                landmarks: {
                  detection: detection.detection,
                  landmarks: detection.landmarks,
                },
              })
            )

            resolve(detectedFaces)
          } catch (error) {
            reject(error)
          }
        }
        img.onerror = reject
      })
    } catch (error) {
      console.error('Error extracting embeddings:', error)
      throw error
    }
  }
}

export const faceDetectionService = new FaceDetectionService()
