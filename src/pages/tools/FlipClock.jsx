import { useEffect, useState } from 'react'
import { usePersistedState } from '@/hooks/usePersistedState'
import ToolShell, { panelButton } from '@/components/ToolShell'

const Card = ({ v }) => (
  <div className="relative rounded-xl bg-neutral-900 text-white font-bold tabular-nums shadow-2xl border border-white/10 flex items-center justify-center overflow-hidden"
    style={{ fontSize: 'clamp(3rem, 15vw, 12rem)', width: '0.8em', height: '1.15em', lineHeight: 1 }}>
    {v}<div className="absolute inset-x-0 top-1/2 h-px bg-black/80" aria-hidden="true" />
  </div>
)

export default function FlipClock() {
  const [now, setNow] = useState(new Date())
  const [h24, setH24] = usePersistedState('clock:h24', false)
  const [secs, setSecs] = usePersistedState('clock:secs', true)
  const [date, setDate] = usePersistedState('clock:date', true)
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 250); return () => clearInterval(t) }, [])

  let h = now.getHours(); const ampm = h >= 12 ? 'PM' : 'AM'
  if (!h24) h = h % 12 || 12
  const p = (n) => String(n).padStart(2, '0')
  const groups = [p(h), p(now.getMinutes()), ...(secs ? [p(now.getSeconds())] : [])]
  return (
    <ToolShell
      background={{ background: '#0a0a0a' }} title="Flip Clock" hint="Press F for fullscreen." 
      controls={
        <>
          <button onClick={() => setH24((v) => !v)} className={panelButton}>{h24 ? '24-hour' : '12-hour'}</button>
          <button onClick={() => setSecs((v) => !v)} aria-pressed={secs} className={`${panelButton} ${secs ? 'bg-blue-500/50' : ''}`}>Seconds</button>
          <button onClick={() => setDate((v) => !v)} aria-pressed={date} className={`${panelButton} ${date ? 'bg-blue-500/50' : ''}`}>Date</button>
        </>
      }
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-[2vw]" role="timer" aria-label={now.toLocaleTimeString()}>
          {groups.map((g, i) => (
            <div key={i} className="flex gap-[1vw]">{g.split('').map((d, j) => <Card key={j} v={d} />)}</div>
          ))}
          {!h24 && <span className="self-end mb-4 text-white/70 text-xl md:text-3xl font-semibold">{ampm}</span>}
        </div>
        {date && <p className="text-white/70 text-lg md:text-2xl">{now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>}
      </div>
    </ToolShell>
  )
}
