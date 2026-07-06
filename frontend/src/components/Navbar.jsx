import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()
  const { cart } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleHome = () => {
    if (!user) return '/'
    if (user.role === 'RESTAURANT_OWNER') return '/restaurant/dashboard'
    if (user.role === 'ADMIN') return '/admin/users'
    return '/'
  }

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur border-b border-outline-variant">
      <div className="max-w-7xl mx-auto px-4 md:px-12 h-16 flex items-center justify-between">
        <Link to={roleHome()} className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-3xl">restaurant</span>
          <span className="text-xl font-extrabold tracking-tight text-on-surface">FreshFeast</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-on-surface-variant">
          {(!isAuthenticated || user.role === 'CUSTOMER') && (
            <Link to="/" className="hover:text-primary transition-colors">Browse</Link>
          )}
          {isAuthenticated && user.role === 'CUSTOMER' && (
            <>
              <Link to="/orders" className="hover:text-primary transition-colors">My Orders</Link>
              <Link to="/help" className="hover:text-primary transition-colors">Help</Link>
            </>
          )}
          {isAuthenticated && user.role === 'RESTAURANT_OWNER' && (
            <>
              <Link to="/restaurant/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
              <Link to="/restaurant/analytics" className="hover:text-primary transition-colors">Analytics</Link>
              <Link to="/restaurant/menu" className="hover:text-primary transition-colors">Menu</Link>
            </>
          )}
          {isAuthenticated && user.role === 'ADMIN' && (
            <>
              <Link to="/admin/users" className="hover:text-primary transition-colors">Users</Link>
              <Link to="/admin/support" className="hover:text-primary transition-colors">Support</Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && user.role === 'CUSTOMER' && (
            <Link to="/cart" className="relative flex items-center justify-center h-10 w-10 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined text-on-surface">shopping_cart</span>
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.totalItems}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:block text-sm font-medium text-on-surface-variant">Hi, {user.name.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full text-sm font-semibold border border-outline-variant hover:bg-surface-container transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 rounded-full text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors">
                Log in
              </Link>
              <Link to="/register" className="px-4 py-2 rounded-full text-sm font-semibold bg-primary text-on-primary hover:opacity-90 transition-opacity">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
