import { lazy, createElement } from 'react'
import { TOOLS_DATA, CATEGORIES } from './toolsData'

export { CATEGORIES }

// Vite bundles each tool page as its own chunk; they load on demand.
const pages = import.meta.glob('../pages/tools/**/*.{tsx,jsx}')
const loaderFor = (file) => {
  const key = Object.keys(pages).find((k) => k.replace(/\.(tsx|jsx)$/, '') === `../pages/tools/${file}`)
  if (!key) throw new Error(`Missing tool page: ${file}`)
  return pages[key]
}

const lazyCache = new Map()
const lazyFor = (file) => {
  if (!lazyCache.has(file)) lazyCache.set(file, lazy(loaderFor(file)))
  return lazyCache.get(file)
}

// Entries with a `preset` share one configurable component (e.g. all color pages use ScreenTool).
export const TOOLS = TOOLS_DATA.map((t) => {
  const Base = lazyFor(t.file)
  const component = t.preset ? () => createElement(Base, { preset: { id: t.id, ...t.preset } }) : Base
  return { ...t, component }
})
export const getTool = (id) => TOOLS.find((x) => x.id === id)
