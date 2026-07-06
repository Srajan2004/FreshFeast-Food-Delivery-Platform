import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'
import ErrorBanner from '../../components/ErrorBanner'

export default function Cart() {
  const { cart, loading, error, refreshCart, updateQuantity, removeItem } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    refreshCart()
  }, [refreshCart])

  if (loading && cart.items.length === 0) return <Loading label="Loading your cart..." />

  if (cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <EmptyState
          icon="shopping_cart"
          title="Your cart is empty"
          description="Browse restaurants and add some delicious food to get started."
          action={
            <Link to="/" className="mt-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity">
              Browse restaurants
            </Link>
          }
        />
      </div>
    )
  }

  const restaurantName = cart.items[0]?.restaurantName

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-1">Your Cart</h1>
      {restaurantName && <p className="text-on-surface-variant mb-6">from {restaurantName}</p>}

      {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg divide-y divide-outline-variant">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4">
            <div className="w-16 h-16 rounded-md bg-surface-container overflow-hidden shrink-0">
              {item.imageUrl && <img src={item.imageUrl} alt={item.menuItemName} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-on-surface truncate">{item.menuItemName}</p>
              <p className="text-sm text-on-surface-variant">₹{Number(item.price).toFixed(2)} each</p>
            </div>
            <div className="flex items-center gap-2 bg-surface-container rounded-full px-1">
              <button
                onClick={() => item.quantity <= 1 ? removeItem(item.id) : updateQuantity(item.id, item.quantity - 1)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-secondary hover:bg-secondary-container/50 font-bold"
              >
                −
              </button>
              <span className="w-6 text-center font-bold text-on-surface">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="h-8 w-8 rounded-full flex items-center justify-center text-secondary hover:bg-secondary-container/50 font-bold"
              >
                +
              </button>
            </div>
            <p className="w-20 text-right font-bold text-on-surface shrink-0">₹{Number(item.lineTotal).toFixed(2)}</p>
            <button
              onClick={() => removeItem(item.id)}
              className="text-outline hover:text-error transition-colors shrink-0"
              aria-label="Remove item"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
        <div className="flex items-center justify-between text-on-surface-variant mb-2">
          <span>Subtotal ({cart.totalItems} items)</span>
          <span className="font-semibold text-on-surface">₹{Number(cart.subtotal).toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-on-surface-variant mb-4 text-sm">
          <span>Delivery fee</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex items-center justify-between text-lg font-extrabold text-on-surface border-t border-outline-variant pt-4 mb-6">
          <span>Total</span>
          <span>₹{Number(cart.subtotal).toFixed(2)}</span>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full bg-primary text-on-primary font-bold py-3.5 rounded-full hover:opacity-90 transition-opacity"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  )
}
