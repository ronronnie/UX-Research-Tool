import React from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'

// Page placeholders — replaced module by module
const Dashboard   = React.lazy(() => import('./pages/Dashboard.jsx'))
const NewSession  = React.lazy(() => import('./pages/NewSession.jsx'))
const Analytics   = React.lazy(() => import('./pages/Analytics.jsx'))

const NAV_ITEMS = [
  { to: '/',          label: 'Dashboard',  icon: '⊞' },
  { to: '/session',   label: 'New Session', icon: '+' },
  { to: '/analytics', label: 'Analytics',   icon: '◈' },
]

function NavBar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-secondary border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-bold text-lg tracking-tight">♠ UX Research</span>
            <span className="hidden sm:inline text-text-muted text-xs border border-border rounded px-1.5 py-0.5">
              Poker Platform
            </span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent-green/15 text-accent-green'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                  }`
                }
              >
                <span className="text-xs">{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

function PageWrapper({ children }) {
  return (
    <main className="pt-14 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </main>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-border border-t-accent-green rounded-full animate-spin" />
        <span className="text-text-muted text-sm">Loading…</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <NavBar />
      <PageWrapper>
        <React.Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/"          element={<Dashboard />} />
            <Route path="/session/*" element={<NewSession />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </React.Suspense>
      </PageWrapper>
    </>
  )
}
