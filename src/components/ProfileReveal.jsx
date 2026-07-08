/*
  PROFILE REVEAL — a retention moment. The learner's combination shown as
  a gift, not a diagnosis: a bar visual of the modality mix plus a warm
  plain-language sentence describing how we'll teach them.
*/
import { describeProfile, MODALITY_LABELS } from '../engine/profile'
import { logEvent } from '../lib/eventLog'
import { Bilingual, BigButton, Screen, Card } from './ui'

export default function ProfileReveal({ profile, onStart }) {
  const description = describeProfile(profile)
  const sorted = Object.entries(profile.modality).sort((a, b) => b[1] - a[1])
  const max = Math.max(...sorted.map(([, v]) => v), 0.001)

  function start() {
    logEvent('profile_revealed', { profile })
    onStart()
  }

  return (
    <Screen>
      <div className="flex-1 flex flex-col justify-center rise-in">
        <div className="text-center mb-6">
          <span className="text-4xl">🎁</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-teal-deep mt-2">
            This is how you learn
          </h2>
          <p className="text-ink-soft italic">Así es como aprendes</p>
        </div>

        <Card className="mb-4">
          <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-4">
            Your learning combination · Tu combinación de aprendizaje
          </p>
          <div className="space-y-3">
            {sorted.map(([key, value]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-ink">
                    {MODALITY_LABELS[key].en}{' '}
                    <span className="text-ink-soft italic font-normal">· {MODALITY_LABELS[key].es}</span>
                  </span>
                  <span className="text-ink-soft">{Math.round(value * 100)}%</span>
                </div>
                <div className="h-2.5 bg-teal-soft rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-brand to-amber-brand transition-all duration-700"
                    style={{ width: `${(value / max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="mb-6 bg-teal-soft/60 border-teal-brand/20">
          <Bilingual en={description.en} es={description.es} size="base" />
        </Card>

        <BigButton onClick={start}>
          <span className="font-semibold">Start my course</span>
          <span className="block text-sm opacity-90">Empezar mi curso</span>
        </BigButton>
      </div>
    </Screen>
  )
}
