import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { restaurantApi } from '../../api/restaurantApi'
import { menuApi } from '../../api/menuApi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import Loading from '../../components/Loading'
import ErrorBanner from '../../components/ErrorBanner'

export default function RestaurantMenu() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const { addToCart, refreshCart } = useCart()

  const [restaurant, setRestaurant] = useState(null)
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addingId, setAddingId] = useState(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [r, menuItems, cats] = await Promise.all([
          restaurantApi.getById(id),
          menuApi.getMenuItems(id),
          menuApi.getCategories(id),
        ])
        setRestaurant(r)
        setItems(menuItems)
        setCategories(cats)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleAdd = async (itemId) => {
    setError(null)
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (user.role !== 'CUSTOMER') {
      setError('Only customer accounts can order food.')
      return
    }
    setAddingId(itemId)
    try {
      await addToCart(itemId, 1)
      await refreshCart()
    } catch (err) {
      setError(err.message)
    } finally {
      setAddingId(null)
    }
  }

  if (loading) return <Loading label="Loading menu..." />
  if (!restaurant) return null

  const grouped = categories.length
    ? categories.map((cat) => ({
        category: cat,
        items: items.filter((i) => i.categoryId === cat.id),
      }))
    : [{ category: { id: 'all', name: 'Menu' }, items }]

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-12 py-8">
      <div className="rounded-xl overflow-hidden mb-8 relative">
        <div className="aspect-[3/1] w-full bg-surface-container">
          {restaurant.imageUrl && (
            <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="p-6 bg-surface-container-lowest border border-outline-variant border-t-0 rounded-b-xl">
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface">{restaurant.name}</h1>
          <p className="text-on-surface-variant mt-1">{restaurant.description}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-sm font-semibold text-on-surface-variant">
            <span className="flex items-center gap-1 text-secondary">
              <span className="material-symbols-outlined text-base">star</span>
              {restaurant.rating?.toFixed(1) ?? 'New'}
            </span>
            <span>{restaurant.cuisineType}</span>
            {restaurant.avgDeliveryTimeMinutes && <span>{restaurant.avgDeliveryTimeMinutes} min delivery</span>}
            <span>{restaurant.address}</span>
          </div>
        </div>
      </div>

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      {grouped.map(({ category, items: catItems }) => catItems.length > 0 && (
        <section key={category.id} className="mb-8">
          <h2 className="text-xl font-bold text-on-surface mb-4">{category.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {catItems.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-surface-container-lowest border border-outline-variant rounded-lg">
                <div className="w-24 h-24 rounded-md bg-surface-container overflow-hidden shrink-0">
                  {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`inline-block w-3 h-3 rounded-sm border-2 mr-2 ${item.isVeg ? 'border-secondary' : 'border-error'}`}>
                        <span className={`block w-full h-full rounded-full scale-50 ${item.isVeg ? 'bg-secondary' : 'bg-error'}`} />
                      </span>
                      <span className="font-bold text-on-surface">{item.name}</span>
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant mt-1 line-clamp-2 flex-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold text-on-surface">₹{Number(item.price).toFixed(2)}</span>
                    <button
                      onClick={() => handleAdd(item.id)}
                      disabled={!item.isAvailable || addingId === item.id}
                      className="px-4 py-1.5 rounded-full text-sm font-bold border-2 border-secondary text-secondary hover:bg-secondary hover:text-on-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {!item.isAvailable ? 'Unavailable' : addingId === item.id ? 'Adding...' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
