/* Shared UI primitives: bilingual text, buttons, cards, layout shell. */
import { exportSession } from '../lib/eventLog'

/* Primary text in simple English, Spanish support underneath in a softer style. */
export function Bilingual({ en, es, size = 'base', className = '' }) {
  const sizes = {
    xl: ['text-2xl sm:text-3xl font-bold', 'text-base sm:text-lg'],
    lg: ['text-xl sm:text-2xl font-semibold', 'text-sm sm:text-base'],
    base: ['text-base sm:text-lg font-medium', 'text-sm'],
    sm: ['text-sm font-medium', 'text-xs'],
  }
  const [enCls, esCls] = sizes[size]
  return (
    <div className={className}>
      <p className={`${enCls} text-ink`}>{en}</p>
      {es && es !== '—' && <p className={`${esCls} text-ink-soft italic mt-0.5`}>{es}</p>}
    </div>
  )
}

export function BigButton({ children, onClick, variant = 'primary', disabled, className = '' }) {
  const styles = {
    primary: 'bg-teal-brand text-white hover:bg-teal-deep shadow-md shadow-teal-brand/20',
    secondary: 'bg-white text-ink border-2 border-teal-brand/25 hover:border-teal-brand/60 hover:bg-teal-soft/50',
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
    <div className={`bg-white rounded-3xl shadow-sm border border-teal-brand/10 p-6 ${className}`}>
      {children}
    </div>
  )
}

/* Full-screen shell: mobile-first column, comfy on desktop. */
export function Screen({ children, footer = null }) {
  return (
    <div className="min-h-dvh flex flex-col bg-cream">
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6 sm:py-10 flex flex-col">
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

/* Soft progress indicator, e.g. "question 7 of 24" plus a thin bar. */
export function SoftProgress({ current, total, label }) {
  return (
    <div className="mb-6">
      <p className="text-xs text-ink-soft mb-2">{label}</p>
      <div className="h-1.5 bg-teal-soft rounded-full overflow-hidden">
        <div
          className="h-full bg-teal-brand rounded-full transition-all duration-500"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
