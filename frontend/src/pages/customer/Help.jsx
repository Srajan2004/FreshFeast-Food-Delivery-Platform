import { useEffect, useState } from 'react'
import { supportApi } from '../../api/supportApi'
import StatusBadge from '../../components/StatusBadge'
import Loading from '../../components/Loading'
import ErrorBanner from '../../components/ErrorBanner'
import EmptyState from '../../components/EmptyState'

export default function Help() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await supportApi.getMine()
      setTickets(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await supportApi.create(form)
      setForm({ subject: '', message: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your request.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-1">Help & Support</h1>
      <p className="text-on-surface-variant mb-6">Have an issue with an order or your account? Let us know.</p>

      {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-4 mb-8">
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1">Subject</label>
          <input
            required
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1">Message</label>
          <textarea
            required
            rows={4}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit request'}
        </button>
      </form>

      <h2 className="font-bold text-on-surface mb-4">Your requests</h2>
      {loading ? (
        <Loading label="Loading..." />
      ) : tickets.length === 0 ? (
        <EmptyState icon="support_agent" title="No requests yet" />
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <p className="font-bold text-on-surface">{t.subject}</p>
                <StatusBadge status={t.status} />
              </div>
              <p className="text-sm text-on-surface-variant mb-2">{t.message}</p>
              {t.adminResponse && (
                <div className="bg-surface-container rounded-md p-3 text-sm">
                  <p className="font-semibold text-on-surface mb-1">Support team response:</p>
                  <p className="text-on-surface-variant">{t.adminResponse}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
