export default function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="bg-error-container text-on-error-container px-4 py-3 rounded-md text-sm font-medium flex items-center gap-2">
      <span className="material-symbols-outlined text-lg">error</span>
      {message}
    </div>
  )
}
