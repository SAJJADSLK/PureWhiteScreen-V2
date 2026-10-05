import { useEffect } from 'react'
import { Link } from 'wouter'
import { GUIDES, getGuide } from '../content/guides'
import { TOOLS_DATA } from '../lib/toolsData'
import { updatePageMetadata, addStructuredData } from '../lib/seoOptimization'
import { SITE_NAME, SITE_URL } from '../config'

const wrap = 'max-w-3xl mx-auto px-4 py-16 text-slate-200 leading-relaxed'

export function GuidesIndex() {
  useEffect(() => {
    updatePageMetadata({ title: `Guides: screen tests, lighting and focus | ${SITE_NAME}`, description: 'Practical guides on testing screens, lighting for video calls, cleaning, OLED care, background noise and focus timers.', keywords: ['screen guides'] })
  }, [])
  return (
    <div className={wrap}>
      <h1 className="text-4xl font-bold text-white mb-3">Guides</h1>
      <p className="text-slate-400 mb-10">Short, practical guides to go with the tools.</p>
      <ul className="space-y-5">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <Link href={`/guides/${g.slug}`} className="block rounded-xl border border-white/10 bg-white/5 hover:border-white/30 p-5">
              <h2 className="text-xl font-semibold text-white">{g.title}</h2>
              <p className="text-slate-400 mt-1">{g.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function GuideArticle({ slug }) {
  const g = getGuide(slug)
  useEffect(() => {
    if (!g) return
    updatePageMetadata({ title: `${g.title} | ${SITE_NAME}`, description: g.description, keywords: [g.title.toLowerCase()] })
    addStructuredData({ '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, mainEntityOfPage: `${SITE_URL}/guides/${g.slug}`, publisher: { '@type': 'Organization', name: SITE_NAME } })
  }, [g])
  if (!g) return <div className={wrap}><h1 className="text-3xl font-bold text-white">Guide not found</h1><p className="mt-4"><Link href="/guides" className="text-blue-400 underline">All guides</Link></p></div>
  const tools = g.tools.map((id) => TOOLS_DATA.find((t) => t.id === id)).filter(Boolean)
  const others = GUIDES.filter((x) => x.slug !== g.slug).slice(0, 3)
  return (
    <article className={wrap}>
      <p className="text-sm mb-3"><Link href="/guides" className="text-blue-400 hover:underline">Guides</Link></p>
      <h1 className="text-4xl font-bold text-white mb-4">{g.title}</h1>
      <p className="text-lg text-slate-300 mb-8">{g.intro}</p>
      {g.sections.map((s) => (
        <section key={s.h} className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-3">{s.h}</h2>
          {s.p?.map((t) => <p key={t} className="mb-3">{t}</p>)}
          {s.list && <ul className="list-disc pl-6 space-y-2">{s.list.map((t) => <li key={t}>{t}</li>)}</ul>}
        </section>
      ))}
      <aside className="mt-10 rounded-xl border border-blue-400/30 bg-blue-500/10 p-5">
        <h2 className="text-lg font-semibold text-white mb-3">Try it now</h2>
        <div className="flex flex-wrap gap-2">
          {tools.map((t) => <Link key={t.id} href={`/tools/${t.id}`} className="rounded-full bg-blue-500 hover:bg-blue-400 px-4 py-2 text-sm font-medium text-white">{t.icon} {t.name}</Link>)}
        </div>
      </aside>
      <h2 className="text-xl font-semibold text-white mt-12 mb-3">More guides</h2>
      <ul className="space-y-2">{others.map((o) => <li key={o.slug}><Link href={`/guides/${o.slug}`} className="text-blue-400 hover:underline">{o.title}</Link></li>)}</ul>
    </article>
  )
}
