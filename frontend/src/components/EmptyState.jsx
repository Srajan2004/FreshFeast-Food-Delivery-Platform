export default function EmptyState({ icon = 'inbox', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-4">
      <span className="material-symbols-outlined text-5xl text-outline">{icon}</span>
      <h3 className="text-lg font-bold text-on-surface">{title}</h3>
      {description && <p className="text-on-surface-variant max-w-sm">{description}</p>}
      {action}
    </div>
  )
}
