import { useEffect, useRef } from 'react'

const CLIENT = 'ca-pub-3811332485680799'
// Set VITE_ADSENSE_BANNER_SLOT in Vercel env to your real ad-unit id to show manual ads.
// Without it nothing renders (no empty gap, no AdSense console errors).
const SLOT = import.meta.env.VITE_ADSENSE_BANNER_SLOT

export default function AdSlot({ className = '' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!SLOT || !ref.current || ref.current.dataset.pushed) return
    ref.current.dataset.pushed = '1'
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}) } catch { /* blocked by adblock */ }
  }, [])
  if (!SLOT) return null
  return (
    <div className={`flex justify-center px-4 py-6 ${className}`}>
      <ins ref={ref} className="adsbygoogle" style={{ display: 'block', width: '100%', maxWidth: 728, minHeight: 90 }}
        data-ad-client={CLIENT} data-ad-slot={SLOT} data-ad-format="auto" data-full-width-responsive="true" />
    </div>
  )
}
