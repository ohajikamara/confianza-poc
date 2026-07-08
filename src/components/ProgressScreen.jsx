/*
  PROGRESS after each lesson: the 5-lesson bar, "What you can now DO"
  achievements, and a confidence trend framed ONLY against the learner's
  own baseline. No leaderboards, no comparisons, no streak-shaming.
*/
import { LESSONS } from '../data/lessons'
import { Bilingual, BigButton, Screen, Card } from './ui'

export default function ProgressScreen({ completedLessons, confidenceTrend, onContinue }) {
  const done = LESSONS.filter((l) => completedLessons.includes(l.id))
  const baseline = confidenceTrend[0] ?? 0.5
  const current = confidenceTrend[confidenceTrend.length - 1] ?? baseline
  const delta = current - baseline
  const allDone = done.length === LESSONS.length

  return (
    <Screen>
      <div className="rise-in flex-1 flex flex-col justify-center">
        <div className="text-center mb-6">
          <span className="text-4xl">🌟</span>
          <h2 className="text-2xl font-bold text-teal-deep mt-2">
            Lesson {done.length} of {LESSONS.length} complete
          </h2>
          <p className="text-ink-soft italic">Lección {done.length} de {LESSONS.length} completada</p>
        </div>

        {/* Course progress bar */}
        <div className="flex gap-2 mb-6">
          {LESSONS.map((l) => (
            <div
              key={l.id}
              className={`flex-1 h-3 rounded-full ${
                completedLessons.includes(l.id) ? 'bg-teal-brand' : 'bg-teal-soft'
              }`}
            />
          ))}
        </div>

        <Card className="mb-4">
          <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-3">
            What you can now DO · Lo que ya puedes HACER
          </p>
          <ul className="space-y-2">
            {done.map((l) => (
              <li key={l.id} className="flex gap-2 text-sm">
                <span className="text-teal-brand font-bold">✓</span>
                <span>
                  {l.achievement.en} <span className="text-ink-soft italic">· {l.achievement.es}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Confidence trend vs the learner's own starting point only */}
        <Card className="mb-6 bg-teal-soft/50 border-teal-brand/15">
          <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
            Your confidence · Tu confianza
          </p>
          <div className="flex items-end gap-1.5 h-14 mb-2">
            {confidenceTrend.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-lg bg-gradient-to-t from-teal-brand to-amber-brand/80 transition-all"
                style={{ height: `${Math.max(v * 100, 8)}%` }}
              />
            ))}
          </div>
          <Bilingual
            en={
              delta >= 0.01
                ? 'Growing — compared only to where YOU started.'
                : 'Confidence moves in waves. You showed up — that counts.'
            }
            es={
              delta >= 0.01
                ? 'Creciendo — comparado solo con donde TÚ empezaste.'
                : 'La confianza va en olas. Llegaste hoy — eso cuenta.'
            }
            size="sm"
          />
        </Card>

        <BigButton onClick={onContinue}>
          <span className="font-semibold">{allDone ? 'See everything you can do' : 'Continue'}</span>
          <span className="block text-sm opacity-90">{allDone ? 'Ver todo lo que puedes hacer' : 'Continuar'}</span>
        </BigButton>
      </div>
    </Screen>
  )
}
