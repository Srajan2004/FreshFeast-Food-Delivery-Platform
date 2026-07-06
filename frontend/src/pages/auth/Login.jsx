import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorBanner from '../../components/ErrorBanner'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const data = await login(form)
      const from = location.state?.from?.pathname
      if (from) {
        navigate(from)
      } else if (data.role === 'RESTAURANT_OWNER') {
        navigate('/restaurant/dashboard')
      } else if (data.role === 'ADMIN') {
        navigate('/admin/users')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-surface px-4 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-lg shadow-card p-8">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-primary text-4xl">restaurant</span>
          <h1 className="text-2xl font-extrabold text-on-surface mt-2">Welcome back</h1>
          <p className="text-on-surface-variant text-sm mt-1">Log in to your FreshFeast account</p>
        </div>

        {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
        </p>

      </div>
    </div>
  )
}
