/*
  COURSE HOME — five lesson cards, unlocked sequentially. Includes the
  "what you can now DO" achievements and the learner's own confidence
  trend (framed only against their own baseline — no leaderboards,
  no comparisons, no streak-shaming).
*/
import { LESSONS } from '../data/lessons'
import { Bilingual, Screen, Card } from './ui'

export default function CourseHome({ profile, completedLessons, confidenceTrend, onStartLesson }) {
  const nextLesson = LESSONS.find((l) => !completedLessons.includes(l.id))

  // Confidence trend vs the learner's OWN starting point.
  const baseline = confidenceTrend[0] ?? profile.affective.confidence
  const current = confidenceTrend[confidenceTrend.length - 1] ?? baseline
  const delta = current - baseline

  return (
    <Screen>
      <div className="rise-in">
        <h2 className="text-2xl font-bold text-teal-deep">Your course</h2>
        <p className="text-ink-soft italic mb-6">Tu curso</p>

        {completedLessons.length > 0 && (
          <Card className="mb-4 bg-amber-soft/70 border-amber-brand/20">
            <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-2">
              What you can now DO · Lo que ya puedes HACER
            </p>
            <ul className="space-y-1.5">
              {LESSONS.filter((l) => completedLessons.includes(l.id)).map((l) => (
                <li key={l.id} className="flex gap-2 text-sm">
                  <span className="text-teal-brand font-bold">✓</span>
                  <span>
                    {l.achievement.en}{' '}
                    <span className="text-ink-soft italic">· {l.achievement.es}</span>
                  </span>
                </li>
              ))}
            </ul>
            {confidenceTrend.length > 1 && (
              <p className="text-sm mt-3 pt-3 border-t border-amber-brand/20 text-ink-soft">
                {delta >= 0.01
                  ? '📈 Your confidence is growing — compared to your own start.'
                  : '🌱 Confidence grows unevenly. Showing up is the win today.'}
              </p>
            )}
          </Card>
        )}

        <div className="space-y-3">
          {LESSONS.map((lesson) => {
            const done = completedLessons.includes(lesson.id)
            const isNext = nextLesson?.id === lesson.id
            const locked = !done && !isNext
            return (
              <button
                key={lesson.id}
                disabled={locked}
                onClick={() => onStartLesson(lesson.id)}
                className={`w-full text-left rounded-3xl p-5 border-2 transition-all active:scale-[0.98] ${
                  done
                    ? 'bg-teal-soft/60 border-teal-brand/20'
                    : isNext
                      ? 'bg-warm-white border-teal-brand shadow-md shadow-teal-brand/10'
                      : 'bg-warm-white/50 border-transparent opacity-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${
                      done ? 'bg-teal-brand text-white' : isNext ? 'bg-amber-brand text-white' : 'bg-teal-soft text-ink-soft'
                    }`}
                  >
                    {done ? '✓' : lesson.number}
                  </span>
                  <div>
                    <Bilingual en={lesson.title.en} es={lesson.title.es} size="base" />
                    <p className="text-xs text-ink-soft mt-1">
                      {done ? 'Completed · Completada' : isNext ? '3–5 min · Ready for you · Lista para ti' : 'Coming soon · Próximamente'}
                    </p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </Screen>
  )
}
