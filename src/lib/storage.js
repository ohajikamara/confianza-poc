/*
  localStorage snapshot so a returning visitor resumes where they left off.
  Everything is wrapped in try/catch: if the environment forbids storage
  (private mode, embedded webview), the app silently degrades to
  in-memory-only and nothing breaks. Critical logic NEVER depends on this.
*/

const KEY = 'confianza_snapshot_v1'

export function saveSnapshot(snapshot) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...snapshot, savedAt: Date.now() }))
  } catch {
    /* storage unavailable — in-memory only, by design */
  }
}

export function loadSnapshot() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearSnapshot() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
