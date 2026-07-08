/*
  COURSE COMPLETE — celebrate the real, concrete abilities gained, plus a
  soft email-capture field (stored locally only, for now).
*/
import { useState } from 'react'
import { LESSONS } from '../data/lessons'
import { logEvent } from '../lib/eventLog'
import { Bilingual, BigButton, Screen, Card } from './ui'

export default function CourseComplete() {
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)

  function saveEmail() {
    if (!email.includes('@')) return
    logEvent('email_captured', { email })
    try {
      localStorage.setItem('confianza_email', email)
    } catch { /* in-memory only is fine */ }
    setSaved(true)
  }

  return (
    <Screen>
      <div className="rise-in flex-1 flex flex-col justify-center">
        <div className="text-center mb-6">
          <span className="text-5xl">🎓</span>
          <h2 className="text-3xl font-bold text-teal-deep mt-3">
            You did five lessons of real English.
          </h2>
          <p className="text-ink-soft italic mt-1">Hiciste cinco lecciones de inglés de verdad.</p>
        </div>

        <Card className="mb-4">
          <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-3">
            Here's everything you can now do · Todo lo que ya puedes hacer
          </p>
          <ul className="space-y-2.5">
            {LESSONS.map((l) => (
              <li key={l.id} className="flex gap-2.5 text-sm">
                <span className="text-teal-brand font-bold text-base">✓</span>
                <span>
                  {l.achievement.en}{' '}
                  <span className="text-ink-soft italic">· {l.achievement.es}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="bg-amber-soft/70 border-amber-brand/20">
          {!saved ? (
            <>
              <Bilingual
                en="Want to know when the full course opens?"
                es="¿Quieres saber cuándo abre el curso completo?"
                size="base"
                className="mb-3"
              />
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="flex-1 rounded-xl border-2 border-teal-brand/20 px-4 py-3 bg-white focus:border-teal-brand outline-none text-sm"
                />
                <button
                  onClick={saveEmail}
                  className="rounded-xl bg-teal-brand text-white px-5 font-semibold text-sm hover:bg-teal-deep transition-all active:scale-95"
                >
                  Yes!
                </button>
              </div>
            </>
          ) : (
            <Bilingual
              en="Saved. We'll let you know — keep speaking in the meantime."
              es="Guardado. Te avisaremos — sigue hablando mientras tanto."
              size="base"
            />
          )}
        </Card>
      </div>
    </Screen>
  )
}
