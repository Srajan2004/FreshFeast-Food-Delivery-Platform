import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { orderApi } from '../../api/orderApi'
import StatusBadge from '../../components/StatusBadge'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'

const TRACKER_STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']

export default function MyOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const justPlacedOrderId = location.state?.justPlacedOrderId

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await orderApi.getMine()
        setOrders(data)
      } finally {
        setLoading(false)
      }
    }
    load()
    const interval = setInterval(load, 15000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <Loading label="Loading your orders..." />

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <EmptyState icon="receipt_long" title="No orders yet" description="Your order history will show up here once you place an order." />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0 py-8 space-y-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-2">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className={`bg-surface-container-lowest border rounded-lg p-6 ${order.id === justPlacedOrderId ? 'border-secondary ring-2 ring-secondary/30' : 'border-outline-variant'}`}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="font-bold text-on-surface">{order.restaurantName}</p>
              <p className="text-xs text-on-surface-variant">Order #{order.id} · {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {order.status !== 'CANCELLED' && (
            <div className="flex items-center mb-5">
              {TRACKER_STEPS.map((step, idx) => {
                const currentIdx = TRACKER_STEPS.indexOf(order.status)
                const done = idx <= currentIdx
                return (
                  <div key={step} className="flex-1 flex items-center last:flex-none">
                    <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${done ? 'bg-tertiary' : 'bg-surface-container-high'}`} />
                    {idx < TRACKER_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 ${idx < currentIdx ? 'bg-tertiary' : 'bg-surface-container-high'}`} />
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <div className="space-y-1 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-on-surface-variant">
                <span>{item.quantity} × {item.itemName}</span>
                <span>₹{Number(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-outline-variant pt-4">
            <span className="text-sm text-on-surface-variant">{order.deliveryAddress}</span>
            <span className="font-extrabold text-on-surface">₹{Number(order.totalAmount).toFixed(2)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
