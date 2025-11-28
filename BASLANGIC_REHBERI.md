# Event Photos - Başlangıç Rehberi

## Proje Nedir?

Event Photos, etkinlik fotoğraflarını kişi bazlı ayırmanızı ve yüz tanıma teknolojisi sayesinde kişilerin kendilerine ait fotoğraflarına erişmelerini sağlayan bir web uygulamasıdır.

### Senaryo

1. **Etkinlik Yöneticisi** (siz) bir etkinlik oluşturursunuz
2. Uygulamada **QR kod** veya **paylaşım linki** otomatik oluşturulur
3. **Katılımcılar** linki tıklayarak veya QR kodu tarayarak katılırlar
4. Katılımcılar **kendi yüzlerinin fotoğrafını** yüklerler
5. Tüm katılımcılar yüzlerini yükledikten sonra **tarama işlemi** başlar
6. Yüz tanıma teknolojisi tüm etkinlik fotoğraflarını tarar
7. **Kendi fotoğraflarını** otomatik olarak bulur ve erişim sağlar

## Kurulum

### Gereksinimler
- Node.js 16 veya üzeri
- npm veya yarn
- Modern web tarayıcı (Chrome, Firefox, Edge)

### Adım Adım Kurulum

```bash
# 1. Proje dizinine gidin
cd face-test-claudie

# 2. Dependencies yükleyin
npm install

# 3. Environment dosyasını oluşturun
cp .env.example .env

# 4. Development server'ı başlatın
npm run dev
```

Server `http://localhost:5173` adresinde başlayacak.

## Kullanım

### 1. Giriş Yapın
- Homepage'de "Google ile Giriş Yap" butonuna tıklayın
- Gmail hesabınızla oturum açın
- Ad-soyadınızı girin ve kayıt olun

### 2. Paket Seçin
- Ana sayfada "Paket Yükselt" bölümüne gidin
- **Ücretsiz**: 3 fotoğrafta 1 kişi taraması
- **Premium**: 500 fotoğraf, sınırsız tarama

### 3. Etkinlik Oluşturun
- "Yeni Etkinlik Oluştur" butonuna tıklayın
- Etkinlik adı ve açıklamasını girin
- "Etkinliği Oluştur" butonuna tıklayın

### 4. Katılımcılarla Paylaşın
- Etkinlik detay sayfasında **QR kodu** veya **paylaşım linkini** görürsünüz
- Katılımcılarınıza kopyalayıp gönderin
- Katılımcılar tarafından taranan QR kod otomatik açılır

### 5. Fotoğraf Yükleme
- Katılımcılar linke tıklayınca giriş sayfası açılır
- Etkinliğe katılmak isteyip istemedikleri sorulur
- "Evet" derse kayıt olur veya giriş yapar
- Kendi yüzlerinin net fotoğrafını yüklerler

### 6. Yüz Taraması
- Tüm katılımcılar fotoğraf yükledikten sonra etkinlik yöneticisi "Tara" butonuna basar
- Sistem tüm etkinlik fotoğraflarında yüzleri arar
- Eşleşenleri bulur ve listeler

### 7. Sonuçları Görüntüle
- Katılımcılar kendilerine ait fotoğrafları görebilirler
- İndirebilir veya sosyal medyada paylaşabilirler

## Proje Yapısı

```
src/
├── app/          # Ana uygulama ve routing
├── pages/        # Sayfa componentleri
├── features/     # Feature'a özel kodlar
│   ├── auth/     # Kimlik doğrulama
│   ├── events/   # Etkinlik yönetimi
│   ├── payment/  # Ödeme sistemi
│   └── faceDetection/ # Yüz tanıma
└── shared/       # Paylaşılan kodlar
    ├── components/  # Reusable components
    ├── services/    # API ve storage
    ├── config/      # Konfigürasyon
    └── styles/      # Global stiller
```

## Önemli Sayfalar

| Sayfalar | URL | Açıklama |
|----------|-----|----------|
| Giriş | `/auth/login` | Google OAuth giriş |
| Ana Sayfa | `/` | Dashboard ve özet |
| Fiyatlandırma | `/pricing` | Paket seçim |
| Etkinlik Oluştur | `/events/create` | Yeni etkinlik |
| Etkinlik Detay | `/events/:id` | Etkinlik yönetimi |

## API Endpoints

### Kimlik Doğrulama
- `POST /auth/google` - Google giriş
- `POST /auth/signup` - Kayıt
- `GET /auth/me` - Mevcut kullanıcı

### Etkinlikler
- `POST /events` - Etkinlik oluştur
- `GET /events` - Etkinlik listesi
- `GET /events/:id` - Etkinlik detayı
- `POST /events/:id/photos` - Fotoğraf yükle
- `GET /events/:id/photos` - Fotoğraf listesi

### Yüz Tanıma
- `POST /face-detection/scan-event` - Etkinliği tara
- `POST /face-detection/match` - Yüz eşleştir

### Ödeme
- `POST /payments/initialize` - Ödeme başlat
- `POST /payments/confirm` - Ödeme onayla

## Konfigürasyon

### Environment Variables

`.env` dosyasında ayarlanacak:

```env
# API URL (Backend'in adresi)
VITE_API_URL=http://localhost:3000/api

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Paket Ayarları

`src/shared/config/index.ts`'de tanımlıdır:

```typescript
export const SUBSCRIPTION_PACKAGES = {
  FREE: {
    maxPhotos: 3,
    maxFacesPerScan: 1,
  },
  PREMIUM: {
    maxPhotos: 500,
    maxFacesPerScan: -1, // unlimited
  },
}
```

## Geliştirme

### Komutlar

```bash
# Dev server
npm run dev

# Build
npm run build

# Preview
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Dosya Ekleme Rehberi

1. **Type Eklemek**
   ```typescript
   // src/features/myfeature/types/MyType.ts
   export interface MyType {
     id: string
     name: string
   }
   ```

2. **Service Eklemek**
   ```typescript
   // src/features/myfeature/services/myService.ts
   export class MyService {
     async doSomething() { }
   }
   export const myService = new MyService()
   ```

3. **Hook Eklemek**
   ```typescript
   // src/features/myfeature/hooks/useMyFeature.ts
   export function useMyFeature() {
     const [state, setState] = useState()
     return { state }
   }
   ```

4. **Component Eklemek**
   ```typescript
   // src/features/myfeature/components/MyComponent.tsx
   export function MyComponent() {
     return <div>Component</div>
   }
   ```

## Sık Sorulan Sorular

**S: Google OAuth nasıl ayarlanır?**
A: Google Cloud Console'dan OAuth 2.0 Client ID oluşturun ve VITE_GOOGLE_CLIENT_ID'ye yapıştırın.

**S: Yüz tanıma nasıl çalışır?**
A: Face-api.js kullanarak browser'da yüzler tespit edilir ve JavaScript ile karşılaştırılır.

**S: Backend'e bağlanmak için ne yapmalıyım?**
A: Uygulamanın API endpoints'lerini backend'inize bağlayın ve VITE_API_URL'yi güncelleyin.

**S: Veri nereye kaydediliyor?**
A: localStorage'a token ve kullanıcı bilgisi, backend'e fotoğraflar ve yüz encodings.

## Destek

Sorular veya problemler için lütfen:
1. PROJE_REHBERI.md'yi okuyun
2. GELISTIRME_NOTLARI.md'ye bakın
3. Issue oluşturun

## Lisans

MIT License - Özgürce kullanabilirsiniz.

---

**Happy Coding! 🚀**
