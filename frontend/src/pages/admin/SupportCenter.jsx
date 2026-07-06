import { useEffect, useState } from 'react'
import { supportApi } from '../../api/supportApi'
import StatusBadge from '../../components/StatusBadge'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'
import ErrorBanner from '../../components/ErrorBanner'

export default function SupportCenter() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('OPEN')
  const [expandedId, setExpandedId] = useState(null)
  const [responseDraft, setResponseDraft] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await supportApi.getAll()
      setTickets(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load support tickets.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const toggleExpand = (ticket) => {
    if (expandedId === ticket.id) {
      setExpandedId(null)
    } else {
      setExpandedId(ticket.id)
      setResponseDraft(ticket.adminResponse || '')
    }
  }

  const handleUpdate = async (ticketId, updates) => {
    setSaving(true)
    try {
      const updated = await supportApi.update(ticketId, updates)
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update ticket.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = statusFilter === 'ALL' ? tickets : tickets.filter((t) => t.status === statusFilter)

  if (loading) return <Loading label="Loading support tickets..." />

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-1">Support Center</h1>
      <p className="text-on-surface-variant mb-6">Respond to customer and partner support requests.</p>

      {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ALL'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              statusFilter === s
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="support_agent" title="No tickets here" description="You're all caught up." />
      ) : (
        <div className="space-y-4">
          {filtered.map((ticket) => (
            <div key={ticket.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
              <button onClick={() => toggleExpand(ticket)} className="w-full text-left p-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-on-surface truncate">{ticket.subject}</p>
                  <p className="text-xs text-on-surface-variant">{ticket.userName} · {ticket.userEmail} · {new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
                <StatusBadge status={ticket.status} />
              </button>

              {expandedId === ticket.id && (
                <div className="px-5 pb-5 border-t border-outline-variant pt-4 space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant mb-1">Message</p>
                    <p className="text-sm text-on-surface whitespace-pre-wrap">{ticket.message}</p>
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-on-surface-variant mb-1">Admin response</p>
                    <textarea
                      rows={3}
                      value={responseDraft}
                      onChange={(e) => setResponseDraft(e.target.value)}
                      placeholder="Write a response to the user..."
                      className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={ticket.status}
                      onChange={(e) => handleUpdate(ticket.id, { status: e.target.value })}
                      className="px-3 py-2 rounded-md border border-outline-variant bg-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                      <option value="CLOSED">Closed</option>
                    </select>
                    <button
                      onClick={() => handleUpdate(ticket.id, { adminResponse: responseDraft })}
                      disabled={saving}
                      className="px-4 py-2 rounded-full text-sm font-bold bg-primary text-on-primary hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                      {saving ? 'Saving...' : 'Send response'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
