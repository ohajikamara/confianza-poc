/*
  THE LEARNER PROFILE
  -------------------
  Four dimensions. Modality is a set of WEIGHTS, never a single label —
  people are mixing desks, not light switches. The assessment seeds these
  values; the Emotional Intelligence engine keeps moving them live as the
  learner behaves (behaviour gradually outranks the quiz).

  For the teaching lead: every number in here is between 0 and 1.
  - modality.*: relative appetite for each learning channel (normalised so
    they sum to 1 — a weight of 0.30 means "about 30% of how this person
    learns").
  - affective.*: emotional dials. 0.5 is "average". confidence is LIVE —
    it moves after every answer and reflection.
  - pace / cognitive: coarse preferences used to pick defaults.
  - behavioural: raw counters the EI engine maintains.
*/

export function createEmptyProfile() {
  return {
    modality: {
      doing: 0,          // learns by attempting tasks
      watching: 0,       // learns from demonstration / video
      reading: 0,        // learns from written explanation
      stepByStep: 0,     // learns from guided sequential scaffolding
      experimenting: 0,  // learns by trial, error and playing
      reviewing: 0,      // learns by revisiting and reflecting
    },
    affective: {
      confidence: 0.5,            // 0 fragile → 1 confident (live value)
      frustrationTolerance: 0.5,  // how long they can sit with difficulty
      correctionSensitivity: 0.5, // high = corrections feel crushing
      shameResponse: 0.5,         // high = public mistakes paralyse
      socialComfort: 0.5,         // high = audience motivates; low = privacy essential
    },
    pace: {
      style: 'adaptive',      // "fastRisky" | "slowSure" | "adaptive"
      sessionLength: 'short', // "short" | "medium"
    },
    cognitive: {
      orientation: 'mixed', // "bigPicture" | "detailsFirst" | "mixed"
      grammarMode: 'mixed', // "explained" | "shownByExample" | "mixed"
    },
    behavioural: {
      // Updated live by the EI engine; over time these override the quiz.
      quitAfterMistake: 0,
      retryCount: 0,
      skipCount: 0,
      avgHesitationMs: 0,
      reflectionEngagement: 0,
    },
    placement: {
      correct: 0, // placement items answered correctly (seeds difficulty band)
      total: 0,
    },
    mixedFlag: false, // set when answers repeatedly say "a combination" — the primary persona
  }
}

const clamp01 = (v) => Math.max(0, Math.min(1, v))

/*
  Apply one assessment answer to the profile.
  Each answer option carries an `effects` map: { "dot.path": delta }.
  - modality.* deltas ACCUMULATE (normalised at the end of the assessment)
  - affective.* deltas shift the 0.5 baseline, clamped to [0, 1]
  - pace.* / cognitive.* string values are SET directly
  - special keys: "mixedFlag": true, "placement": 1|0 (correct/incorrect)
  The full question→effect mapping lives in src/data/assessment.js where
  each option documents what it moves and why.
*/
export function applyAnswerEffects(profile, effects) {
  const next = structuredClone(profile)
  for (const [path, value] of Object.entries(effects)) {
    if (path === 'mixedFlag') {
      next.mixedFlag = true
      continue
    }
    if (path === 'placement') {
      next.placement.total += 1
      next.placement.correct += value
      continue
    }
    const [dim, key] = path.split('.')
    if (dim === 'modality') {
      next.modality[key] += value
    } else if (dim === 'affective') {
      next.affective[key] = clamp01(next.affective[key] + value)
    } else if (dim === 'pace' || dim === 'cognitive') {
      next[dim][key] = value
    }
  }
  return next
}

/** Normalise modality weights so they sum to 1 (called once, after the assessment). */
export function normaliseModality(profile) {
  const next = structuredClone(profile)
  const sum = Object.values(next.modality).reduce((a, b) => a + b, 0)
  if (sum > 0) {
    for (const key of Object.keys(next.modality)) {
      next.modality[key] = next.modality[key] / sum
    }
  } else {
    // Learner answered "not sure" to everything: start perfectly mixed.
    for (const key of Object.keys(next.modality)) {
      next.modality[key] = 1 / 6
    }
  }
  return next
}

/** Live confidence nudges from the EI engine. Small on purpose: trends, not jolts. */
export function nudgeConfidence(profile, delta) {
  const next = structuredClone(profile)
  next.affective.confidence = clamp01(next.affective.confidence + delta)
  return next
}

