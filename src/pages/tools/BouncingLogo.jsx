import { useEffect, useRef, useState } from 'react'
import { usePersistedState } from '@/hooks/usePersistedState'
import ToolShell, { Field, panelInput } from '@/components/ToolShell'

const COLORS = ['#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#00c7be', '#0a84ff', '#bf5af2', '#ff2d92']

export default function BouncingLogo() {
  const [text, setText] = usePersistedState('bounce:text', 'VIDEO')
  const [speed, setSpeed] = usePersistedState('bounce:speed', 3)
  const [hits, setHits] = useState(0)
  const box = useRef(null), el = useRef(null)
  const st = useRef({ x: 80, y: 60, dx: 1, dy: 1, c: 0 })
  const speedRef = useRef(speed); speedRef.current = speed

  useEffect(() => {
    let raf
    const loop = () => {
      const b = box.current, e = el.current
      if (b && e) {
        const s = st.current, W = b.clientWidth - e.offsetWidth, H = b.clientHeight - e.offsetHeight
        s.x += s.dx * speedRef.current; s.y += s.dy * speedRef.current
        let hitX = false, hitY = false
        if (s.x <= 0) { s.x = 0; s.dx = 1; hitX = true } else if (s.x >= W) { s.x = W; s.dx = -1; hitX = true }
        if (s.y <= 0) { s.y = 0; s.dy = 1; hitY = true } else if (s.y >= H) { s.y = H; s.dy = -1; hitY = true }
        if (hitX || hitY) { s.c = (s.c + 1) % COLORS.length; e.style.color = COLORS[s.c]; e.style.borderColor = COLORS[s.c] }
        if (hitX && hitY) setHits((n) => n + 1)
        e.style.transform = `translate(${s.x}px, ${s.y}px)`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <ToolShell background={{ background: '#000' }} title="Bouncing Logo" hint="Wait for a perfect corner hit. Press F for fullscreen."
      controls={
        <>
          <Field label="Text"><input value={text} maxLength={14} onChange={(e) => setText(e.target.value.toUpperCase())} className={`${panelInput} w-28`} aria-label="Logo text" /></Field>
          <Field label="Speed"><input type="range" min="1" max="10" value={speed} onChange={(e) => setSpeed(+e.target.value)} className="w-24" aria-label="Speed" /></Field>
          <span className="text-sm text-white/80">Corner hits: <strong>{hits}</strong></span>
        </>
      }>
      <div ref={box} className="absolute inset-0">
        <div ref={el} className="absolute left-0 top-0 border-4 rounded-2xl px-6 py-2 font-black tracking-widest" style={{ color: COLORS[0], borderColor: COLORS[0], fontSize: 'clamp(1.5rem, 6vw, 4rem)', willChange: 'transform' }}>{text || ' '}</div>
      </div>
    </ToolShell>
  )
}
