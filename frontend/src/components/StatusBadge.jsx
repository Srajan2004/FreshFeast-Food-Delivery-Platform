const STATUS_STYLES = {
  PENDING: 'bg-surface-container-high text-on-surface-variant',
  CONFIRMED: 'bg-tertiary-container/20 text-tertiary',
  PREPARING: 'bg-primary-container/20 text-primary',
  OUT_FOR_DELIVERY: 'bg-tertiary text-on-tertiary',
  DELIVERED: 'bg-secondary-container text-on-secondary-container',
  CANCELLED: 'bg-error-container text-on-error-container',
  OPEN: 'bg-error-container text-on-error-container',
  IN_PROGRESS: 'bg-primary-container/20 text-primary',
  RESOLVED: 'bg-secondary-container text-on-secondary-container',
  CLOSED: 'bg-surface-container-high text-on-surface-variant',
  ACTIVE: 'bg-secondary-container text-on-secondary-container',
  SUSPENDED: 'bg-primary-container/20 text-primary',
  BANNED: 'bg-error-container text-on-error-container',
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-surface-container-high text-on-surface-variant'
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${style}`}>
      {status?.replace(/_/g, ' ')}
    </span>
  )
}
