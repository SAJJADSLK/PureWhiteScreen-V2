import { useEffect, useState } from 'react'

const ROWS = [['F', 'Fullscreen on or off'], ['Esc', 'Leave fullscreen'], ['Space', 'Start / pause (timers, noise)'], ['L', 'Lap (stopwatch)'], ['R', 'Reset (timers)'], ['?', 'Show this help']]

export default function ShortcutsHelp() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = (e) => {
      const tag = (e.target.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return
      if (e.key === '?') setOpen((o) => !o)
      else if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[95] bg-black/60 grid place-items-center p-4" onClick={() => setOpen(false)} role="dialog" aria-label="Keyboard shortcuts">
      <div className="bg-slate-900 border border-slate-600 rounded-xl p-6 w-full max-w-sm text-white" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-semibold mb-4">Keyboard shortcuts</h2>
        <dl className="space-y-2">
          {ROWS.map(([k, d]) => (
            <div key={k} className="flex items-center justify-between gap-4 text-sm">
              <dt><kbd className="px-2 py-0.5 rounded bg-slate-700 font-mono">{k}</kbd></dt><dd className="text-slate-300">{d}</dd>
            </div>
          ))}
        </dl>
        <button onClick={() => setOpen(false)} className="mt-5 w-full rounded-lg bg-blue-500 hover:bg-blue-400 py-2 font-medium">Close</button>
      </div>
    </div>
  )
}
