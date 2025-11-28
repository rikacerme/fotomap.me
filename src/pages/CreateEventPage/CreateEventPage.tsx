import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '@/shared/components/PageLayout'
import { useCreateEvent } from '@/features/events/hooks/useEvents'
import toast from 'react-hot-toast'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'

export function CreateEventPage() {
  const navigate = useNavigate()
  const { user } = useCurrentUser()
  const { createEvent, isLoading, error } = useCreateEvent()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error('Etkinlik adı gereklidir')
      return
    }

    // Check free plan limit (max 1 event)
    if (user?.subscription === 'free') {
      try {
        const userEvents = await (await import('@/features/events/services/eventService')).eventService.getUserEvents()
        if (userEvents.length >= 1) {
          toast.error('Ücretsiz pakette sadece 1 etkinlik oluşturabilirsiniz. Daha fazla etkinlik için Premium\'a yükseltin.')
          navigate('/pricing')
          return
        }
      } catch (err) {
        console.error('Error checking event limit:', err)
      }
    }

    const event = await createEvent(formData.title, formData.description)
    if (event) {
      toast.success('Etkinlik başarıyla oluşturuldu!')
      navigate(`/events/${event.id}`)
    } else {
      toast.error(error || 'Etkinlik oluştururken hata oluştu')
    }
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Yeni Etkinlik Oluştur</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Etkinlik Adı *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="örn: İzmir Yazılım Konferansı 2024"
              className="input-field"
              required
            />
          </div>

          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Etkinlik hakkında kısa bir açıklama..."
              rows={5}
              className="input-field"
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-danger-50 border border-danger-200 text-danger-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? 'Oluşturuluyor...' : 'Etkinliği Oluştur'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary flex-1"
            >
              İptal
            </button>
          </div>
        </form>

        <div className="mt-8 bg-blue-50 border-l-4 border-primary-600 p-6 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            Etkinlik Oluşturduktan Sonra
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✓ QR kod ve paylaşım linki otomatik oluşturulacak</li>
            <li>✓ Katılımcılarınızla QR kodu veya linki paylaşabilirsiniz</li>
            <li>✓ Katılımcılar yüzlerini fotoğrafladıktan sonra yüz tanıması yapılacak</li>
            <li>✓ Tüm fotoğrafları taradıktan sonra kendi fotoğraflarınıza erişim sağlayacaksınız</li>
          </ul>
        </div>
      </div>
    </PageLayout>
  )
}
