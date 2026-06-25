import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

// ── BUTTON ────────────────────────────────────────────────
export function Button({
  className,
  variant = 'default',
  size = 'md',
  loading,
  children,
  ...props
}) {

  const variants = {
    default:
      `
      bg-blue-500
      hover:bg-blue-600
      text-white
      shadow-md
      shadow-blue-200/50
      `,

    ghost:
      `
      bg-slate-100
      hover:bg-slate-200
      text-slate-700
      border
      border-slate-200
      `,

    danger:
      `
      bg-red-50
      hover:bg-red-100

      text-red-600

      border
      border-red-200
      `,

    success:
      `
      bg-emerald-50
      hover:bg-emerald-100

      text-emerald-600

      border
      border-emerald-200
      `,

    outline:
      `
      border
      border-slate-300

      hover:border-blue-400
      hover:bg-slate-50

      text-slate-700
      `,

    secondary:
      `
      bg-slate-100
      hover:bg-slate-200

      text-slate-800
      `,
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
  }

  return (
    <button
      className={cn(
        `
        inline-flex
        items-center
        justify-center
        gap-2

        font-semibold

        transition-all
        duration-150

        disabled:opacity-50
        disabled:cursor-not-allowed
        `,
        variants[variant],
        sizes[size],
        className
      )}

      disabled={loading || props.disabled}

      {...props}
    >

      {loading && (
        <Loader2
          className="
            w-4
            h-4
            animate-spin
          "
        />
      )}

      {children}

    </button>
  )
}

// ── INPUT ─────────────────────────────────────────────────
export function Input({
  className,
  label,
  error,
  ...props
}) {

  return (
    <div className="w-full">

      {label && (
        <label
          className="
            block

            text-xs
            font-bold

            text-slate-500

            uppercase
            tracking-[0.15em]

            mb-2
          "
        >
          {label}
        </label>
      )}

      <input
        className={cn(
          `
          w-full

          h-11

          px-4

          rounded-xl

          bg-slate-50

          border
          border-slate-200

          text-sm
          font-medium
          text-slate-900

          placeholder:text-slate-400

          focus:outline-none
          focus:ring-4
          focus:ring-blue-100
          focus:border-blue-500

          transition-all
          `,
          error && 'border-red-400',
          className
        )}

        {...props}
      />

      {error && (
        <p
          className="
            mt-1.5

            text-xs
            font-medium

            text-red-500
          "
        >
          {error}
        </p>
      )}

    </div>
  )
}

// ── SELECT ────────────────────────────────────────────────
export function Select({
  className,
  label,
  error,
  children,
  ...props
}) {

  return (
    <div className="w-full">

      {label && (
        <label
          className="
            block

            text-xs
            font-bold

            text-slate-500

            uppercase
            tracking-[0.15em]

            mb-2
          "
        >
          {label}
        </label>
      )}

      <select
        className={cn(
          `
          w-full

          h-11

          px-4

          rounded-xl

          bg-slate-50

          border
          border-slate-200

          text-sm
          font-medium
          text-slate-900

          focus:outline-none
          focus:ring-4
          focus:ring-blue-100
          focus:border-blue-500

          transition-all
          `,
          error && 'border-red-400',
          className
        )}

        {...props}
      >
        {children}
      </select>

      {error && (
        <p
          className="
            mt-1.5

            text-xs
            font-medium

            text-red-500
          "
        >
          {error}
        </p>
      )}

    </div>
  )
}

// ── BADGE ─────────────────────────────────────────────────
export function Badge({
  status,
  children,
  className,
}) {

  const styles = {
    active:
      'bg-emerald-100 text-emerald-700',

    trial:
      'bg-amber-100 text-amber-700',

    suspended:
      'bg-red-100 text-red-700',

    cancelled:
      'bg-slate-100 text-slate-600',

    default:
      'bg-slate-100 text-slate-600',
  }

  return (
    <span
      className={cn(
        `
        inline-flex
        items-center

        px-2.5
        py-1

        rounded-full

        text-[11px]
        font-semibold

        tracking-wide
        `,
        styles[status] ||
        styles.default,
        className
      )}
    >
      {children}
    </span>
  )
}

// ── CARD ──────────────────────────────────────────────────
export function Card({
  className,
  children,
  ...props
}) {

  return (
    <div
      className={cn(
        `
        bg-white/90

        backdrop-blur-xl

        border
        border-slate-200/70

        rounded-2xl

        shadow-sm
        `,
        className
      )}

      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  className,
  children,
}) {

  return (
    <div
      className={cn(
        `
        flex
        items-center
        justify-between

        px-5
        py-4

        border-b
        border-slate-100
        `,
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardTitle({
  className,
  children,
}) {

  return (
    <h3
      className={cn(
        `
        text-base
        font-bold
        tracking-tight

        text-slate-900
        `,
        className
      )}
    >
      {children}
    </h3>
  )
}

export function CardBody({
  className,
  children,
}) {

  return (
    <div
      className={cn(
        'p-5',
        className
      )}
    >
      {children}
    </div>
  )
}

// ── MODAL ─────────────────────────────────────────────────
export function Modal({
  open,
  onClose,
  title,
  children,
  size = 'md',
}) {

  if (!open) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-50

        flex
        items-center
        justify-center

        animate-fadeIn
      "
    >

      <div
        className="
          absolute
          inset-0

          bg-slate-900/20

          backdrop-blur-sm
        "

        onClick={onClose}
      />

      <div
        className={cn(
          `
          relative

          w-full

          bg-white/95

          backdrop-blur-xl

          border
          border-slate-200/70

          rounded-3xl

          p-6

          shadow-[0_20px_60px_rgba(15,23,42,0.12)]

          animate-slideUp

          mx-4

          max-h-[90vh]
          overflow-y-auto
          `,
          sizes[size]
        )}
      >

        {title && (
          <h2
            className="
              text-xl
              font-black

              tracking-tight

              text-slate-900

              mb-5
            "
          >
            {title}
          </h2>
        )}

        {children}

      </div>

    </div>
  )
}

// ── CONFIRM DIALOG ────────────────────────────────────────
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  variant = 'danger',
}) {

  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
    >

      <div className="text-center">

        <div className="text-5xl mb-4">
          {variant === 'danger'
            ? '⚠️'
            : '✅'}
        </div>

        <h3
          className="
            text-lg
            font-bold

            text-slate-900

            mb-2
          "
        >
          {title}
        </h3>

        <p
          className="
            text-sm
            text-slate-500

            mb-6
          "
        >
          {message}
        </p>

        <div
          className="
            flex
            gap-3
            justify-center
          "
        >
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant={variant}
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </div>

      </div>

    </Modal>
  )
}

