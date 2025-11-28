Proje Genel Kuralları

Proje TypeScript ile yazılacak, strict mode açık olacak.

Tüm kodlar feature bazlı organize edilecek. “Layer bazlı (components/services/store ayrı ana klasörler)” yapı kullanılmayacak.

Tüm fonksiyonlar tek sorumluluk prensibine göre yazılacak:

Bir fonksiyon mümkünse tek iş yapsın.

UI component fonksiyonları mümkünse 50 satırı, iş mantığı fonksiyonları 30 satırı geçmesin.

Tüm isimler (dosya, fonksiyon, değişken) anlamlı olacak, kısaltmalardan kaçınılacak (getUserById, mapUserDtoToUser gibi).

Uygulamada magic string / magic number kullanılmayacak; constants için config veya constants dosyaları kullanılacak.

Tüm ortak kurallar, bu dokümana göre tasarlanacak, yeni feature ekleyen geliştirici bu kurallardan sapmayacak.

2. Folder Yapısı Kuralları

Root yapı:

src/
  app/
  pages/
  features/
  shared/
  assets/
  types/


src/app/:

App.tsx (veya ana root component) burada durur.

main.tsx (bootstrap / render), routes.tsx (route tanımları) burada olur.

Uygulama seviyesindeki provider’lar (ThemeProvider, I18nProvider, global store provider vb.) app/providers/ altında tutulur.

src/pages/:

Route’a bağlı sayfa componentleri burada.

Her sayfa kendi klasöründe:

HomePage/HomePage.tsx

SettingsPage/SettingsPage.tsx

index.ts sadece export { HomePage } from "./HomePage"; gibi re-export yapabilir.

src/features/:

Her feature için bir klasör:

features/auth

features/profile

features/cart gibi.

Her feature içinde kullanılabilecek alt klasörler:

features/<featureName>/
  components/
  containers/
  hooks/
  services/
  store/
  types/
  mappers/ (ihtiyaç varsa)
  utils/   (feature’e özel küçük helper’lar)


src/shared/:

Uygulama genelinde kullanılan her şey burada:

shared/components/ → Tekrar kullanılabilir UI bileşenleri

shared/hooks/ → Framework bağımsız / generic hooks

shared/services/ → ApiClient, StorageClient vb.

shared/store/ → Global store’lar (tema, dil, global UI state)

shared/config/ → Tema, i18n, sabit config

shared/types/ → Uygulama genelinde kullanılan type’lar

src/assets/:

Görseller, ikonlar, fontlar.

src/types/:

Proje root’unda global type tanımları (global.d.ts vb.) gerekiyorsa.

3. Page (Sayfa) Kuralları

pages altındaki componentler:

Sadece aşağıdakilerden sorumludur:

Route parametrelerini okumak

Uygun layout’u seçmek (örneğin PageLayout)

İlgili feature container bileşenini ekrana yerleştirmek

Yasak olanlar:

Doğrudan API çağrısı yapmak

Doğrudan storage (localStorage, cookie) kullanmak

Kapsamlı iş mantığı barındırmak (if-else bloklarıyla dolu işlem zincirleri)

Sayfa componentleri:

Mümkün olduğunca “dumb” olacak:

Data’yı containers veya hooks layer’ından props olarak alacak.

Route configuration (routes.tsx):

Tüm rotalar tek bir yerde tanımlanacak.

Route’lar sayfaları işaret eder, feature’ları değil.

4. Feature Yapısı ve Kuralları

Her feature, kendi domainini içerir:

auth → login, logout, current user

profile → kullanıcı profili okuma/güncelleme

cart → sepet işlemleri

Her feature içinde:

components/:

Yalnızca UI ile ilgilenir.

Input/Output (props) odaklıdır.

İş mantığı içermez, sadece eventleri container/hook’a iletir.

containers/:

Feature özel “smart” UI bileşenler.

hooks’u çağırır, gelen veriyi components’lara dağıtır.

Bir sayfaya özel ama aynı feature içinde tekrar kullanılabilir.

hooks/:

İş mantığının ana yeri.

API çağrısı yapan service’leri kullanır.

State yönetir, validasyon yapar, side-effect yürütür.

services/:

API istekleri ve storage erişimi buradan yapılır.

shared/services/http/ApiClient ve shared/services/storage/StorageClient üzerinden çalışır.

store/:

Feature’a özel global state (örn. authStore, cartStore).

types/:

Feature’a ait type/interface/enum’lar burada.

Her type ayrı dosyada tutulur.

mappers/:

API DTO ↔ Domain model dönüşümleri.

utils/:

Feature’e özel küçük helper fonksiyonlar (örn. formatUserName).

5. Global State, Tema ve Dil Kuralları

Global store dosyaları shared/store/ altında:

themeStore.ts

i18nStore.ts

uiStore.ts (modals, toasts, global loading, global error gibi UI state’leri)

Tema yönetimi:

Tema bilgisi (örn. "light" | "dark") sadece themeStore içinde tutulur.

