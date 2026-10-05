import { useRef, useState } from 'react'
import { Upload, Download, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { FORMATS, formatBytes, loadImage, renderBlob, downloadBlob, baseName, makeZip } from '@/lib/imageUtils'

const PRESETS = {
  'resize-web': { label: 'Web (1600px, WebP)', format: 'webp', quality: 0.8, maxWidth: 1600 },
  'resize-social': { label: 'Social (1080px, JPG)', format: 'jpg', quality: 0.85, maxWidth: 1080 },
  thumbnails: { label: 'Thumbnails (320px, WebP)', format: 'webp', quality: 0.75, maxWidth: 320 },
  lossless: { label: 'Lossless PNG (original size)', format: 'png', quality: 1, maxWidth: 0 },
}

export default function BatchProcessor() {
  const [items, setItems] = useState([])
  const [preset, setPreset] = useState('resize-web')
  const [busy, setBusy] = useState(false)
  const input = useRef(null)

  const add = (list) => {
    const imgs = [...list].filter((f) => f.type.startsWith('image/'))
    if (!imgs.length) return toast.error('Please choose image files')
    setItems((cur) => [...cur, ...imgs.map((file) => ({ id: crypto.randomUUID(), file, status: 'pending' }))])
  }

  const run = async () => {
    setBusy(true)
    const p = PRESETS[preset]
    const next = [...items]
    for (let i = 0; i < next.length; i++) {
      if (next[i].status === 'done') continue
      try {
        const { img, url } = await loadImage(next[i].file)
        const { blob } = await renderBlob(img, p)
        URL.revokeObjectURL(url)
        next[i] = { ...next[i], status: 'done', blob, name: `${baseName(next[i].file.name)}.${FORMATS[p.format].ext}` }
      } catch (e) { next[i] = { ...next[i], status: 'error', error: e.message } }
      setItems([...next])
    }
    setBusy(false)
  }

  const done = items.filter((i) => i.status === 'done')
  const zip = async () => {
    const names = new Set()
    const files = done.map((d) => { let n = d.name, k = 1; while (names.has(n)) n = d.name.replace(/(\.[^.]+)$/, `-${k++}$1`); names.add(n); return { name: n, blob: d.blob } })
    downloadBlob(await makeZip(files), 'images.zip')
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Batch Image Processor</h1>
        <p className="text-slate-400 mb-6">Resize and convert many images at once, then download them as one ZIP. Runs entirely in your browser.</p>

        <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); add(e.dataTransfer.files) }}
          onClick={() => input.current?.click()} role="button" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
          className="border-2 border-dashed border-slate-600 hover:border-blue-400 rounded-xl p-8 text-center cursor-pointer mb-6">
          <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
          <p>Drop images here or click to choose (multiple allowed)</p>
          <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => { add(e.target.files); e.target.value = '' }} />
        </div>

        <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Preset">
          {Object.entries(PRESETS).map(([k, p]) => (
            <button key={k} aria-pressed={preset === k} onClick={() => { setPreset(k); setItems((c) => c.map((i) => ({ ...i, status: 'pending', blob: undefined }))) }}
              className={`px-3 py-2 rounded-full text-sm border ${preset === k ? 'bg-blue-500 border-blue-500' : 'border-slate-600 hover:border-slate-400'}`}>{p.label}</button>
          ))}
        </div>

        <div className="flex gap-3 mb-6">
          <button onClick={run} disabled={!items.length || busy} className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-40 font-medium inline-flex items-center gap-2">
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}Process {items.length || ''} image{items.length === 1 ? '' : 's'}
          </button>
          <button onClick={zip} disabled={!done.length} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 inline-flex items-center gap-2">
            <Download className="w-4 h-4" />Download ZIP ({done.length})
          </button>
          <button onClick={() => setItems([])} disabled={!items.length || busy} className="px-4 py-2 rounded-lg border border-slate-600 disabled:opacity-40">Clear</button>
        </div>

        <ul className="space-y-2">
          {items.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-3 bg-slate-800 rounded-lg px-4 py-3 text-sm">
              <span className="truncate">{i.file.name}</span>
              <span className="text-slate-400 whitespace-nowrap">
                {i.status === 'done' ? `${formatBytes(i.file.size)} → ${formatBytes(i.blob.size)}` : i.status === 'error' ? i.error : formatBytes(i.file.size)}
              </span>
              <button aria-label={`Remove ${i.file.name}`} onClick={() => setItems((c) => c.filter((x) => x.id !== i.id))} disabled={busy}><X className="w-4 h-4" /></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
