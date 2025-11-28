import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyCadIYvrBskY2iVZUQ8hy0BQH7sp5Ed0z8',
  authDomain: 'login-82faf.firebaseapp.com',
  databaseURL: 'https://login-82faf-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'login-82faf',
  storageBucket: 'login-82faf.firebasestorage.app',
  messagingSenderId: '419049300552',
  appId: '1:419049300552:web:1648abef6252ed68d02e7d',
  measurementId: 'G-HMLYLHKMLR',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Analytics
const analytics = getAnalytics(app)

// Initialize Auth with persistence
export const auth = getAuth(app)

// Set persistence to LOCAL so user stays logged in across sessions
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to set auth persistence:', error)
})

export default app