export const MODALITY_LABELS = {
  doing: { en: 'Doing', es: 'Haciendo' },
  watching: { en: 'Watching', es: 'Observando' },
  reading: { en: 'Reading', es: 'Leyendo' },
  stepByStep: { en: 'Step by step', es: 'Paso a paso' },
  experimenting: { en: 'Experimenting', es: 'Experimentando' },
  reviewing: { en: 'Reviewing', es: 'Repasando' },
}

/*
  Turn the profile into a warm, plain-language description for the
  Profile Reveal screen. Names the top channels, the correction style,
  and the pace — framed as a gift, not a diagnosis.
*/
export function describeProfile(profile) {
  const sorted = Object.entries(profile.modality).sort((a, b) => b[1] - a[1])
  const [top1, top2] = sorted
  const topLabel = (k) => MODALITY_LABELS[k].en.toLowerCase()
  const topLabelEs = (k) => MODALITY_LABELS[k].es.toLowerCase()

  const mixed = profile.mixedFlag || (top1[1] - sorted[sorted.length - 1][1] < 0.12)

  let en = mixed
    ? `You learn best through a mix of channels — especially ${topLabel(top1[0])} and ${topLabel(top2[0])}.`
    : `You learn best through ${topLabel(top1[0])}, supported by ${topLabel(top2[0])}.`
  let es = mixed
    ? `Aprendes mejor con una mezcla de canales — sobre todo ${topLabelEs(top1[0])} y ${topLabelEs(top2[0])}.`
    : `Aprendes mejor ${topLabelEs(top1[0])}, con apoyo de ${topLabelEs(top2[0])}.`

  const { correctionSensitivity } = profile.affective
  if (correctionSensitivity > 0.62) {
    en += ' You like corrections shown gently, without pointing at the mistake.'
    es += ' Prefieres correcciones suaves, sin señalar el error.'
  } else if (correctionSensitivity < 0.38) {
    en += ' You like corrections told to you directly — no dancing around it.'
    es += ' Prefieres correcciones directas, sin rodeos.'
  } else {
    en += ' You like corrections that show you the right way calmly.'
    es += ' Prefieres correcciones que te muestran el camino con calma.'
  }

  if (profile.pace.style === 'fastRisky') {
    en += ' You move fast and learn from trying.'
    es += ' Avanzas rápido y aprendes intentando.'
  } else if (profile.pace.style === 'slowSure') {
    en += ' You like to be sure of each step before the next.'
    es += ' Te gusta asegurar cada paso antes del siguiente.'
  } else {
    en += ' Your pace adapts to the moment — and so will we.'
    es += ' Tu ritmo se adapta al momento — y nosotros también.'
  }

  en += ' We built your course around exactly that.'
  es += ' Construimos tu curso exactamente alrededor de eso.'
  return { en, es }
}

/*
  Pick the default explanation variant for a concept from the profile.
  ORDER MATTERS and is intentional:
  1. grammarMode is the strongest stated preference ("explain the rule"
     vs "show me examples").
  2. Otherwise the heaviest modality channel decides.
  The EI engine can OVERRIDE this at any moment — emotional state beats
  preference, always (core design law).
*/
export function defaultVariantFor(profile) {
  const { grammarMode } = profile.cognitive
  if (grammarMode === 'explained') return 'ruleFirst'
  if (grammarMode === 'shownByExample') return 'exampleFirst'

  const sorted = Object.entries(profile.modality).sort((a, b) => b[1] - a[1])
  const top = sorted[0][0]
  const map = {
    doing: 'tryIt',
    experimenting: 'tryIt',
    watching: 'story',
    reading: 'ruleFirst',
    stepByStep: 'stepByStep',
    reviewing: 'exampleFirst',
  }
  return map[top] || 'exampleFirst'
}

/*
  Seed difficulty band from the placement block.
  3-4 gentle items: all correct → standard (they're a solid beginner),
  most wrong → support (extra scaffolding from lesson one).
  Live performance moves this constantly afterwards (90–98% target band).
*/
export function initialDifficulty(profile) {
  const { correct, total } = profile.placement
  if (total === 0) return 'standard'
  const ratio = correct / total
  if (ratio < 0.5) return 'support'
  return 'standard'
}
