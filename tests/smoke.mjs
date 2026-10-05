// Smoke test: every route renders without console errors or the error boundary.
// Usage: npm run build && npx vite preview --port 4173 & npm run test:smoke
// Needs a Chromium: set CHROMIUM_PATH, or let playwright-core find its own.
import { chromium } from 'playwright-core'
import { TOOLS_DATA } from '../src/lib/toolsData.js'
import { GUIDES } from '../src/content/guides.js'

const base = process.env.BASE_URL || 'http://localhost:4173'
const ignore = [/ERR_TUNNEL/, /ERR_NAME/, /ERR_INTERNET/, /googlesyndication/, /fonts\.g/, /Failed to load resource/]
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.addInitScript(() => localStorage.setItem('pws:consent', 'denied'))
const errors = []
page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)))
page.on('console', (m) => { if (m.type() === 'error' && !ignore.some((r) => r.test(m.text()))) errors.push(m.text().slice(0, 200)) })

let failed = 0
const check = (name, ok, extra = '') => { if (!ok) failed++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name} ${extra}`) }

for (const route of ['/', '/about', '/contact', '/privacy', '/terms', '/guides', ...GUIDES.map((g) => `/guides/${g.slug}`), ...TOOLS_DATA.map((t) => `/tools/${t.id}`)]) {
  errors.length = 0
  await page.goto(base + route); await page.waitForTimeout(700)
  const text = await page.innerText('body')
  check(route, !errors.length && !text.includes('unexpected error') && text.length > 80, errors.join(' | '))
}
await page.goto(base + '/'); check('home lists all tools', (await page.locator('#tools a').count()) === TOOLS_DATA.length)
await page.fill('input[type=search]', 'pomo'); check('search filters', (await page.locator('#tools a').count()) === 1)
await page.goto(base + '/nope'); check('404 page', (await page.innerText('body')).includes('404'))
await page.goto(base + '/tools/pomodoro'); check('canonical per page', (await page.getAttribute('link[rel=canonical]', 'href')).endsWith('/tools/pomodoro'))
check('one JSON-LD block', (await page.locator('script[data-pws-ld]').count()) === 1)
await browser.close()
console.log(failed ? `\n${failed} check(s) failed` : '\nall checks passed')
process.exit(failed ? 1 : 0)
