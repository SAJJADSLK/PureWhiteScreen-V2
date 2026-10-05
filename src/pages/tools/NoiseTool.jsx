import { useEffect, useRef, useState } from 'react'
import { Play, Pause } from 'lucide-react'
import { Soundscape } from '@/lib/ambientAudio'
import { usePersistedState } from '@/hooks/usePersistedState'
import ToolShell, { Field, panelInput } from '@/components/ToolShell'

const SLEEP = [['Off', 0], ['15 min', 15], ['30 min', 30], ['60 min', 60], ['8 hours', 480]]

export default function NoiseTool({ preset }) {
  const { id, kind, title, blurb, colors } = preset
  const [on, setOn] = useState(false)
  const [volume, setVolume] = usePersistedState('noise:volume', 40)
  const [sleep, setSleep] = useState(0)
  const [left, setLeft] = useState(0)
  const [error, setError] = useState('')
  const engine = useRef(null)

  const stop = () => { engine.current?.stop(); engine.current = null; setOn(false); setLeft(0) }
  const start = async () => {
    try { engine.current = new Soundscape(); await engine.current.start(); setError(''); setOn(true) }
    catch (e) { setError(e.message) }
  }

  useEffect(() => { if (on && engine.current) engine.current.set(kind, volume) }, [on, volume, kind])
  useEffect(() => () => engine.current?.stop(), [])
  useEffect(() => { stop() }, [id]) // switching noise pages stops the old sound

  // sleep timer (timestamp based)
  useEffect(() => {
    if (!on || !sleep) { setLeft(0); return }
    const end = Date.now() + sleep * 60000
    const t = setInterval(() => {
      const r = Math.max(0, Math.round((end - Date.now()) / 1000)); setLeft(r)
      if (r === 0) stop()
    }, 500)
    return () => clearInterval(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, sleep])

  const mm = String(Math.floor(left / 60)).padStart(2, '0'), ss = String(left % 60).padStart(2, '0')
  return (
    <ToolShell
      background={{ background: `radial-gradient(circle at 50% 40%, ${colors[1]}, ${colors[0]} 60%, #05070d)` }}
      title={title} hint={blurb} autoHide={false}
      onKey={(e) => { if (e.key === ' ') { e.preventDefault(); on ? stop() : start() } }}
      controls={
        <>
          <Field label="Volume">
            <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(+e.target.value)} className="w-32" aria-label="Volume" />
            <span className="w-9 tabular-nums text-white/70">{volume}%</span>
          </Field>
          <Field label="Sleep timer">
            <select value={sleep} onChange={(e) => setSleep(+e.target.value)} className={panelInput}>
              {SLEEP.map(([n, v]) => <option key={n} value={v} className="text-black">{n}</option>)}
            </select>
          </Field>
        </>
      }
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <button onClick={on ? stop : start} aria-label={on ? `Pause ${title}` : `Play ${title}`}
          className="relative h-28 w-28 rounded-full bg-white/15 border border-white/40 backdrop-blur text-white flex items-center justify-center hover:bg-white/25 transition">
          {on && <span className="absolute inset-0 rounded-full border border-white/40 animate-ping" aria-hidden="true" />}
          {on ? <Pause size={44} /> : <Play size={44} className="ml-1" />}
        </button>
        <p className="text-white/80 text-sm" aria-live="polite">{error || (on ? (left ? `Stops in ${mm}:${ss}` : 'Playing. Press Space to pause.') : 'Press play, or press Space.')}</p>
      </div>
    </ToolShell>
  )
}
