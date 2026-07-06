import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import NotFound from './pages/NotFound'

import BrowseRestaurants from './pages/customer/BrowseRestaurants'
import RestaurantMenu from './pages/customer/RestaurantMenu'
import Cart from './pages/customer/Cart'
import Checkout from './pages/customer/Checkout'
import MyOrders from './pages/customer/MyOrders'
import Help from './pages/customer/Help'

import Dashboard from './pages/restaurant/Dashboard'
import MenuManager from './pages/restaurant/MenuManager'
import Analytics from './pages/restaurant/Analytics'
import MyRestaurant from './pages/restaurant/MyRestaurant'

import UserManagement from './pages/admin/UserManagement'
import SupportCenter from './pages/admin/SupportCenter'

function App() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main>
        <Routes>
          {/* Public / customer browsing */}
          <Route path="/" element={<BrowseRestaurants />} />
          <Route path="/restaurants/:id" element={<RestaurantMenu />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer (protected) */}
          <Route path="/cart" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}><Cart /></ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}><Checkout /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}><MyOrders /></ProtectedRoute>
          } />
          <Route path="/help" element={
            <ProtectedRoute><Help /></ProtectedRoute>
          } />

          {/* Restaurant owner (protected) */}
          <Route path="/restaurant/dashboard" element={
            <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}><Dashboard /></ProtectedRoute>
          } />
          <Route path="/restaurant/menu" element={
            <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}><MenuManager /></ProtectedRoute>
          } />
          <Route path="/restaurant/analytics" element={
            <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}><Analytics /></ProtectedRoute>
          } />
          <Route path="/restaurant/profile" element={
            <ProtectedRoute allowedRoles={['RESTAURANT_OWNER']}><MyRestaurant /></ProtectedRoute>
          } />

          {/* Admin (protected) */}
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><UserManagement /></ProtectedRoute>
          } />
          <Route path="/admin/support" element={
            <ProtectedRoute allowedRoles={['ADMIN']}><SupportCenter /></ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
