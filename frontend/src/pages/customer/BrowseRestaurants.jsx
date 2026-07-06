import { useEffect, useState } from 'react'
import { restaurantApi } from '../../api/restaurantApi'
import RestaurantCard from '../../components/RestaurantCard'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'

const CUISINE_FILTERS = ['All', 'Italian', 'Fast Food', 'Indian', 'Chinese', 'Desserts']

export default function BrowseRestaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCuisine, setActiveCuisine] = useState('All')

  const loadRestaurants = async (query) => {
    setLoading(true)
    try {
      const data = await restaurantApi.getAll(query)
      setRestaurants(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRestaurants()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    loadRestaurants(search)
  }

  const filtered = restaurants.filter((r) =>
    activeCuisine === 'All' ? true : r.cuisineType?.toLowerCase().includes(activeCuisine.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-8">
      <div className="bg-gradient-to-br from-primary to-primary-container rounded-xl p-8 md:p-12 text-on-primary mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Craving something delicious?</h1>
        <p className="text-white/90 mb-6">Order from the best restaurants near you, delivered fast and fresh.</p>
        <form onSubmit={handleSearch} className="max-w-xl">
          <div className="flex items-center bg-white rounded-full shadow-elevated px-5 py-3 gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants or cuisines..."
              className="flex-1 outline-none text-on-surface bg-transparent"
            />
            <button type="submit" className="text-primary font-bold text-sm">Search</button>
          </div>
        </form>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {CUISINE_FILTERS.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCuisine(c)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              activeCuisine === c
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <Loading label="Finding great food near you..." />
      ) : filtered.length === 0 ? (
        <EmptyState icon="storefront" title="No restaurants found" description="Try a different search or filter." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
        </div>
      )}
    </div>
  )
}
