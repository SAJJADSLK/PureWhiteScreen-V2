import { useCallback, useEffect, useRef, useState } from 'react'
import { Maximize, Minimize } from 'lucide-react'
import { enterFullscreen, exitFullscreen } from '@/lib/fullscreenUtils'

// Shared full-area tool layout: background, auto-hiding controls, F / Esc keys, fullscreen state.
// `controls` renders inside the floating panel. `onKey(e)` lets a tool add shortcuts.
export default function ToolShell({ background, title, hint, children, controls, onKey, autoHide = true, dark = true, panelClass = '' }) {
  const [fs, setFs] = useState(false)
  const [show, setShow] = useState(true)
  const timer = useRef(null)
  const hovering = useRef(false)

  const wake = useCallback(() => {
    setShow(true)
    clearTimeout(timer.current)
    if (autoHide) timer.current = setTimeout(() => { if (!hovering.current) setShow(false) }, 3500)
  }, [autoHide])

  useEffect(() => {
    const on = () => setFs(Boolean(document.fullscreenElement || document.webkitFullscreenElement))
    document.addEventListener('fullscreenchange', on); document.addEventListener('webkitfullscreenchange', on)
    return () => { document.removeEventListener('fullscreenchange', on); document.removeEventListener('webkitfullscreenchange', on) }
  }, [])

  const toggleFs = useCallback(() => { fs ? exitFullscreen() : enterFullscreen() }, [fs])

  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = (e.target.tagName || '').toLowerCase()
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFs() }
      onKey?.(e)
      wake()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [toggleFs, onKey, wake])

  useEffect(() => { wake(); return () => clearTimeout(timer.current) }, [wake])

  const text = dark ? 'text-white' : 'text-black'
  return (
    <div className="fixed inset-0 overflow-hidden" style={background} onMouseMove={wake} onTouchStart={wake} onClick={wake}>
      {children}
      {(title || hint) && (
        <div className={`pointer-events-none absolute top-8 inset-x-0 text-center px-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
          {title && <h1 className={`text-3xl md:text-4xl font-bold ${text} opacity-70`}>{title}</h1>}
          {hint && <p className={`mt-2 text-sm ${text} opacity-60`}>{hint}</p>}
        </div>
      )}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-3xl transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        onMouseEnter={() => { hovering.current = true; wake() }} onMouseLeave={() => { hovering.current = false; wake() }}
      >
        <div className={`bg-black/80 backdrop-blur-md text-white rounded-2xl border border-white/20 px-4 py-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 ${panelClass}`}>
          {controls}
          <button onClick={toggleFs} aria-label={fs ? 'Exit fullscreen' : 'Enter fullscreen'} title="Fullscreen (F)"
            className="rounded-lg p-2 hover:bg-white/20">{fs ? <Minimize size={20} /> : <Maximize size={20} />}</button>
        </div>
      </div>
    </div>
  )
}

export function Field({ label, children, className = '' }) {
  return (
    <label className={`flex items-center gap-2 text-sm ${className}`}>
      <span className="text-white/80 whitespace-nowrap">{label}</span>{children}
    </label>
  )
}

export const panelInput = 'rounded-md bg-white/10 border border-white/20 px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-400'
export const panelButton = 'rounded-lg px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 border border-white/20'
