# 📸 Photo Upload Validation & Quota System - Implementation Guide

## 📋 Özet
Etkinlik oluşturanlar için file type validation ve fotoğraf quota sistemi eklendi.

## 🎯 Özellikler

### 1. File Type Validation
- ✅ Sadece **JPEG/JPG** dosyaları desteklenir
- ✅ Diğer formatlar reddedilir (PNG, GIF, WebP, vb.)
- ✅ Hem MIME type hem dosya uzantısı kontrol edilir

### 2. Subscription-based Quota
```typescript
Free Plan:     5 fotoğraf
Pro Plan:     50 fotoğraf
Premium Plan: ∞ (sınırsız)
```

### 3. Quota Management
- Mevcut kullanım görüntülenir: `3/5 fotoğraf`
- Limite ulaşıldığında: Upload engellenir + upgrade prompt
- Paket yükseltme önerilir

## 🔧 Teknik Detaylar

### PhotoCapture.tsx Props
```typescript
interface PhotoCaptureProps {
  onPhotoCapture?: (file: File) => void
  onPhotoUpload?: (file: File) => void
  maxPhotos?: number           // Default: 5 (Free plan)
  currentPhotoCount?: number   // Default: 0
}
```

### Validation Rules

#### 1. JPEG/JPG Only
```typescript
const allowedTypes = ['image/jpeg']
if (!allowedTypes.includes(file.type)) {
  // Hata: Sadece JPEG/JPG dosyaları yüklenebilir
}

const fileName = file.name.toLowerCase()
if (!fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg')) {
  // Hata: .jpg ve .jpeg uzantıları gerekli
}
```

#### 2. File Size Check
- Max: 10 MB per file
- Error: "Dosya boyutu çok büyük (max 10MB)"

#### 3. Quota Check
```typescript
if (currentPhotoCount >= maxPhotos) {
  // Error: "Fotoğraf limitine ulaştınız (5/5)"
  //        "Daha fazla fotoğraf yüklemek için paketinizi yükseltin."
}
```

### File Input Accept
```html
<input
  type="file"
  accept=".jpg,.jpeg,image/jpeg"
  ...
/>
```

## 📝 Kullanım Örneği

### EventDetailPage Component'inde
```typescript
<PhotoCapture
  onPhotoCapture={handlePhotoCapture}
  onPhotoUpload={handlePhotoCapture}
  maxPhotos={currentUser?.maxPhotos || 5}
  currentPhotoCount={event?.photoIds.length || 0}
/>
```

### User Context'ten Get
```typescript
const { user } = useCurrentUser()
// user.maxPhotos - kullanıcının paket limitini içerir
// user.photoCount - toplam yüklenen fotoğraf sayısı
```

## 🔗 Integration Points

### 1. EventService
- `uploadPhoto()` method'unda validation
- Quota check before save
- Error throwing with clear messages

### 2. Event Type
```typescript
interface Event {
  photoIds: string[]     // Yüklenen fotoğraf IDleri
  // ...
}
```

### 3. User Type
```typescript
interface User {
  photoCount: number     // Toplam yüklenen fotoğraf sayısı
  maxPhotos: number      // Paket limitine göre max
  subscription: 'free' | 'premium'
  // ...
}
```

## 🎨 Error Messages

| Scenario | Message |
|----------|---------|
| PDF upload | "Sadece JPEG/JPG dosyaları yüklenebilir..." |
| PNG upload | "Sadece JPEG/JPG dosyaları yüklenebilir..." |
| Wrong extension | "Sadece .jpg ve .jpeg uzantılı dosyalar..." |
| File too large | "Dosya boyutu çok büyük (max 10MB)" |
| Quota exceeded | "Fotoğraf limitine ulaştınız (5/5)..." |

## 📊 UI Components

### Quota Display
```
📸 Fotoğraf Çek
              3/5 fotoğraf ← Mevcut/Max
```

### Error Alert
```
[❌] Fotoğraf limitine ulaştınız (5/5)
     Daha fazla fotoğraf yüklemek için paketinizi yükseltin.
```

## ✅ Testing Checklist

- [ ] PDF upload → Rejected with error message
- [ ] JPEG upload → Accepted and displayed
- [ ] PNG upload → Rejected with error message
- [ ] Quota at limit (5/5) → Upload button disabled, error shown
- [ ] File size > 10MB → Rejected with size error
- [ ] Captured photo → Saved as JPEG properly

## 🚀 Deployment Notes

1. **package.json** güncellenmiş (qrcode.react v3.2.0)
2. **PhotoCapture.tsx** - Validation eklendi
3. **Event.ts** - imageUrl field added
4. **EventService.ts** - imageUrl with file upload

## 📦 Installation

```bash
# Updated dependencies
npm install
# or
npm ci --legacy-peer-deps
```

## 🔐 Security Considerations

- File MIME type validation
- File extension validation  
- File size limit (10MB)
- Quota enforcement per user
- User.maxPhotos based on subscription

---

**Last Updated**: 2025-11-29
**Status**: Ready for implementation
