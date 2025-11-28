# Event Photos - Etkinlik Fotoğraf Yönetim Uygulaması

Etkinlik fotoğraflarını kişi bazlı ayırmak ve yüz tanıma teknolojisi ile bulmak için tasarlanmış modern bir web uygulaması.

## Proje Özellikleri

### Ana Özellikler
- **Gmail Entegrasyonu**: Google OAuth ile kimlik doğrulama
- **Etkinlik Yönetimi**: Etkinlik oluşturma ve yönetim
- **QR Kod Paylaşım**: Katılımcılarla QR kod ve link paylaşma
- **Yüz Tanıma**: Face API.js kullanarak yüz tespiti ve eşleştirmesi
- **Ödeme Sistemi**: İki aşamalı paket sistemi (Ücretsiz ve Premium)
- **Fotoğraf Yönetimi**: Fotoğraf yükleme ve depolama

### Paket Özellikleri

#### Ücretsiz Paket
- 3 toplu fotoğrafta 1 kişiyi arama
- Sınırlı etkinlik sayısı
- Temel özelliklere erişim

#### Premium Paket (₺9.99/ay)
- 500 fotoğraf yükleme kapasitesi
- Sınırsız yüz taraması
- Sınırsız etkinlik oluşturma
- Avantajlı QR kod paylaşım

## Teknoloji Stack

### Frontend
- **React 18**: UI framework
- **TypeScript**: Strict mode ile type-safe development
- **Vite**: Build tool ve development server
- **React Router v6**: Routing ve navigasyon
- **Zustand**: Global state management
- **Tailwind CSS**: Styling
- **Axios**: HTTP client
- **Zod**: Schema validation
- **React Hook Form**: Form management
- **React Hot Toast**: Notification system
- **Lucide React**: Icon library
- **QRCode.React**: QR kod oluşturma
- **Face API.js**: Yüz tanıma

### Backend (Simüle Edilmiş)
- Node.js / Express (planlanmış)
- PostgreSQL (planlanmış)

## Klasör Yapısı

```
src/
├── app/                          # Application root
│   ├── App.tsx                  # Main app component with routing
│   ├── main.tsx                 # Entry point
│   └── providers/               # Global providers
│
├── pages/                       # Page components (route-based)
│   ├── HomePage/
│   │   ├── HomePage.tsx
│   │   └── index.ts
│   ├── EventDetailPage/
│   │   ├── EventDetailPage.tsx
│   │   └── index.ts
│   ├── CreateEventPage/
│   │   ├── CreateEventPage.tsx
│   │   └── index.ts
│   └── PricingPage/
│       ├── PricingPage.tsx
│       └── index.ts
│
├── features/                    # Feature-based modules
│   ├── auth/                   # Authentication feature
│   │   ├── types/              # User, AuthTokens, etc.
│   │   ├── services/           # authService
│   │   ├── hooks/              # useAuth, useLogin, useSignup, etc.
│   │   ├── store/              # authStore (Zustand)
│   │   └── components/         # LoginPage, GoogleSignupForm
│   │
│   ├── events/                 # Event management feature
│   │   ├── types/              # Event, EventPhoto, FaceMatch
│   │   ├── services/           # eventService
│   │   ├── hooks/              # useCreateEvent, useEventPhotos
│   │   ├── store/              # eventStore
│   │   ├── components/         # Reusable components
│   │   └── containers/         # Smart components
│   │
│   ├── payment/                # Payment & subscription feature
│   │   ├── types/              # Package, Payment
│   │   ├── services/           # paymentService
│   │   ├── hooks/              # usePayment
│   │   └── components/         # Payment-related components
│   │
│   └── faceDetection/          # Face detection & matching feature
│       ├── types/              # FaceDetectionResult, ScanResult
│       ├── services/           # faceDetectionService
│       ├── hooks/              # useFaceDetection
│       └── components/         # Face detection UI components
│
├── shared/                     # Shared across features
│   ├── components/             # Reusable UI components
│   │   ├── PageLayout.tsx
│   │   └── Header.tsx
│   │
│   ├── hooks/                  # Generic, framework-agnostic hooks
│   │   └── (custom hooks)
│   │
│   ├── services/               # Core services
│   │   ├── apiClient.ts        # API client with interceptors
│   │   └── storageClient.ts    # Storage abstraction
│   │
│   ├── config/                 # Configuration
│   │   └── index.ts            # App config, package configs
│   │
│   ├── store/                  # Global stores
│   │   └── (Zustand stores)
│   │
│   ├── types/                  # Global types
│   │   └── index.ts
│   │
│   └── styles/                 # Global styles
│       └── globals.css
│
├── assets/                     # Static assets
│   ├── images/
│   └── icons/
│
└── types/                      # Project-level type definitions
    └── (if needed)
```

## Temel Akışlar

### 1. Kimlik Doğrulama Akışı
```
User → Google Login Button
  ↓
googleLogin() hook çağrılır
  ↓
authService.loginWithGoogle(token)
  ↓
Token ve User localStorage'a kaydedilir
  ↓
authStore update edilir
  ↓
User HomePage'ye yönlendirilir
```

