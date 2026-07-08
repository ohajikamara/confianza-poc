/*
  THE LEARNING COMBINATION ASSESSMENT
  (styled per mocks/confianza_assessment_web_app_design.md)

  Desktop: two zones — left emotional guidance panel (~34%), right assessment
  panel (~66%). Mobile: single column (logo → progress → reassurance → card →
  answers → guidance → sticky Back/Next).

  Interaction: selecting an answer highlights it (amber border + check icon,
  no judgement); Next advances, Back returns. A "Not sure" option is always
  available and never penalised. Answers are folded into the profile only at
  the END (so Back + change never double-applies effects).
*/
import { useState } from 'react'
import { QUESTIONS, BLOCK_LABELS } from '../data/assessment'
import { applyAnswerEffects, createEmptyProfile } from '../engine/profile'
import { logEvent } from '../lib/eventLog'
import { Bilingual, Logo } from './ui'

/* Pick a friendly icon for an answer card from what the answer measures.
   Block E (placement) uses letter badges instead — icons would hint. */
const MODALITY_ICONS = {
  doing: '✋', watching: '👁️', reading: '📖',
  stepByStep: '🪜', experimenting: '🧪', reviewing: '🔁',
}
const AFFECTIVE_ICONS = {
  shameResponse: '💬', frustrationTolerance: '💪', correctionSensitivity: '🧭',
  confidence: '⭐', socialComfort: '👥',
}
function iconFor(option, question, index) {
  if (question.block === 'E') return String.fromCharCode(65 + index) // A, B, C…
  const effects = option.effects || {}
  if (effects.mixedFlag) return '🌤️'
  for (const key of Object.keys(effects)) {
    const [dim, field] = key.split('.')
    if (dim === 'modality' && MODALITY_ICONS[field]) return MODALITY_ICONS[field]
    if (dim === 'affective' && AFFECTIVE_ICONS[field]) return AFFECTIVE_ICONS[field]
    if (dim === 'pace') return '⏱️'
    if (dim === 'cognitive') return '🗺️'
  }
  return ['🌱', '☀️', '🌿', '🌼', '🍃'][index % 5]
}

