import { useEffect, useState } from 'react'

// useState that survives reloads (per-tool settings). Safe when storage is blocked.
export function usePersistedState(key, initial) {
  const k = `pws:${key}`
  const [value, setValue] = useState(() => {
    try { const raw = localStorage.getItem(k); return raw === null ? initial : JSON.parse(raw) } catch { return initial }
  })
  useEffect(() => { try { localStorage.setItem(k, JSON.stringify(value)) } catch { /* storage unavailable */ } }, [k, value])
  return [value, setValue]
}
