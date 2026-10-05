import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import ToolShell, { Field, panelInput, panelButton } from '@/components/ToolShell'

const PRESETS = [['1 min', 60], ['5 min', 300], ['10 min', 600], ['15 min', 900], ['30 min', 1800], ['1 hour', 3600]]
const pad = (n) => String(n).padStart(2, '0')

function beep() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext, ctx = new AC()
    ;[0, 0.35, 0.7, 1.05].forEach((d) => {
      const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime + d
      o.frequency.value = 880; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.32)
    })
    setTimeout(() => ctx.close(), 2500)
  } catch { /* audio blocked */ }
}

export default function CountdownTimer() {
  const initial = (() => { const t = Number(new URLSearchParams(window.location.search).get('t')); return t > 0 && t <= 359999 ? t : 300 })()
  const [total, setTotal] = useState(initial)
  const [left, setLeft] = useState(initial)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const endAt = useRef(0)

  useEffect(() => {
    if (!running) return
    endAt.current = Date.now() + left * 1000
    const t = setInterval(() => {
      const r = Math.max(0, Math.ceil((endAt.current - Date.now()) / 1000))
      setLeft(r)
      if (r === 0) { setRunning(false); setDone(true); beep(); toast.success("Time's up!") }
    }, 200)
    return () => clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  useEffect(() => {
    if (running || done) document.title = done ? "Time's up! - Countdown" : `${fmt(left)} - Countdown`
    return () => { document.title = 'Countdown Timer - Pure White Screen' }
  }, [left, running, done])

  const h = Math.floor(left / 3600), m = Math.floor((left % 3600) / 60), s = left % 60
  const fmt = (x) => `${x >= 3600 ? pad(Math.floor(x / 3600)) + ':' : ''}${pad(Math.floor((x % 3600) / 60))}:${pad(x % 60)}`
  const set = (secs) => { setTotal(secs); setLeft(secs); setRunning(false); setDone(false) }
  const toggle = () => { if (left === 0) return; setDone(false); setRunning((r) => !r) }
  const reset = () => { setLeft(total); setRunning(false); setDone(false) }
  const part = (label, val, max, apply) => (
    <Field label={label}>
      <input type="number" min="0" max={max} value={val} disabled={running} className={`${panelInput} w-16`} aria-label={label}
        onChange={(e) => { const v = Math.max(0, Math.min(max, Math.floor(+e.target.value || 0))); set(apply(v)) }} />
    </Field>
  )
  const pct = total ? (1 - left / total) * 100 : 0
  return (
    <ToolShell
      background={{ background: done ? '#7f1d1d' : 'linear-gradient(135deg,#0b1220,#16243d)', transition: 'background .4s' }}
      title="Countdown Timer" hint="Space to start or pause. Tab title shows the time left." autoHide={!running ? false : true}
      onKey={(e) => { if (e.key === ' ') { e.preventDefault(); toggle() } else if (e.key === 'r' || e.key === 'R') reset() }}
      controls={
        <>
          {part('h', h, 99, (v) => v * 3600 + m * 60 + s)}{part('m', m, 59, (v) => h * 3600 + v * 60 + s)}{part('s', s, 59, (v) => h * 3600 + m * 60 + v)}
          <button onClick={toggle} className={`${panelButton} inline-flex items-center gap-1.5`}>{running ? <Pause size={16} /> : <Play size={16} />}{running ? 'Pause' : 'Start'}</button>
          <button onClick={reset} className={`${panelButton} inline-flex items-center gap-1.5`}><RotateCcw size={16} />Reset</button>
          <div className="flex flex-wrap gap-1.5 justify-center" role="group" aria-label="Presets">
            {PRESETS.map(([n, v]) => <button key={n} onClick={() => set(v)} className={`${panelButton} text-xs`}>{n}</button>)}
          </div>
        </>
      }
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-white font-mono tabular-nums font-bold" style={{ fontSize: 'clamp(3.5rem, 18vw, 14rem)', lineHeight: 1 }} role="timer" aria-live="off">{h > 0 || total >= 3600 ? `${pad(h)}:` : ''}{pad(m)}:{pad(s)}</div>
        <div className="mt-8 h-2 w-[min(80vw,40rem)] rounded-full bg-white/15 overflow-hidden"><div className="h-full bg-cyan-400 transition-all" style={{ width: `${pct}%` }} /></div>
        {done && <p className="mt-6 text-2xl font-semibold text-white">Time's up!</p>}
      </div>
    </ToolShell>
  )
}
