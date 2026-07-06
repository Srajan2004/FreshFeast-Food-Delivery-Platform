import { useEffect, useState } from 'react'
import { adminApi } from '../../api/adminApi'
import Loading from '../../components/Loading'
import ErrorBanner from '../../components/ErrorBanner'
import EmptyState from '../../components/EmptyState'

const ROLE_ICONS = { CUSTOMER: 'person', RESTAURANT_OWNER: 'storefront', ADMIN: 'shield_person' }

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getUsers()
      setUsers(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleStatusChange = async (userId, status) => {
    setUpdatingId(userId)
    try {
      const updated = await adminApi.updateUserStatus(userId, status)
      setUsers((prev) => prev.map((u) => (u.id === userId ? updated : u)))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update user status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = users.filter((u) => {
    const roleMatch = roleFilter === 'ALL' || u.role === roleFilter
    const searchMatch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    return roleMatch && searchMatch
  })

  if (loading) return <Loading label="Loading users..." />

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-0 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-1">User Management</h1>
      <p className="text-on-surface-variant mb-6">Manage customers, restaurant owners, and their access.</p>

      {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-1 px-4 py-2.5 rounded-md border border-outline-variant bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        />
        <div className="flex gap-2 overflow-x-auto">
          {['ALL', 'CUSTOMER', 'RESTAURANT_OWNER', 'ADMIN'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                roleFilter === r
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="group" title="No users found" description="Try a different search or filter." />
      ) : (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-container text-on-surface-variant text-left uppercase text-xs tracking-wide">
              <tr>
                <th className="px-5 py-3 font-bold">User</th>
                <th className="px-5 py-3 font-bold">Role</th>
                <th className="px-5 py-3 font-bold">Status</th>
                <th className="px-5 py-3 font-bold">Joined</th>
                <th className="px-5 py-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-bold text-on-surface">{u.name}</p>
                    <p className="text-on-surface-variant text-xs">{u.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1.5 text-on-surface-variant font-semibold">
                      <span className="material-symbols-outlined text-base">{ROLE_ICONS[u.role]}</span>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                      u.status === 'ACTIVE' ? 'bg-secondary-container text-on-secondary-container'
                      : u.status === 'SUSPENDED' ? 'bg-primary-container/20 text-primary'
                      : 'bg-error-container text-on-error-container'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-on-surface-variant">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    {u.role === 'ADMIN' ? (
                      <span className="text-xs text-on-surface-variant">—</span>
                    ) : (
                      <select
                        value={u.status}
                        disabled={updatingId === u.id}
                        onChange={(e) => handleStatusChange(u.id, e.target.value)}
                        className="px-3 py-1.5 rounded-md border border-outline-variant bg-surface text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="BANNED">Banned</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
