import { useEffect, useState } from 'react'
import { Link } from 'wouter'
import { ADSENSE_CLIENT } from '../config'

const KEY = 'pws:consent'
const read = () => { try { return localStorage.getItem(KEY) } catch { return null } }
const write = (v) => { try { localStorage.setItem(KEY, v) } catch { /* storage blocked */ } }

function loadAds() {
  if (document.querySelector('script[data-adsense]')) return
  const s = document.createElement('script')
  s.async = true; s.crossOrigin = 'anonymous'; s.dataset.adsense = '1'
  s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`
  document.head.appendChild(s)
}

export const hasAdConsent = () => read() === 'granted'

export default function CookieConsent() {
  const [choice, setChoice] = useState(() => read())
  const [open, setOpen] = useState(false)

  useEffect(() => { if (choice === 'granted') loadAds() }, [choice])
  useEffect(() => {
    const reopen = () => setOpen(true)
    window.addEventListener('pws:cookie-settings', reopen)
    return () => window.removeEventListener('pws:cookie-settings', reopen)
  }, [])

  const decide = (v) => {
    write(v); setChoice(v); setOpen(false)
    if (v === 'denied' && document.querySelector('script[data-adsense]')) window.location.reload() // unload ad scripts
  }

  if (choice && !open) return null
  return (
    <div role="dialog" aria-label="Cookie preferences" className="fixed bottom-0 inset-x-0 z-[90] p-4">
      <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-600 rounded-xl shadow-2xl p-5 text-sm text-slate-200 flex flex-col sm:flex-row gap-4 sm:items-center">
        <p className="flex-1">
          This site is free thanks to ads. May we use cookies for advertising? The tools work either way, and your files never leave your device.
          {' '}<Link href="/privacy" className="underline text-blue-400">Privacy policy</Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => decide('denied')} className="px-4 py-2 rounded-lg border border-slate-500 hover:bg-slate-800">Decline</button>
          <button onClick={() => decide('granted')} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 font-semibold text-white">Accept</button>
        </div>
      </div>
    </div>
  )
}
