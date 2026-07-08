/*
  THE EMOTIONAL INTELLIGENCE ENGINE
  =================================
  Core design law: emotional intelligence is the foundation, the learning
  combination profile is the framework on top of it, and the teaching
  methods are the machinery both of them drive. Every adaptive decision
  checks EMOTIONAL STATE FIRST and preference SECOND.

  This is a PURE FUNCTION — no side effects, fully testable:

      eiEngine(profile, recentEvents) → { state, signals, adaptations }

  It is evaluated after EVERY learner action. Three layers:
    SENSE      — extract behavioural signals from the recent event window
    INTERPRET  — classify the learner's current state, reading the SAME
                 signal differently for different affective profiles
    RESPOND    — emit adaptations (variant switches, difficulty moves,
                 messages, interstitials) for the UI to apply

  Written to be read by the teaching lead: every rule states its trigger,
  its reasoning, and its response in plain language.
*/

/* ---------- Tunable thresholds (all in one place for easy challenge) ---------- */
const T = {
  RAPID_FIRE_MS: 2000,        // wrong answers < 2s apart = guessing/frustration
  LONG_HESITATION_MS: 12000,  // > 12s before answering = possible fear of committing
  FAST_ANSWER_MS: 4000,       // < 4s and correct = cruising
  IDLE_MS: 45000,             // > 45s idle mid-lesson (the UI logs an `idle` event)
  FATIGUE_SESSION_MS: 8 * 60 * 1000, // sessions longer than 8 min can tire a beginner
  HIGH: 0.62,                 // "high" cut-off on a 0–1 affective dial
  LOW: 0.38,                  // "low" cut-off
}

/* ============================ SENSE ============================
   Distil the recent event window (the current lesson's events) into
   named signals. Replays and retries are POSITIVE engagement — care,
   not weakness — and are never counted against the learner. */
function sense(events) {
  const items = events.filter((e) => e.type === 'item_result')
  const lastItems = items.slice(-6)

  // Consecutive wrong answers, counting back from the most recent item.
  let consecutiveWrong = 0
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].payload.correct) break
    consecutiveWrong++
  }

  // Rapid-fire wrong: the last 2+ answers were wrong AND arrived fast —
  // the signature of frustrated guessing rather than thinking.
  const lastTwo = items.slice(-2)
  const rapidFireWrong =
    lastTwo.length === 2 &&
    lastTwo.every((e) => !e.payload.correct && e.payload.ms < T.RAPID_FIRE_MS)

  // Hesitation: average time-to-answer over the recent items.
  const avgMs = lastItems.length
    ? lastItems.reduce((sum, e) => sum + (e.payload.ms || 0), 0) / lastItems.length
    : 0

  // Are answers slowing down? (compare last 2 items vs the ones before)
  let slowing = false
  if (items.length >= 4) {
    const older = items.slice(-4, -2)
    const newer = items.slice(-2)
    const avg = (arr) => arr.reduce((s, e) => s + (e.payload.ms || 0), 0) / arr.length
    slowing = avg(newer) > avg(older) * 1.6
  }

  const correctRate = lastItems.length
    ? lastItems.filter((e) => e.payload.correct).length / lastItems.length
    : 1

  const allCorrectAndFast =
    lastItems.length >= 3 &&
    lastItems.every((e) => e.payload.correct && e.payload.ms < T.FAST_ANSWER_MS)

  const sessionStart = events.find((e) => e.type === 'lesson_start')
  const sessionMs = sessionStart ? Date.now() - sessionStart.t : 0

  const recentIdle = events.slice(-3).some((e) => e.type === 'idle')
  const lastReflection = [...events].reverse().find((e) => e.type === 'reflection')

  return {
    consecutiveWrong,
    rapidFireWrong,
    avgMs,
    slowing,
    correctRate,
    allCorrectAndFast,
    sessionMs,
    recentIdle,
    itemCount: items.length,
    replays: events.filter((e) => e.type === 'replay').length,   // positive signal
    retries: events.filter((e) => e.type === 'retry').length,    // positive signal
    skips: events.filter((e) => e.type === 'skip').length,
    lastReflectionValence: lastReflection?.payload?.valence ?? null,
  }
}

