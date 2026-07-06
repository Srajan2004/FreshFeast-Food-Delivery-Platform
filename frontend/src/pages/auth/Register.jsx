import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ErrorBanner from '../../components/ErrorBanner'

const ROLES = [
  { value: 'CUSTOMER', label: 'Customer', icon: 'person', description: 'Order food from restaurants' },
  { value: 'RESTAURANT_OWNER', label: 'Restaurant Owner', icon: 'storefront', description: 'Manage a restaurant & menu' },
]

export default function Register() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'CUSTOMER' })
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const data = await register(form)
      if (data.role === 'RESTAURANT_OWNER') {
        navigate('/restaurant/dashboard')
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
          <h1 className="text-2xl font-extrabold text-on-surface mt-2">Create your account</h1>
          <p className="text-on-surface-variant text-sm mt-1">Join FreshFeast in seconds</p>
        </div>

        {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((r) => (
              <button
                type="button"
                key={r.value}
                onClick={() => setForm({ ...form, role: r.value })}
                className={`p-3 rounded-md border text-left transition-colors ${
                  form.role === r.value
                    ? 'border-primary bg-primary-container/10'
                    : 'border-outline-variant hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-primary block mb-1">{r.icon}</span>
                <span className="font-semibold text-sm text-on-surface block">{r.label}</span>
                <span className="text-xs text-on-surface-variant">{r.description}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1">Full name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Jane Doe"
            />
          </div>
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
            <label className="block text-sm font-semibold text-on-surface mb-1">Phone (optional)</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+91 90000 00000"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="At least 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-bold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
