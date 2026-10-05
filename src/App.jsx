import { Suspense, useEffect, useState } from 'react'
import { Route, Switch, Link, useLocation } from 'wouter'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import AdSlot from './components/AdSlot'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Legal, { LEGAL_SLUGS } from './pages/Legal'
import { GuidesIndex, GuideArticle } from './pages/Guides'
import CookieConsent from './components/CookieConsent'
import ToolInfo from './components/ToolInfo'
import { getToolContent } from './lib/toolContent'
import { useWakeLock } from './hooks/useWakeLock'
import ShortcutsHelp from './components/ShortcutsHelp'
import { pushRecent } from './lib/recent'
import { Toaster } from 'sonner'
import { TOOLS, getTool } from './lib/tools'
import { updatePageMetadata, addStructuredData } from './lib/seoOptimization'
import { HOME_META, toolMeta } from './lib/pageMeta'

const SITE = 'https://www.purewhitescreen.online'
const DEFAULT_META = { ...HOME_META, keywords: ['white screen', 'ring light', 'pomodoro', 'screen tools'] }

function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-live="polite">
      <div className="h-10 w-10 rounded-full border-4 border-slate-600 border-t-blue-400 animate-spin" />
      <span className="sr-only">Loading tool…</span>
    </div>
  )
}

function ToolPage({ id, fullscreen }) {
  const tool = getTool(id)
  useEffect(() => {
    if (!tool) return
    const meta = { ...toolMeta(tool), keywords: [tool.name.toLowerCase(), 'free online', 'no signup'] }
    updatePageMetadata(meta)
    addStructuredData({
      '@context': 'https://schema.org', '@type': 'WebApplication',
      name: meta.title, description: meta.description, url: `${SITE}/tools/${tool.id}`,
      applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    })
  }, [tool])
  useWakeLock(Boolean(tool))
  useEffect(() => { if (tool) pushRecent(tool.id) }, [tool])
  const [flashDismissed, setFlashDismissed] = useState(false)
  if (!tool) return <NotFound />
  const Component = tool.component
  const flash = getToolContent(tool.id)?.flash && !flashDismissed
  return (
    <>
    {/* `transform` makes this the containing block for the tools' `fixed inset-0` layers,
    // so they fill the area below the nav instead of covering the page/footer. */}
    <div className="relative overflow-hidden" style={{ height: fullscreen ? '100dvh' : 'calc(100dvh - 4rem)', transform: 'translateZ(0)' }} data-tool={tool.id}>
      <ErrorBoundary key={tool.id}>
        <Suspense fallback={<Loading />}><Component /></Suspense>
      </ErrorBoundary>
      {flash && (
        <div role="alert" className="absolute top-3 left-1/2 -translate-x-1/2 z-[60] max-w-md bg-amber-500/95 text-black text-sm rounded-lg px-4 py-3 shadow-lg flex gap-3 items-start">
          <span>Warning: this tool has moving or flickering visuals. Do not use it if you are sensitive to flashing light.</span>
          <button onClick={() => setFlashDismissed(true)} className="font-semibold underline shrink-0">Got it</button>
        </div>
      )}
    </div>
    <ToolInfo id={tool.id} />
    </>
  )
}

function NotFound() {
  useEffect(() => { updatePageMetadata({ ...DEFAULT_META, title: 'Page not found - Pure White Screen' }) }, [])
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold mb-3">404</h1>
      <p className="text-gray-400 mb-6">That page doesn't exist.</p>
      <Link href="/" className="px-6 py-3 rounded-lg bg-blue-500 font-semibold hover:bg-blue-400">Back home</Link>
    </div>
  )
}

function ScrollAndMeta() {
  const [location] = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    if (location === '/') updatePageMetadata(DEFAULT_META)
  }, [location])
  return null
}

function useFullscreen() {
  const [fs, setFs] = useState(false)
  useEffect(() => {
    const on = () => setFs(Boolean(document.fullscreenElement || document.webkitFullscreenElement))
    document.addEventListener('fullscreenchange', on)
    document.addEventListener('webkitfullscreenchange', on)
    return () => { document.removeEventListener('fullscreenchange', on); document.removeEventListener('webkitfullscreenchange', on) }
  }, [])
  return fs
}

export default function App() {
  const [location] = useLocation()
  const isHome = location === '/'
  const isTool = location.startsWith('/tools/')
  const fullscreen = useFullscreen()
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:bg-white focus:text-black focus:p-3">Skip to content</a>
      {!fullscreen && <Navigation />}
      <ScrollAndMeta />
      <main id="main" className="flex-1">
        <Switch>
          <Route path="/"><Home tools={TOOLS} /></Route>
          {LEGAL_SLUGS.map((slug) => <Route key={slug} path={`/${slug}`}><Legal slug={slug} /></Route>)}
          <Route path="/guides"><GuidesIndex /></Route>
          <Route path="/guides/:slug">{(p) => <GuideArticle slug={p.slug} />}</Route>
          <Route path="/tools/:id">{(p) => <ToolPage id={p.id} fullscreen={fullscreen} />}</Route>
          <Route><NotFound /></Route>
        </Switch>
      </main>
      {(isHome || isTool) && !fullscreen && <AdSlot />}
      {!fullscreen && <Footer />}
      <CookieConsent />
      <ShortcutsHelp />
      <Toaster theme="dark" position="top-center" />
    </div>
  )
}