export default function Assessment({ initialAnswers = {}, initialIndex = 0, onSaveProgress, onComplete }) {
  const [index, setIndex] = useState(initialIndex)
  const [answers, setAnswers] = useState(initialAnswers) // questionId → option index | 'notSure'
  const [savedNotice, setSavedNotice] = useState(false)

  const question = QUESTIONS[index]
  const block = BLOCK_LABELS[question.block]
  const selection = answers[question.id]
  const hasSelection = selection !== undefined

  function select(value) {
    setAnswers({ ...answers, [question.id]: value })
  }

  function next() {
    if (!hasSelection) return
    const option = selection === 'notSure' ? null : question.options[selection]
    logEvent('assessment_answer', {
      questionId: question.id,
      block: question.block,
      answer: option ? option.en : 'not_sure',
      effects: option ? option.effects : {},
    })
    if (index + 1 < QUESTIONS.length) {
      setIndex(index + 1)
    } else {
      logEvent('assessment_complete', { totalQuestions: QUESTIONS.length })
      // Fold ALL effects into a fresh profile in one pass (see file header).
      let profile = createEmptyProfile()
      for (const q of QUESTIONS) {
        const a = answers[q.id] ?? (q.id === question.id ? selection : undefined)
        if (a !== undefined && a !== 'notSure') {
          profile = applyAnswerEffects(profile, q.options[a].effects)
        }
      }
      onComplete(profile)
    }
  }

  function back() {
    if (index > 0) setIndex(index - 1)
  }

  function saveForLater() {
    onSaveProgress(answers, index)
    logEvent('assessment_saved_for_later', { index })
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 4000)
  }

  return (
    <div className="min-h-dvh bg-cream flex flex-col lg:flex-row">
      {/* ============ LEFT: emotional guidance panel (desktop) ============ */}
      <aside className="hidden lg:flex flex-col w-[34%] bg-warm-white border-r border-sand overflow-hidden">
        <div className="p-8 pb-4">
          <Logo />
        </div>
        <div className="px-8 pb-6">
          <h2 className="font-display text-3xl font-bold text-ink leading-snug">
            There are no wrong answers here.
          </h2>
          <p className="font-display text-xl font-semibold text-teal-brand mt-1">
            No hay respuestas malas aquí.
          </p>
          <div className="w-10 h-1 bg-amber-brand rounded-full my-4" />
          <p className="font-semibold text-ink">We are learning how you learn.</p>
          <p className="text-sm text-ink-soft">Estamos aprendiendo cómo aprendes tú.</p>
          <span className="inline-flex items-center gap-2 mt-4 rounded-full bg-teal-soft text-ink text-sm font-semibold px-4 py-2">
            🤍 No pressure <span className="text-ink-soft font-normal">· Sin presión</span>
          </span>
        </div>
        {/* Colombian café street scene; anchored to the bottom and oversized
            so the table/coffee foreground shows and the top (with its
            imperfect AI-generated signage) stays cropped out. */}
        <div className="flex-1 min-h-0 relative overflow-hidden">
          <img
            src={`${import.meta.env.BASE_URL}cafe-scene.jpg`}
            alt=""
            className="absolute bottom-0 left-0 w-full h-[140%] object-cover object-bottom"
          />
        </div>
      </aside>

      {/* ============ RIGHT: assessment interaction panel ============ */}
      <section className="flex-1 flex flex-col px-4 py-5 sm:px-8 sm:py-6 max-w-3xl mx-auto w-full">
        {/* Top bar: logo (mobile), progress centre, save-later right */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="lg:hidden"><Logo size="sm" /></div>
          <div className="hidden lg:block" />
          <button
            onClick={saveForLater}
            className="text-right text-sm text-teal-brand hover:text-teal-deep leading-tight"
          >
            <span className="font-semibold block">🔖 Save and continue later</span>
            <span className="text-xs text-ink-soft">Guarda y continúa después</span>
          </button>
        </div>

        <div className="text-center mb-2">
          <p className="font-display font-bold text-ink">
            Question {index + 1} of {QUESTIONS.length}
          </p>
          <p className="text-xs text-ink-soft">Pregunta {index + 1} de {QUESTIONS.length}</p>
        </div>
        <div className="h-2 bg-sand rounded-full overflow-hidden max-w-lg w-full mx-auto mb-4">
          <div
            className="h-full bg-teal-brand rounded-full transition-all duration-500"
            style={{ width: `${((index + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        {savedNotice && (
          <div className="rise-in max-w-lg w-full mx-auto mb-3 rounded-2xl bg-teal-soft px-4 py-3 text-center">
            <Bilingual
              en="Saved. You can continue whenever you are ready."
              es="Guardado. Puedes continuar cuando estés listo."
              size="sm"
            />
          </div>
        )}

        {/* Mobile reassurance line (left panel replaces this on desktop) */}
        <p className="lg:hidden text-center text-sm text-ink-soft mb-4">
          There are no wrong answers here. <span className="italic">· No hay respuestas malas aquí.</span>
        </p>

        {/* ---------- Question card ---------- */}
        <div key={question.id} className="rise-in flex-1 flex flex-col">
          <div className="bg-warm-white rounded-3xl shadow-sm border border-sand p-5 sm:p-8">
            <span className="block text-center text-xs font-semibold text-teal-brand bg-teal-soft rounded-full px-3 py-1 mb-4 w-fit mx-auto">
              {block.en} · {block.es}
            </span>
            <div className="text-center mb-6">
              <h1 className="font-display text-xl sm:text-2xl font-bold text-ink leading-snug">
                {question.en}
              </h1>
              <p className="text-sm sm:text-base text-ink-soft mt-1.5">{question.es}</p>
            </div>

            <div className="space-y-3" role="radiogroup" aria-label={question.en}>
              {question.options.map((option, i) => {
                const selected = selection === i
                return (
                  <button
                    key={i}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => select(i)}
                    className={`w-full flex items-center gap-4 text-left rounded-2xl border-2 px-4 py-3.5 transition-all active:scale-[0.99] ${
                      selected
                        ? 'border-amber-brand bg-amber-soft shadow-md shadow-amber-brand/20'
                        : 'border-sand bg-warm-white hover:border-teal-brand/40'
                    }`}
                  >
                    <span className="flex-shrink-0 w-11 h-11 rounded-full bg-teal-soft flex items-center justify-center text-lg font-display font-bold text-teal-brand">
                      {iconFor(option, question, i)}
                    </span>
                    <span className="flex-1">
                      <span className="block font-semibold text-ink">
                        {i + 1}. {option.en}
                      </span>
                      {option.es && option.es !== '—' && (
                        <span className="block text-sm text-ink-soft">{option.es}</span>
                      )}
                    </span>
                    {selected && (
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-brand text-white flex items-center justify-center text-sm font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                )
              })}

              {/* "Not sure" is always a safe choice */}
              <button
                role="radio"
                aria-checked={selection === 'notSure'}
                onClick={() => select('notSure')}
                className={`w-full text-center rounded-2xl border-2 px-4 py-3 text-sm transition-all ${
                  selection === 'notSure'
                    ? 'border-amber-brand bg-amber-soft font-semibold text-ink'
                    : 'border-transparent text-ink-soft hover:text-ink underline underline-offset-4'
                }`}
              >
                Not sure · No estoy seguro
              </button>
            </div>

            <p className="flex items-center justify-center gap-2 text-xs text-ink-soft mt-5">
              🕐 Take your time. You can skip and return later.
              <span className="italic">· Tómate tu tiempo. Puedes volver después.</span>
            </p>
          </div>

          {/* ---------- Back / Next ---------- */}
          <div className="sticky bottom-0 mt-4 pb-4 pt-2 bg-gradient-to-t from-cream via-cream to-transparent flex gap-3 max-w-lg w-full mx-auto">
            <button
              onClick={back}
              disabled={index === 0}
              className="flex-1 rounded-2xl border-2 border-sand bg-warm-white px-5 py-3.5 text-teal-brand font-semibold transition-all hover:border-teal-brand/40 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            >
              ← Back <span className="block text-xs font-normal text-ink-soft">Atrás</span>
            </button>
            <button
              onClick={next}
              disabled={!hasSelection}
              className="flex-[1.4] rounded-2xl bg-teal-brand px-5 py-3.5 text-white font-semibold shadow-md shadow-teal-brand/25 transition-all hover:bg-teal-deep active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
            >
              Next → <span className="block text-xs font-normal opacity-80">Siguiente</span>
            </button>
          </div>
          {!hasSelection && (
            <p className="text-center text-xs text-ink-soft -mt-2 pb-2">
              Choose the answer that feels closest today. · Elige la respuesta que se siente más cercana hoy.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
