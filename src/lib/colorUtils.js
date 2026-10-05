export function kelvinToRgb(k) { // Tanner Helland approximation, 1000-10000K
  const t = Math.min(Math.max(k, 1000), 10000) / 100
  const r = t <= 66 ? 255 : 329.698727446 * Math.pow(t - 60, -0.1332047592)
  const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * Math.pow(t - 60, -0.0755148492)
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307
  const c = (v) => Math.round(Math.min(255, Math.max(0, v)))
  return [c(r), c(g), c(b)]
}

export const hexToRgb = (hex) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '')
  if (!m) return null
  const n = parseInt(m[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export const rgbToHex = ([r, g, b]) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

// brightness 0-100 scales toward black
export const scaleRgb = (rgb, brightness) => rgb.map((v) => Math.round(v * Math.max(0, Math.min(100, brightness)) / 100))

export const normalizeHex = (v) => {
  let s = String(v || '').trim().replace(/^#/, '')
  if (/^[0-9a-f]{3}$/i.test(s)) s = s.split('').map((c) => c + c).join('')
  return /^[0-9a-f]{6}$/i.test(s) ? '#' + s.toLowerCase() : null
}

export const RESOLUTIONS = [
  ['Screen size', 0, 0], ['480p (854×480)', 854, 480], ['720p (1280×720)', 1280, 720], ['1080p (1920×1080)', 1920, 1080],
  ['1440p (2560×1440)', 2560, 1440], ['4K (3840×2160)', 3840, 2160], ['8K (7680×4320)', 7680, 4320],
]
