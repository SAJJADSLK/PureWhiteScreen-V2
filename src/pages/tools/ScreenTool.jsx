import { useEffect, useMemo, useRef, useState } from 'react'
import { Download, Link2, Grid3x3, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import ToolShell, { Field, panelInput, panelButton } from '@/components/ToolShell'
import { usePersistedState } from '@/hooks/usePersistedState'
import { kelvinToRgb, hexToRgb, scaleRgb, rgbToHex, normalizeHex, RESOLUTIONS } from '@/lib/colorUtils'
import { downloadBlob } from '@/lib/imageUtils'

// One configurable screen tool powering white/black/green/color pages and the lighting scenes.
// preset: { id, title, hint, mode: 'color' | 'light', color, temp, brightness, picker, tips[] }
function readParams() {
  try { return new URLSearchParams(window.location.search) } catch { return new URLSearchParams() }
}

export default function ScreenTool({ preset }) {
  const { id, title, hint, mode = 'color', picker = false, tips = [] } = preset
  const params = useMemo(readParams, [])
  const p = (k, d) => params.get(k) ?? d
  const [color, setColor] = usePersistedState(`${id}:color`, normalizeHex(p('c', '')) || preset.color || '#ffffff')
  const [temp, setTemp] = usePersistedState(`${id}:temp`, Number(p('t', preset.temp ?? 6500)))
  const [brightness, setBrightness] = usePersistedState(`${id}:b`, Number(p('b', preset.brightness ?? 100)))
  const [grid, setGrid] = useState(false)
  const [oled, setOled] = usePersistedState('oled-protect', false)
  const [res, setRes] = useState(0)
  const [hexInput, setHexInput] = useState(color)
  const [drift, setDrift] = useState(0)
  const urlApplied = useRef(false)

  // shared links (?c=&t=&b=) win over saved settings, once
  useEffect(() => {
    if (urlApplied.current) return
    urlApplied.current = true
    const c = normalizeHex(params.get('c') || ''); if (c) setColor(c)
    if (params.get('t')) setTemp(Number(params.get('t')))
    if (params.get('b')) setBrightness(Number(params.get('b')))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => setHexInput(color), [color])

  // OLED protection: tiny brightness drift every 30s so no pixel sits at one value for hours
  useEffect(() => {
    if (!oled) { setDrift(0); return }
    const t = setInterval(() => setDrift((Math.random() * 6 - 3)), 30000)
    return () => clearInterval(t)
  }, [oled])

  const base = mode === 'light' ? kelvinToRgb(temp) : (hexToRgb(color) || [255, 255, 255])
  const rgb = scaleRgb(base, Math.max(0, Math.min(100, brightness + drift)))
  const css = `rgb(${rgb.join(',')})`
  const isDark = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114 < 140

  const save = () => {
    const [name, w, h] = RESOLUTIONS[res]
    const W = w || window.screen.width * (window.devicePixelRatio || 1), H = h || window.screen.height * (window.devicePixelRatio || 1)
    try {
      const c = document.createElement('canvas'); c.width = Math.round(W); c.height = Math.round(H)
      const ctx = c.getContext('2d'); ctx.fillStyle = css; ctx.fillRect(0, 0, c.width, c.height)
      c.toBlob((b) => {
        if (!b) return toast.error('This size is too large for your device. Try a smaller one.')
        downloadBlob(b, `${id}-${c.width}x${c.height}.png`)
      }, 'image/png')
    } catch { toast.error('Could not create that image size.') }
  }

  const share = async () => {
    const q = new URLSearchParams()
    if (mode === 'color' && color !== (preset.color || '#ffffff')) q.set('c', color.replace('#', ''))
    if (mode === 'light') q.set('t', String(temp))
    if (brightness !== (preset.brightness ?? 100)) q.set('b', String(brightness))
    const url = `${window.location.origin}${window.location.pathname}${q.toString() ? `?${q}` : ''}`
    try { await navigator.clipboard.writeText(url); toast.success('Link copied. It opens with these settings.') } catch { toast.info(url) }
  }

  const grid4 = grid
    ? { backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,.28)' : 'rgba(0,0,0,.28)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,.28)' : 'rgba(0,0,0,.28)'} 1px, transparent 1px)`, backgroundSize: '4px 4px' }
    : undefined

  const controls = (
    <>
      <Field label="Brightness">
        <input type="range" min="5" max="100" value={brightness} onChange={(e) => setBrightness(+e.target.value)} className="w-28" aria-label="Brightness" />
        <span className="w-9 tabular-nums text-white/70">{brightness}%</span>
      </Field>
      {mode === 'light' && (
        <Field label="Warmth">
          <input type="range" min="2000" max="9000" step="100" value={temp} onChange={(e) => setTemp(+e.target.value)} className="w-28" aria-label="Color temperature" />
          <span className="w-12 tabular-nums text-white/70">{temp}K</span>
        </Field>
      )}
      {picker && (
        <>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} aria-label="Pick a color" className="h-8 w-10 rounded bg-transparent cursor-pointer" />
          <Field label="Hex">
            <input value={hexInput} onChange={(e) => { setHexInput(e.target.value); const n = normalizeHex(e.target.value); if (n) setColor(n) }}
              onBlur={() => setHexInput(color)} className={`${panelInput} w-24 font-mono`} aria-label="Hex color" maxLength={7} />
          </Field>
        </>
      )}
      <Field label="Size">
        <select value={res} onChange={(e) => setRes(+e.target.value)} className={panelInput} aria-label="Download size">
          {RESOLUTIONS.map(([n], i) => <option key={n} value={i} className="text-black">{n}</option>)}
        </select>
      </Field>
      <button onClick={save} className={`${panelButton} inline-flex items-center gap-1.5`} title="Download as PNG"><Download size={16} />PNG</button>
      <button onClick={share} className={`${panelButton} inline-flex items-center gap-1.5`} title="Copy a link with these settings"><Link2 size={16} />Share</button>
      <button onClick={() => setGrid((g) => !g)} aria-pressed={grid} className={`${panelButton} inline-flex items-center gap-1.5 ${grid ? 'bg-blue-500/50' : ''}`} title="Show a pixel grid"><Grid3x3 size={16} />Grid</button>
      <button onClick={() => setOled((o) => !o)} aria-pressed={oled} className={`${panelButton} inline-flex items-center gap-1.5 ${oled ? 'bg-blue-500/50' : ''}`} title="OLED protection: shifts brightness slightly every 30 seconds"><ShieldCheck size={16} />OLED</button>
    </>
  )

  return (
    <ToolShell
      background={{ backgroundColor: css, transition: 'background-color .25s' }}
      title={title} hint={hint} dark={isDark} controls={controls}
    >
      {grid && <div className="absolute inset-0 pointer-events-none" style={grid4} />}
      {tips.length > 0 && (
        <ul className={`pointer-events-none absolute top-28 inset-x-0 mx-auto max-w-md text-center text-sm space-y-1 px-4 ${isDark ? 'text-white/55' : 'text-black/55'}`}>
          {tips.map((t) => <li key={t}>{t}</li>)}
        </ul>
      )}
    </ToolShell>
  )
}
