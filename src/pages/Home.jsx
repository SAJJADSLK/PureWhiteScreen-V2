import { useMemo, useState } from 'react'
import { Link } from 'wouter'
import { ChevronRight, Zap, Palette, Monitor, Sparkles, Search, ShieldCheck } from 'lucide-react'
import { CATEGORIES } from '../lib/tools'
import { getRecent } from '../lib/recent'
import { GUIDES } from '../content/guides'

const SCENES = [
  ['zoom-lighting', '🎥', 'Video call', 'Light your face'],
  ['makeup-mirror', '💄', 'Makeup', 'Bright, even light'],
  ['selfie-light', '🤳', 'Selfie', 'Soft fill light'],
  ['night-light', '🌙', 'Night', 'Dim red light'],
  ['reading-light', '📖', 'Reading', 'Warm, soft light'],
  ['clean-screen', '🧼', 'Clean my screen', 'Spot every smudge'],
  ['brown-noise', '🟤', 'Focus', 'Brown noise'],
  ['countdown-timer', '⏳', 'Timer', 'Countdown with alarm'],
]

const FEATURES = [
  { icon: Zap, title: 'Lightning Fast', desc: 'Each tool loads on demand, so the site stays quick.' },
  { icon: Palette, title: 'Fully Customizable', desc: 'Adjust colors, brightness and effects.' },
  { icon: Monitor, title: 'Works Everywhere', desc: 'Desktop, tablet and phone. Press F for fullscreen.' },
  { icon: ShieldCheck, title: 'Private', desc: 'No account. Everything runs in your browser.' },
]

const FAQ = [
  ['What is Pure White Screen?', `A collection of free screen utility tools for creators, streamers and professionals. Everything runs in your browser.`],
  ['Do I need to create an account?', 'No. Open a tool and use it.'],
  ['Are the tools free?', 'Yes. The site is supported by Google AdSense advertising.'],
  ['Can I use these for streaming or video calls?', 'Yes. Ring Light, Color Screen and Green Screen are popular for that.'],
  ['Do you store my data?', 'The tools run locally in your browser. Basic anonymous analytics and ad cookies may be used by the site and Google AdSense.'],
]

export default function Home({ tools }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const recent = useMemo(() => getRecent().map((id) => tools.find((t) => t.id === id)).filter(Boolean), [tools])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tools.filter((t) =>
      (category === 'All' || t.category === category) &&
      (!q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q)))
  }, [tools, query, category])

  return (
    <div className="text-white">
      <section className="relative flex items-center justify-center px-4 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
          <div className="absolute top-32 right-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium">{tools.length} free screen tools</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent leading-tight pb-1">
            Pure White Screen
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Professional screen utilities for creators, streamers, and professionals. Free, fast, and no signup required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools/white-screen" className="px-8 py-4 bg-linear-to-r from-blue-500 to-cyan-500 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all hover:scale-105 inline-flex items-center justify-center gap-2 group">
              Open White Screen <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#tools" className="px-8 py-4 border border-white/30 rounded-lg font-semibold hover:bg-white/10 transition-all">Browse all tools</a>
          </div>
        </div>
      </section>

      <section className="px-4 pb-4" aria-labelledby="scenes-h">
        <div className="max-w-6xl mx-auto">
          <h2 id="scenes-h" className="text-2xl md:text-3xl font-bold text-center mb-6">What do you need right now?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SCENES.map(([id, icon, label, sub]) => (
              <Link key={id} href={`/tools/${id}`} className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/30 p-4 transition">
                <div className="text-3xl mb-2" aria-hidden="true">{icon}</div>
                <div className="font-semibold">{label}</div>
                <div className="text-sm text-gray-400">{sub}</div>
              </Link>
            ))}
          </div>
          {recent.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-3">Continue where you left off</h3>
              <div className="flex flex-wrap gap-2">
                {recent.map((t) => <Link key={t.id} href={`/tools/${t.id}`} className="rounded-full border border-white/20 hover:border-white/50 px-4 py-2 text-sm">{t.icon} {t.name}</Link>)}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-6 rounded-xl bg-white/5 border border-white/10">
              <f.icon className="w-10 h-10 text-blue-400 mb-3" />
              <h3 className="text-lg font-semibold mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tools" className="py-16 px-4 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-3">Explore Our Tools</h2>
          <p className="text-gray-400 text-center mb-10">Search or filter by category.</p>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <label className="relative flex-1">
              <span className="sr-only">Search tools</span>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tools…"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-400 focus:outline-none"
                style={{ height: 'auto', background: undefined }}
              />
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
              {['All', ...CATEGORIES].map((c) => (
                <button key={c} onClick={() => setCategory(c)} aria-pressed={category === c}
                  className={`px-3 py-2 rounded-full text-sm border transition ${category === c ? 'bg-blue-500 border-blue-500' : 'border-slate-600 hover:border-slate-400'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No tools match "{query}".</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((tool) => (
                <Link key={tool.id} href={`/tools/${tool.id}`}
                  className="group relative overflow-hidden rounded-xl p-6 bg-linear-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1">
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">{tool.icon}</div>
                    <h3 className="text-lg font-semibold mb-1">{tool.name}</h3>
                    <p className="text-sm text-gray-400">{tool.desc}</p>
                    <div className="mt-4 flex items-center justify-between text-sm"><span className="text-blue-400 font-medium inline-flex items-center gap-1">Launch <ChevronRight className="w-4 h-4" /></span><span className="text-xs text-slate-500">{tool.category}</span></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4" aria-labelledby="guides-h">
        <div className="max-w-6xl mx-auto">
          <h2 id="guides-h" className="text-3xl md:text-4xl font-bold text-center mb-8">Guides</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {GUIDES.slice(0, 3).map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="rounded-xl border border-white/10 bg-white/5 hover:border-white/30 p-5">
                <h3 className="font-semibold mb-2">{g.title}</h3>
                <p className="text-sm text-gray-400">{g.description}</p>
              </Link>
            ))}
          </div>
          <p className="text-center mt-6"><Link href="/guides" className="text-blue-400 hover:underline">All guides</Link></p>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map(([q, a]) => (
              <details key={q} className="bg-white/5 border border-white/10 p-5 rounded-lg group">
                <summary className="font-bold cursor-pointer flex justify-between items-center">
                  {q}<span className="group-open:rotate-180 transition" aria-hidden="true">▼</span>
                </summary>
                <p className="text-gray-400 mt-3">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
