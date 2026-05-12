import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { superAdminLogin } from '@/services/api'
import { Sparkles, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await superAdminLogin(form)
      login(data.token, data.admin)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center relative overflow-hidden">

      {/* BG GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent2/6 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />
      </div>

      <div className="relative w-full max-w-sm mx-4 animate-slideUp">

        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent2 mb-4 shadow-xl shadow-accent/30">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-2xl gradient-text">Decolivings</h1>
          <p className="text-xs text-muted uppercase tracking-widest mt-1">Super Admin Portal</p>
        </div>

        {/* CARD */}
        <div className="bg-surface border border-border rounded-2xl p-7 shadow-2xl">
          <h2 className="font-display font-bold text-xl mb-1">Welcome back</h2>
          <p className="text-sm text-muted mb-6">Sign in to manage your platform</p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                Email
              </label>
              <input
                type="email"
                className="input-base"
                placeholder="admin@decolivings.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-base pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-display font-bold text-white bg-gradient-to-r from-accent to-accent-dark hover:opacity-90 transition-opacity shadow-lg shadow-accent/25 disabled:opacity-50 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted mt-5">
          Decolivings Platform © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
