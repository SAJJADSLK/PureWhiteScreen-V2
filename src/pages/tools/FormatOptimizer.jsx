import { useEffect, useRef, useState } from 'react'
import { Upload, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { FORMATS, formatBytes, loadImage, renderBlob, downloadBlob, baseName } from '@/lib/imageUtils'

export default function FormatOptimizer() {
  const [file, setFile] = useState(null)
  const [src, setSrc] = useState('')
  const [quality, setQuality] = useState(80)
  const [maxWidth, setMaxWidth] = useState(0)
  const [results, setResults] = useState([])
  const [busy, setBusy] = useState(false)
  const imgRef = useRef(null)
  const input = useRef(null)

  useEffect(() => () => src && URL.revokeObjectURL(src), [src])

  const pick = async (f) => {
    if (!f || !f.type.startsWith('image/')) return toast.error('Please choose an image file')
    try {
      const { img, url } = await loadImage(f)
      imgRef.current = img; setFile(f); setSrc(url); setResults([])
    } catch (e) { toast.error(e.message) }
  }

  const convert = async (key) => {
    if (!imgRef.current) return toast.error('Upload an image first')
    setBusy(true)
    try {
      const { blob, width, height } = await renderBlob(imgRef.current, { format: key, quality: quality / 100, maxWidth })
      setResults((r) => [{ id: crypto.randomUUID(), key, blob, width, height, name: `${baseName(file.name)}.${FORMATS[key].ext}` }, ...r])
    } catch (e) { toast.error(e.message) } finally { setBusy(false) }
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Image Format Optimizer</h1>
        <p className="text-slate-400 mb-6">Convert and compress images to WebP, AVIF, JPG or PNG. Everything happens in your browser; your files never leave your device.</p>

        <div
          onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]) }}
          onClick={() => input.current?.click()} role="button" tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
          className="border-2 border-dashed border-slate-600 hover:border-blue-400 rounded-xl p-8 text-center cursor-pointer mb-6">
          {src ? <img src={src} alt="Preview" className="max-h-48 mx-auto rounded mb-3" /> : <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />}
          <p>{file ? `${file.name} (${formatBytes(file.size)})` : 'Drop an image here or click to choose'}</p>
          <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <label className="block text-sm">Quality: {quality}%
            <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(+e.target.value)} className="mt-2" />
          </label>
          <label className="block text-sm">Max width (px, 0 = original)
            <input type="number" min="0" max="10000" value={maxWidth} onChange={(e) => setMaxWidth(Math.max(0, +e.target.value || 0))}
              className="mt-2 w-full rounded bg-slate-800 border border-slate-600 px-3 py-2" />
          </label>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {Object.entries(FORMATS).map(([k, f]) => (
            <button key={k} disabled={!file || busy} onClick={() => convert(k)}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 disabled:opacity-40 font-medium inline-flex items-center gap-2">
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}Convert to {f.label}
            </button>
          ))}
        </div>

        <ul className="space-y-3">
          {results.map((r) => {
            const saved = file ? Math.round((1 - r.blob.size / file.size) * 100) : 0
            return (
              <li key={r.id} className="flex items-center justify-between gap-4 bg-slate-800 rounded-lg p-4">
                <div className="text-sm">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-slate-400">{r.width}×{r.height} · {formatBytes(r.blob.size)} · {saved >= 0 ? `${saved}% smaller` : `${-saved}% larger`}</p>
                </div>
                <button onClick={() => downloadBlob(r.blob, r.name)} className="px-3 py-2 rounded bg-slate-700 hover:bg-slate-600 inline-flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" />Download
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
