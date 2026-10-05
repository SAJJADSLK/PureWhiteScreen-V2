import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { Soundscape } from '../lib/ambientAudio'

// Renders a sound on/off button and plays the given tracks: [{ kind, volume 0-100 }].
// Audio only starts after a click (browser autoplay policy).
export default function SoundEngine({ tracks, label = 'Sound' }) {
  const [on, setOn] = useState(false)
  const [error, setError] = useState('')
  const engine = useRef(null)
  const key = tracks.map((t) => `${t.kind}:${t.volume}`).join('|')

  const toggle = async () => {
    if (on) { engine.current?.stop(); engine.current = null; setOn(false); return }
    try {
      engine.current = new Soundscape(); await engine.current.start(); setError(''); setOn(true)
    } catch (e) { setError(e.message) }
  }

  useEffect(() => {
    if (!on || !engine.current) return
    const e = engine.current, active = new Set()
    tracks.forEach((t) => { e.set(t.kind, t.volume); active.add(t.kind) })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, key])

  useEffect(() => () => { engine.current?.stop(); engine.current = null }, [])

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
      <button onClick={toggle} aria-pressed={on}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium backdrop-blur border transition ${on ? 'bg-cyan-500/30 border-cyan-300/60 text-white' : 'bg-black/60 border-white/30 text-white hover:bg-black/80'}`}>
        {on ? <Volume2 size={16} /> : <VolumeX size={16} />}{on ? `${label} on` : `Turn ${label.toLowerCase()} on`}
      </button>
      {error && <p className="text-xs text-red-300 bg-black/70 rounded px-2 py-1" role="alert">{error}</p>}
    </div>
  )
}
