/**
 * Tracks API request latency for Render (and similar) cold starts.
 * When a request takes longer than WAKING_THRESHOLD_MS, we assume the server
 * is "waking up" and show a friendly message to the user.
 */
const WAKING_THRESHOLD_MS = 2000

type Listener = (isWaking: boolean) => void
let isWaking = false
let pendingCount = 0
let wakeTimer: ReturnType<typeof setTimeout> | null = null
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((cb) => cb(isWaking))
}

function clearWakeTimer() {
  if (wakeTimer) {
    clearTimeout(wakeTimer)
    wakeTimer = null
  }
}

function onRequestEnd() {
  pendingCount = Math.max(0, pendingCount - 1)
  if (pendingCount === 0) {
    clearWakeTimer()
    if (isWaking) {
      isWaking = false
      notify()
    }
  }
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getIsWaking(): boolean {
  return isWaking
}

/**
 * Wrap an async operation (e.g. fetch) so we can detect slow responses
 * and show "Waking server…" UI.
 */
export async function trackRequest<T>(fn: () => Promise<T>): Promise<T> {
  pendingCount++
  if (pendingCount === 1) {
    wakeTimer = setTimeout(() => {
      wakeTimer = null
      if (pendingCount > 0) {
        isWaking = true
        notify()
      }
    }, WAKING_THRESHOLD_MS)
  }

  try {
    return await fn()
  } finally {
    onRequestEnd()
  }
}
