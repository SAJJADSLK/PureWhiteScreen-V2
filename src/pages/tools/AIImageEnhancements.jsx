import { useEffect, useRef, useState } from 'react'
import { Upload, Download, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { loadImage, renderBlob, downloadBlob, baseName, formatBytes } from '@/lib/imageUtils'

const DEFAULTS = { brightness: 100, contrast: 100, saturate: 100, sharpen: 0, grayscale: 0, sepia: 0 }
const CONTROLS = [
  ['brightness', 'Brightness', 50, 150, '%'], ['contrast', 'Contrast', 50, 150, '%'], ['saturate', 'Saturation', 0, 200, '%'],
  ['sharpen', 'Sharpen', 0, 100, ''], ['grayscale', 'Grayscale', 0, 100, '%'], ['sepia', 'Sepia', 0, 100, '%'],
]
const filterOf = (v) => `brightness(${v.brightness}%) contrast(${v.contrast}%) saturate(${v.saturate}%) grayscale(${v.grayscale}%) sepia(${v.sepia}%)`

export default function ImageEnhancer() {
  const [file, setFile] = useState(null)
  const [vals, setVals] = useState(DEFAULTS)
  const img = useRef(null)
  const canvas = useRef(null)
  const input = useRef(null)

  // live preview on a downscaled canvas
  useEffect(() => {
    const el = canvas.current, im = img.current
    if (!el || !im) return
    const scale = Math.min(1, 900 / im.naturalWidth)
    el.width = Math.round(im.naturalWidth * scale); el.height = Math.round(im.naturalHeight * scale)
    const ctx = el.getContext('2d')
    ctx.filter = filterOf(vals); ctx.drawImage(im, 0, 0, el.width, el.height); ctx.filter = 'none'
  }, [vals, file])

  const pick = async (f) => {
    if (!f || !f.type.startsWith('image/')) return toast.error('Please choose an image file')
    try { const { img: im } = await loadImage(f); img.current = im; setFile(f); setVals(DEFAULTS) } catch (e) { toast.error(e.message) }
  }

  const save = async () => {
    try {
      const { blob } = await renderBlob(img.current, { format: 'png', filter: filterOf(vals), sharpen: vals.sharpen / 100 })
      downloadBlob(blob, `${baseName(file.name)}-enhanced.png`)
      toast.success(`Saved (${formatBytes(blob.size)})`)
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div className="h-full overflow-y-auto bg-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-1">Image Enhancer</h1>
        <p className="text-slate-400 mb-6">Adjust brightness, contrast, color and sharpness with a live preview, then save at full resolution. Runs in your browser.</p>
        {!file ? (
          <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); pick(e.dataTransfer.files?.[0]) }}
            onClick={() => input.current?.click()} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && input.current?.click()}
            className="border-2 border-dashed border-slate-600 hover:border-blue-400 rounded-xl p-12 text-center cursor-pointer">
            <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" /><p>Drop an image here or click to choose</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-[1fr_16rem] gap-6">
            <canvas ref={canvas} className="w-full rounded-lg bg-slate-800" aria-label="Preview" />
            <div className="space-y-4">
              {CONTROLS.map(([k, label, min, max, unit]) => (
                <label key={k} className="block text-sm">{label}: {vals[k]}{unit}
                  <input type="range" min={min} max={max} value={vals[k]} onChange={(e) => setVals((v) => ({ ...v, [k]: +e.target.value }))} className="mt-2" />
                </label>
              ))}
              <div className="flex gap-2 pt-2">
                <button onClick={save} className="flex-1 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 font-medium inline-flex items-center justify-center gap-2"><Download className="w-4 h-4" />Save PNG</button>
                <button onClick={() => setVals(DEFAULTS)} aria-label="Reset" className="px-3 py-2 rounded-lg border border-slate-600"><RotateCcw className="w-4 h-4" /></button>
              </div>
              <button onClick={() => { setFile(null); img.current = null }} className="text-sm text-slate-400 underline">Choose another image</button>
            </div>
          </div>
        )}
        <input ref={input} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      </div>
    </div>
  )
}
