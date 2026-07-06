import { Link } from 'react-router-dom'

export default function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="group block bg-surface-container-lowest rounded-lg overflow-hidden border border-outline-variant shadow-card hover:shadow-elevated hover:-translate-y-0.5 transition-all"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container">
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-outline">
            <span className="material-symbols-outlined text-4xl">restaurant</span>
          </div>
        )}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Closed</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-on-surface text-lg leading-tight">{restaurant.name}</h3>
          <span className="flex items-center gap-1 bg-secondary-container text-on-secondary-container text-xs font-bold px-2 py-1 rounded-full shrink-0">
            <span className="material-symbols-outlined text-sm">star</span>
            {restaurant.rating?.toFixed(1) ?? 'New'}
          </span>
        </div>
        <p className="text-sm text-on-surface-variant mt-1">{restaurant.cuisineType}</p>
        <div className="flex items-center gap-3 mt-3 text-xs font-semibold text-on-surface-variant">
          {restaurant.avgDeliveryTimeMinutes && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              {restaurant.avgDeliveryTimeMinutes} min
            </span>
          )}
          {restaurant.priceRange && <span>{restaurant.priceRange}</span>}
        </div>
      </div>
    </Link>
  )
}
