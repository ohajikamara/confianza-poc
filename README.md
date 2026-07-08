# Confianza — Proof of Concept

An English learning platform for Spanish-speaking beginners in Colombia. Three parts:

1. **Learning Combination Assessment** — 24 warm, conversational questions that build a multidimensional learner profile (modality weights, affective dials, pace, cognitive style, gentle placement).
2. **Adaptive Micro-Course** — five A1 lessons (3–5 min each) whose content, pacing, tone, and explanation mode adapt to the profile and live behaviour.
3. **Emotional Intelligence Engine** — a rule-based layer that senses learner state from behaviour, interprets it against the profile, and switches pedagogy in real time.

**Core design law:** every adaptive decision checks emotional state FIRST and preference SECOND.

## Run it

```bash
npm install
npm run dev     # → http://localhost:5173
```

Everything is client-side: no backend, no auth, no database. Progress snapshots to
localStorage (wrapped in try/catch — degrades silently to in-memory).

## Where the logic lives (for the teaching lead)

| File | What it decides |
|---|---|
| `src/data/assessment.js` | Every question and exactly how each answer moves the profile |
| `src/engine/profile.js` | The profile shape, normalisation, default-variant selection, difficulty seeding |
| `src/data/lessons.js` | All lesson content, incl. every concept in 5 explanation variants |
| `src/engine/eiEngine.js` | SENSE → INTERPRET → RESPOND rules, thresholds, correction tone |
| `src/components/Lesson.jsx` | How adaptations are applied mid-lesson (variant switches, breathers, exits) |

All rules are commented in plain language and meant to be challenged.

## Evidence

The unobtrusive **Export session data** button (footer) downloads the full event log +
final profile as JSON: assessment answers, variant selections/switches, EI state changes,
adaptations fired, intervention outcomes (sessions rescued), item results, reflections,
and session start/end — everything needed to measure completion, rescue rate,
confidence trend, and return visits.
