import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Home, Plus, CreditCard, User, ChevronDown } from 'lucide-react'
import { useLogout, useCurrentUser } from '@/features/auth/hooks/useAuth'
import { LoginModal } from '@/features/auth/components/LoginModal'

export function Header() {
  const { user } = useCurrentUser()
  const { logout } = useLogout()
  const navigate = useNavigate()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLogout = () => {
    logout()
    setShowProfileMenu(false)
    navigate('/')
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">
              EP
            </div>
            <span className="text-xl font-bold text-gray-900">Event Photos</span>
          </Link>

          {/* Navigation - Only show if logged in */}
          {user && (
            <nav className="flex items-center gap-6 flex-1 justify-center">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                Ana Sayfa
              </Link>
              <Link
                to="/my-events"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Etkinliklerim
              </Link>
              <Link
                to="/events/create"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Yeni Etkinlik
              </Link>
              <Link
                to="/pricing"
                className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <CreditCard className="w-4 h-4" />
                Paket Yükselt
              </Link>
            </nav>
          )}

          {/* Right Section - Login/Profile */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.subscription}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                <User className="w-4 h-4" />
                Giriş Yap
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
