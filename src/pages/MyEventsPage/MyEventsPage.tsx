import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '@/shared/components/PageLayout'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'
import { eventService } from '@/features/events/services/eventService'
import { Event } from '@/features/events/types'
import { Edit2, Trash2, Plus, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

export function MyEventsPage() {
  const navigate = useNavigate()
  const { user } = useCurrentUser()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadMyEvents()
    // Reload events every time page comes to focus
    window.addEventListener('focus', loadMyEvents)
    return () => window.removeEventListener('focus', loadMyEvents)
  }, [])

  const loadMyEvents = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const userEvents = await eventService.getUserEvents()
      console.log('Loaded events:', userEvents)
      setEvents(userEvents)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Etkinlikler yüklenemedi'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await eventService.deleteEvent(eventId)
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
      setShowDeleteConfirm(null)
      toast.success('Etkinlik başarıyla silindi')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Silme işlemi başarısız'
      toast.error(errorMessage)
    }
  }

  const getEventStatus = (event: Event) => {
    switch (event.status) {
      case 'draft':
        return { text: 'Taslak', color: 'gray' }
      case 'active':
        return { text: 'Aktif', color: 'green' }
      case 'completed':
        return { text: 'Tamamlandı', color: 'blue' }
      default:
        return { text: 'Bilinmiyor', color: 'gray' }
    }
  }

  const maxEvents = user?.subscription === 'free' ? 1 : 999

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-600">Etkinlikler yükleniyor...</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Etkinliklerim</h1>
            <p className="text-gray-600 mt-2">
              Toplamda {events.length} / {maxEvents} etkinlik
            </p>
          </div>
          <button
            onClick={() => navigate('/events/create')}
            disabled={events.length >= maxEvents}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Yeni Etkinlik
          </button>
        </div>

        {/* Free Plan Warning */}
        {user?.subscription === 'free' && events.length >= maxEvents && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              💡 Ücretsiz planda sadece 1 etkinlik oluşturabilirsiniz. Daha fazla etkinlik için{' '}
              <button
                onClick={() => navigate('/pricing')}
                className="font-semibold text-yellow-900 hover:underline"
              >
                Premium'a yükseltin
              </button>
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {events.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-gray-500 mb-4">
              <Eye className="w-16 h-16 mx-auto opacity-30" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Etkinliğiniz yok</h3>
            <p className="text-gray-600 mb-6">
              Fotoğraflarınızı paylaşmaya başlamak için ilk etkinliğinizi oluşturun
            </p>
            <button
              onClick={() => navigate('/events/create')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Yeni Etkinlik Oluştur
            </button>
          </div>
        )}

        {/* Events Grid */}
        {events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const status = getEventStatus(event)
              const statusColors = {
                gray: 'bg-gray-100 text-gray-800',
                green: 'bg-green-100 text-green-800',
                blue: 'bg-blue-100 text-blue-800',
              }

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-primary-50 to-blue-50 p-6 border-b">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1 pr-2">
                        {event.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusColors[status.color as keyof typeof statusColors]}`}>
                        {status.text}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {/* Event Details */}
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Katılımcılar</p>
                        <p className="text-gray-900 font-medium">{event.participants.length} kişi</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Fotoğraflar</p>
                        <p className="text-gray-900 font-medium">{event.photoIds.length} foto</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wide">Oluşturma Tarihi</p>
                        <p className="text-gray-900 font-medium">
                          {new Date(event.createdAt).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    </div>

                    {/* Share Link Preview */}
                    {event.shareLink && (
                      <div className="bg-gray-50 rounded p-3 text-xs">
                        <p className="text-gray-500 mb-1">Paylaşım Linki</p>
                        <code className="text-gray-700 break-all">{event.shareLink}</code>
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t flex gap-3">
                    <button
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="flex-1 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Görüntüle
                    </button>

                    <button
                      onClick={() => setShowDeleteConfirm(event.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Delete Confirmation Modal */}
                  {showDeleteConfirm === event.id && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                      <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Etkinliği Sil?
                        </h3>
                        <p className="text-gray-600 mb-6">
                          "{event.title}" adlı etkinliği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            İptal
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
