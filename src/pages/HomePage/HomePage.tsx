import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'
import { PageLayout } from '@/shared/components/PageLayout'
import { Plus, Zap, Smile, Share2, Search } from 'lucide-react'

export function HomePage() {
  const { user, loadUser } = useCurrentUser()
  const navigate = useNavigate()

  useEffect(() => {
    loadUser()
  }, [loadUser])

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        {/* Hero Section - Visible to everyone */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Etkinlik Fotoğraflarınızı Kişi Bazlı Paylaşın
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Yüz tanıma teknolojisi ile etkinlik fotoğraflarından kendi yüzünü bulmayı ve QR kod ile paylaşımı kolaylaştırın
          </p>

          {!user ? (
            <button
              onClick={() => navigate('/auth/login')}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg"
            >
              Başlamak İçin Giriş Yap
            </button>
          ) : (
            <button
              onClick={() => navigate('/events/create')}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold text-lg"
            >
              Yeni Etkinlik Oluştur
            </button>
          )}
        </div>

        {/* Features Section - Visible to everyone */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Nasıl Çalışıyor?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Plus className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Etkinlik Oluştur</h3>
              <p className="text-gray-600">
                Etkinliğiniz için bir profil açın, başlık ve açıklamayı ekleyin. Sistem otomatik olarak bir QR kod oluşturacaktır.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">QR Kod ile Paylaş</h3>
              <p className="text-gray-600">
                Katılımcılarınızla QR kodu paylaşın. Onlar kodu taratarak fotoğrafları yükleyebilecekler.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Yüz Tanıma ile Bul</h3>
              <p className="text-gray-600">
                Katılımcılar yapay zeka tarafından kendi yüzlerini otomatik olarak bulup indirebilecekler.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section - Visible to everyone */}
        <div className="mb-16 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Avantajlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <Smile className="w-6 h-6 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Hızlı ve Kolay</h3>
                <p className="text-gray-600">Dakikalar içinde etkinlik oluşturun ve fotoğrafları paylaşmaya başlayın</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Search className="w-6 h-6 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Akıllı Arama</h3>
                <p className="text-gray-600">Yüz tanıma teknolojisi ile otomatik fotoğraf eşleştirmesi</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Share2 className="w-6 h-6 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Güvenli Paylaşım</h3>
                <p className="text-gray-600">QR kod aracılığıyla güvenli ve kontrollü paylaşım</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Zap className="w-6 h-6 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Her Zaman Erişim</h3>
                <p className="text-gray-600">Etkinlik süresi boyunca fotoğraflara erişim sağlanır</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Dashboard - Only visible if logged in */}
        {user && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Hoş geldiniz, {user.name}!
              </h2>
              <p className="text-gray-600">
                İşte sizin etkinlikleriniz ve paket bilginiz
              </p>
            </div>

            {user.subscription === 'free' && (
              <div className="mb-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-blue-900">
                  <span className="font-semibold">Şu anda ücretsiz paket kullanıyorsunuz.</span> Sınırsız etkinlik oluşturmak ve yüz taraması yapabilmek için{' '}
                  <button
                    onClick={() => navigate('/pricing')}
                    className="font-semibold underline hover:text-blue-700"
                  >
                    Premium'a yükseltim yapın
                  </button>
                  .
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Stats Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {user.photoCount}
                </div>
                <p className="text-gray-600 mb-4">
                  Yüklenmiş Fotoğraf / {user.maxPhotos}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(user.photoCount / user.maxPhotos) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Subscription Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Paketiniz</h3>
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full capitalize">
                    {user.subscription}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  {user.subscription === 'free'
                    ? 'Ücretsiz pakette sınırlı özelliklere erişim'
                    : 'Premium avantajlarından yararlanıyorsunuz'}
                </p>
                <button
                  onClick={() => navigate('/pricing')}
                  className="w-full px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  Paketleri Gör
                </button>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Plus className="w-6 h-6 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Hızlı İşlemler</h3>
                </div>
                <button
                  onClick={() => navigate('/events/create')}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mb-2"
                >
                  Yeni Etkinlik Oluştur
                </button>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
              <div className="flex items-start gap-4">
                <Zap className="w-8 h-8 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Etkinliğinizi Başlatın</h2>
                  <p className="mb-4">
                    Etkinliğiniz için bir QR kod oluşturun, katılımcılarınızla paylaşın ve onların çektiği fotoğraflardan kendi yüzlerini otomatik olarak bulmasını sağlayın.
                  </p>
                  <button
                    onClick={() => navigate('/events/create')}
                    className="px-6 py-2 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Hemen Başla
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </PageLayout>
  )
}
