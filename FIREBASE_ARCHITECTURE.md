# Firebase Authentication Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Event Photos Web App                       │
│                   (React + TypeScript + Tailwind)               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        React Components                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ LoginModal.tsx                                             │ │
│  │  • Main auth UI                                            │ │
│  │  • Google, Apple, Email buttons                            │ │
│  │  • Mode switching (login/signup)                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ EmailAuthForm.tsx                                          │ │
│  │  • Email & password inputs                                 │ │
│  │  • Validation & error display                              │ │
│  │  • Show/hide password toggle                               │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Header, HomePage, etc.                                     │ │
│  │  • Uses useCurrentUser() hook                              │ │
│  │  • Uses useLogout() hook                                   │ │
│  │  • Conditional rendering based on user state               │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Hooks Layer                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ useGoogleLogin()       → calls authService.loginWithGoogle │ │
│  │ useAppleLogin()        → calls authService.loginWithApple  │ │
│  │ useEmailLogin()        → calls authService.loginWithEmail  │ │
│  │ useSignup()            → calls authService.signup          │ │
│  │ useLogout()            → calls authService.logout          │ │
│  │ useCurrentUser()       → reads useAuthStore.user           │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    State Management                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ useAuthStore (Zustand)                                     │ │
│  │  • user: User | null                                       │ │
│  │  • isLoading: boolean                                      │ │
│  │  • error: string | null                                    │ │
│  │  • setUser(), loadUser(), logout()                         │ │
│  │  • initializeAuth() - Firebase listener                    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Persists to: localStorage (via Firebase)                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Services Layer                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ authService.ts                                             │ │
│  │  • loginWithGoogle()   ──┐                                  │ │
│  │  • loginWithApple()    ──┤─→ calls firebaseAuthService     │ │
│  │  • loginWithEmail()    ──┤   + user mapping & storage       │ │
│  │  • signup()            ──┤   + error handling (Turkish)     │ │
│  │  • logout()            ──┘                                  │ │
│  │  • getCurrentUser()                                        │ │
│  │  • getIdToken()                                            │ │
│  │  • onAuthStateChanged()                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Firebase Service                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ firebaseAuthService.ts                                     │ │
│  │  • signInWithGoogle()  ────┐                               │ │
│  │  • signInWithApple()   ────┤                               │ │
│  │  • signInWithEmail()   ────┼─→ Firebase Auth API           │ │
│  │  • signUpWithEmail()   ────┤   (OAuth 2.0 popups)          │ │
│  │  • signOut()           ────┘                               │ │
│  │  • getCurrentUser()                                        │ │
│  │  • getIdToken()                                            │ │
│  │  • onAuthStateChanged()                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Firebase Backend                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Firebase Auth (login-82faf)                                │ │
│  │                                                             │ │
│  │  Google OAuth 2.0  ──────┐                                │ │
│  │  Apple OAuth 2.0   ──────┼──→ Firebase User Database       │ │
│  │  Email/Password    ──────┘                                │ │
│  │                                                             │ │
│  │  Returns:                                                  │ │
│  │  • User ID (uid)                                          │ │
│  │  • Email                                                  │ │
│  │  • Display Name                                           │ │
│  │  • Photo URL                                              │ │
│  │  • ID Token (JWT)                                         │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│             Browser Storage & External Auth                     │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ localStorage (Firebase Persistence)                        │ │
│  │  • User metadata                                           │ │
│  │  • Auth tokens                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ External OAuth Providers                                   │ │
│  │  • Google OAuth                                           │ │
│  │  • Apple OAuth                                            │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow Diagrams

### Google/Apple OAuth Flow