// ── TOAST CONTAINER ───────────────────────────────────────
export function ToastContainer({
  toasts,
  dismiss,
}) {

  return (
    <div
      className="
        fixed
        bottom-5
        right-5

        flex
        flex-col
        gap-2

        z-[9999]
      "
    >

      {toasts.map((t) => (

        <div
          key={t.id}

          onClick={() =>
            dismiss(t.id)
          }

          className={cn(
            `
            flex
            items-start
            gap-3

            px-4
            py-3

            rounded-2xl

            border

            cursor-pointer

            bg-white

            shadow-lg

            min-w-[280px]
            max-w-[360px]

            animate-slideUp
            `,

            t.variant ===
            'destructive'
              ? 'border-red-200'
              : 'border-emerald-200'
          )}
        >

          <span className="text-lg mt-0.5">
            {t.variant ===
            'destructive'
              ? '❌'
              : '✅'}
          </span>

          <div>

            {t.title && (
              <p
                className="
                  text-sm
                  font-semibold

                  text-slate-900
                "
              >
                {t.title}
              </p>
            )}

            {t.description && (
              <p
                className="
                  text-xs
                  text-slate-500

                  mt-0.5
                "
              >
                {t.description}
              </p>
            )}

          </div>

        </div>

      ))}

    </div>
  )
}

// ── EMPTY STATE ───────────────────────────────────────────
export function EmptyState({
  icon = '📭',
  title,
  desc,
}) {

  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center

        py-16

        text-center
      "
    >

      <div
        className="
          text-5xl
          mb-3
          opacity-40
        "
      >
        {icon}
      </div>

      <p
        className="
          font-bold
          text-slate-900
        "
      >
        {title}
      </p>

      {desc && (
        <p
          className="
            text-sm
            text-slate-500

            mt-1
          "
        >
          {desc}
        </p>
      )}

    </div>
  )
}

// ── SKELETON ──────────────────────────────────────────────
export function Skeleton({
  className,
}) {

  return (
    <div
      className={cn(
        `
        relative
        overflow-hidden

        rounded-2xl

        bg-gradient-to-r
        from-[#F8FAFC]
        via-[#FFFFFF]
        to-[#F8FAFC]

        border
        border-[#F1F5F9]

        bg-[length:400%_100%]

        animate-shimmer
        `,
        className
      )}
    />
  )
}

// ── STAT CARD ─────────────────────────────────────────────
export function StatCard({
  icon,
  label,
  value,
  color = 'accent',
  trend,
}) {

  const colors = {
    accent:
      'from-blue-50 to-white border-blue-100',

    orange:
      'from-violet-50 to-white border-violet-100',

    success:
      'from-emerald-50 to-white border-emerald-100',

    danger:
      'from-red-50 to-white border-red-100',

    warning:
      'from-amber-50 to-white border-amber-100',
  }

  const topLine = {
    accent:
      'bg-blue-400',

    orange:
      'bg-violet-400',

    success:
      'bg-emerald-400',

    danger:
      'bg-red-400',

    warning:
      'bg-amber-400',
  }

  return (
    <div
      className={cn(
        `
        relative

        rounded-2xl

        border

        bg-gradient-to-br

        p-5

        overflow-hidden

        shadow-sm
        `,
        colors[color]
      )}
    >

      <div
        className={cn(
          `
          absolute
          top-0
          left-0
          right-0

          h-1
          `,
          topLine[color]
        )}
      />

      <div className="text-2xl mb-4">
        {icon}
      </div>

      <div
        className="
          text-3xl
          font-black

          tracking-tight
          leading-none

          text-slate-900

          mb-1
        "
      >
        {value}
      </div>

      <div
        className="
          text-xs

          text-slate-500

          font-semibold

          uppercase
          tracking-wide
        "
      >
        {label}
      </div>

      {trend && (
        <div
          className={cn(
            `
            absolute
            top-4
            right-4

            text-xs
            font-bold

            px-2
            py-1

            rounded-full
            `,

            trend > 0
              ? `
                bg-emerald-100
                text-emerald-700
                `
              : `
                bg-red-100
                text-red-700
                `
          )}
        >

          {trend > 0 ? '↑' : '↓'}{' '}
          {Math.abs(trend)}%

        </div>
      )}

    </div>
  )
}