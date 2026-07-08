/*
  Listening exercises use the browser's built-in SpeechSynthesis API.
  We prefer an en-US or en-GB voice, speak slightly slowly for beginners,
  and expose `speechAvailable` so the UI can show a graceful
  "read aloud unavailable" fallback instead of a dead button.
*/

export const speechAvailable =
  typeof window !== 'undefined' && 'speechSynthesis' in window

let cachedVoice = null

function pickVoice() {
  if (cachedVoice) return cachedVoice
  const voices = window.speechSynthesis.getVoices()
  cachedVoice =
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang === 'en-GB') ||
    voices.find((v) => v.lang.startsWith('en')) ||
    null
  return cachedVoice
}

// Voices often load asynchronously; refresh the cache when they arrive.
if (speechAvailable) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null
    pickVoice()
  }
}

/** Speak an English phrase aloud. Returns true if speech was attempted. */
export function speak(text) {
  if (!speechAvailable) return false
  try {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = pickVoice()
    if (voice) utterance.voice = voice
    utterance.lang = voice?.lang || 'en-US'
    utterance.rate = 0.85 // slightly slow — beginner-friendly
    window.speechSynthesis.speak(utterance)
    return true
  } catch {
    return false
  }
}