```
User clicks "Google/Apple ile Giriş Yap"
              │
              ▼
      LoginModal component
              │
              ▼
      handleGoogleAuth() / handleAppleAuth()
              │
              ▼
      authService.loginWithGoogle() / loginWithApple()
              │
              ▼
      firebaseAuthService.signInWithGoogle() / signInWithApple()
              │
              ▼
      Firebase.signInWithPopup()
              │
              ▼
      OAuth Provider Popup (Google/Apple login screen)
              │
              ▼
      User authenticates with provider
              │
              ▼
      Firebase returns: { user, credentials }
              │
              ▼
      firebaseAuthService returns: { user: AuthResult, provider: 'google'|'apple' }
              │
              ▼
      authService.createOrUpdateUser()
              │
              ▼
      Save to localStorage + useAuthStore.setUser()
              │
              ▼
      LoginModal closes
              │
              ▼
      ✅ User logged in, can access protected pages
```

### Email/Password Login Flow

```
User clicks "E-posta ile Giriş Yap"
              │
              ▼
      LoginModal → EmailAuthForm (login mode)
              │
              ▼
      User enters email & password
              │
              ▼
      handleEmailSignIn()
              │
              ▼
      authService.loginWithEmail(email, password)
              │
              ▼
      firebaseAuthService.signInWithEmailAndPassword()
              │
              ▼
      Firebase verifies email & password
              │
              ▼
      Firebase returns: FirebaseUser object
              │
              ▼
      firebaseAuthService returns: { user: AuthResult, provider: 'email' }
              │
              ▼
      authService.createOrUpdateUser()
              │
              ▼
      Save to localStorage + useAuthStore.setUser()
              │
              ▼
      LoginModal closes
              │
              ▼
      ✅ User logged in, can access protected pages
```

### Email/Password Signup Flow

```
User clicks "Kayıt Ol"
              │
              ▼
      LoginModal → EmailAuthForm (signup mode)
              │
              ▼
      User enters email, password, confirm password
              │
              ▼
      Form validates:
      • Email not empty
      • Password 6+ chars
      • Passwords match
              │
              ▼
      handleEmailSignUp()
              │
              ▼
      authService.signup({ email, name, password })
              │
              ▼
      firebaseAuthService.signUpWithEmail(email, password, name)
              │
              ▼
      Firebase creates new account
              │
              ▼
      updateProfile(user, { displayName: name })
              │
              ▼
      Firebase returns: FirebaseUser object
              │
              ▼
      firebaseAuthService returns: { user: AuthResult, provider: 'email' }
              │
              ▼
      authService.createOrUpdateUser()
              │
              ▼
      Save to localStorage + useAuthStore.setUser()
              │
              ▼
      LoginModal closes
              │
              ▼
      ✅ New account created, user logged in
```

### Logout Flow

```
User clicks profile icon → "Çıkış Yap"
              │
              ▼
      useLogout() hook
              │
              ▼
      authService.logout()
              │
              ▼
      ┌─────────────────┬────────────────┐
      │                 │                │
      ▼                 ▼                ▼
  Firebase          localStorage     useAuthStore
  signOut()         clear()          setUser(null)
      │                 │                │
      │                 │                │
      └─────────────────┴────────────────┘
              │
              ▼
      ✅ User logged out
              │
              ▼
      Redirected to home page
              │
              ▼
      User can log in again
```

### Session Persistence Flow

```
App loads (first time or after refresh)
              │
              ▼
      App component mounts
              │
              ▼
      useAuthStore.initializeAuth() called
              │
              ▼
      authService.getCurrentUser()
              │
              ▼
      firebaseAuthService.getCurrentUser()
              │
              ▼
      Firebase checks localStorage
              │
              ▼
      If session exists:
      Firebase returns FirebaseUser
              │
              ▼
      authService converts to User type
              │
              ▼
      useAuthStore.setUser(user)
              │
              ▼
      ✅ User is logged in (session persisted!)
              │
      If no session:
              │
              ▼
      firebaseAuthService returns null
              │
              ▼
      useAuthStore.setUser(null)
              │
              ▼
      ✅ User needs to log in
```

---

## Data Flow

### User Object Transformation

