import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { analyticsApi } from '../../api/analyticsApi'
import { useMyRestaurant } from '../../utils/useMyRestaurant'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'
import ErrorBanner from '../../components/ErrorBanner'

const STATUS_LABELS = {
  PENDING: 'Pending', CONFIRMED: 'Confirmed', PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for delivery', DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
}

function StatCard({ icon, label, value, accent = 'text-primary' }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
      <span className={`material-symbols-outlined text-3xl ${accent}`}>{icon}</span>
      <p className="text-2xl font-extrabold text-on-surface mt-3">{value}</p>
      <p className="text-sm text-on-surface-variant">{label}</p>
    </div>
  )
}

export default function Analytics() {
  const { restaurant, loading: loadingRestaurant } = useMyRestaurant()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!restaurant) return
    async function load() {
      setLoading(true)
      try {
        const stats = await analyticsApi.getForRestaurant(restaurant.id)
        setData(stats)
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load analytics.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [restaurant])

  if (loadingRestaurant || loading) return <Loading label="Crunching the numbers..." />

  if (!restaurant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <EmptyState
          icon="storefront"
          title="Set up your restaurant first"
          description="Analytics will appear once your restaurant starts receiving orders."
          action={
            <Link to="/restaurant/profile" className="mt-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity">
              Set up restaurant
            </Link>
          }
        />
      </div>
    )
  }

  if (error) return <div className="max-w-5xl mx-auto px-4 py-8"><ErrorBanner message={error} /></div>

  const maxCount = Math.max(1, ...Object.values(data.ordersByStatus || {}))

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-1">Analytics</h1>
      <p className="text-on-surface-variant mb-6">{restaurant.name}</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="receipt_long" label="Total orders" value={data.totalOrders} accent="text-primary" />
        <StatCard icon="payments" label="Total revenue" value={`₹${Number(data.totalRevenue).toFixed(2)}`} accent="text-secondary" />
        <StatCard icon="bar_chart" label="Avg. order value" value={`₹${Number(data.averageOrderValue).toFixed(2)}`} accent="text-tertiary" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
          <h2 className="font-bold text-on-surface mb-4">Orders by status</h2>
          {Object.keys(data.ordersByStatus || {}).length === 0 ? (
            <p className="text-sm text-on-surface-variant">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.ordersByStatus).map(([status, count]) => (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-on-surface-variant">{STATUS_LABELS[status] || status}</span>
                    <span className="font-bold text-on-surface">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-container overflow-hidden">
                    <div
                      className="h-full bg-tertiary rounded-full"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
          <h2 className="font-bold text-on-surface mb-4">Top selling items</h2>
          {(!data.topMenuItems || data.topMenuItems.length === 0) ? (
            <p className="text-sm text-on-surface-variant">No sales yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topMenuItems.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-3">
                  <span className="h-7 w-7 rounded-full bg-primary-container/20 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface truncate">{item.name}</p>
                    <p className="text-xs text-on-surface-variant">{item.quantitySold} sold</p>
                  </div>
                  <span className="font-bold text-on-surface shrink-0">₹{Number(item.revenue).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
