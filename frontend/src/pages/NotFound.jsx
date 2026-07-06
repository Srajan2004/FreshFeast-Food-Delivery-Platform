import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4 text-center px-4">
      <span className="material-symbols-outlined text-6xl text-outline">search_off</span>
      <h1 className="text-3xl font-extrabold text-on-surface">Page not found</h1>
      <p className="text-on-surface-variant max-w-sm">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/" className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity">
        Go home
      </Link>
    </div>
  )
}