/* ============================ INTERPRET ============================
   Combine signals WITH the affective profile. The same behaviour means
   different things for different people — two wrong answers are a fun
   challenge for a resilient learner and a crisis for a fragile one.
   Rules are checked in PRIORITY order: protecting the learner (atRisk,
   frustrated) always outranks optimising the learner (coasting). */
function interpret(signals, profile) {
  const { affective } = profile
  const fragile =
    affective.confidence < T.LOW ||
    affective.shameResponse > T.HIGH ||
    affective.frustrationTolerance < T.LOW

  // RULE: rapid-fire wrong answers → "frustrated".
  // Fast + wrong = guessing to escape, not thinking. Intervene with agency.
  if (signals.rapidFireWrong) return 'frustrated'

  // RULE: 2+ consecutive wrong + fragile affective profile → "atRisk".
  // For this learner, mistakes compound emotionally. Intervene NOW, gently.
  if (signals.consecutiveWrong >= 2 && fragile) return 'atRisk'

  // RULE: 2+ consecutive wrong + HIGH frustration tolerance → "challenged".
  // They're fine — possibly enjoying it. Don't rescue people who don't need it.
  if (signals.consecutiveWrong >= 2 && affective.frustrationTolerance > T.HIGH)
    return 'challenged'

  // RULE: 3+ consecutive wrong for ANYONE → "atRisk".
  // Even resilient learners have a limit; the 90–98% success band is broken.
  if (signals.consecutiveWrong >= 3) return 'atRisk'

  // RULE: negative reflection (Frustrated chip) just chosen → "frustrated".
  if (signals.lastReflectionValence !== null && signals.lastReflectionValence <= -0.6)
    return 'frustrated'

  // RULE: long idle mid-lesson → treat as fatigue/disengagement risk.
  if (signals.recentIdle) return 'fatigued'

  // RULE: long session + slowing responses → "fatigued".
  if (signals.sessionMs > T.FATIGUE_SESSION_MS && signals.slowing) return 'fatigued'

  // RULE: long hesitations + NO wrong answers → "anxious".
  // They know more than they commit to; fear of the button, not of the content.
  if (
    signals.itemCount >= 2 &&
    signals.avgMs > T.LONG_HESITATION_MS &&
    signals.correctRate === 1
  )
    return 'anxious'

  // RULE: fast + all correct → "coasting". Raise the ceiling.
  if (signals.allCorrectAndFast) return 'coasting'

  // RULE: steady pace, mostly correct → "flow". THE GOAL STATE. Do not touch.
  if (signals.itemCount >= 2 && signals.correctRate >= 0.75) return 'flow'

  return 'neutral'
}

/* ============================ RESPOND ============================
   Turn the state into concrete adaptations. Every message names effort,
   never talent, and never uses the words "wrong" or "failed". */
