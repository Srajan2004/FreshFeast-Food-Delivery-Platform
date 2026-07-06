import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { orderApi } from '../../api/orderApi'
import ErrorBanner from '../../components/ErrorBanner'
import EmptyState from '../../components/EmptyState'

export default function Checkout() {
  const { cart, clearCart } = useCart()
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState(null)

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <EmptyState icon="receipt_long" title="Nothing to check out" description="Your cart is empty." />
      </div>
    )
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    setError(null)
    setPlacing(true)
    try {
      const order = await orderApi.place({ deliveryAddress: address })
      await clearCart()
      navigate('/orders', { state: { justPlacedOrderId: order.id } })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-6">Checkout</h1>

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      <form onSubmit={handlePlaceOrder} className="space-y-6">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
          <h2 className="font-bold text-on-surface mb-4">Delivery address</h2>
          <textarea
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Flat / house no., street, city, pincode"
            className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
          <h2 className="font-bold text-on-surface mb-4">Order summary</h2>
          <div className="space-y-2 mb-4">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-on-surface-variant">
                <span>{item.quantity} × {item.menuItemName}</span>
                <span className="font-semibold text-on-surface">₹{Number(item.lineTotal).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-extrabold text-on-surface border-t border-outline-variant pt-4">
            <span>Total</span>
            <span>₹{Number(cart.subtotal).toFixed(2)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={placing}
          className="w-full bg-primary text-on-primary font-bold py-3.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {placing ? 'Placing order...' : `Place order · ₹${Number(cart.subtotal).toFixed(2)}`}
        </button>
      </form>
    </div>
  )
}
