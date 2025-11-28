# Face-API.js Models Setup

Bu proje **CDN üzerinden** face-api.js modellerini otomatik olarak yükler. Lokal dosya kurulumu gerekmez.

## ✅ Otomatik Setup (CDN)

Face-api.js modelleri jsDelivr CDN'den otomatik yüklenecektir:
- **Model URL:** `https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/`

### Avantajları:
- ✅ Lokal kurulum gerekmez
- ✅ Otomatik yüklenir (ilk çağrıda)
- ✅ CDN caching ile hızlı
- ✅ 0 konfigürasyon

### Dezavantajları:
- ⚠️ İnternet bağlantısı gerekli (ilk yükleme için)
- ⚠️ CDN downtime varsa model yüklenmez

---

## 📁 Lokal Kurulum (İsteğe Bağlı)

Eğer modelleri lokal olarak host etmek istiyorsanız:

### Adım 1: Model Dosyalarını İndir

Face-api.js modelleri indir:
https://github.com/vladmandic/face-api/tree/master/model

İndir edilen dosyalar:
- `tiny_face_detector_model-weights_manifest.json`
- `tiny_face_detector_model-weights_shard_1`
- `face_landmark_68_model-weights_manifest.json`
- `face_landmark_68_model-weights_shard_1`
- `face_recognition_model-weights_manifest.json`
- `face_recognition_model-weights_shard_1`
- `face_expression_model-weights_manifest.json`
- `face_expression_model-weights_shard_1`

### Adım 2: Klasöre Yerleştir

```
public/
└── models/
    ├── tiny_face_detector_model-weights_manifest.json
    ├── tiny_face_detector_model-weights_shard_1
    ├── face_landmark_68_model-weights_manifest.json
    ├── face_landmark_68_model-weights_shard_1
    ├── face_recognition_model-weights_manifest.json
    ├── face_recognition_model-weights_shard_1
    ├── face_expression_model-weights_manifest.json
    └── face_expression_model-weights_shard_1
```

### Adım 3: faceDetectionService.ts Güncelle

`src/features/faces/services/faceDetectionService.ts` dosyasında:

```typescript
// CDN yerine lokal path kullan
const MODEL_URL = '/models'  // public/models klasörünü gösterir
```

---

## 🚀 İlk Kullanım

1. **Uygulamayı başlat**
   ```bash
   npm run dev
   ```

2. **Fotoğraf çek butonu tıkla**
   - Tarayıcı konsolunda "Face detection models loaded successfully" mesajı görülecektir
   - Modeller CDN'den indirilecektir (ilk çağrıda ~30 MB)

3. **İnternet Hızı İpuçları**
   - İlk yükleme: 5-10 saniye (bağlantı hızına göre)
   - Sonraki yüklemeler: Anında (browser cache)

---

## 🔍 Doğrulama

### Browser Console'da:
```
✓ Face detection models loaded successfully
```

### Network Tab'da:
- jsDelivr'dan model dosyaları indirildiğini kontrol edin
- Tüm 4 model yüklü olmalı (tiny_face_detector, face_landmark_68, face_recognition, face_expression)

---

## ⚠️ Sorun Giderme

### "Models loading failed" Hatası
1. İnternet bağlantısını kontrol edin
2. CDN erişimini test edin: https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/
3. Tarayıcı console'da detaylı hata mesajını kontrol edin

### "Face detection failed after models loaded"
- Modeller yüklendi ama detection başarısız
- Çözüm: Tarayıcı cache'ini temizleyin (Ctrl+Shift+Delete)
- Veya: Lokal modellere geçin (yukarıdaki adımları izleyin)

### CORS Hatası
- CDN blokluysa lokal setup yapın
- Veya: Proxy kullanan bir CDN alternatifi (unpkg.com, etc.)

---

## 📊 Model Boyutları (Lokal Kurulum için)

| Model | Boyut |
|-------|-------|
| tiny_face_detector | ~2 MB |
| face_landmark_68 | ~3 MB |
| face_recognition | ~130 MB |
| face_expression | ~600 KB |
| **Toplam** | **~136 MB** |

---

## 🌐 CDN Alternatifleri

CDN'nin downtime'ında başka seçenekler:

```typescript
// Option 1: unpkg.com
const MODEL_URL = 'https://unpkg.com/@vladmandic/face-api/model/'

// Option 2: cdnjs.com
const MODEL_URL = 'https://cdnjs.cloudflare.com/ajax/libs/face-api.js/...'

// Option 3: Lokal (public/models/)
const MODEL_URL = '/models'
```

---

## 📝 İlgili Dosyalar

- `src/features/faces/services/faceDetectionService.ts` - CDN ayarı
- `src/features/faces/hooks/useFaceDetection.ts` - Hook'lar
- `src/shared/components/PhotoCapture.tsx` - Kamera UI
- `src/pages/EventDetailPage/EventDetailPage.tsx` - Entegrasyon

