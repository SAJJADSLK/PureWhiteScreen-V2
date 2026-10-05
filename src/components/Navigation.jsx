import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'wouter'
import { Menu, X, ChevronDown } from 'lucide-react'
import { TOOLS, CATEGORIES } from '../lib/tools'

const FEATURED = ['white-screen', 'ring-light', 'pomodoro']

export default function Navigation() {
  const [location] = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => { setMobileOpen(false); setMenuOpen(false) }, [location])

  useEffect(() => {
    const onDown = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') { setMenuOpen(false); setMobileOpen(false) } }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [])

  const active = (path) => (location === path ? 'text-blue-400' : 'hover:text-blue-400')
  const grouped = CATEGORIES.map((c) => ({ c, items: TOOLS.filter((x) => x.category === c) }))

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700" aria-label="Main">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition">
            <span className="w-8 h-8 bg-white rounded" aria-hidden="true" />
            <span>Pure White Screen</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className={`transition ${active('/')}`}>Home</Link>
            {FEATURED.map((id) => {
              const tool = TOOLS.find((x) => x.id === id)
              return <Link key={id} href={`/tools/${id}`} className={`transition ${active(`/tools/${id}`)}`}>{tool.name}</Link>
            })}
            <Link href="/guides" className={`transition ${active('/guides')}`}>Guides</Link>
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 hover:text-blue-400 transition"
              >
                All Tools <ChevronDown className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-[52rem] max-w-[92vw] max-h-[75vh] overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl p-5 grid grid-cols-4 gap-6">
                  {grouped.map(({ c, items }) => (
                    <div key={c}>
                      <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-2">{c}</h4>
                      <ul className="space-y-1">
                        {items.map((tool) => (
                          <li key={tool.id}>
                            <Link href={`/tools/${tool.id}`} className="flex items-center gap-2 text-sm py-1 hover:text-blue-400">
                              <span aria-hidden="true">{tool.icon}</span>{tool.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            className="md:hidden p-2 hover:bg-slate-800 rounded"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-900 max-h-[80vh] overflow-y-auto px-4 py-4">
          <Link href="/" className="block py-2 font-medium">Home</Link>
          <Link href="/guides" className="block py-2 font-medium">Guides</Link>
          {grouped.map(({ c, items }) => (
            <div key={c} className="mt-4">
              <h4 className="text-xs uppercase tracking-wider text-slate-400 mb-1">{c}</h4>
              {items.map((tool) => (
                <Link key={tool.id} href={`/tools/${tool.id}`} className="flex items-center gap-2 py-2 text-sm">
                  <span aria-hidden="true">{tool.icon}</span>{tool.name}
                </Link>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}
