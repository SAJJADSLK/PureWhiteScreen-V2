// Real, in-browser image processing helpers (Canvas API). Nothing is uploaded anywhere.

export const FORMATS = {
  webp: { mime: 'image/webp', ext: 'webp', label: 'WebP' },
  avif: { mime: 'image/avif', ext: 'avif', label: 'AVIF' },
  jpg: { mime: 'image/jpeg', ext: 'jpg', label: 'JPG' },
  png: { mime: 'image/png', ext: 'png', label: 'PNG' },
}

export function formatBytes(n) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

export function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ img, url })
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not read this image')) }
    img.src = url
  })
}

function toBlob(canvas, mime, quality) {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), mime, quality))
}

// Browsers silently fall back to PNG for unsupported encoders, so verify the output type.
export async function renderBlob(img, { format = 'webp', quality = 0.8, maxWidth = 0, filter = 'none', sharpen = 0 } = {}) {
  const f = FORMATS[format]
  let w = img.naturalWidth, h = img.naturalHeight
  if (maxWidth && w > maxWidth) { h = Math.round((h * maxWidth) / w); w = maxWidth }
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')
  if (format === 'jpg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h) } // no alpha in JPG
  ctx.filter = filter
  ctx.drawImage(img, 0, 0, w, h)
  ctx.filter = 'none'
  if (sharpen > 0) applySharpen(ctx, w, h, sharpen)
  const blob = await toBlob(c, f.mime, quality)
  if (!blob || blob.type !== f.mime) throw new Error(`${f.label} is not supported by this browser`)
  return { blob, width: w, height: h }
}

function applySharpen(ctx, w, h, amount) {
  const src = ctx.getImageData(0, 0, w, h)
  const dst = ctx.createImageData(w, h)
  const s = src.data, d = dst.data
  const a = amount, k = [0, -a, 0, -a, 1 + 4 * a, -a, 0, -a, 0]
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) { d[i] = s[i]; d[i + 1] = s[i + 1]; d[i + 2] = s[i + 2]; d[i + 3] = s[i + 3]; continue }
      for (let ch = 0; ch < 3; ch++) {
        let v = 0, n = 0
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) v += s[((y + dy) * w + (x + dx)) * 4 + ch] * k[n++]
        d[i + ch] = v < 0 ? 0 : v > 255 ? 255 : v
      }
      d[i + 3] = s[i + 3]
    }
  }
  ctx.putImageData(dst, 0, 0)
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function baseName(name) { return name.replace(/\.[^.]+$/, '') }

// Minimal "stored" (uncompressed) ZIP writer so batch results download as one file.
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0 } return t })()
const crc32 = (u8) => { let c = 0xffffffff; for (let i = 0; i < u8.length; i++) c = CRC[(c ^ u8[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }

export async function makeZip(files) {
  const enc = new TextEncoder(), parts = [], central = []
  let offset = 0
  for (const { name, blob } of files) {
    const data = new Uint8Array(await blob.arrayBuffer()), nm = enc.encode(name), crc = crc32(data)
    const lh = new DataView(new ArrayBuffer(30))
    lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true)
    lh.setUint32(14, crc, true); lh.setUint32(18, data.length, true); lh.setUint32(22, data.length, true); lh.setUint16(26, nm.length, true)
    parts.push(lh.buffer, nm, data)
    const ch = new DataView(new ArrayBuffer(46))
    ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true)
    ch.setUint32(16, crc, true); ch.setUint32(20, data.length, true); ch.setUint32(24, data.length, true); ch.setUint16(28, nm.length, true); ch.setUint32(42, offset, true)
    central.push(ch.buffer, nm)
    offset += 30 + nm.length + data.length
  }
  const csize = central.reduce((s, p) => s + (p.byteLength ?? p.length), 0)
  const end = new DataView(new ArrayBuffer(22))
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, csize, true); end.setUint32(16, offset, true)
  return new Blob([...parts, ...central, end.buffer], { type: 'application/zip' })
}
