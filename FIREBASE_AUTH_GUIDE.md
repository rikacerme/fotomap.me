# Firebase Authentication Integration Guide

## Overview

Firebase authentication has been fully integrated into the Event Photos application with support for:
- ✅ Google Sign-In
- ✅ Apple Sign-In  
- ✅ Email/Password Authentication

## Installation

### 1. Install Firebase SDK

```bash
npm install firebase
```

The package.json has been automatically updated with Firebase ^10.7.0.

### 2. Firebase Configuration

Your Firebase config is already set up in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: 'AIzaSyCadIYvrBskY2iVZUQ8hy0BQH7sp5Ed0z8',
  authDomain: 'login-82faf.firebaseapp.com',
  databaseURL: 'https://login-82faf-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'login-82faf',
  storageBucket: 'login-82faf.firebasestorage.app',
  messagingSenderId: '419049300552',
  appId: '1:419049300552:web:1648abef6252ed68d02e7d',
  measurementId: 'G-HMLYLHKMLR'
}
```

## Architecture

### File Structure

```
src/
├── lib/
│   └── firebase.ts                          # Firebase initialization
├── features/auth/
│   ├── services/
│   │   ├── firebaseAuthService.ts          # Firebase auth methods
│   │   └── authService.ts                  # Application auth service (integrates Firebase)
│   ├── hooks/
│   │   └── useAuth.ts                      # Auth hooks (Google, Apple, Email, Signup, Logout)
│   ├── components/
│   │   ├── LoginModal.tsx                  # Main login modal (all auth methods)
│   │   ├── EmailAuthForm.tsx               # Email login/signup form
│   │   └── GoogleSignupForm.tsx            # Google signup form
│   ├── store/
│   │   └── authStore.ts                    # Zustand auth state store
│   └── types/
│       └── User.ts                         # User type definitions
```

### Core Services

#### 1. **Firebase Auth Service** (`firebaseAuthService.ts`)

Handles all direct Firebase operations:

```typescript
firebaseAuthService.signInWithGoogle()     // Returns { user, provider: 'google' }
firebaseAuthService.signInWithApple()      // Returns { user, provider: 'apple' }
firebaseAuthService.signInWithEmail(email, password)
firebaseAuthService.signUpWithEmail(email, password, name)
firebaseAuthService.signOut()
firebaseAuthService.getCurrentUser()       // Returns FirebaseUser | null
firebaseAuthService.getIdToken()          // Returns JWT token for API requests
firebaseAuthService.isAuthenticated()
firebaseAuthService.onAuthStateChanged(callback)
```

#### 2. **Auth Service** (`authService.ts`)

Application-level auth service that integrates Firebase with your app:

```typescript
authService.loginWithGoogle()              // Firebase + app integration
authService.loginWithApple()
authService.loginWithEmail(email, password)
authService.signup(payload)                // Email signup
authService.getCurrentUser()               // Get current user from Firebase or storage
authService.logout()                       // Sign out + clear storage
authService.getStoredToken()              // Get Firebase ID token
authService.isAuthenticated()
authService.onAuthStateChanged(callback)  // Listen to Firebase auth changes
```

### State Management

#### **Zustand Auth Store** (`authStore.ts`)

```typescript
// State
useAuthStore.user              // Current User object
useAuthStore.isLoading         // Loading state
useAuthStore.error             // Error message

// Actions
useAuthStore.setUser()         // Set user
useAuthStore.setError()        // Set error
useAuthStore.loadUser()        // Load user from Firebase
useAuthStore.logout()          // Sign out
useAuthStore.initializeAuth()  // Initialize Firebase auth listener
```

### Custom Hooks

#### **Google Login Hook** (`useGoogleLogin`)

```typescript
const { login, isLoading, error } = useGoogleLogin()

// Usage
await login()  // Triggers Google OAuth popup
```

#### **Apple Login Hook** (`useAppleLogin`)

```typescript
const { login, isLoading, error } = useAppleLogin()

// Usage
await login()  // Triggers Apple OAuth
```

#### **Email Login Hook** (`useEmailLogin`)

```typescript
const { login, isLoading, error } = useEmailLogin()

// Usage
await login(email, password)
```

#### **Signup Hook** (`useSignup`)

```typescript
const { signup, isLoading, error } = useSignup()

// Usage
await signup({ email, name, password })
```

#### **Logout Hook** (`useLogout`)

```typescript
const { logout } = useLogout()

// Usage
await logout()  // Signs out from Firebase and clears storage
```

#### **Current User Hook** (`useCurrentUser`)

```typescript
const { user, isLoading, loadUser } = useCurrentUser()

// Usage
useEffect(() => {
  loadUser()  // Load user on app init
}, [])
```

## Integration Points

### 1. **App Initialization**

In your main App component, initialize auth on mount:

```typescript
import { useAuthStore } from '@/features/auth/store/authStore'
import { useEffect } from 'react'

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeAuth()  // Load user and listen to Firebase changes
  }, [initializeAuth])

  // ... rest of your app
}
```

### 2. **Login Modal**

The LoginModal component now supports all three auth methods:

```typescript
import { LoginModal } from '@/features/auth/components/LoginModal'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Giriş Yap</button>
      <LoginModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
