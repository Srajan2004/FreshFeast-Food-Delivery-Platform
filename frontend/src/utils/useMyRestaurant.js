import { useEffect, useState, useCallback } from 'react'
import { restaurantApi } from '../api/restaurantApi'

export function useMyRestaurant() {
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const mine = await restaurantApi.getMine()
      setRestaurant(mine.length > 0 ? mine[0] : null)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your restaurant.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { restaurant, loading, error, reload: load }
}
