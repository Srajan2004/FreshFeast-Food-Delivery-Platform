import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { orderApi } from '../../api/orderApi'
import { useMyRestaurant } from '../../utils/useMyRestaurant'
import StatusBadge from '../../components/StatusBadge'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'
import ErrorBanner from '../../components/ErrorBanner'

const NEXT_STATUS = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'PREPARING',
  PREPARING: 'OUT_FOR_DELIVERY',
  OUT_FOR_DELIVERY: 'DELIVERED',
}

const NEXT_LABEL = {
  PENDING: 'Confirm order',
  CONFIRMED: 'Start preparing',
  PREPARING: 'Send for delivery',
  OUT_FOR_DELIVERY: 'Mark delivered',
}

export default function Dashboard() {
  const { restaurant, loading: loadingRestaurant } = useMyRestaurant()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [filter, setFilter] = useState('ACTIVE')

  const loadOrders = useCallback(async () => {
    if (!restaurant) return
    setLoading(true)
    try {
      const data = await orderApi.getForRestaurant(restaurant.id)
      setOrders(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load orders.')
    } finally {
      setLoading(false)
    }
  }, [restaurant])

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 15000)
    return () => clearInterval(interval)
  }, [loadOrders])

  const handleAdvance = async (order) => {
    const next = NEXT_STATUS[order.status]
    if (!next) return
    setUpdatingId(order.id)
    try {
      const updated = await orderApi.updateStatus(order.id, next)
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update order status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleCancel = async (order) => {
    setUpdatingId(order.id)
    try {
      const updated = await orderApi.updateStatus(order.id, 'CANCELLED')
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel order.')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loadingRestaurant) return <Loading label="Loading dashboard..." />

  if (!restaurant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <EmptyState
          icon="storefront"
          title="Set up your restaurant first"
          description="Create your restaurant profile to start receiving orders."
          action={
            <Link to="/restaurant/profile" className="mt-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity">
              Set up restaurant
            </Link>
          }
        />
      </div>
    )
  }

  const visibleOrders = orders.filter((o) => {
    if (filter === 'ALL') return true
    if (filter === 'ACTIVE') return !['DELIVERED', 'CANCELLED'].includes(o.status)
    return o.status === filter
  })

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-0 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface">{restaurant.name}</h1>
          <p className="text-on-surface-variant">Live orders dashboard</p>
        </div>
        <Link to="/restaurant/profile" className="text-sm font-semibold text-primary hover:underline">Edit profile</Link>
      </div>

      {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {['ACTIVE', 'ALL', 'PENDING', 'DELIVERED', 'CANCELLED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              filter === f
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'
            }`}
          >
            {f.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {loading && orders.length === 0 ? (
        <Loading label="Loading orders..." />
      ) : visibleOrders.length === 0 ? (
        <EmptyState icon="receipt_long" title="No orders here" description="New orders will appear automatically." />
      ) : (
        <div className="space-y-4">
          {visibleOrders.map((order) => (
            <div key={order.id} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="font-bold text-on-surface">Order #{order.id} · {order.customerName}</p>
                  <p className="text-xs text-on-surface-variant">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <StatusBadge status={order.status} />
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-on-surface-variant">
                    <span>{item.quantity} × {item.itemName}</span>
                    <span>₹{Number(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-on-surface-variant mb-4">Deliver to: {order.deliveryAddress}</p>

              <div className="flex items-center justify-between border-t border-outline-variant pt-4">
                <span className="font-extrabold text-on-surface">₹{Number(order.totalAmount).toFixed(2)}</span>
                <div className="flex gap-2">
                  {!['DELIVERED', 'CANCELLED'].includes(order.status) && (
                    <button
                      onClick={() => handleCancel(order)}
                      disabled={updatingId === order.id}
                      className="px-4 py-2 rounded-full text-sm font-semibold border border-error text-error hover:bg-error-container transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() => handleAdvance(order)}
                      disabled={updatingId === order.id}
                      className="px-4 py-2 rounded-full text-sm font-bold bg-secondary text-on-secondary hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {updatingId === order.id ? 'Updating...' : NEXT_LABEL[order.status]}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