### 2. Etkinlik Oluşturma Akışı
```
User → Create Event Form
  ↓
Form validation (Zod/React Hook Form)
  ↓
useCreateEvent() hook çağrılır
  ↓
eventService.createEvent(title, description)
  ↓
API isteği gönderilir
  ↓
Event oluşturulur, QR kod ve link oluşturulur
  ↓
User → Event Detail Page
```

### 3. Etkinliğe Katılım Akışı
```
Participant → QR Code Scans / Link Clicks
  ↓
joinEventByLink() service çağrılır
  ↓
Event katılımcı listesine eklenir
  ↓
Participant → Photo Upload Page
  ↓
Kendi yüzünün fotoğrafını yükler
  ↓
Face encoding oluşturulur ve saklanır
```

### 4. Yüz Taraması Akışı
```
Event → All Photos Uploaded
  ↓
User → Scan for My Face Button
  ↓
useFaceDetection() hook çağrılır
  ↓
Face API.js tüm fotoları analiz eder
  ↓
User's face encoding tüm foto setinde aranır
  ↓
Matches bulunur ve görüntülenir
  ↓
User → Personal Photo Gallery
```

## Veri Modelleri

### User (Authentication)
```typescript
{
  id: string
  email: string
  name: string
  avatar?: string
  subscription: 'free' | 'premium'
  photoCount: number
  maxPhotos: number
  createdAt: string
  updatedAt: string
}
```

### Event
```typescript
{
  id: string
  title: string
  description: string
  organizerId: string
  status: 'draft' | 'active' | 'completed'
  shareLink: string
  qrCode: string
  participants: string[]
  photoIds: string[]
  createdAt: string
  updatedAt: string
}
```

### EventPhoto
```typescript
{
  id: string
  eventId: string
  userId: string
  uploadedBy: string
  url: string
  fileName: string
  size: number
  uploadedAt: string
}
```

## Kurallar ve Best Practices

### 1. Dosya Organizasyonu
- Her feature kendi klasöründe bulunur
- `types/` altında tüm type definitionları
- `services/` altında API/storage işlemleri
- `hooks/` altında business logic
- `components/` altında dumb UI components
- `containers/` altında smart components

### 2. Naming Conventions
- Hook'lar `use` ile başlar: `useAuth`, `useCreateEvent`
- Component'ler PascalCase: `LoginForm`, `EventCard`
- Service'ler camelCase: `authService`, `eventService`
- Store'lar camelCase: `authStore`, `eventStore`

### 3. Component Size
- UI components: max 50 lines
- Business logic functions: max 30 lines
- Strict mode açık, tüm warnings giderilmiş

### 4. Type Safety
- Tüm fonksiyonlarda açık return types
- Request/response types tanımlanmış
- Magic strings/numbers kullanılmıyor

### 5. API Communication
- Tüm HTTP istekleri `apiClient` üzerinden
- `axios` interceptors ile token yönetimi
- Error handling ve logging
- Type-safe responses

### 6. State Management
- Local state: `useState` ile
- Feature state: Zustand stores
- Global state: `shared/store/` altında

## Kurulum ve Çalıştırma

### Prerequisites
- Node.js 16+
- npm veya yarn

### Adımlar

```bash
# Dependencies yükleme
npm install

# Environment variables oluşturma
cp .env.example .env
# .env dosyasını düzenleyin

# Development server başlatma
npm run dev

# Build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
```

## API Endpoints (Planlanmış)

### Authentication
- `POST /auth/google` - Google OAuth ile giriş
- `POST /auth/signup` - Yeni kullanıcı kaydı
- `GET /auth/me` - Mevcut kullanıcı bilgisi
- `POST /auth/logout` - Çıkış

### Events
- `POST /events` - Etkinlik oluştur
- `GET /events` - Kullanıcının etkinliklerini listele
- `GET /events/:id` - Etkinlik detayları
- `PUT /events/:id` - Etkinliği güncelle
- `DELETE /events/:id` - Etkinliği sil
- `POST /events/:id/photos` - Fotoğraf yükle
- `GET /events/:id/photos` - Etkinliğin fotoğraflarını listele
- `POST /events/join` - Etkinliğe katıl

### Face Detection
- `POST /face-detection/detect` - Fotoğrafta yüz tespit et
- `POST /face-detection/scan-event` - Etkinlik fotoğraflarını tara
- `POST /face-detection/match` - Yüz eşleştirme

### Payments
- `POST /payments/initialize` - Ödeme başlat
- `POST /payments/confirm` - Ödeme onayla
- `GET /payments/history` - Ödeme geçmişi

## Testing

```bash
# Tests çalıştır
npm run test

# Coverage raporu
npm run test:coverage
```

## Katkı Rehberi

1. Feature'ı kendi branch'inde geliştir
2. README kurallarına uyun
3. Type safety kontrol et
4. Component boyutları kontrol et
5. PR açmadan önce build et

## Lisans

MIT
