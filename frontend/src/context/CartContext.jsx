import { createContext, useContext, useState, useCallback } from 'react'
import { cartApi } from '../api/cartApi'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  const [cart, setCart] = useState({ items: [], subtotal: 0, totalItems: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated || user?.role !== 'CUSTOMER') return
    setLoading(true)
    try {
      const data = await cartApi.getCart()
      setCart(data)
    } catch (err) {
      // silently ignore - cart is best-effort
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  const addToCart = useCallback(async (menuItemId, quantity = 1) => {
    setError(null)
    try {
      const data = await cartApi.addItem({ menuItemId, quantity })
      setCart(data)
      return data
    } catch (err) {
      const message = err.response?.data?.message || 'Could not add item to cart.'
      setError(message)
      throw new Error(message)
    }
  }, [])

  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    const data = await cartApi.updateItem(cartItemId, { quantity })
    setCart(data)
  }, [])

  const removeItem = useCallback(async (cartItemId) => {
    const data = await cartApi.removeItem(cartItemId)
    setCart(data)
  }, [])

  const clearCart = useCallback(async () => {
    await cartApi.clearCart()
    setCart({ items: [], subtotal: 0, totalItems: 0 })
  }, [])

  return (
    <CartContext.Provider value={{ cart, loading, error, refreshCart, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