```
Firebase User (from OAuth/Email)
    ↓
    {
      uid: "firebase-unique-id",
      email: "user@example.com",
      displayName: "User Name",
      photoURL: "https://...",
      ...
    }
    ↓
firebaseAuthService.mapFirebaseUserToAuthResult()
    ↓
AuthResult
    {
      user: {
        id: "firebase-unique-id",
        email: "user@example.com",
        name: "User Name",
        avatar: "https://..."
      },
      provider: "google" | "apple" | "email"
    }
    ↓
authService.createOrUpdateUser()
    ↓
User Type (Application User)
    {
      id: "firebase-unique-id",
      email: "user@example.com",
      name: "User Name",
      avatar: "https://...",
      subscription: "free" | "premium",
      photoCount: 0,
      maxPhotos: 50,
      createdAt: "2025-11-28T...",
      updatedAt: "2025-11-28T..."
    }
    ↓
useAuthStore.setUser()
    ↓
localStorage.setItem('user', JSON.stringify(user))
    ↓
Zustand state updated
    ↓
Components re-render with user data
```

---

## Component Hierarchy

```
App
├── useAuthStore.initializeAuth() ← Initialize auth on mount
├── Router
│   ├── Header ─→ uses useCurrentUser(), useLogout()
│   │   └── LoginModal ─→ uses useGoogleLogin(), useAppleLogin(), useEmailLogin(), useSignup()
│   │       └── EmailAuthForm ─→ Email input & password form
│   ├── HomePage ─→ conditional rendering based on user
│   ├── EventDetailPage ─→ protected, uses useCurrentUser()
│   ├── CreateEventPage ─→ protected, uses useCurrentUser()
│   └── ...other routes
```

---

## State Management Flow

```
Firebase Auth State
        ↓
firebaseAuthService.onAuthStateChanged()
        ↓
authService.onAuthStateChanged()
        ↓
useAuthStore.initializeAuth()
        ↓
useAuthStore (Zustand)
   {
     user: User | null,
     isLoading: boolean,
     error: string | null
   }
        ↓
useCurrentUser() hook
        ↓
Components subscribe to user state
        ↓
Components re-render on user change
```

---

## Security Flow

```
Login Credentials
        ↓
SSL/TLS Encryption (HTTPS)
        ↓
Firebase Backend
        ↓
Password: Bcrypt hashing (server-side, never exposed)
Google/Apple: OAuth 2.0 secure tokens
        ↓
Firebase returns: ID Token (JWT)
        ↓
authService.getIdToken()
        ↓
Include in API requests: Authorization: Bearer <token>
        ↓
Backend validates token with Firebase Admin SDK
        ↓
✅ Request authenticated
```

---

## File Dependency Graph

```
App.tsx
    ↓
    ├── useAuthStore (initialize auth)
    │   └── authService.getCurrentUser()
    │
    ├── Header.tsx
    │   ├── useCurrentUser()
    │   ├── useLogout()
    │   └── LoginModal.tsx
    │       ├── useGoogleLogin()
    │       ├── useAppleLogin()
    │       ├── useEmailLogin()
    │       ├── useSignup()
    │       └── EmailAuthForm.tsx
    │
    ├── HomePage.tsx
    │   └── useCurrentUser()
    │
    └── other routes...
        └── useCurrentUser()

authService.ts
    ↓
    └── firebaseAuthService.ts
        └── firebase.ts (initialize Firebase)

useAuthStore.ts
    ↓
    └── authService.ts
```

---

## Error Handling Flow

```
User action (login, signup, etc.)
    ↓
Try to authenticate with Firebase
    ↓
Firebase throws error (if any)
    ↓
firebaseAuthService.handleAuthError()
    ↓
Convert to Turkish error message:
"auth/user-not-found" → "E-posta adresi bulunamadı."
"auth/wrong-password" → "Yanlış şifre."
etc.
    ↓
Throw Error with Turkish message
    ↓
Component catches error
    ↓
Display error in UI (setLocalError)
    ↓
User sees helpful error message in Turkish
```

---

## Summary

- **Components** use hooks to access auth functionality
- **Hooks** call `authService` methods
- **AuthService** delegates to `firebaseAuthService` and manages user data
- **FirebaseAuthService** communicates directly with Firebase
- **Zustand Store** manages application state
- **localStorage** persists sessions automatically
- **Firebase** handles all security and encryption

This architecture separates concerns while maintaining a clean data flow! 🎯
