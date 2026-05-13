import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetEvent } from '@/features/events/hooks/useEvents'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'
import { PageLayout } from '@/shared/components/PageLayout'
import { PhotoCapture } from '@/shared/components/PhotoCapture'
import { eventService } from '@/features/events/services/eventService'
import { Event } from '@/features/events/types'
import QRCode from 'qrcode.react'
import { Copy, Check, AlertCircle, Loader, Upload } from 'lucide-react'
import toast from 'react-hot-toast'

export function EventDetailPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { user: currentUser } = useCurrentUser()
  const { event: hookedEvent } = useGetEvent(eventId || '')
  const [event, setEvent] = useState<Event | null>(hookedEvent || null)
  const [isLoadingEvent, setIsLoadingEvent] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [showPhotoCapture, setShowPhotoCapture] = useState(false)
  const [showJoinConfirm, setShowJoinConfirm] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isUserOrganizer, setIsUserOrganizer] = useState(false)
  const [isUserParticipant, setIsUserParticipant] = useState(false)

  const updateRoleStatus = (eventData: Event | null, userId: string | undefined) => {
    if (!eventData || !userId) {
      setIsUserOrganizer(false)
      setIsUserParticipant(false)
      return
    }
    
    setIsUserOrganizer(eventData.organizerId === userId)
    setIsUserParticipant(eventData.participants.includes(userId) && eventData.organizerId !== userId)
  }

  const handleJoinEvent = async () => {
    if (!event || !currentUser?.id) return
    
    setIsJoining(true)
    try {
      await eventService.addEventParticipant(event.id, currentUser.id)
      
      const updatedEvent = { ...event, participants: [...event.participants, currentUser.id] }
      setEvent(updatedEvent)
      updateRoleStatus(updatedEvent, currentUser.id)
      
      toast.success('Etkinliğe katıldınız!')
      setShowJoinConfirm(false)
    } catch (error) {
      console.error('Error joining event:', error)
      toast.error('Etkinliğe katılırken hata oluştu')
    } finally {
      setIsJoining(false)
    }
  }

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoadingEvent(true)
      try {
        if (eventId) {
          if (hookedEvent) {
            setEvent(hookedEvent)
            updateRoleStatus(hookedEvent, currentUser?.id)
          } else {
            const fetchedEvent = await eventService.getEvent(eventId)
            setEvent(fetchedEvent)
            updateRoleStatus(fetchedEvent, currentUser?.id)

            if (window.location.pathname.includes('/share/')) {
              const isAlreadyParticipant = fetchedEvent?.participants.includes(currentUser?.id || '')
              if (!isAlreadyParticipant) {
                setShowJoinConfirm(true)
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading event:', error)
        setIsOfflineMode(true)
        const placeholderEvent: Event = {
          id: eventId || 'unknown',
          title: 'Etkinlik Yükleniyor...',
          description: 'Bu etkinlik şu anda yüklenmemiş. İnternet bağlantınızı kontrol edin.',
          organizerId: 'unknown',
          createdBy: { id: 'unknown', name: 'Unknown', email: 'unknown@example.com' },
          status: 'draft',
          shareLink: window.location.href,
          qrCode: '',
          participants: [],
          photoIds: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setEvent(placeholderEvent)
        updateRoleStatus(placeholderEvent, currentUser?.id)
      } finally {
        setIsLoadingEvent(false)
      }
    }

    fetchEvent()
  }, [eventId, hookedEvent, currentUser?.id])

  const handleCopyLink = () => {
    if (event?.shareLink) {
      navigator.clipboard.writeText(event.shareLink)
      setCopied(true)
      toast.success('Link kopyalandı!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handlePhotoCapture = async (file: File) => {
    if (!event) return

    try {
      // Simply upload the photo without face detection
      const uploadedPhoto = await eventService.uploadPhoto(event.id, file)
      
      // Update local event state with new photo
      const updatedEvent = { ...event, photoIds: [...event.photoIds, uploadedPhoto.id] }
      setEvent(updatedEvent)
      
      toast.success('Fotoğraf başarıyla yüklendi!')
      setShowPhotoCapture(false)
    } catch (error) {
      console.error('Error uploading photo:', error)
      toast.error('Fotoğraf yüklenirken hata oluştu')
    }
  }

  if (isLoadingEvent) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </PageLayout>
    )
  }

  if (!event) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-warning-600 mx-auto mb-4" />
          <p className="text-warning-600 font-semibold">Etkinlik şu anda yüklenemedi</p>
          <p className="text-gray-600 text-sm mt-2">
            İnternet bağlantısını kontrol edin ve sayfayı yenileyin
          </p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      {/* Join Confirmation Dialog */}
      {showJoinConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Etkinliğe Katıl?
            </h3>
            <p className="text-gray-600 mb-6">
              <span className="font-semibold text-gray-900">{event.title}</span> etkinliğine katılmak istiyor musunuz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowJoinConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Hayır
              </button>
              <button
                onClick={handleJoinEvent}
                disabled={isJoining}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
              >
                {isJoining ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Katılıyor...
                  </>
                ) : (
                  'Evet'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Offline mode warning */}
        {isOfflineMode && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-semibold">Çevrimdışı Mod</p>
              <p className="text-yellow-700 text-sm mt-1">
                Etkinlik yerel cihazdan gösteriliyor. Etkinlik detayları tam olmayabilir.
              </p>
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-6">{event.title}</h1>

        {/* Photo Capture Button - Show for everyone who has joined */}
        {(isUserOrganizer || isUserParticipant) && (
          <div className="mb-8">
            <button
              onClick={() => setShowPhotoCapture(!showPhotoCapture)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Fotoğraf Yükle
            </button>
          </div>
        )}

        {/* Organizer Controls Section */}
        {isUserOrganizer && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* QR Code */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">QR Kod</h2>
              <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                {event.shareLink ? (
                  <QRCode value={event.shareLink} size={256} level="H" />
                ) : (
                  <div className="w-64 h-64 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500">QR Kod</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 text-center mt-4">
                Katılımcılarınızla bu QR kodu paylaşın
              </p>
            </div>

            {/* Share Link */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Paylaşım Linki</h2>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={event.shareLink}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Katılımcılarınızı bu link ile davet edin
              </p>
            </div>
          </div>
        )}

        {/* Photo Capture Component */}
        {showPhotoCapture && (
          <div className="mb-8">
            <PhotoCapture
              onPhotoCapture={handlePhotoCapture}
              onPhotoUpload={handlePhotoCapture}
            />
          </div>
        )}

        {/* Event Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Etkinlik Bilgileri</h2>
          <p className="text-gray-700 mb-4">{event.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Durum</p>
              <p className="font-semibold text-gray-900 capitalize">{event.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Katılımcı Sayısı</p>
              <p className="font-semibold text-gray-900">{event.participants.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fotoğraf Sayısı</p>
              <p className="font-semibold text-gray-900">{event.photoIds.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Oluşturma Tarihi</p>
              <p className="font-semibold text-gray-900">
                {new Date(event.createdAt).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
