# 🎉 Yüz Tanıma Etkinlik Uygulaması - Başlangıç Rehberi

Bu proje, React ve face-api.js kullanarak etkinlik fotoğraflarında yüz tanıma yapan bir uygulamadır.

## 🚀 Hızlı Başlangıç

### 1. Kurulum

```bash
# Tüm bağımlılıkları yükle
npm install

# Face-API modellerini indir ve konfigure et
npm run setup:face-api

# Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcı otomatik olarak `http://localhost:5173` adresinde açılacaktır.

### 2. İlk Kullanım

1. **Giriş Yapın**
   - Google, Apple veya E-posta ile giriş yapın
   - Firebase auth ile kimlik doğrulama yapılır

2. **Etkinlik Oluşturun**
   - "Yeni Etkinlik" butonuna tıklayın
   - Etkinlik adı ve açıklamasını yazın
   - Etkinlik oluşturulacak ve MyEventsPage'de görünecektir

3. **Paylaşım Linki Alın**
   - Etkinlik detay sayfasında QR kodu veya paylaşım linkini kopyalayın
   - Bu linki başkasının paylaşması için kullanabilirsiniz

4. **Fotoğraf Çek ve Yüz Ara**
   - Share linkten giriş yapan kişi "Fotoğraf Çek & Ara" butonuna tıklar
   - Kamerayı açmak için izin verir
   - Fotoğraf çeker (veya dosyadan yükler)
   - Sistem otomatik olarak:
     - Çekilen fotoğraftaki yüzleri algılar
     - Fotoğrafı etkinliğe ekler
     - Yüzü diğer etkinlik fotoğraflarında arar
     - Eşleşmeleri benzerlik skoruyla gösterir

## 📁 Proje Yapısı

```
src/
├── features/
│   ├── auth/              # Kimlik doğrulama (Firebase)
│   ├── events/            # Etkinlik yönetimi
│   │   ├── services/
│   │   │   └── eventService.ts       # localStorage tabanlı event CRUD
│   │   ├── hooks/
│   │   ├── types/
│   │   └── ...
│   └── faces/             # Yüz tanıma
│       ├── services/
│       │   └── faceDetectionService.ts  # face-api.js entegrasyonu
│       ├── hooks/
│       │   └── useFaceDetection.ts      # React hooks
│       └── ...
├── pages/
│   ├── EventDetailPage/   # Etkinlik detayları & yüz arama
│   ├── MyEventsPage/      # Kullanıcının etkinlikleri
│   ├── CreateEventPage/   # Yeni etkinlik oluşturma
│   └── ...
├── shared/
│   ├── components/
│   │   ├── PhotoCapture.tsx   # Kamera & dosya yükleme
│   │   └── ...
│   └── ...
└── ...

public/
└── models/                # Face-API.js modelleri
    ├── tiny_face_detector_model-weights_manifest.json
    ├── tiny_face_detector_model-weights_shard_1
    ├── face_landmark_68_model-weights_manifest.json
    └── ...
```

## 🔧 Temel Özellikler

### 1. Etkinlik Yönetimi
- ✅ Etkinlik oluştur/oku/güncelle/sil
- ✅ Katılımcıları yönet
- ✅ Fotoğraf yükle
- ✅ QR kod ile paylaş
- ✅ Share link ile çok cihazdan erişim

### 2. Yüz Tanıma
- ✅ Gerçek zamanlı yüz algılama (webcam)
- ✅ Face embeddings çıkarma (face-api.js)
- ✅ Yüz benzerliği karşılaştırması
- ✅ Etkinlik fotoğraflarında yüz arama
- ✅ Benzerlik skoru ile sonuçlar

### 3. Çevrimdışı Mod
- ✅ İnternet olmadan share linkler açılabilir
- ✅ Yerel cihazdan fotoğraf yükleme
- ✅ Benzerlik araması (eğer veriler yüklüyse)

## 📝 API ve Hooks

### EventService

```typescript
// Temel CRUD
eventService.createEvent(title, description)
eventService.getEvent(eventId)
eventService.getUserEvents()
eventService.updateEvent(eventId, data)
eventService.deleteEvent(eventId)

// Fotoğraf
eventService.uploadPhoto(eventId, file)
eventService.getEventPhotos(eventId)

// Paylaşım
eventService.getShareLink(eventId)
eventService.joinEventByLink(shareLink)

// Yüz embeddings
eventService.saveFaceEmbeddings(photoId, embeddings)
eventService.getFaceEmbeddings(photoId)
eventService.getEventFaceEmbeddings(eventId)
```

### Face Detection Service

```typescript
// Yüz algılama
faceDetectionService.detectFacesInImage(imageFile)

// Benzerlik karşılaştırması
faceDetectionService.compareFaceEmbeddings(emb1, emb2)

// Arama
faceDetectionService.findMatchingFaces(sourceEmb, photoEmbeddings, threshold)
```

### Hooks

```typescript
// Yüz algılama
const { detectFaces, isDetecting, detectionError } = useFaceDetection()

// Yüz arama
const { searchFaces, isSearching, searchError } = useFaceSearch()
```

## 🔐 Veri Saklama

Tüm veriler **localStorage** içinde saklanır (backend olmadan):

```
localStorage:
├── user_events          # Etkinlikler
├── event_photos         # Fotoğraf verileri (base64)
├── face_embeddings      # Yüz embeddings (sayısal vektörler)
└── user                 # Kimlik doğrulama bilgisi
```

## 🛠️ Troubleshooting

### "Models not found" Hatası
```bash
# Face-API modellerini yeniden kur
npm run setup:face-api
```

### Kamera Erişimi Reddedildi
- Tarayıcı izinlerini kontrol edin
- Priv mode/incognito modda deneyin
- HTTPS veya localhost'ta çalıştığından emin olun

### Yüz Algılanamıyor
- Fotoğraf net ve aydınlık olduğundan emin olun
- Yüzün kameraya doğru baktığından emin olun
- Face-API modellerinin yüklü olduğunu kontrol edin (F12 → Console)

### Performans Sorunları
- Çok büyük fotoğrafları küçültmeyi deneyin
- Face-API'ın yüklenmesini bekleyin (ilk kullanımda yavaş olabilir)
- Tarayıcı cache'ini temizleyin

## 📦 Teknoloji Stack

| Teknoloji | Versiyon | Amaç |
|-----------|----------|------|
| React | 18.2.0 | UI framework |
| TypeScript | 5.2.2 | Type safety |
| Vite | 4.5.0 | Build tool |
| Tailwind CSS | 3.3.5 | Styling |
| Firebase | 10.7.0 | Authentication |
| face-api.js | 0.22.2 | Face detection |
| React Router | 6.16.0 | Routing |
| Zustand | 4.4.1 | State management |

## 🚀 Dağıtım

### Build İçin

```bash
npm run build
```

Üretim klasörü: `dist/`

### Preview

```bash
npm run preview
```

## 📚 Ek Kaynaklar

- [face-api.js Dokümantasyonu](https://github.com/vladmandic/face-api)
- [React Router Dokümantasyonu](https://reactrouter.com)
- [Firebase Dokümantasyonu](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

## ⚖️ Lisans

Bu proje MIT lisansı altındadır.

## 👥 Katkı

Katkıda bulunmak için pull request açabilirsiniz.

---

**Sorular mı var?** Dokümantasyonu kontrol edin:
- `FACE_API_SETUP.md` - Face-API kurulum detayları
- `API_DOCUMENTATION.md` - Backend API spec (gelecek)
- `DATABASE_SCHEMA.md` - Veritabanı yapısı
