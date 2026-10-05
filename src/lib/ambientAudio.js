// Procedural ambient audio via the Web Audio API: no audio files, works offline.

function noiseBuffer(ctx, type, seconds = 4) {
  const len = ctx.sampleRate * seconds
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  if (type === 'white') for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  else if (type === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852
      b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898
      d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926
    }
  } else { // brown
    let last = 0
    for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5 }
  }
  return buf
}

function loopNoise(ctx, type) {
  const src = ctx.createBufferSource()
  src.buffer = noiseBuffer(ctx, type); src.loop = true; src.start()
  return src
}

function filter(ctx, type, freq, q = 0.7) {
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q; return f
}

function lfo(ctx, freq, depth, target) {
  const o = ctx.createOscillator(), g = ctx.createGain()
  o.frequency.value = freq; g.gain.value = depth
  o.connect(g).connect(target); o.start()
  return o
}

// run `fn` at random intervals until stopped
function scheduler(fn, minMs, maxMs, timers) {
  let alive = true
  const tick = () => { if (!alive) return; fn(); const id = setTimeout(tick, minMs + Math.random() * (maxMs - minMs)); timers.push(id) }
  timers.push(setTimeout(tick, minMs))
  return () => { alive = false }
}

const BUILDERS = {
  rain(ctx, out, timers, nodes) {
    const n = loopNoise(ctx, 'pink'), hp = filter(ctx, 'highpass', 500), g = ctx.createGain(); g.gain.value = 0.9
    n.connect(hp).connect(g).connect(out)
    const n2 = loopNoise(ctx, 'white'), bp = filter(ctx, 'bandpass', 5000, 0.5), g2 = ctx.createGain(); g2.gain.value = 0.12
    n2.connect(bp).connect(g2).connect(out)
    nodes.push(n, n2)
  },
  pink(ctx, out, timers, nodes) {
    const n = loopNoise(ctx, 'pink'), lp = filter(ctx, 'lowpass', 16000), g = ctx.createGain(); g.gain.value = 1.4
    n.connect(lp).connect(g).connect(out); nodes.push(n)
  },
  brown(ctx, out, timers, nodes) {
    const n = loopNoise(ctx, 'brown'), g = ctx.createGain(); g.gain.value = 1.0
    n.connect(g).connect(out); nodes.push(n)
  },
  white(ctx, out, timers, nodes) {
    const n = loopNoise(ctx, 'white'), lp = filter(ctx, 'lowpass', 12000), g = ctx.createGain(); g.gain.value = 0.45
    n.connect(lp).connect(g).connect(out); nodes.push(n)
  },
  cafe(ctx, out, timers, nodes) {
    const n = loopNoise(ctx, 'pink'), bp = filter(ctx, 'bandpass', 900, 0.4), g = ctx.createGain(); g.gain.value = 0.6
    n.connect(bp).connect(g).connect(out); nodes.push(n, lfo(ctx, 0.13, 0.25, g.gain))
    scheduler(() => { // cup / cutlery clinks
      const o = ctx.createOscillator(), e = ctx.createGain(), t = ctx.currentTime
      o.frequency.value = 2200 + Math.random() * 2200; e.gain.setValueAtTime(0.0001, t)
      e.gain.exponentialRampToValueAtTime(0.06, t + 0.005); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
      o.connect(e).connect(out); o.start(t); o.stop(t + 0.2)
    }, 1500, 6000, timers)
  },
  ocean(ctx, out, timers, nodes) {
    const n = loopNoise(ctx, 'brown'), lp = filter(ctx, 'lowpass', 700), g = ctx.createGain(); g.gain.value = 0.5
    n.connect(lp).connect(g).connect(out); nodes.push(n, lfo(ctx, 0.09, 0.4, g.gain), lfo(ctx, 0.09, 350, lp.frequency))
    const h = loopNoise(ctx, 'white'), hp = filter(ctx, 'highpass', 3000), hg = ctx.createGain(); hg.gain.value = 0.05
    h.connect(hp).connect(hg).connect(out); nodes.push(h, lfo(ctx, 0.09, 0.04, hg.gain))
  },
  forest(ctx, out, timers, nodes) {
    const n = loopNoise(ctx, 'pink'), lp = filter(ctx, 'lowpass', 450), g = ctx.createGain(); g.gain.value = 0.35
    n.connect(lp).connect(g).connect(out); nodes.push(n, lfo(ctx, 0.07, 0.15, g.gain))
    scheduler(() => { // bird chirps
      const t = ctx.currentTime, base = 2200 + Math.random() * 2400, count = 1 + Math.floor(Math.random() * 3)
      for (let i = 0; i < count; i++) {
        const o = ctx.createOscillator(), e = ctx.createGain(), s = t + i * 0.16
        o.type = 'sine'; o.frequency.setValueAtTime(base, s); o.frequency.exponentialRampToValueAtTime(base * (1.2 + Math.random() * 0.5), s + 0.1)
        e.gain.setValueAtTime(0.0001, s); e.gain.exponentialRampToValueAtTime(0.05, s + 0.02); e.gain.exponentialRampToValueAtTime(0.0001, s + 0.12)
        o.connect(e).connect(out); o.start(s); o.stop(s + 0.14)
      }
    }, 1200, 5000, timers)
  },
  fire(ctx, out, timers, nodes) {
    const n = loopNoise(ctx, 'brown'), lp = filter(ctx, 'lowpass', 350), g = ctx.createGain(); g.gain.value = 0.7
    n.connect(lp).connect(g).connect(out); nodes.push(n, lfo(ctx, 0.4, 0.15, g.gain))
    const buf = noiseBuffer(ctx, 'white', 1)
    scheduler(() => { // crackles
      const s = ctx.createBufferSource(), hp = filter(ctx, 'highpass', 1200 + Math.random() * 3000), e = ctx.createGain(), t = ctx.currentTime
      s.buffer = buf; e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(0.25 * Math.random() + 0.05, t + 0.003); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.03 + Math.random() * 0.05)
      s.connect(hp).connect(e).connect(out); s.start(t, Math.random() * 0.8); s.stop(t + 0.1)
    }, 40, 350, timers)
  },
  aurora(ctx, out, timers, nodes) {
    const lp = filter(ctx, 'lowpass', 900), g = ctx.createGain(); g.gain.value = 0.18
    lp.connect(g).connect(out)
    ;[110, 164.8, 220.4, 329.6].forEach((f, i) => {
      const o = ctx.createOscillator(), og = ctx.createGain(); o.type = 'sine'; o.frequency.value = f * (1 + (i - 1.5) * 0.002)
      og.gain.value = 0.25; o.connect(og).connect(lp); o.start(); nodes.push(o, lfo(ctx, 0.05 + i * 0.03, 0.18, og.gain))
    })
  },
}