```

The modal automatically handles:
- Google OAuth popup
- Apple OAuth
- Email/Password login
- Email signup with confirm password
- Switching between login and signup modes

### 3. **Protected Routes**

```typescript
import { useCurrentUser } from '@/features/auth/hooks/useAuth'

function ProtectedPage() {
  const { user, isLoading } = useCurrentUser()

  if (isLoading) return <Loading />
  if (!user) return <Navigate to="/" />

  return <YourComponent user={user} />
}
```

### 4. **Header with Auth**

```typescript
import { useCurrentUser } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useAuth'

function Header() {
  const { user } = useCurrentUser()
  const { logout } = useLogout()

  return (
    <header>
      {user ? (
        <>
          <span>{user.name}</span>
          <button onClick={() => logout()}>Çıkış</button>
        </>
      ) : (
        <button onClick={() => { /* open login modal */ }}>Giriş Yap</button>
      )}
    </header>
  )
}
```

## Firebase Console Setup

### Enable Authentication Methods

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **login-82faf**
3. Go to **Authentication** > **Sign-in method**

#### Enable Google Sign-In
1. Click **Google**
2. Enable the toggle
3. Set up OAuth consent screen if needed

#### Enable Apple Sign-In
1. Click **Apple**
2. Enable the toggle
3. Configure your Apple app ID and service ID

#### Enable Email/Password
1. Click **Email/Password**
2. Enable the toggle
3. Enable "Email link (passwordless sign-in)" if desired

### Configure Authorized Domains

1. Go to **Authentication** > **Settings**
2. Under **Authorized domains**, add:
   - `localhost:5173` (for development)
   - Your production domain
   - `firebaseapp.com` (automatically added)

## Error Handling

The Firebase auth service includes Turkish error messages for common issues:

```typescript
'auth/user-not-found'          → 'E-posta adresi bulunamadı.'
'auth/wrong-password'           → 'Yanlış şifre.'
'auth/email-already-in-use'     → 'Bu e-posta adresi zaten kullanılıyor.'
'auth/weak-password'            → 'Şifre en az 6 karakter olmalıdır.'
'auth/invalid-email'            → 'Geçersiz e-posta adresi.'
'auth/user-cancelled'           → 'Giriş işlemi iptal edildi.'
'auth/popup-blocked'            → 'Açılır pencere engellendi...'
'auth/operation-not-allowed'    → 'Bu giriş yöntemi şu anda devre dışıdır.'
```

## User Persistence

Firebase automatically persists user sessions using:
- `browserLocalPersistence`: Stores auth state in localStorage
- Users stay logged in across browser sessions/tabs
- Auto-syncs across browser tabs

## API Integration

To use Firebase ID token with your backend:

```typescript
const token = await authService.getStoredToken()

// Include in API request headers
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

// Or manually:
const response = await fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

## Migration from Old System

If you had an old API-based auth system:

1. **Old** → **New mapping**:
   - `authService.loginWithGoogle(token)` → `authService.loginWithGoogle()`
   - No more manual token handling
   - Firebase handles tokens automatically

2. **Update your components**:
   ```typescript
   // Old
   const { login } = useGoogleLogin()
   await login('google-token')

   // New
   const { login } = useGoogleLogin()
   await login()  // No token needed
   ```

## Troubleshooting

### CORS Issues
- Firebase auth is client-side, doesn't need CORS
- Only backend API endpoints need CORS configuration

### Popup Blocked
- Ensure sign-in is triggered by user action
- Some browsers block popups on slow networks

### Session Not Persisting
- Firebase automatically handles persistence
- Check browser localStorage is enabled
- Check browser console for errors

### Apple Sign-In Issues (macOS/iOS)
- Requires HTTPS in production
- App ID and service ID must be configured in Apple Developer

### Email Already In Use
- Firebase prevents duplicate email accounts
- Users should use password reset if they forgot their password

## Testing

### Test Google Sign-In
```typescript
const { login } = useGoogleLogin()
try {
  await login()
  console.log('Google sign-in successful')
} catch (error) {
  console.error('Google sign-in failed:', error)
}
```

### Test Email Sign-Up
```typescript
const { signup } = useSignup()
try {
  await signup({
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123'
  })
  console.log('Signup successful')
} catch (error) {
  console.error('Signup failed:', error)
}
```

### Test Logout
```typescript
const { logout } = useLogout()
await logout()
// User should be cleared from state and storage
```

## Next Steps

1. **Install dependencies**: `npm install`
2. **Test authentication**: Try Google, Apple, and Email login
3. **Configure Firebase Console**: Enable auth methods and authorized domains
4. **Update backend**: If you have a backend, update to validate Firebase tokens
5. **Deploy**: Test on staging before production

## References

- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Firebase Auth Error Codes](https://firebase.google.com/docs/auth/errors)
- [React Firebase Best Practices](https://firebase.google.com/docs/web/frameworks-libraries)

---

**Project**: Event Photos App  
**Firebase Project**: login-82faf  
**Firebase Region**: europe-west1
