import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

// ── BUTTON ────────────────────────────────────────────────
export function Button({ className, variant = 'default', size = 'md', loading, children, ...props }) {
  const variants = {
    default:   'bg-accent hover:bg-accent-dark text-white shadow-lg shadow-accent/20',
    ghost:     'bg-surface2 hover:bg-border text-muted hover:text-white border border-border',
    danger:    'bg-danger/15 hover:bg-danger/25 text-danger border border-danger/20',
    success:   'bg-success/15 hover:bg-success/25 text-success border border-success/20',
    outline:   'border border-border hover:border-accent/50 text-white hover:bg-surface2',
    secondary: 'bg-surface2 hover:bg-border text-white',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
  }
  return (
    <button
      className={cn('btn-base font-semibold', variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {children}
    </button>
  )
}

// ── INPUT ─────────────────────────────────────────────────
export function Input({ className, label, error, ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">{label}</label>}
      <input className={cn('input-base', error && 'border-danger', className)} {...props} />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}

// ── SELECT ────────────────────────────────────────────────
export function Select({ className, label, error, children, ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1.5">{label}</label>}
      <select className={cn('input-base', error && 'border-danger', className)} {...props}>
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  )
}

// ── BADGE ─────────────────────────────────────────────────
export function Badge({ status, children, className }) {
  const styles = {
    active:    'badge-active',
    trial:     'badge-trial',
    suspended: 'badge-suspended',
    cancelled: 'badge-cancelled',
    default:   'bg-muted/20 text-muted',
  }
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide',
      styles[status] || styles.default,
      className
    )}>
      {children}
    </span>
  )
}

// ── CARD ──────────────────────────────────────────────────
export function Card({ className, children, ...props }) {
  return (
    <div className={cn('card', className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return (
    <div className={cn('flex items-center justify-between px-5 py-4 border-b border-border', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('font-display font-bold text-base', className)}>{children}</h3>
}

export function CardBody({ className, children }) {
  return <div className={cn('p-5', className)}>{children}</div>
}

// ── MODAL ─────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, size = 'md' }) {
  if (!open) return null
  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
      <div className="absolute inset-0 bg-bg/80 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'relative w-full bg-surface border border-border rounded-2xl p-6 shadow-2xl animate-slideUp mx-4 max-h-[90vh] overflow-y-auto',
        sizes[size]
      )}>
        {title && <h2 className="font-display font-bold text-xl mb-5">{title}</h2>}
        {children}
      </div>
    </div>
  )
}

// ── CONFIRM DIALOG ────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, variant = 'danger' }) {
  if (!open) return null
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center">
        <div className="text-4xl mb-3">
          {variant === 'danger' ? '⚠️' : '✅'}
        </div>
        <h3 className="font-display font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant={variant} onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </Modal>
  )
}

// ── TOAST CONTAINER ───────────────────────────────────────
export function ToastContainer({ toasts, dismiss }) {
  return (
    <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-[9999]">
      {toasts.map(t => (
        <div key={t.id}
          onClick={() => dismiss(t.id)}
          className={cn(
            'flex items-start gap-3 px-4 py-3 rounded-xl border cursor-pointer',
            'bg-surface2 shadow-xl animate-slideUp min-w-[280px] max-w-[360px]',
            t.variant === 'destructive' ? 'border-danger/40' : 'border-success/40'
          )}>
          <span className="text-lg mt-0.5">
            {t.variant === 'destructive' ? '❌' : '✅'}
          </span>
          <div>
            {t.title && <p className="text-sm font-semibold">{t.title}</p>}
            {t.description && <p className="text-xs text-muted mt-0.5">{t.description}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── EMPTY STATE ───────────────────────────────────────────
export function EmptyState({ icon = '📭', title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-3 opacity-40">{icon}</div>
      <p className="font-semibold text-white">{title}</p>
      {desc && <p className="text-sm text-muted mt-1">{desc}</p>}
    </div>
  )
}

// ── SKELETON ──────────────────────────────────────────────
export function Skeleton({ className }) {
  return (
    <div className={cn(
      'rounded-lg bg-gradient-to-r from-surface2 via-border to-surface2 bg-[length:400%_100%] animate-shimmer',
      className
    )} />
  )
}

// ── STAT CARD ─────────────────────────────────────────────
export function StatCard({ icon, label, value, color = 'accent', trend }) {
  const colors = {
    accent:  'from-accent/20 to-accent/5 border-accent/20',
    orange:  'from-accent2/20 to-accent2/5 border-accent2/20',
    success: 'from-success/20 to-success/5 border-success/20',
    danger:  'from-danger/20 to-danger/5 border-danger/20',
    warning: 'from-warning/20 to-warning/5 border-warning/20',
  }
  const topLine = {
    accent: 'bg-accent', orange: 'bg-accent2',
    success: 'bg-success', danger: 'bg-danger', warning: 'bg-warning',
  }
  return (
    <div className={cn(
      'relative rounded-xl border bg-gradient-to-br p-5 overflow-hidden',
      colors[color]
    )}>
      <div className={cn('absolute top-0 left-0 right-0 h-0.5', topLine[color])} />
      <div className="text-2xl mb-3">{icon}</div>
      <div className="font-display font-extrabold text-4xl tracking-tight leading-none mb-1">{value}</div>
      <div className="text-xs text-muted font-semibold uppercase tracking-wide">{label}</div>
      {trend && (
        <div className={cn(
          'absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full',
          trend > 0 ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'
        )}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  )
}
