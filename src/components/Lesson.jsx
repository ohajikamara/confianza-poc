/*
  THE LESSON PLAYER — five beats in order (comprehension before production):
    warmup → input (concept variant + phrases) → check → mission → reflection

  The Emotional Intelligence engine runs after EVERY answer. Its adaptations
  are applied here: variant switches, difficulty moves, encouragement lines,
  the frustrated-breather interstitial, and the honourable fatigue exit.

  Difficulty tiers on check items (comprehensible-input band):
    support  → 2 options + hint shown  |  standard → 3 options  |  stretch → 4, no hint
*/
import { useEffect, useMemo, useRef, useState } from 'react'
import { REFLECTION_CHIPS } from '../data/lessons'
import { eiEngine, correctionFor, RECOVERY_PRAISE, CONFIDENCE_DELTAS } from '../engine/eiEngine'
import { defaultVariantFor, nudgeConfidence } from '../engine/profile'
import { logEvent, getEvents } from '../lib/eventLog'
import { speak, speechAvailable } from '../lib/speech'
import { Bilingual, BigButton, Screen, Card, SoftProgress } from './ui'

const BEATS = ['warmup', 'input', 'check', 'mission', 'reflection']

const VARIANT_NAMES = {
  exampleFirst: { en: 'by example', es: 'con ejemplos' },
  ruleFirst: { en: 'with the rule', es: 'con la regla' },
  story: { en: 'as a story', es: 'como historia' },
  stepByStep: { en: 'step by step', es: 'paso a paso' },
  tryIt: { en: 'by trying it', es: 'intentándolo' },
}

