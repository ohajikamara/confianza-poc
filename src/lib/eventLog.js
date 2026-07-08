/*
  Instrumentation: every interaction in the app becomes one event in this
  in-memory list. Shape: { t: timestamp (ms), type: string, payload: object }.

  Event types used across the app:
    session_start / session_resume / session_end
    assessment_answer, assessment_complete
    profile_revealed
    lesson_start, beat_start, item_result, replay, retry, skip,
    variant_selected, variant_switched, difficulty_changed,
    ei_state_change, adaptation_fired, intervention_outcome,
    reflection, lesson_complete, course_complete, email_captured

  The "Export session data" button downloads this log + the final profile
  as JSON. This is the evidence base for the pilot analysis: assessment
  completion, lessons completed, interventions fired vs sessions rescued,
  confidence trend, return visits.
*/

const events = []
const listeners = new Set()

export function logEvent(type, payload = {}) {
  const event = { t: Date.now(), type, payload }
  events.push(event)
  listeners.forEach((fn) => fn(event))
  return event
}

export function getEvents() {
  return events
}

/** Last N events, newest last — the EI engine reads a recent window. */
export function recentEvents(n = 30) {
  return events.slice(-n)
}

export function onEvent(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Download the full event log + final profile as a JSON file. */
export function exportSession(profile, extra = {}) {
  const data = {
    exportedAt: new Date().toISOString(),
    app: 'confianza-poc',
    profile,
    ...extra,
    events,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `confianza-session-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
