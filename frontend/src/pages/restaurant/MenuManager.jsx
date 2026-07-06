import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { menuApi } from '../../api/menuApi'
import { useMyRestaurant } from '../../utils/useMyRestaurant'
import Loading from '../../components/Loading'
import EmptyState from '../../components/EmptyState'
import ErrorBanner from '../../components/ErrorBanner'

const EMPTY_ITEM = { name: '', description: '', price: '', imageUrl: '', isVeg: true, isAvailable: true, categoryId: '' }

export default function MenuManager() {
  const { restaurant, loading: loadingRestaurant } = useMyRestaurant()
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [newCategory, setNewCategory] = useState('')
  const [itemForm, setItemForm] = useState(EMPTY_ITEM)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  const loadMenu = useCallback(async () => {
    if (!restaurant) return
    setLoading(true)
    try {
      const [cats, menuItems] = await Promise.all([
        menuApi.getCategories(restaurant.id),
        menuApi.getMenuItems(restaurant.id),
      ])
      setCategories(cats)
      setItems(menuItems)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load menu.')
    } finally {
      setLoading(false)
    }
  }, [restaurant])

  useEffect(() => {
    loadMenu()
  }, [loadMenu])

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.trim()) return
    try {
      await menuApi.addCategory(restaurant.id, { name: newCategory, displayOrder: categories.length + 1 })
      setNewCategory('')
      loadMenu()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add category.')
    }
  }

  const resetItemForm = () => {
    setItemForm(EMPTY_ITEM)
    setEditingId(null)
  }

  const handleEditClick = (item) => {
    setItemForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      imageUrl: item.imageUrl || '',
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
      categoryId: item.categoryId || '',
    })
    setEditingId(item.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmitItem = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const payload = { ...itemForm, price: Number(itemForm.price), categoryId: itemForm.categoryId || null }
      if (editingId) {
        await menuApi.updateMenuItem(editingId, payload)
      } else {
        await menuApi.addMenuItem(restaurant.id, payload)
      }
      resetItemForm()
      loadMenu()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save menu item.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (itemId) => {
    if (!confirm('Remove this item from the menu?')) return
    try {
      await menuApi.deleteMenuItem(itemId)
      loadMenu()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete item.')
    }
  }

  const toggleAvailability = async (item) => {
    try {
      await menuApi.updateMenuItem(item.id, {
        name: item.name, description: item.description, price: item.price,
        imageUrl: item.imageUrl, isVeg: item.isVeg, categoryId: item.categoryId,
        isAvailable: !item.isAvailable,
      })
      loadMenu()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update availability.')
    }
  }

  if (loadingRestaurant) return <Loading label="Loading..." />

  if (!restaurant) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <EmptyState
          icon="storefront"
          title="Set up your restaurant first"
          description="You need a restaurant profile before you can add menu items."
          action={
            <Link to="/restaurant/profile" className="mt-2 px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity">
              Set up restaurant
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-0 py-8">
      <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface mb-1">Menu Manager</h1>
      <p className="text-on-surface-variant mb-6">{restaurant.name}</p>

      {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
          <h2 className="font-bold text-on-surface mb-4">Categories</h2>
          <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
            <input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Desserts"
              className="flex-1 px-3 py-2 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <button type="submit" className="px-4 py-2 rounded-md bg-secondary text-on-secondary text-sm font-bold hover:opacity-90">Add</button>
          </form>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <span key={c.id} className="px-3 py-1.5 rounded-full bg-surface-container text-sm font-semibold text-on-surface-variant">
                {c.name}
              </span>
            ))}
            {categories.length === 0 && <p className="text-sm text-on-surface-variant">No categories yet.</p>}
          </div>
        </div>

        <form onSubmit={handleSubmitItem} className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-3">
          <h2 className="font-bold text-on-surface">{editingId ? 'Edit item' : 'Add menu item'}</h2>
          <input
            required
            value={itemForm.name}
            onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
            placeholder="Item name"
            className="w-full px-3 py-2 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <textarea
            rows={2}
            value={itemForm.description}
            onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
            placeholder="Description"
            className="w-full px-3 py-2 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={itemForm.price}
              onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
              placeholder="Price"
              className="w-full px-3 py-2 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            <select
              value={itemForm.categoryId}
              onChange={(e) => setItemForm({ ...itemForm, categoryId: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option value="">No category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <input
            value={itemForm.imageUrl}
            onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
            placeholder="Image URL"
            className="w-full px-3 py-2 rounded-md border border-outline-variant bg-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <label className="flex items-center gap-2 text-sm font-semibold text-on-surface">
            <input
              type="checkbox"
              checked={itemForm.isVeg}
              onChange={(e) => setItemForm({ ...itemForm, isVeg: e.target.checked })}
              className="h-4 w-4 accent-secondary"
            />
            Vegetarian
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-primary text-on-primary font-bold py-2.5 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add item'}
            </button>
            {editingId && (
              <button type="button" onClick={resetItemForm} className="px-4 py-2.5 rounded-full border border-outline-variant text-sm font-semibold">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h2 className="font-bold text-on-surface mb-4">Current menu</h2>
      {loading ? (
        <Loading label="Loading menu..." />
      ) : items.length === 0 ? (
        <EmptyState icon="restaurant_menu" title="No menu items yet" description="Add your first dish using the form above." />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant rounded-lg p-4">
              <div className="w-14 h-14 rounded-md bg-surface-container overflow-hidden shrink-0">
                {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-on-surface truncate">{item.name}</p>
                <p className="text-sm text-on-surface-variant">₹{Number(item.price).toFixed(2)} {item.categoryName && `· ${item.categoryName}`}</p>
              </div>
              <button
                onClick={() => toggleAvailability(item)}
                className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${item.isAvailable ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-on-surface-variant'}`}
              >
                {item.isAvailable ? 'Available' : 'Unavailable'}
              </button>
              <button onClick={() => handleEditClick(item)} className="text-outline hover:text-primary transition-colors shrink-0">
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button onClick={() => handleDelete(item.id)} className="text-outline hover:text-error transition-colors shrink-0">
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
