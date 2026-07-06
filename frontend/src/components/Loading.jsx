export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-on-surface-variant">
      <span className="material-symbols-outlined text-4xl animate-spin text-primary">progress_activity</span>
      <p className="font-medium">{label}</p>
    </div>
  )
}