Componentler temayı hook üzerinden okur (örn. useTheme()).

Temayı değiştiren tek fonksiyon themeStore içindedir (örn. setTheme("dark")).

Dil (i18n) yönetimi:

Aktif dil kodu ("tr" | "en" | ...) i18nStore’da tutulur.

Çeviri kaynakları shared/config/i18n klasöründe:

en.ts, tr.ts, index.ts

Componentlerde string direkt yazılmaz:

t("auth.login.title") gibi çeviri fonksiyonları kullanılır.

User/global UI state:

Örn. global isSidebarOpen, globalErrorMessage, isAppLoading gibi şeyler uiStore içinde tutulur.

6. API Erişimi Kuralları

Tüm API istekleri tek bir client abstraction üzerinden yapılır:

shared/services/http/ApiClient.ts

Uygulama içinde asla doğrudan:

fetch(...)

axios(...)
kullanılmaz.
Sadece ApiClient (veya onun üzerinden çalışan service’ler) kullanılır.

ApiClient sorumlulukları:

Base URL yönetimi

Ortak header (örn. Authorization, Content-Type)

Request/response interceptor mantığı (gerekirse)

Ortak error handling (örneğin loglama/hata tipi dönüştürme)

Feature service’leri:

Örn. features/auth/services/authService.ts

Yalnızca kendi feature’ına ait endpoints’i bilir:

login, logout, getCurrentUser gibi metotlar

Dönüş tipleri type-safe (TS interface’leriyle) olmalı.

Akış:

Component → Hook → Feature Service → ApiClient → HTTP

7. Storage / Cookie Kuralları

Uygulama içinde hiçbir yerde:

localStorage.getItem/setItem

sessionStorage.getItem/setItem

document.cookie
doğrudan kullanılmayacak.

Bu işlemler sadece shared/services/storage katmanından geçer:

StorageClient.ts

Gerekirse driver’lar:

drivers/LocalStorageDriver.ts

drivers/SessionStorageDriver.ts

drivers/CookieStorageDriver.ts

StorageClient sorumlulukları:

JSON parse/stringify (type-safe)

Hata yönetimi (bozuk JSON vb.)

Key isimlendirme standardı (örneğin: APP_AUTH_TOKEN, APP_THEME).

Feature service’leri token, user, preferences gibi veriler için sadece StorageClient kullanır.

8. Type / Model / DTO Kuralları

Her domain type’ı ayrı dosyada tutulur:

features/auth/types/User.ts

features/auth/types/AuthTokens.ts

Aynı klasörde index.ts sadece re-export için:

export * from "./User";

export * from "./AuthTokens";

API DTO’ları ile UI modelleri ayrılabilir:

DTO: UserDto.ts

Model: User.ts

DTO ↔ Model dönüşümleri mappers klasöründe yapılır:

mapUserDtoToUser(dto: UserDto): User

Type isimlendirme:

Interface: I prefix kullanma (User yeterli).

Union/enum gibi durumlarda anlamlı isimler: UserRole, ApiErrorCode.

9. Error / Loading / Empty State Kuralları

Her API çağrısında beklenebilecek 3 temel state yönetilir:

loading

error

data

Bu state’ler:

Genelde hook içinde tutulur (useLogin, useUserList gibi).

Component, sadece props olarak alır ve UI gösterimi yapar.

Hata mesajları:

Mümkün olduğunca kullanıcı dostu mesajlara map edilir.

Teknik hata mesajları loglanır ama kullanıcıya aynen gösterilmez.

Global error (örn. token expiry) gibi durumlar:

ApiClient interceptors veya global uiStore üzerinden yönetilir.

10. Form / Validation Kuralları

Form state yönetimi:

Mümkünse ortak bir form helper/kitaplık (React Hook Form vs.) kullanılır.

Form mantığı hooks veya containers içinde tutulur.

Component sadece:

input değerlerini gösterir

event’leri hook’a iletir.

Validation:

Şema bazlı validasyon tercih edilir (örn. Zod, Yup).

Validasyon kuralları ayrı dosyada tutulabilir (örn. validation.ts).

Error mesajları i18n üzerinden çevirilmelidir.

11. Naming, Import ve Style Kuralları

Hook’lar daima use ile başlar:

useLogin, useCurrentUser, useDebounce

Componentler PascalCase:

LoginForm.tsx, UserCard.tsx

Service dosyaları:

authService.ts, profileService.ts

Store dosyaları:

authStore.ts, themeStore.ts

Import’larda alias kullan:

@/shared/...

@/features/auth/...

Göreceli import derinliğinden kaçın (../../../../ gibi).

12. Test Kuralları (Kısa, Ama Net)

Her kritik iş mantığı hook’u için test yazılacak:

features/auth/hooks/__tests__/useLogin.test.ts

Service’ler için:

Success ve error senaryoları test edilecek.

UI component testleri:

En azından render ve temel etkileşim (butona basınca callback çağrılıyor mu?) test edilecek.