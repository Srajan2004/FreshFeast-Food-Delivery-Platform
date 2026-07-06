import { useEffect, useState } from 'react'
import { restaurantApi } from '../../api/restaurantApi'
import ErrorBanner from '../../components/ErrorBanner'
import Loading from '../../components/Loading'

const EMPTY_FORM = {
  name: '', description: '', cuisineType: '', address: '',
  imageUrl: '', priceRange: '$$', isOpen: true, avgDeliveryTimeMinutes: 30,
}

export default function MyRestaurant({ onSaved }) {
  const [restaurant, setRestaurant] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const mine = await restaurantApi.getMine()
        if (mine.length > 0) {
          setRestaurant(mine[0])
          setForm({ ...EMPTY_FORM, ...mine[0] })
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)
    try {
      let saved;
      if (restaurant) {
        saved = await restaurantApi.update(restaurant.id, form)
      } else {
        saved = await restaurantApi.create(form)
      }
      setRestaurant(saved)
      setSuccess(true)
      onSaved?.(saved)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save restaurant details.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loading label="Loading your restaurant..." />

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-0 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-1">
        {restaurant ? 'Restaurant Profile' : 'Set up your restaurant'}
      </h1>
      <p className="text-on-surface-variant mb-6">
        {restaurant ? 'Update your restaurant details.' : 'Tell customers about your restaurant before you add menu items.'}
      </p>

      {error && <div className="mb-4"><ErrorBanner message={error} /></div>}
      {success && (
        <div className="mb-4 bg-secondary-container text-on-secondary-container px-4 py-3 rounded-md text-sm font-medium">
          Saved successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1">Restaurant name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1">Cuisine type</label>
            <input
              value={form.cuisineType}
              onChange={(e) => setForm({ ...form, cuisineType: e.target.value })}
              placeholder="e.g. Italian, Fast Food"
              className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1">Price range</label>
            <select
              value={form.priceRange}
              onChange={(e) => setForm({ ...form, priceRange: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="$">$ Budget</option>
              <option value="$$">$$ Moderate</option>
              <option value="$$$">$$$ Premium</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1">Address</label>
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-on-surface mb-1">Image URL</label>
          <input
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            placeholder="https://..."
            className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-1">Avg. delivery time (min)</label>
            <input
              type="number"
              min={5}
              value={form.avgDeliveryTimeMinutes}
              onChange={(e) => setForm({ ...form, avgDeliveryTimeMinutes: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <label className="flex items-center gap-2 font-semibold text-on-surface pb-3">
            <input
              type="checkbox"
              checked={form.isOpen}
              onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
              className="h-5 w-5 accent-primary"
            />
            Currently open
          </label>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-on-primary font-bold py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {saving ? 'Saving...' : restaurant ? 'Save changes' : 'Create restaurant'}
        </button>
      </form>
    </div>
  )
}
