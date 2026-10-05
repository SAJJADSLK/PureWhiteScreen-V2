import { useEffect, useState } from 'react'
import ToolShell from '@/components/ToolShell'

export default function BlueScreenPrank() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setPct((p) => (p >= 100 ? 0 : Math.min(100, p + Math.ceil(Math.random() * 6)))), 900)
    return () => clearInterval(t)
  }, [])
  return (
    <ToolShell background={{ background: '#0b59c4' }} title="" hint="" autoHide
      controls={<span className="text-sm text-white/80">Prank screen. Press F for fullscreen and Esc to leave.</span>}>
      <div className="absolute inset-0 flex flex-col justify-center px-[8vw] text-white select-none" style={{ fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
        <div style={{ fontSize: 'clamp(4rem, 14vw, 9rem)', lineHeight: 1 }}>:(</div>
        <p className="mt-6 max-w-3xl" style={{ fontSize: 'clamp(1.1rem, 2.4vw, 2rem)' }}>Your device ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.</p>
        <p className="mt-6" style={{ fontSize: 'clamp(1.1rem, 2.4vw, 2rem)' }}>{pct}% complete</p>
        <div className="mt-8 flex items-center gap-5 max-w-3xl">
          <div className="h-20 w-20 shrink-0 bg-white/90 grid place-items-center text-[#0b59c4] text-xs font-bold text-center p-1" aria-hidden="true">QR</div>
          <p className="text-sm md:text-base opacity-90">For more information about this issue and possible fixes, visit your support page. If you call a support person, give them this stop code: CRITICAL_PROCESS_DIED</p>
        </div>
      </div>
    </ToolShell>
  )
}
