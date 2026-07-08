/*
  CONFIANZA — proof of concept.
  Screen flow: Welcome → Assessment → Profile Reveal → Course Home →
  Lesson (5 beats) → Progress → ... → Course Complete.

  No router: one state machine. State lives in memory, with a snapshot to
  localStorage (try/catch-wrapped) so a returning visitor resumes.
*/
import { useEffect, useMemo, useState } from 'react'
import Welcome from './components/Welcome'
import Assessment from './components/Assessment'
import ProfileReveal from './components/ProfileReveal'
import CourseHome from './components/CourseHome'
import Lesson from './components/Lesson'
import ProgressScreen from './components/ProgressScreen'
import CourseComplete from './components/CourseComplete'
import { ExportFooter } from './components/ui'
import { LESSONS } from './data/lessons'
import { createEmptyProfile, normaliseModality, initialDifficulty } from './engine/profile'
import { logEvent } from './lib/eventLog'
import { saveSnapshot, loadSnapshot, clearSnapshot } from './lib/storage'

export default function App() {
  const snapshot = useMemo(() => loadSnapshot(), [])

  const [screen, setScreen] = useState('welcome')
  const [profile, setProfile] = useState(createEmptyProfile)
  const [completedLessons, setCompletedLessons] = useState([])
  const [activeLessonId, setActiveLessonId] = useState(null)
  // Confidence trend: one point at baseline + one after each lesson.
  const [confidenceTrend, setConfidenceTrend] = useState([])
  // Items missed in a lesson resurface at the start of the next one.
  const [reviewQueue, setReviewQueue] = useState([])

  useEffect(() => {
    logEvent(snapshot ? 'session_resume_available' : 'session_start', {
      returningVisitor: !!snapshot,
      lastSavedAt: snapshot?.savedAt ?? null,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Persist a snapshot on every meaningful transition (degrades silently
     to in-memory-only if storage is unavailable). */
  useEffect(() => {
    // Not during welcome/assessment: resuming mid-assessment would replay
    // answer effects onto an already-shifted profile. Lessons resume at Home.
    if (screen === 'welcome' || screen === 'assessment') return
    saveSnapshot({ screen: screen === 'lesson' ? 'home' : screen, profile, completedLessons, confidenceTrend, reviewQueue })
  }, [screen, profile, completedLessons, confidenceTrend, reviewQueue])

  function startFresh() {
    clearSnapshot()
    setProfile(createEmptyProfile())
    setCompletedLessons([])
    setConfidenceTrend([])
    setReviewQueue([])
    logEvent('assessment_start', {})
    setScreen('assessment')
  }

  function resume() {
    logEvent('session_resume', { savedScreen: snapshot.screen })
    setProfile(snapshot.profile)
    setCompletedLessons(snapshot.completedLessons || [])
    setConfidenceTrend(snapshot.confidenceTrend || [])
    setReviewQueue(snapshot.reviewQueue || [])
    setScreen(snapshot.screen === 'assessment' ? 'assessment' : snapshot.screen)
  }

  function completeAssessment(finalProfile) {
    const normalised = normaliseModality(finalProfile)
    setProfile(normalised)
    // Confidence baseline: the trend is always measured against THIS point.
    setConfidenceTrend([normalised.affective.confidence])
    setScreen('reveal')
  }

  function completeLesson({ missedItems, profileAfter }) {
    setCompletedLessons((prev) => [...prev, activeLessonId])
    setConfidenceTrend((prev) => [...prev, profileAfter.affective.confidence])
    setReviewQueue(missedItems) // resurface once at the start of the next lesson
    setScreen('progress')
  }

  function continueFromProgress() {
    const allDone = completedLessons.length === LESSONS.length
    if (allDone) {
      logEvent('course_complete', { confidenceTrend })
      setScreen('complete')
    } else {
      setScreen('home')
    }
  }

  const activeLesson = LESSONS.find((l) => l.id === activeLessonId)
  const completedAchievements = LESSONS.filter((l) => completedLessons.includes(l.id)).map(
    (l) => l.achievement,
  )

  return (
    <>
      {screen === 'welcome' && (
        <Welcome hasSnapshot={!!snapshot} onStart={startFresh} onResume={resume} />
      )}

      {screen === 'assessment' && (
        <Assessment profile={profile} onProfileChange={setProfile} onComplete={completeAssessment} />
      )}

      {screen === 'reveal' && <ProfileReveal profile={profile} onStart={() => setScreen('home')} />}

      {screen === 'home' && (
        <CourseHome
          profile={profile}
          completedLessons={completedLessons}
          confidenceTrend={confidenceTrend}
          onStartLesson={(id) => {
            setActiveLessonId(id)
            setScreen('lesson')
          }}
        />
      )}

      {screen === 'lesson' && activeLesson && (
        <Lesson
          key={activeLesson.id}
          lesson={activeLesson}
          profile={profile}
          onProfileChange={setProfile}
          carriedReview={reviewQueue}
          initialDifficulty={initialDifficulty(profile)}
          completedAchievements={completedAchievements}
          onComplete={completeLesson}
          onExitEarly={() => {
            logEvent('session_end', { reason: 'honourable_exit' })
            setScreen('home')
          }}
        />
      )}

      {screen === 'progress' && (
        <ProgressScreen
          completedLessons={completedLessons}
          confidenceTrend={confidenceTrend}
          onContinue={continueFromProgress}
        />
      )}

      {screen === 'complete' && <CourseComplete />}

      <ExportFooter profile={profile} />
    </>
  )
}
