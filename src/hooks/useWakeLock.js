import { useEffect } from 'react'

// Keeps the screen awake while a tool is open (Screen Wake Lock API; silently ignored if unsupported).
export function useWakeLock(enabled = true) {
  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return
    let lock = null, cancelled = false
    const acquire = async () => {
      try { lock = await navigator.wakeLock.request('screen'); if (cancelled) lock.release().catch(() => {}) } catch { /* denied or not visible */ }
    }
    const onVis = () => { if (document.visibilityState === 'visible') acquire() }
    acquire()
    document.addEventListener('visibilitychange', onVis)
    return () => { cancelled = true; document.removeEventListener('visibilitychange', onVis); lock?.release().catch(() => {}) }
  }, [enabled])
}
