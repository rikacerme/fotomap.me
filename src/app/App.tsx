import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Header } from '@/shared/components/Header'
import { LoginPage } from '@/features/auth/components/LoginPage'
import { HomePage } from '@/pages/HomePage'
import { EventDetailPage } from '@/pages/EventDetailPage'
import { PricingPage } from '@/pages/PricingPage'
import { CreateEventPage } from '@/pages/CreateEventPage'
import { MyEventsPage } from '@/pages/MyEventsPage'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'
import { useAuthStore } from '@/features/auth/store/authStore'

function PrivateRoute({
  children,
  isAuthenticated,
}: {
  children: React.ReactNode
  isAuthenticated: boolean
}) {
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />
  }
  return children
}

export function App() {
  const { user, loadUser } = useCurrentUser()
  const initializeAuth = useAuthStore((state) => state.initializeAuth)

  // Initialize Firebase auth on app load
  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  // Load user after auth is initialized
  useEffect(() => {
    loadUser()
  }, [loadUser])

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/events/create"
          element={
            <PrivateRoute isAuthenticated={Boolean(user)}>
              <CreateEventPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-events"
          element={
            <PrivateRoute isAuthenticated={Boolean(user)}>
              <MyEventsPage />
            </PrivateRoute>
          }
        />

        {/* Share link route - public, no auth required */}
        <Route path="/share/:eventId" element={<EventDetailPage />} />

        {/* Event detail route - requires auth */}
        <Route
          path="/events/:eventId"
          element={
            <PrivateRoute isAuthenticated={Boolean(user)}>
              <EventDetailPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/pricing"
          element={
            <PrivateRoute isAuthenticated={Boolean(user)}>
              <PricingPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
