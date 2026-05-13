import React, { useRef, useState, useEffect } from 'react'
import { Camera, RotateCcw, Upload, X } from 'lucide-react'

interface PhotoCaptureProps {
  onPhotoCapture?: (file: File) => void
  onPhotoUpload?: (file: File) => void
  maxPhotos?: number
  currentPhotoCount?: number
}

export const PhotoCapture: React.FC<PhotoCaptureProps> = ({
  onPhotoCapture,
  onPhotoUpload,
  maxPhotos = 5,
  currentPhotoCount = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isCameraActive, setIsCameraActive] = useState(false)
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoadingCamera, setIsLoadingCamera] = useState(false)

  // Start camera
  const startCamera = async () => {
    setIsLoadingCamera(true)
    setErrorMessage(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (error) {
      console.error('Camera access error:', error)
      setErrorMessage(
        'Kamera erişimi reddedildi. Lütfen tarayıcı izinlerini kontrol edin.'
      )
    } finally {
      setIsLoadingCamera(false)
    }
  }

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      setIsCameraActive(false)
    }
  }

  // Capture photo from video
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        
        const photoDataUrl = canvasRef.current.toDataURL('image/jpeg')
        setCapturedPhoto(photoDataUrl)
        stopCamera()
      }
    }
  }

  // Reset captured photo
  const resetPhoto = () => {
    setCapturedPhoto(null)
    setErrorMessage(null)
  }

  // Send captured photo
  const sendCapturedPhoto = async () => {
    if (capturedPhoto && canvasRef.current) {
      try {
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo_${Date.now()}.jpg`, {
              type: 'image/jpeg',
            })
            onPhotoCapture?.(file)
            resetPhoto()
          }
        }, 'image/jpeg', 0.9)
      } catch (error) {
        console.error('Error sending photo:', error)
        setErrorMessage('Fotoğraf gönderilemedi')
      }
    }
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type - only JPEG/JPG allowed
      const allowedTypes = ['image/jpeg']
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage('Sadece JPEG/JPG dosyaları yüklenebilir. Lütfen geçerli bir dosya seçin.')
        return
      }

      // Validate file extension
      const fileName = file.name.toLowerCase()
      if (!fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg')) {
        setErrorMessage('Sadece .jpg ve .jpeg uzantılı dosyalar desteklenir.')
        return
      }

      // Validate quota
      if (currentPhotoCount >= maxPhotos) {
        setErrorMessage(
          `Fotoğraf limitine ulaştınız (${currentPhotoCount}/${maxPhotos}). Daha fazla fotoğraf yüklemek için paketinizi yükseltin.`
        )
        return
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Dosya boyutu çok büyük (max 10MB)')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedPhoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Send to parent
      onPhotoUpload?.(file)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          📸 Fotoğraf Çek
        </h3>
        <div className="text-sm text-gray-600">
          <span className="font-semibold">{currentPhotoCount}</span>/{maxPhotos} fotoğraf
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}

      {/* Camera View */}
      {isCameraActive && !capturedPhoto && (
        <div className="mb-4">
          <div className="relative bg-black rounded-lg overflow-hidden mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-auto"
            />
            {/* Focus circle indicator */}
            <div className="absolute inset-0 border-4 border-blue-500 rounded-lg opacity-30 pointer-events-none" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={capturePhoto}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Camera className="w-5 h-5" />
              Fotoğrafı Çek
            </button>
            <button
              onClick={stopCamera}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <X className="w-5 h-5" />
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Captured Photo Preview */}
      {capturedPhoto && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Çekilen Fotoğraf:</p>
          <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4">
            <img src={capturedPhoto} alt="Captured" className="w-full h-auto" />
          </div>

          <div className="flex gap-2">
            <button
              onClick={sendCapturedPhoto}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Gönder
            </button>
            <button
              onClick={resetPhoto}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Tekrar Çek
            </button>
          </div>
        </div>
      )}

      {/* Camera Controls */}
      {!isCameraActive && !capturedPhoto && (
        <div className="space-y-3">
          <button
            onClick={startCamera}
            disabled={isLoadingCamera}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Camera className="w-5 h-5" />
            {isLoadingCamera ? 'Kamera Açılıyor...' : 'Kamerayı Aç'}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">veya</span>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Upload className="w-5 h-5" />
            Dosyadan Yükle
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,image/jpeg"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>
      )}

      {/* Hidden Canvas for Image Processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
