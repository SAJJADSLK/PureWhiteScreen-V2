import { useEffect, useRef, useState } from 'react'
import { Play, Pause, RotateCcw, Flag } from 'lucide-react'
import ToolShell, { panelButton } from '@/components/ToolShell'

const fmt = (ms) => {
  const t = Math.floor(ms / 10), cs = t % 100, s = Math.floor(t / 100) % 60, m = Math.floor(t / 6000) % 60, h = Math.floor(t / 360000)
  const p = (n) => String(n).padStart(2, '0')
  return `${h ? p(h) + ':' : ''}${p(m)}:${p(s)}.${p(cs)}`
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState([])
  const startRef = useRef(0)
  const baseRef = useRef(0)

  useEffect(() => {
    if (!running) return
    startRef.current = performance.now(); let raf
    const tick = () => { setElapsed(baseRef.current + performance.now() - startRef.current); raf = requestAnimationFrame(tick) }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); baseRef.current += performance.now() - startRef.current }
  }, [running])

  const lap = () => setLaps((l) => [{ n: l.length + 1, total: elapsed, split: elapsed - (l[0]?.total || 0) }, ...l])
  const reset = () => { setRunning(false); baseRef.current = 0; setElapsed(0); setLaps([]) }
  const toggle = () => setRunning((r) => !r)

  const splits = laps.map((l) => l.split), best = Math.min(...splits), worst = Math.max(...splits)
  return (
    <ToolShell
      background={{ background: 'linear-gradient(135deg,#0b1220,#16243d)' }}
      title="Stopwatch" hint="Space: start or stop. L: lap. R: reset." autoHide={false}
      onKey={(e) => { if (e.key === ' ') { e.preventDefault(); toggle() } else if (e.key === 'l' || e.key === 'L') { if (running) lap() } else if (e.key === 'r' || e.key === 'R') reset() }}
      controls={
        <>
          <button onClick={toggle} className={`${panelButton} inline-flex items-center gap-1.5`}>{running ? <Pause size={16} /> : <Play size={16} />}{running ? 'Stop' : 'Start'}</button>
          <button onClick={lap} disabled={!running} className={`${panelButton} inline-flex items-center gap-1.5 disabled:opacity-40`}><Flag size={16} />Lap</button>
          <button onClick={reset} className={`${panelButton} inline-flex items-center gap-1.5`}><RotateCcw size={16} />Reset</button>
        </>
      }
    >
      <div className="absolute inset-0 flex flex-col items-center pt-28 overflow-y-auto pb-40">
        <div className="text-white font-mono tabular-nums font-bold" style={{ fontSize: 'clamp(3rem, 14vw, 11rem)', lineHeight: 1 }} role="timer" aria-live="off">{fmt(elapsed)}</div>
        {laps.length > 0 && (
          <ol className="mt-8 w-[min(90vw,28rem)] space-y-1 text-white/90 font-mono text-sm">
            {laps.map((l) => (
              <li key={l.n} className={`flex justify-between rounded px-3 py-1.5 bg-white/10 ${laps.length > 2 && l.split === best ? 'text-green-300' : laps.length > 2 && l.split === worst ? 'text-red-300' : ''}`}>
                <span>Lap {l.n}</span><span>{fmt(l.split)}</span><span className="text-white/60">{fmt(l.total)}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </ToolShell>
  )
}
