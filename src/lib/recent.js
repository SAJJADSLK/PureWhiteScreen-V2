const KEY = 'pws:recent'
export function getRecent() {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(v) ? v : [] } catch { return [] }
}
export function pushRecent(id) {
  try { localStorage.setItem(KEY, JSON.stringify([id, ...getRecent().filter((x) => x !== id)].slice(0, 6))) } catch { /* storage blocked */ }
}
