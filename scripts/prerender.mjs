// Runs after `vite build`: writes a real HTML file per route (title, meta, canonical, JSON-LD and a
// text snapshot) so search engines and link previews see content without running JavaScript.
// React replaces the snapshot as soon as the app loads. Also writes sitemap.xml.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { TOOLS_DATA } from '../src/lib/toolsData.js'
import { TOOL_CONTENT } from '../src/lib/toolContent.js'
import { GUIDES } from '../src/content/guides.js'
import { HOME_META, toolMeta, SITE_URL, SITE_NAME } from '../src/lib/pageMeta.js'

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const today = new Date().toISOString().slice(0, 10)

function page({ route, title, description, body, ld }) {
  const url = SITE_URL + route
  let html = template
    .replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${esc(title)}" />`)
    .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${esc(description)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
  if (ld) html = html.replace('</head>', `<script type="application/ld+json" data-pws-ld="1">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n</head>`)
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
}

const list = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`

// home
page({
  route: '/', ...HOME_META,
  ld: { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
  body: `<main><h1>${SITE_NAME}</h1><p>${esc(HOME_META.description)}</p><h2>All tools</h2><ul>${TOOLS_DATA.map((t) => `<li><a href="/tools/${t.id}">${esc(t.name)}</a>: ${esc(t.desc)}</li>`).join('')}</ul></main>`,
})

// tools
for (const t of TOOLS_DATA) {
  const m = toolMeta(t), c = TOOL_CONTENT[t.id]
  const ld = [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: t.name, description: m.description, url: `${SITE_URL}/tools/${t.id}`, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  ]
  if (c?.faq?.length) ld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: c.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) })
  page({
    route: `/tools/${t.id}`, ...m, ld,
    body: `<main><h1>${esc(t.name)}</h1><p>${esc(t.desc)}</p>${c ? `<h2>How to use</h2><ol>${c.how.map((s) => `<li>${esc(s)}</li>`).join('')}</ol><h2>Good for</h2>${list(c.uses)}<h2>Questions</h2>${c.faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}` : ''}<p><a href="/">All tools</a></p></main>`,
  })
}

// guides
page({ route: '/guides', title: `Guides: screen tests, lighting and focus | ${SITE_NAME}`, description: 'Practical guides on testing screens, lighting for video calls, cleaning, OLED care, background noise and focus timers.',
  body: `<main><h1>Guides</h1><ul>${GUIDES.map((g) => `<li><a href="/guides/${g.slug}">${esc(g.title)}</a>: ${esc(g.description)}</li>`).join('')}</ul></main>` })
for (const g of GUIDES) {
  page({
    route: `/guides/${g.slug}`, title: `${g.title} | ${SITE_NAME}`, description: g.description,
    ld: { '@context': 'https://schema.org', '@type': 'Article', headline: g.title, description: g.description, mainEntityOfPage: `${SITE_URL}/guides/${g.slug}`, publisher: { '@type': 'Organization', name: SITE_NAME } },
    body: `<main><article><h1>${esc(g.title)}</h1><p>${esc(g.intro)}</p>${g.sections.map((s) => `<h2>${esc(s.h)}</h2>${(s.p || []).map((t) => `<p>${esc(t)}</p>`).join('')}${s.list ? list(s.list) : ''}`).join('')}</article></main>`,
  })
}

// legal pages (meta only; React renders the full text)
for (const [slug, title] of [['about', 'About'], ['contact', 'Contact'], ['privacy', 'Privacy Policy'], ['terms', 'Terms of Use']]) {
  page({ route: `/${slug}`, title: `${title} - ${SITE_NAME}`, description: `${title} for ${SITE_NAME}.`, body: `<main><h1>${title}</h1><p><a href="/">Back to ${SITE_NAME}</a></p></main>` })
}

// sitemap
const urls = ['/', '/guides', ...GUIDES.map((g) => `/guides/${g.slug}`), ...TOOLS_DATA.map((t) => `/tools/${t.id}`), '/about', '/contact', '/privacy', '/terms']
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc><lastmod>${today}</lastmod><priority>${u === '/' ? '1.0' : u.startsWith('/tools') ? '0.8' : u.startsWith('/guides') ? '0.7' : '0.3'}</priority></url>`).join('\n')}\n</urlset>\n`)
console.log(`prerendered ${urls.length} pages + sitemap`)
