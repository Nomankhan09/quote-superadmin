import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import Layout from '@/components/layout/Layout'
import LoginPage from '@/components/pages/LoginPage'
import Dashboard from '@/components/pages/Dashboard'
import TenantsPage from '@/components/pages/TenantsPage'
import PlansPage from '@/components/pages/PlansPage'
import AppsPage from '@/components/pages/AppPage'
import UserPage from './components/pages/UserPage'
import AccessRequestsPage from './components/pages/AccessRequests'

function ProtectedRoute({ children }) {
  const { isAuth } = useAuth()
  return isAuth ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { isAuth } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={isAuth ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/*" element={
        <ProtectedRoute>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tenants" element={<TenantsPage />} />
              <Route path="/apps" element={<AppsPage />} />
              <Route path="/plans" element={<PlansPage />} />
              <Route path="/users" element={<UserPage />} />
              <Route path="/access-requests" element={<AccessRequestsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
