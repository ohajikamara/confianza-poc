/*
  THE LEARNING COMBINATION ASSESSMENT
  One question per screen, big friendly buttons, soft progress, no timer,
  and a "Not sure / No estoy seguro" option on every question (it applies
  no effects and is never penalised). Feels like a conversation with a
  kind teacher, not a test.
*/
import { useState } from 'react'
import { QUESTIONS, BLOCK_LABELS } from '../data/assessment'
import { applyAnswerEffects } from '../engine/profile'
import { logEvent } from '../lib/eventLog'
import { Bilingual, BigButton, Screen, SoftProgress } from './ui'

export default function Assessment({ profile, onProfileChange, onComplete }) {
  const [index, setIndex] = useState(0)
  const question = QUESTIONS[index]
  const block = BLOCK_LABELS[question.block]

  function answer(option, isNotSure = false) {
    logEvent('assessment_answer', {
      questionId: question.id,
      block: question.block,
      answer: isNotSure ? 'not_sure' : option.en,
      effects: isNotSure ? {} : option.effects,
    })
    const next = isNotSure ? profile : applyAnswerEffects(profile, option.effects)
    if (index + 1 < QUESTIONS.length) {
      onProfileChange(next)
      setIndex(index + 1)
    } else {
      logEvent('assessment_complete', { totalQuestions: QUESTIONS.length })
      onComplete(next)
    }
  }

  return (
    <Screen>
      <SoftProgress
        current={index + 1}
        total={QUESTIONS.length}
        label={`Question ${index + 1} of ${QUESTIONS.length} · Pregunta ${index + 1} de ${QUESTIONS.length}`}
      />

      {/* key forces the rise-in animation to replay per question */}
      <div key={question.id} className="rise-in flex-1 flex flex-col">
        <span className="inline-block self-start text-xs font-semibold text-teal-brand bg-teal-soft rounded-full px-3 py-1 mb-4">
          {block.en} · {block.es}
        </span>

        <Bilingual en={question.en} es={question.es} size="lg" className="mb-6" />

        <div className="space-y-3">
          {question.options.map((option, i) => (
            <BigButton key={i} variant="secondary" onClick={() => answer(option)}>
              <Bilingual en={option.en} es={option.es} size="base" />
            </BigButton>
          ))}
          <button
            onClick={() => answer(null, true)}
            className="w-full text-center text-sm text-ink-soft hover:text-ink py-3 underline underline-offset-4"
          >
            Not sure · No estoy seguro
          </button>
        </div>
      </div>
    </Screen>
  )
}