export default function Lesson({
  lesson,
  profile,
  onProfileChange,
  carriedReview, // items missed in the PREVIOUS lesson, resurfacing here
  initialDifficulty,
  completedAchievements, // for the breather "look how far you've come" list
  onComplete,
  onExitEarly,
}) {
  const [beat, setBeat] = useState('warmup')
  const [variant, setVariant] = useState(() => defaultVariantFor(profile))
  const [difficulty, setDifficulty] = useState(initialDifficulty)
  const [toast, setToast] = useState(null) // encouragement line {en, es}
  const [overlay, setOverlay] = useState(null) // breather / exit / reteach
  const [gentleCorrections, setGentleCorrections] = useState(false)

  /* Check-beat state. The queue starts with carried review items (reframed
     positively), then this lesson's items. Missed items are re-appended
     once so they resurface within the same lesson. */
  const [checkQueue, setCheckQueue] = useState(() => [
    ...carriedReview.map((item) => ({ ...item, reframed: true, isReview: true })),
    ...lesson.check.map((item) => ({ ...item })),
  ])
  const [checkIndex, setCheckIndex] = useState(0)
  const [feedback, setFeedback] = useState(null) // { correct, chosen, correction }
  const [missedItems, setMissedItems] = useState([]) // wrong on first try → next lesson

  const lessonEventStart = useRef(getEvents().length)
  const itemShownAt = useRef(Date.now())
  const lastInterventionAt = useRef(-10) // item count at last intervention (cooldown)
  const struggleFlag = useRef(false) // was the previous answer wrong? (recovery praise)

  useEffect(() => {
    logEvent('lesson_start', { lessonId: lesson.id, variant, difficulty })
    logEvent('variant_selected', { lessonId: lesson.id, variant, source: 'profile_default' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ---------- EI engine hookup ---------- */
  const lessonEvents = () => getEvents().slice(lessonEventStart.current)

  function runEngine() {
    const { state, adaptations } = eiEngine(profile, lessonEvents())
    logEvent('ei_state_change', { state })

    const itemCount = lessonEvents().filter((e) => e.type === 'item_result').length
    const cooledDown = itemCount - lastInterventionAt.current >= 2

    for (const a of adaptations) {
      logEvent('adaptation_fired', { state, adaptation: a.type, detail: a })
      switch (a.type) {
        case 'switchVariant':
          if (a.variant !== variant && cooledDown) {
            lastInterventionAt.current = itemCount
            setVariant(a.variant)
            logEvent('variant_switched', { from: variant, to: a.variant, reason: state })
            setOverlay({ kind: 'reteach', variant: a.variant, state })
          }
          break
        case 'setDifficulty':
          if (a.difficulty !== difficulty) {
            setDifficulty(a.difficulty)
            logEvent('difficulty_changed', { from: difficulty, to: a.difficulty, reason: state })
          }
          break
        case 'reduceItems':
          // Drop the last not-yet-shown, non-review item: a shorter beat is a kindness.
          setCheckQueue((q) => {
            for (let i = q.length - 1; i > checkIndex; i--) {
              if (!q[i].isReview) return [...q.slice(0, i), ...q.slice(i + 1)]
            }
            return q
          })
          break
        case 'encourage':
          setToast(a.message)
          break
        case 'interstitial':
          if (cooledDown) {
            lastInterventionAt.current = itemCount
            setOverlay({ kind: 'breather', ...a, state })
          }
          break
        case 'offerExit':
          if (cooledDown) {
            lastInterventionAt.current = itemCount
            setOverlay({ kind: 'exit', message: a.message, state })
          }
          break
        case 'gentleCorrections':
          setGentleCorrections(true)
          break
        case 'confidenceDelta':
          onProfileChange(nudgeConfidence(profile, a.delta))
          break
        default:
          break
      }
    }
    return state
  }

  /* Idle watch (>45s without interaction mid-lesson → fatigue signal). */
  useEffect(() => {
    if (beat !== 'check' && beat !== 'mission') return undefined
    const timer = setTimeout(() => {
      logEvent('idle', { beat, ms: 45000 })
      runEngine()
    }, 45000)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beat, checkIndex, feedback, overlay])

  /* Toast auto-dismiss */
  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  function goToBeat(next) {
    logEvent('beat_start', { lessonId: lesson.id, beat: next })
    setBeat(next)
  }

  /* ---------- Check-beat answer handling ---------- */
  const currentItem = checkQueue[checkIndex]

  // Difficulty shapes the options: support = correct + 1 distractor (+ hint),
  // standard = correct + 2, stretch = all 4 and no hint.
  const visibleOptions = useMemo(() => {
    if (!currentItem) return []
    const correct = currentItem.options.find((o) => o.correct)
    const distractors = currentItem.options.filter((o) => !o.correct)
    const count = difficulty === 'support' ? 1 : difficulty === 'standard' ? 2 : 3
    const chosen = [correct, ...distractors.slice(0, count)]
    // Stable shuffle so the correct answer isn't always first.
    return chosen
      .map((o, i) => ({ o, k: (i * 7 + (currentItem.id?.length || 1) * 13) % 10 }))
      .sort((a, b) => a.k - b.k)
      .map(({ o }) => o)
  }, [currentItem, difficulty])

  function answerCheck(option) {
    const ms = Date.now() - itemShownAt.current
    const correct = !!option.correct
    logEvent('item_result', {
      itemId: currentItem.id, lessonId: lesson.id, beat: 'check',
      correct, ms, difficulty, isReview: !!currentItem.isReview,
    })

    if (correct) {
      const praise = struggleFlag.current ? RECOVERY_PRAISE : null
      struggleFlag.current = false
      onProfileChange(
        nudgeConfidence(profile, praise ? CONFIDENCE_DELTAS.correctAfterStruggle : CONFIDENCE_DELTAS.correct),
      )
      setFeedback({ correct: true, chosen: option, praise })
    } else {
      struggleFlag.current = true
      const correctText = currentItem.options.find((o) => o.correct).en
      setFeedback({
        correct: false,
        chosen: option,
        correction: correctionFor(profile, correctText, gentleCorrections),
      })
      // First miss on a lesson item → resurface once later in THIS lesson
      // and once at the start of the NEXT lesson (spaced repetition seed).
      if (!currentItem.isReview && !currentItem.requeued) {
        setCheckQueue((q) => [
          ...q.map((it, i) => (i === checkIndex ? { ...it, requeued: true } : it)),
          { ...currentItem, requeued: true, reframed: true, isReview: true },
        ])
        setMissedItems((m) => (m.some((x) => x.id === currentItem.id) ? m : [...m, currentItem]))
      }
    }
    runEngine()
  }

  function retryItem() {
    logEvent('retry', { itemId: currentItem.id }) // retrying = engagement, never failure
    setFeedback(null)
    itemShownAt.current = Date.now()
  }

  function nextCheckItem({ skipped = false } = {}) {
    if (skipped) logEvent('skip', { itemId: currentItem.id })
    setFeedback(null)
    itemShownAt.current = Date.now()
    if (checkIndex + 1 < checkQueue.length) {
      setCheckIndex(checkIndex + 1)
    } else {
      goToBeat('mission')
    }
  }

  /* ---------- Overlay actions ---------- */
  function closeOverlay(outcome) {
    logEvent('intervention_outcome', { kind: overlay.kind, state: overlay.state, outcome })
    if (outcome === 'deferItem' && beat === 'check' && currentItem) {
      // Honour "come back to this later": push to next lesson's review, move on.
      setMissedItems((m) => (m.some((x) => x.id === currentItem.id) ? m : [...m, currentItem]))
      setOverlay(null)
      nextCheckItem({ skipped: true })
      return
    }
    if (outcome === 'switchVariant') {
      // Learner chose a different explanation: pick one they haven't seen.
      const order = ['stepByStep', 'story', 'exampleFirst', 'ruleFirst']
      const next = order.find((v) => v !== variant) || 'stepByStep'
      setVariant(next)
      logEvent('variant_switched', { from: variant, to: next, reason: 'learner_choice' })
      setOverlay({ kind: 'reteach', variant: next, state: overlay.state })
      return
    }
    if (outcome === 'exit') {
      onExitEarly()
      return
    }
    setOverlay(null)
    itemShownAt.current = Date.now()
  }

  /* ---------- Reflection ---------- */
  function reflect(chip) {
    logEvent('reflection', { lessonId: lesson.id, chipId: chip.id, valence: chip.valence })
    const delta =
      chip.id === 'proud' ? CONFIDENCE_DELTAS.proudReflection
      : chip.id === 'okay' ? CONFIDENCE_DELTAS.okayReflection
      : CONFIDENCE_DELTAS.negativeReflection
    const updated = nudgeConfidence(profile, delta)
    onProfileChange(updated)
    logEvent('lesson_complete', { lessonId: lesson.id, chipId: chip.id, missedItems: missedItems.map((i) => i.id) })
    onComplete({ missedItems, reflection: chip, profileAfter: updated })
  }

  /* ================================ RENDER ================================ */
  const beatIndex = BEATS.indexOf(beat)

  return (
    <Screen>
      <SoftProgress
        current={beatIndex + 1}
        total={BEATS.length}
        label={`Lesson ${lesson.number}: ${lesson.title.en} · Lección ${lesson.number}`}
      />

      {/* Encouragement toast (EI engine speaking) */}
      {toast && (
        <div className="rise-in mb-4 rounded-2xl bg-amber-soft border border-amber-brand/30 px-4 py-3">
          <Bilingual en={toast.en} es={toast.es} size="sm" />
        </div>
      )}

      {/* ---------------- BEAT 1: WARM-UP ---------------- */}
      {beat === 'warmup' && (
        <div className="rise-in flex-1 flex flex-col justify-center">
          <span className="text-4xl mb-4">☀️</span>
          <Bilingual en={lesson.warmup.en} es={lesson.warmup.es} size="lg" className="mb-8" />
          <BigButton onClick={() => goToBeat('input')}>
            <span className="font-semibold">I'm ready</span>
            <span className="block text-sm opacity-90">Estoy listo</span>
          </BigButton>
        </div>
      )}

      {/* ---------------- BEAT 2: INPUT ---------------- */}
      {beat === 'input' && (
        <InputBeat
          lesson={lesson}
          variant={variant}
          onDone={() => goToBeat('check')}
        />
      )}

      {/* ---------------- BEAT 3: UNDERSTAND CHECK ---------------- */}
      {beat === 'check' && currentItem && (
        <div key={`${currentItem.id}-${checkIndex}`} className="rise-in flex-1 flex flex-col">
          <p className="text-xs text-ink-soft mb-3">
            {checkIndex + 1} of {checkQueue.length} · Understanding · Comprensión
          </p>
          {currentItem.reframed && (
            <div className="mb-3 rounded-2xl bg-teal-soft px-4 py-2.5">
              <Bilingual
                en="Remember this one? Let's make it yours."
                es="¿La recuerdas? Vamos a hacerla tuya."
                size="sm"
              />
            </div>
          )}
          <Bilingual en={currentItem.prompt.en} es={currentItem.prompt.es} size="lg" className="mb-3" />
          {difficulty === 'support' && (
            <p className="text-sm text-amber-brand font-medium mb-3">
              💡 {currentItem.hint.en} <span className="italic font-normal">· {currentItem.hint.es}</span>
            </p>
          )}

          <div className="space-y-3">
            {visibleOptions.map((option, i) => {
              const isChosen = feedback?.chosen === option
              const isCorrectOption = option.correct
              // With gentle corrections we highlight the RIGHT answer softly
              // and never flag the chosen one (spec: anxious + high sensitivity).
              let style = 'secondary'
              let ring = ''
              if (feedback) {
                if (isCorrectOption && (feedback.correct ? isChosen : true)) ring = 'ring-2 ring-teal-brand bg-teal-soft/60'
                if (!feedback.correct && isChosen && !gentleCorrections) ring = 'ring-2 ring-amber-brand bg-amber-soft/60'
              }
              return (
                <BigButton
                  key={i}
                  variant={style}
                  className={ring}
                  disabled={!!feedback}
                  onClick={() => answerCheck(option)}
                >
                  <Bilingual en={option.en} es={option.es} size="base" />
                </BigButton>
              )
            })}
          </div>

          {feedback && (
            <div className="rise-in mt-4">
              {feedback.correct ? (
                <div className="rounded-2xl bg-teal-soft px-4 py-3 mb-3">
                  <Bilingual
                    en={feedback.praise ? feedback.praise.en : 'Yes — that\'s it.'}
                    es={feedback.praise ? feedback.praise.es : 'Sí — eso es.'}
                    size="sm"
                  />
                </div>
              ) : (
                <div className="rounded-2xl bg-amber-soft px-4 py-3 mb-3">
                  <Bilingual en={feedback.correction.en} es={feedback.correction.es} size="sm" />
                </div>
              )}
              <div className="flex gap-3">
                {!feedback.correct && (
                  <BigButton variant="secondary" onClick={retryItem} className="flex-1">
                    <span className="text-sm font-semibold">Try again · Otra vez</span>
                  </BigButton>
                )}
                <BigButton onClick={() => nextCheckItem()} className="flex-1">
                  <span className="text-sm font-semibold">Continue · Continuar</span>
                </BigButton>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- BEAT 4: MISSION ---------------- */}
      {beat === 'mission' && (
        <MissionBeat
          lesson={lesson}
          profile={profile}
          gentleCorrections={gentleCorrections}
          onResult={(correct, ms, retryCountLocal) => {
            logEvent('item_result', {
              itemId: `${lesson.id}_mission`, lessonId: lesson.id, beat: 'mission',
              correct, ms, difficulty, retries: retryCountLocal,
            })
            runEngine()
          }}
          onDone={() => goToBeat('reflection')}
        />
      )}

      {/* ---------------- BEAT 5: REFLECTION ---------------- */}
      {beat === 'reflection' && (
        <div className="rise-in flex-1 flex flex-col justify-center">
          <Bilingual en="How did that feel?" es="¿Cómo te sentiste?" size="xl" className="mb-6 text-center" />
          <div className="flex flex-wrap justify-center gap-3">
            {REFLECTION_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => reflect(chip)}
                className="rounded-full bg-white border-2 border-teal-brand/20 hover:border-teal-brand px-5 py-3 transition-all active:scale-95"
              >
                <span className="text-xl mr-2">{chip.emoji}</span>
                <span className="font-medium">{chip.en}</span>
                <span className="text-ink-soft italic text-sm"> · {chip.es}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- OVERLAYS (EI interventions) ---------------- */}
      {overlay && (
        <div className="fixed inset-0 bg-ink/30 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md rise-in">
            {overlay.kind === 'breather' && (
              <>
                <span className="text-3xl">🌿</span>
                <Bilingual en={overlay.message.en} es={overlay.message.es} size="lg" className="my-3" />
                <ul className="space-y-1.5 mb-5">
                  {completedAchievements.length === 0 && (
                    <li className="text-sm flex gap-2"><span className="text-teal-brand">✓</span> You started learning English today. · Empezaste a aprender inglés hoy.</li>
                  )}
                  {completedAchievements.map((a, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="text-teal-brand">✓</span> {a.en} <span className="text-ink-soft italic">· {a.es}</span>
                    </li>
                  ))}
                  <li className="text-sm flex gap-2"><span className="text-teal-brand">✓</span> You're {Math.round(((checkIndex + 1) / Math.max(checkQueue.length, 1)) * 100)}% through this practice. · Ya llevas gran parte de esta práctica.</li>
                </ul>
                <div className="space-y-3">
                  {overlay.choices.map((choice) => (
                    <BigButton key={choice.id} variant="secondary" onClick={() => closeOverlay(choice.id)}>
                      <Bilingual en={choice.label.en} es={choice.label.es} size="sm" />
                    </BigButton>
                  ))}
                </div>
              </>
            )}

            {overlay.kind === 'reteach' && (
              <>
                <Bilingual
                  en={`Let's look at it ${VARIANT_NAMES[overlay.variant].en} instead.`}
                  es={`Mirémoslo ${VARIANT_NAMES[overlay.variant].es} esta vez.`}
                  size="lg"
                  className="mb-4"
                />
                <VariantCards lesson={lesson} variant={overlay.variant} compact />
                <BigButton className="mt-4" onClick={() => closeOverlay('continued')}>
                  <span className="font-semibold text-sm">Got it — let's continue · Entendido — sigamos</span>
                </BigButton>
              </>
            )}

            {overlay.kind === 'exit' && (
              <>
                <span className="text-3xl">🌙</span>
                <Bilingual en={overlay.message.en} es={overlay.message.es} size="base" className="my-3" />
                <div className="space-y-3">
                  <BigButton variant="secondary" onClick={() => closeOverlay('exit')}>
                    <span className="text-sm font-semibold">Stop for today (progress saved) · Parar por hoy (progreso guardado)</span>
                  </BigButton>
                  <BigButton onClick={() => closeOverlay('continued')}>
                    <span className="text-sm font-semibold">I want to keep going · Quiero seguir</span>
                  </BigButton>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </Screen>
  )
}

/* ---------- BEAT 2 subcomponent: concept variant + phrase player ---------- */
function VariantCards({ lesson, variant, compact = false }) {
  const data = lesson.concept.variants[variant]
  const [step, setStep] = useState(0)
  const [tryAnswered, setTryAnswered] = useState(null)

  // tryIt: task first, teach from the attempt (no penalty, ever).
  if (variant === 'tryIt' && data.try && tryAnswered === null) {
    return (
      <div>
        <Bilingual en={data.try.prompt.en} es={data.try.prompt.es} size="base" className="mb-4" />
        <div className="space-y-3">
          {data.try.options.map((o, i) => (
            <BigButton key={i} variant="secondary" onClick={() => {
              logEvent('tryit_attempt', { lessonId: lesson.id, correct: !!o.correct })
              setTryAnswered(!!o.correct)
            }}>
              <span className="font-medium">{o.en}</span>
            </BigButton>
          ))}
        </div>
      </div>
    )
  }

  const cards = data.cards
  // stepByStep reveals one confirmed piece at a time; other variants show all.
  const visible = variant === 'stepByStep' && !compact ? cards.slice(0, step + 1) : cards

  return (
    <div>
      {variant === 'tryIt' && tryAnswered !== null && (
        <div className="rounded-2xl bg-teal-soft px-4 py-2.5 mb-3">
          <Bilingual
            en={tryAnswered ? 'Your instinct was right! Here\'s why:' : 'Good guess — here\'s the pattern:'}
            es={tryAnswered ? '¡Tu instinto acertó! Aquí el porqué:' : 'Buen intento — aquí está el patrón:'}
            size="sm"
          />
        </div>
      )}
      <div className="space-y-3">
        {visible.map((card, i) => (
          <div key={i} className="rise-in rounded-2xl bg-white border border-teal-brand/15 px-4 py-3">
            <Bilingual en={card.en} es={card.es} size="sm" />
          </div>
        ))}
      </div>
      {variant === 'stepByStep' && !compact && step < cards.length - 1 && (
        <BigButton variant="secondary" className="mt-3" onClick={() => setStep(step + 1)}>
          <span className="text-sm font-semibold">Got it — next piece · Entendido — siguiente</span>
        </BigButton>
      )}
    </div>
  )
}

function InputBeat({ lesson, variant, onDone }) {
  return (
    <div className="rise-in flex-1 flex flex-col">
      <span className="inline-block self-start text-xs font-semibold text-teal-brand bg-teal-soft rounded-full px-3 py-1 mb-4">
        {lesson.concept.focus.en} · {lesson.concept.focus.es}
      </span>

      <VariantCards lesson={lesson} variant={variant} />

      <div className="mt-6">
        <p className="text-xs font-semibold text-ink-soft uppercase tracking-wide mb-1">
          Listen & repeat · Escucha y repite
        </p>
        <p className="text-xs text-ink-soft mb-3">
          Replay as many times as you like — replaying is what careful learners do. ·
          Repite las veces que quieras — repetir es de buenos estudiantes.
        </p>
        <div className="space-y-2.5">
          {lesson.phrases.map((phrase, i) => (
            <PhraseRow key={i} phrase={phrase} lessonId={lesson.id} />
          ))}
        </div>
      </div>

      <BigButton className="mt-6" onClick={onDone}>
        <span className="font-semibold">I'm ready to practise</span>
        <span className="block text-sm opacity-90">Listo para practicar</span>
      </BigButton>
    </div>
  )
}

function PhraseRow({ phrase, lessonId }) {
  const [plays, setPlays] = useState(0)
  function play() {
    // Replays are a POSITIVE engagement signal — logged, never penalised.
    logEvent('replay', { lessonId, phrase: phrase.en, playCount: plays + 1 })
    speak(phrase.en)
    setPlays(plays + 1)
  }
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl border border-teal-brand/15 px-4 py-3">
      <button
        onClick={play}
        disabled={!speechAvailable}
        className="flex-shrink-0 w-11 h-11 rounded-full bg-teal-brand text-white text-lg hover:bg-teal-deep active:scale-95 transition-all disabled:opacity-30"
        aria-label={`Play "${phrase.en}"`}
      >
        🔊
      </button>
      <div className="flex-1">
        <p className="font-semibold text-ink">{phrase.en}</p>
        <p className="text-sm text-ink-soft italic">{phrase.es}</p>
        {!speechAvailable && (
          <p className="text-xs text-amber-brand">read aloud unavailable · audio no disponible</p>
        )}
      </div>
      {plays > 0 && <span className="text-xs text-ink-soft">×{plays}</span>}
    </div>
  )
}

/* ---------- BEAT 4 subcomponent: the real-world mission ---------- */
function MissionBeat({ lesson, profile, gentleCorrections, onResult, onDone }) {
  const mission = lesson.mission
  const [chosen, setChosen] = useState([]) // arrange: picked word indices
  const [result, setResult] = useState(null) // { correct, correction? }
  const [retries, setRetries] = useState(0)
  const startedAt = useRef(Date.now())

  function finishAttempt(correct, chosenOption = null) {
    onResult(correct, Date.now() - startedAt.current, retries)
    if (correct) {
      setResult({ correct: true, chosenOption })
    } else {
      setResult({
        correct: false,
        chosenOption,
        correction: correctionFor(profile, mission.answer || mission.options?.find((o) => o.correct)?.en, gentleCorrections),
      })
    }
  }

  function retry() {
    logEvent('retry', { itemId: `${lesson.id}_mission` })
    setRetries(retries + 1)
    setResult(null)
    setChosen([])
    startedAt.current = Date.now()
  }

  const built = chosen.map((i) => mission.words?.[i]).join(' ')

  return (
    <div className="rise-in flex-1 flex flex-col">
      <span className="inline-block self-start text-xs font-semibold text-white bg-amber-brand rounded-full px-3 py-1 mb-4">
        Your mission · Tu misión
      </span>
      <Bilingual en={mission.setup.en} es={mission.setup.es} size="base" className="mb-2" />

      {mission.type === 'dialogue' && (
        <>
          <div className="rounded-2xl bg-teal-soft px-4 py-3 my-3">
            <Bilingual en={mission.line.en} es={mission.line.es} size="base" />
          </div>
          <Bilingual en={mission.prompt.en} es={mission.prompt.es} size="sm" className="mb-4" />
          <div className="space-y-3">
            {mission.options.map((o, i) => (
              <BigButton
                key={i}
                variant="secondary"
                disabled={!!result}
                className={
                  result && o.correct ? 'ring-2 ring-teal-brand bg-teal-soft/60'
                  : result && !result.correct && !gentleCorrections && o === result.chosenOption ? 'ring-2 ring-amber-brand bg-amber-soft/60' : ''
                }
                onClick={() => finishAttempt(!!o.correct, o)}
              >
                <span className="font-medium">{o.en}</span>
              </BigButton>
            ))}
          </div>
        </>
      )}

      {mission.type === 'arrange' && (
        <>
          {/* The sentence being built */}
          <div className="min-h-14 rounded-2xl border-2 border-dashed border-teal-brand/30 bg-white px-4 py-3 my-4 flex flex-wrap gap-2 items-center">
            {chosen.length === 0 && (
              <span className="text-sm text-ink-soft italic">Tap the words in order · Toca las palabras en orden</span>
            )}
            {chosen.map((wordIndex, pos) => (
              <button
                key={pos}
                onClick={() => !result && setChosen(chosen.filter((_, p) => p !== pos))}
                className="rounded-xl bg-teal-brand text-white px-3 py-1.5 font-medium"
              >
                {mission.words[wordIndex]}
              </button>
            ))}
          </div>
          {/* The word bank */}
          <div className="flex flex-wrap gap-2 mb-4">
            {mission.words.map((word, i) => (
              <button
                key={i}
                disabled={chosen.includes(i) || !!result}
                onClick={() => setChosen([...chosen, i])}
                className="rounded-xl bg-white border-2 border-teal-brand/25 px-3 py-1.5 font-medium disabled:opacity-25 hover:border-teal-brand transition-all active:scale-95"
              >
                {word}
              </button>
            ))}
          </div>
          <BigButton
            disabled={chosen.length !== mission.words.length || !!result}
            onClick={() => finishAttempt(built === mission.answer)}
          >
            <span className="font-semibold text-sm">Check my sentence · Revisar mi frase</span>
          </BigButton>
        </>
      )}

      {result && (
        <div className="rise-in mt-4">
          {result.correct ? (
            <div className="rounded-2xl bg-teal-soft px-4 py-4 mb-3">
              <span className="text-2xl">🎉</span>
              <Bilingual en={mission.praise.en} es={mission.praise.es} size="base" className="mt-1" />
            </div>
          ) : (
            <div className="rounded-2xl bg-amber-soft px-4 py-3 mb-3">
              <Bilingual en={result.correction.en} es={result.correction.es} size="sm" />
            </div>
          )}
          <div className="flex gap-3">
            {!result.correct && (
              <BigButton variant="secondary" onClick={retry} className="flex-1">
                <span className="text-sm font-semibold">Try again · Otra vez</span>
              </BigButton>
            )}
            <BigButton onClick={onDone} className="flex-1">
              <span className="text-sm font-semibold">Continue · Continuar</span>
            </BigButton>
          </div>
        </div>
      )}
    </div>
  )
}