function respond(state, signals, profile) {
  const adaptations = []
  const { affective } = profile

  switch (state) {
    case 'atRisk':
      // Switch to stepByStep REGARDLESS of quiz preferences (emotion beats
      // preference), drop to support difficulty, shrink the task, encourage.
      adaptations.push(
        { type: 'switchVariant', variant: 'stepByStep' },
        { type: 'setDifficulty', difficulty: 'support' },
        { type: 'reduceItems', by: 1 },
        {
          type: 'encourage',
          message: {
            en: "This one is tricky for everyone. Let's take it in small pieces.",
            es: 'Esta es difícil para todos. Vamos a tomarla en pedacitos.',
          },
        },
        { type: 'confidenceDelta', delta: -0.03 }, // record the dip honestly (small)
      )
      break

    case 'frustrated':
      // Pause the flow with a soft breather that shows the distance travelled,
      // then OFFER A CHOICE. Choice restores agency; agency lowers the
      // affective filter (they decide, so they stay in control).
      adaptations.push({
        type: 'interstitial',
        kind: 'breather',
        message: {
          en: "Quick breather. Look how far you've come:",
          es: 'Un respiro rápido. Mira lo lejos que has llegado:',
        },
        choices: [
          {
            id: 'switchVariant',
            label: { en: 'Try a different explanation', es: 'Probar otra explicación' },
          },
          {
            id: 'deferItem',
            label: { en: 'Come back to this later', es: 'Volver a esto más tarde' },
          },
        ],
      })
      break

    case 'anxious':
      // Lower the stakes EXPLICITLY. If corrections feel crushing for this
      // learner, also switch to the gentlest correction mode (show the right
      // answer without flagging the wrong one).
      adaptations.push({
        type: 'encourage',
        message: {
          en: "No pressure — you can't break anything here. Guessing is allowed and useful.",
          es: 'Sin presión — aquí no puedes dañar nada. Adivinar está permitido y es útil.',
        },
      })
      if (affective.correctionSensitivity > T.HIGH) {
        adaptations.push({ type: 'gentleCorrections' })
      }
      break

    case 'coasting':
      // Raise to stretch. Social learners get a playful public-feeling
      // challenge; private learners get the same stretch, quietly.
      adaptations.push({ type: 'setDifficulty', difficulty: 'stretch' })
      if (affective.socialComfort > T.HIGH) {
        adaptations.push({
          type: 'encourage',
          message: {
            en: 'Bet you can get this next one in under 10 seconds.',
            es: 'Apuesto a que aciertas la próxima en menos de 10 segundos.',
          },
        })
      }
      adaptations.push({ type: 'confidenceDelta', delta: 0.02 })
      break

    case 'fatigued':
      // Offer an early, HONOURABLE exit. Stopping well beats pushing badly.
      adaptations.push({
        type: 'offerExit',
        message: {
          en: 'Great session. Stopping now is smart, not lazy. Your next lesson will be ready when you are.',
          es: 'Gran sesión. Parar ahora es inteligente, no perezoso. Tu próxima lección estará lista cuando tú lo estés.',
        },
      })
      break

    case 'challenged':
      // They're wrestling and winning the inner fight. Acknowledge, don't rescue.
      adaptations.push({
        type: 'encourage',
        message: {
          en: "You're staying with a hard one. That's exactly how it's done.",
          es: 'Sigues con una difícil. Así es exactamente como se hace.',
        },
      })
      break

    case 'flow':
      // Change NOTHING. Flow minutes are the product working. Log and step back.
      break

    default:
      break
  }

  // RULE (any state): drop back to support if the success band is broken
  // (< 80% correct over recent items). Comprehensible input above all.
  if (signals.itemCount >= 3 && signals.correctRate < 0.8 && state !== 'atRisk') {
    adaptations.push({ type: 'setDifficulty', difficulty: 'support' })
  }

  return adaptations
}

/** The engine. Evaluate after every learner action. */
export function eiEngine(profile, events) {
  const signals = sense(events)
  const state = interpret(signals, profile)
  const adaptations = respond(state, signals, profile)
  return { state, signals, adaptations }
}

/*
  Correction phrasing that follows the learner's correctionSensitivity.
  Used after an incorrect answer, BEFORE any retry. Never "wrong", never
  "failed" — always "not yet", "almost", "let's look again".
*/
export function correctionFor(profile, correctText, gentleOverride = false) {
  const s = profile.affective.correctionSensitivity
  if (!gentleOverride && s < T.LOW) {
    // Direct: this learner asked for it straight.
    return {
      en: `Not this one — the answer is "${correctText}".`,
      es: `Esta no — la respuesta es «${correctText}».`,
    }
  }
  if (gentleOverride || s > T.HIGH) {
    // Gentlest: show the right way without flagging the mistake at all.
    return {
      en: `Here's how it sounds: "${correctText}". Let's look again together.`,
      es: `Así suena: «${correctText}». Miremos de nuevo juntos.`,
    }
  }
  // Middle: demonstrative, warm.
  return {
    en: `Almost! The one we want is "${correctText}".`,
    es: `¡Casi! La que buscamos es «${correctText}».`,
  }
}

/* Specific praise after a correct answer that FOLLOWED struggle —
   references the recovery itself, because that's the skill being built. */
export const RECOVERY_PRAISE = {
  en: "You got it after sticking with it. That's how languages are learned.",
  es: 'Lo lograste por no soltarlo. Así se aprenden los idiomas.',
}

/* Live confidence movement (see spec §6): small nudges, trends not jolts. */
export const CONFIDENCE_DELTAS = {
  correct: 0.015,
  correctAfterStruggle: 0.03,
  proudReflection: 0.04,
  okayReflection: 0.02,
  negativeReflection: -0.02,
}