export const SOUND_KINDS = Object.keys(BUILDERS)

export class Soundscape {
  constructor() { this.ctx = null; this.tracks = new Map() }

  async start() {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) throw new Error('Web Audio is not supported in this browser')
    if (!this.ctx) this.ctx = new AC()
    if (this.ctx.state === 'suspended') await this.ctx.resume()
  }

  set(kind, volume) { // volume 0..100
    if (!this.ctx || !BUILDERS[kind]) return
    let tr = this.tracks.get(kind)
    if (!tr) {
      const gain = this.ctx.createGain(); gain.gain.value = 0; gain.connect(this.ctx.destination)
      tr = { gain, timers: [], nodes: [] }
      BUILDERS[kind](this.ctx, gain, tr.timers, tr.nodes)
      this.tracks.set(kind, tr)
    }
    const v = Math.max(0, Math.min(100, volume)) / 100
    tr.gain.gain.setTargetAtTime(v * v * 0.8, this.ctx.currentTime, 0.05)
  }

  stop() {
    for (const tr of this.tracks.values()) {
      tr.timers.forEach(clearTimeout); tr.nodes.forEach((n) => { try { n.stop() } catch { /* already stopped */ } })
      try { tr.gain.disconnect() } catch { /* noop */ }
    }
    this.tracks.clear()
    if (this.ctx) { this.ctx.close().catch(() => {}); this.ctx = null }
  }
}
