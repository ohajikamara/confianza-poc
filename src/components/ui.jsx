/* Shared UI primitives: bilingual text, buttons, cards, layout shell, logo. */
import { exportSession } from '../lib/eventLog'

/* Leaf/sprout brand mark + wordmark (per design doc: organic, calm, deep teal). */
export function Logo({ size = 'base' }) {
  const dim = size === 'sm' ? 22 : 30
  return (
    <div className="flex items-center gap-2 select-none">
      <svg width={dim} height={dim} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        {/* two leaves on a stem */}
        <path
          d="M16 28C16 20 16 14 16 10"
          stroke="#0E7C66" strokeWidth="2.4" strokeLinecap="round"
        />
        <path
          d="M16 13C16 8 12 4.5 6.5 4C6.5 10 9.5 13.5 16 13Z"
          fill="#0E7C66"
        />
        <path
          d="M16 17C16 12.5 19.5 9.5 25.5 9C25.5 14.5 22.5 17.5 16 17Z"
          fill="#E8A13C"
        />
      </svg>
      <span
        className={`font-display font-bold text-ink ${size === 'sm' ? 'text-lg' : 'text-2xl'}`}
      >
        Confianza
      </span>
    </div>
  )
}

/* Primary text in simple English, Spanish support text underneath in a softer style. */
export function Bilingual({ en, es, size = 'base', className = '' }) {
  const sizes = {
    xl: ['font-display text-2xl sm:text-3xl font-bold', 'text-base sm:text-lg'],
    lg: ['font-display text-xl sm:text-2xl font-semibold', 'text-sm sm:text-base'],
    base: ['text-base sm:text-lg font-semibold', 'text-sm'],
    sm: ['text-sm font-semibold', 'text-xs'],
  }
  const [enCls, esCls] = sizes[size]
  return (
    <div className={className}>
      <p className={`${enCls} text-ink`}>{en}</p>
      {es && es !== '—' && <p className={`${esCls} text-ink-soft mt-0.5`}>{es}</p>}
    </div>
  )
}

export function BigButton({ children, onClick, variant = 'primary', disabled, className = '' }) {
  const styles = {
    primary: 'bg-teal-brand text-white hover:bg-teal-deep shadow-md shadow-teal-brand/20',
    secondary: 'bg-warm-white text-ink border-2 border-sand hover:border-teal-brand/50 hover:bg-teal-soft/40',
    amber: 'bg-amber-brand text-white hover:brightness-95 shadow-md shadow-amber-brand/20',
    ghost: 'bg-transparent text-ink-soft hover:text-ink underline underline-offset-4',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-2xl px-5 py-4 text-left transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-warm-white rounded-3xl shadow-sm border border-sand p-6 ${className}`}>
      {children}
    </div>
  )
}

/* Full-screen shell: mobile-first column, comfy on desktop. */
export function Screen({ children, footer = null, showLogo = true, wide = false }) {
  return (
    <div className="min-h-dvh flex flex-col bg-cream">
      <main className={`flex-1 w-full ${wide ? 'max-w-6xl' : 'max-w-lg'} mx-auto px-4 py-5 sm:py-8 flex flex-col`}>
        {showLogo && (
          <div className="mb-5">
            <Logo size="sm" />
          </div>
        )}
        {children}
      </main>
      {footer}
    </div>
  )
}

/* Unobtrusive footer with the "Export session data" evidence button. */
export function ExportFooter({ profile }) {
  return (
    <footer className="w-full max-w-lg mx-auto px-4 pb-4 flex justify-between items-center text-xs text-ink-soft/70">
      <span>Confianza · proof of concept</span>
      <button
        onClick={() => exportSession(profile)}
        className="underline underline-offset-2 hover:text-ink-soft"
      >
        Export session data
      </button>
    </footer>
  )
}

/* Soft progress indicator, e.g. "Question 7 of 22" plus a thin rounded bar. */
export function SoftProgress({ current, total, label, centered = false }) {
  return (
    <div className={`mb-6 ${centered ? 'text-center' : ''}`}>
      <p className="text-sm font-semibold text-ink mb-2">{label}</p>
      <div className={`h-2 bg-sand rounded-full overflow-hidden ${centered ? 'max-w-md mx-auto' : ''}`}>
        <div
          className="h-full bg-teal-brand rounded-full transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
