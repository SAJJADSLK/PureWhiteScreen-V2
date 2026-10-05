import { Link } from 'wouter'
import { TOOLS, getTool } from '../lib/tools'
import { getToolContent } from '../lib/toolContent'

export default function ToolInfo({ id }) {
  const tool = getTool(id)
  const info = getToolContent(id)
  if (!tool || !info) return null
  const related = TOOLS.filter((t) => t.category === tool.category && t.id !== id).concat(TOOLS.filter((t) => t.category !== tool.category)).slice(0, 4)
  return (
    <section className="max-w-4xl mx-auto px-4 py-14 text-slate-200" aria-labelledby="about-tool">
      <h2 id="about-tool" className="text-3xl font-bold text-white mb-2">{tool.icon} {tool.name}</h2>
      <p className="text-slate-400 mb-8">{tool.desc}</p>
      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">How to use</h3>
          <ol className="list-decimal pl-5 space-y-2">{info.how.map((s) => <li key={s}>{s}</li>)}</ol>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Good for</h3>
          <ul className="list-disc pl-5 space-y-2">{info.uses.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">Questions</h3>
      <div className="space-y-3 mb-10">
        {info.faq.map(([q, a]) => (
          <details key={q} className="bg-white/5 border border-white/10 rounded-lg p-4">
            <summary className="cursor-pointer font-medium">{q}</summary>
            <p className="mt-2 text-slate-300">{a}</p>
          </details>
        ))}
      </div>
      <p className="text-sm text-slate-400 mb-8">Shortcuts: <kbd className="px-1.5 py-0.5 rounded bg-slate-700">F</kbd> fullscreen, <kbd className="px-1.5 py-0.5 rounded bg-slate-700">Esc</kbd> exit fullscreen.</p>
      <h3 className="text-xl font-semibold text-white mb-3">More tools</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {related.map((t) => (
          <Link key={t.id} href={`/tools/${t.id}`} className="rounded-lg bg-white/5 border border-white/10 hover:border-white/30 p-4 text-sm">
            <span className="text-2xl block mb-1" aria-hidden="true">{t.icon}</span>{t.name}
          </Link>
        ))}
      </div>
    </section>
  )
}
