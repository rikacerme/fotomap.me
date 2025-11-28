import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SUBSCRIPTION_PACKAGES } from '@/shared/config'
import { PageLayout } from '@/shared/components/PageLayout'
import { Check, Zap } from 'lucide-react'
import { usePayment } from '@/features/payment/hooks/usePayment'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'

export function PricingPage() {
  const navigate = useNavigate()
  const { user } = useCurrentUser()
  const { initializePayment, isLoading } = usePayment()

  const handleSelectPackage = async (packageId: string) => {
    if (packageId === 'free') {
      navigate('/')
      return
    }

    const result = await initializePayment(packageId)
    if (result) {
      navigate(`/payment/checkout?intentId=${result.id}`)
    }
  }

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fiyatlandırma Planları
          </h1>
          <p className="text-lg text-gray-600">
            İhtiyacınıza uygun paket seçin ve etkinlik fotoğraflarınızı yönetin
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.values(SUBSCRIPTION_PACKAGES).map((pkg) => (
            <div
              key={pkg.id}
              className={`rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ${
                user?.subscription === pkg.id
                  ? 'ring-2 ring-primary-600 transform scale-105'
                  : ''
              }`}
            >
              <div className={`p-8 ${pkg.id === 'premium' ? 'bg-gradient-to-br from-primary-600 to-blue-600 text-white' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{pkg.name}</h2>
                  {pkg.id === 'premium' && (
                    <span className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-semibold rounded-full">
                      <Zap className="w-3 h-3" />
                      Popüler
                    </span>
                  )}
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-bold">
                    ₺{pkg.price}
                  </span>
                  {pkg.price > 0 && (
                    <span className={`text-sm ml-2 ${pkg.id === 'premium' ? 'text-gray-200' : 'text-gray-600'}`}>
                      /ay
                    </span>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <Check className="w-5 h-5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPackage(pkg.id)}
                  disabled={isLoading || user?.subscription === pkg.id}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    pkg.id === 'premium'
                      ? 'bg-white text-primary-600 hover:bg-gray-100'
                      : user?.subscription === pkg.id
                        ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {user?.subscription === pkg.id
                    ? 'Aktif Plan'
                    : isLoading
                      ? 'İşlem yapılıyor...'
                      : 'Seç'}
                </button>
              </div>

              <div className={`p-6 ${pkg.id === 'premium' ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <p className="text-sm font-semibold mb-4">Özellikler:</p>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <strong>Max Fotoğraf:</strong> {pkg.maxPhotos}
                  </p>
                  <p className="text-gray-700">
                    <strong>Yüz Taraması:</strong>{' '}
                    {pkg.maxFacesPerScan === -1
                      ? 'Sınırsız'
                      : `${pkg.maxFacesPerScan} kişi`}
                  </p>
                  <p className="text-gray-700">
                    <strong>Etkinlikler:</strong>{' '}
                    {pkg.maxEvents === -1 ? 'Sınırsız' : pkg.maxEvents}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 border-l-4 border-primary-600 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Paket Değişikliği
          </h3>
          <p className="text-gray-700">
            Herhangi bir zamanda paketinizi yükseltebilir veya düşürebilirsiniz. Ödediğiniz tutar
            hesaplamaya katılacaktır.
          </p>
        </div>
      </div>
    </PageLayout>
  )
}
