# Firebase Authentication - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Firebase (2 minutes)

```bash
cd c:\Users\Izoly\Documents\projeler\face-test-claudie
npm install
```

### Step 2: Initialize Auth (1 minute)

Add this to your main **App.tsx** file in the App component:

```typescript
import { useAuthStore } from '@/features/auth/store/authStore'
import { useEffect } from 'react'

function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    // ... your existing app JSX
  )
}
```

### Step 3: Enable Auth Methods in Firebase Console (2 minutes)

1. Go to https://console.firebase.google.com/project/login-82faf
2. Click **Authentication** in the left menu
3. Click **Sign-in method** tab
4. Enable these providers (click each one and toggle the switch):
   - ✅ Google
   - ✅ Apple  
   - ✅ Email/Password

5. Under **Authorized domains**, make sure `localhost:5173` is listed

### ✅ Done!

You now have Firebase authentication set up with Google, Apple, and Email login.

---

## 🧪 Testing

### Test Google Login:
1. Click "Google ile Giriş Yap" in LoginModal
2. Complete Google OAuth popup
3. You should be logged in

### Test Apple Login:
1. Click "Apple ile Giriş Yap" in LoginModal
2. Complete Apple OAuth
3. You should be logged in

### Test Email Signup:
1. Click "Kayıt Ol" in LoginModal
2. Enter email and password (6+ chars)
3. Click "Kayıt Ol"
4. You should be logged in

### Test Email Login:
1. Click "E-posta ile Giriş Yap" in LoginModal
2. Enter your signup email and password
3. Click "Giriş Yap"
4. You should be logged in

### Test Persistence:
1. Log in with any method
2. Close the browser completely
3. Reopen the app
4. You should still be logged in!

### Test Logout:
1. Click profile icon in header
2. Click "Çıkış Yap"
3. You should be logged out

---

## 📁 What Was Added

### New Files:
- `src/lib/firebase.ts` - Firebase config
- `src/features/auth/services/firebaseAuthService.ts` - Firebase auth methods
- `src/features/auth/components/EmailAuthForm.tsx` - Email login form
- `FIREBASE_AUTH_GUIDE.md` - Full documentation
- `FIREBASE_AUTH_CHECKLIST.md` - Implementation checklist
- `FIREBASE_INTEGRATION_SUMMARY.md` - What was done

### Updated Files:
- `package.json` - Added Firebase SDK
- `src/features/auth/services/authService.ts` - Now uses Firebase
- `src/features/auth/hooks/useAuth.ts` - New hooks for all auth methods
- `src/features/auth/components/LoginModal.tsx` - All auth methods
- `src/features/auth/store/authStore.ts` - Firebase integration

---

## 🎯 Available Hooks

### Login/Signup:
```typescript
// Google
const { login, isLoading, error } = useGoogleLogin()
await login()

// Apple  
const { login, isLoading, error } = useAppleLogin()
await login()

// Email Login
const { login, isLoading, error } = useEmailLogin()
await login(email, password)

// Email Signup
const { signup, isLoading, error } = useSignup()
await signup({ email, name, password })
```

### Logout:
```typescript
const { logout } = useLogout()
await logout()
```

### Get Current User:
```typescript
const { user, isLoading, loadUser } = useCurrentUser()
```

---

## 🔑 Getting User Data

```typescript
import { useCurrentUser } from '@/features/auth/hooks/useAuth'

function MyComponent() {
  const { user } = useCurrentUser()

  if (!user) return <p>Not logged in</p>

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>Plan: {user.subscription}</p>
    </div>
  )
}
```

---

## 🚨 Troubleshooting

### "Cannot find module 'firebase'"
```bash
npm install
```

### Google OAuth popup blocked
- Click the button again
- Check browser popup settings
- Make sure you're on `localhost:5173` for local dev

### Apple Sign-In "Operation not allowed"
- Make sure Apple is enabled in Firebase Console
- For production, must use HTTPS (localhost works)

### "user-not-found" when trying to login
- Make sure you signed up with that email first
- Or use Google/Apple login instead

### User not staying logged in
- Make sure `initializeAuth()` is called in App component
- Check browser localStorage is enabled

---

## 📚 Full Documentation

For complete details, read:
- **FIREBASE_AUTH_GUIDE.md** - Full integration guide with architecture
- **FIREBASE_AUTH_CHECKLIST.md** - Checklist and deployment guide
- **FIREBASE_INTEGRATION_SUMMARY.md** - Summary of changes

---

## 🔗 Useful Links

- **Firebase Console**: https://console.firebase.google.com/project/login-82faf
- **Firebase Auth Docs**: https://firebase.google.com/docs/auth
- **Your Project**: login-82faf

---

## ✨ Next Steps (Optional)

### Add Email Verification:
```typescript
// In firebaseAuthService.ts, after signup
await sendEmailVerification(result.user)
```

### Add Password Reset:
```typescript
import { sendPasswordResetEmail } from 'firebase/auth'

sendPasswordResetEmail(auth, email)
```

### Store User Data in Firestore:
```typescript
import { doc, setDoc } from 'firebase/firestore'

await setDoc(doc(db, 'users', user.id), {
  name: user.name,
  email: user.email,
  createdAt: new Date()
})
```

---

## 💡 Tips

1. **User stays logged in** - Firebase auto-persists sessions in localStorage
2. **Get Firebase token** - `await authService.getStoredToken()`
3. **Check if logged in** - `authService.isAuthenticated()`
4. **Listen to auth changes** - `authService.onAuthStateChanged(callback)`

---

## ✅ Checklist

- [ ] `npm install` completed
- [ ] `initializeAuth()` added to App component
- [ ] Google enabled in Firebase Console
- [ ] Apple enabled in Firebase Console
- [ ] Email/Password enabled in Firebase Console
- [ ] Localhost added to authorized domains
- [ ] Tested Google login
- [ ] Tested Apple login
- [ ] Tested Email signup
- [ ] Tested Email login
- [ ] Tested user persistence
- [ ] Tested logout

---

**All set! Your app now has Firebase authentication! 🎉**

Just run `npm install` and test it out.

For questions, read the full documentation files.
