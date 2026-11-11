// v4: formats that follow the layout of the public Ministry demo test (parts 4 and 5).
// Every item is generated here with its own numbers and drawings; nothing is copied.
import type { GItem, GType } from './gifted'

type H = {
  pack: (id: string, type: GType, stem: string, right: string, wrongs: string[], plain: string, r: () => number, diff?: 1 | 2 | 3) => GItem
  rng: (seed: number) => () => number
  nums: (right: number, cands: number[]) => string[]
}
type D = 1 | 2 | 3
const INK = '#223'
const T = (x: number, y: number, v: number | string, fs = 16) => `<text x="${x.toFixed(1)}" y="${(y + fs * 0.35).toFixed(1)}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${v === '?' ? '#e5533d' : INK}">${v}</text>`
const svg = (w: number, h: number, body: string) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" class="g-svg" style="max-width:100%">${body}</svg>`

function finish(items: GItem[], n: number, prefix: string, kind: string, prompt: string): GItem[] {
  const seen = new Set<string>(), out: GItem[] = []
  // balance levels: equal thirds
  const per = Math.ceil(n / 3)
  for (const d of [1, 2, 3]) {
    let k = 0
    for (const it of items) {
      if (it.diff !== d || k >= per || out.length >= n) continue
      const sig = it.stem + '|' + [...it.options].sort().join('|')
      if (seen.has(sig) || new Set(it.options).size !== 4) continue
      seen.add(sig); it.id = prefix + out.length; it.kind = kind; it.prompt = prompt; out.push(it); k++
    }
  }
  return out
}

type R2 = { t: string; d: D; f: (a: number, b: number) => number | null }
const pos = (x: number) => (Number.isInteger(x) && x > 0 && x < 200 ? x : null)

// ---------- 4a. circle with 3 parts: bottom = f(top-right, top-left) ----------
const SECT: R2[] = [
  { t: 'a+b', d: 1, f: (a, b) => pos(a + b) }, { t: 'a-b', d: 1, f: (a, b) => pos(a - b) },
  ...[1, 2, 3].map((k) => ({ t: `a+b+${k}`, d: 2 as D, f: (a: number, b: number) => pos(a + b + k) })),
  ...[1, 2].map((k) => ({ t: `a+b-${k}`, d: 2 as D, f: (a: number, b: number) => pos(a + b - k) })),
  { t: 'a*b', d: 2, f: (a, b) => pos(a * b) }, { t: '2(a+b)', d: 3, f: (a, b) => pos(2 * (a + b)) },
  { t: 'a*b+1', d: 3, f: (a, b) => pos(a * b + 1) }, { t: 'a*b-1', d: 3, f: (a, b) => pos(a * b - 1) },
  { t: 'a*b-a', d: 3, f: (a, b) => pos(a * b - a) }, { t: '2a-b', d: 3, f: (a, b) => pos(2 * a - b) },
]
const sectCircle = (a: number | string, b: number | string, c: number | string, x: number) =>
  `<circle cx="${x}" cy="48" r="40" fill="#fff" stroke="${INK}" stroke-width="2"/><line x1="${x - 40}" y1="48" x2="${x + 40}" y2="48" stroke="${INK}" stroke-width="2"/><line x1="${x}" y1="8" x2="${x}" y2="48" stroke="${INK}" stroke-width="2"/>` +
  T(x + 19, 30, a) + T(x - 19, 30, b) + T(x, 68, c, 18)

// generic two-number rule items: 2 solved examples + question, only one rule in family fits
function twoArg(h: H, seed: number, fam: R2[], pick: (ri: (a: number, b: number) => number, d: D) => [number, number], draw: (ex: [number, number, number | string][]) => string) {
  const r = h.rng(seed), ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  const out: GItem[] = []
  for (let t = 0; t < 6000 && out.length < 400; t++) {
    const d = ([1, 2, 3] as D[])[t % 3]
    const rules = fam.filter((x) => x.d === d)
    const rule = rules[ri(0, rules.length - 1)]
    const ex = [pick(ri, d), pick(ri, d), pick(ri, d)]
    const vals = ex.map(([a, b]) => rule.f(a, b))
    if (vals.some((v) => v === null)) continue
    if (new Set(ex.map((e) => e.join())).size < 3) continue
    const fit = fam.filter((x) => ex.slice(0, 2).every(([a, b], i) => x.f(a, b) === vals[i]))
    if (fit.length !== 1) continue
    // a rule from the other two-number family must not fit with a different answer either
    const alt = [...SECT, ...OPER].filter((x) => ex.slice(0, 2).every(([a, b], i) => x.f(a, b) === vals[i]))
    if (alt.some((x) => x.f(ex[2][0], ex[2][1]) !== vals[2])) continue
    // also: no other rule fitting the examples could give a different answer (guaranteed by fit=1)
    const right = vals[2]!
    const others = fam.map((x) => x.f(ex[2][0], ex[2][1])).filter((v): v is number => v !== null && v !== right)
    const rows: [number, number, number | string][] = ex.map(([a, b], i) => [a, b, i === 2 ? '?' : vals[i]!])
    out.push(h.pack('tmp', 'numshape', draw(rows), String(right), h.nums(right, [...others.slice(0, 2), right + 1, right - 1]), `${rule.t}: ${rows.map((x) => x.join(',')).join(' | ')}`, r, d))
  }
  return out
}

// ---------- 4c. oval -> square (number) -> oval ----------
const OPER: R2[] = [
  { t: 'a+k', d: 1, f: (a, k) => pos(a + k) }, { t: 'a-k', d: 1, f: (a, k) => pos(a - k) },
  { t: 'a*k', d: 2, f: (a, k) => pos(a * k) }, { t: 'a+2k', d: 2, f: (a, k) => pos(a + 2 * k) }, { t: '2a+k', d: 2, f: (a, k) => pos(2 * a + k) },
  { t: 'a*k+1', d: 3, f: (a, k) => pos(a * k + 1) }, { t: 'a*k-1', d: 3, f: (a, k) => pos(a * k - 1) }, { t: '2(a+k)', d: 3, f: (a, k) => pos(2 * (a + k)) }, { t: 'a*k-k', d: 3, f: (a, k) => pos(a * k - k) },
]
const operRow = (a: number | string, k: number | string, c: number | string, y: number) =>
  `<ellipse cx="44" cy="${y}" rx="34" ry="21" fill="#fff" stroke="${INK}" stroke-width="2"/>${T(44, y, a, 18)}` +
  `<line x1="80" y1="${y}" x2="114" y2="${y}" stroke="${INK}" stroke-width="2"/><polygon points="114,${y - 5} 122,${y} 114,${y + 5}" fill="${INK}"/>` +
  `<rect x="124" y="${y - 21}" width="42" height="42" fill="#fff4d6" stroke="${INK}" stroke-width="2"/>${T(145, y, k, 18)}` +
  `<line x1="168" y1="${y}" x2="200" y2="${y}" stroke="${INK}" stroke-width="2"/><polygon points="200,${y - 5} 208,${y} 200,${y + 5}" fill="${INK}"/>` +
  `<ellipse cx="246" cy="${y}" rx="34" ry="21" fill="#fff" stroke="${INK}" stroke-width="2"/>${T(246, y, c, 18)}`

// ---------- 4d. one circle -> two circles ----------
type R1 = { t: string; d: D; f: (x: number) => number | null }
const ONE: R1[] = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((k) => ({ t: `+${k}`, d: 1 as D, f: (x: number) => pos(x + k) })),
  ...[2, 3, 4, 5].map((k) => ({ t: `×${k}`, d: 2 as D, f: (x: number) => pos(x * k) })),
  ...[6, 7, 8, 9, 10].map((k) => ({ t: `×${k}`, d: 3 as D, f: (x: number) => pos(x * k) })),
  ...[2, 3].map((k) => ({ t: `×${k}+1`, d: 3 as D, f: (x: number) => pos(x * k + 1) })),
  { t: 'x·x', d: 3, f: (x) => pos(x * x) },
]
const tree = (cx: number, top: number | string, l: number | string, rr: number | string) =>
  `<circle cx="${cx}" cy="26" r="20" fill="#fff" stroke="${INK}" stroke-width="2"/>${T(cx, 26, top)}` +
  `<line x1="${cx - 10}" y1="44" x2="${cx - 26}" y2="70" stroke="${INK}" stroke-width="2"/><polygon points="${cx - 30},${66} ${cx - 28},${76} ${cx - 21},${70}" fill="${INK}"/>` +
  `<line x1="${cx + 10}" y1="44" x2="${cx + 26}" y2="70" stroke="${INK}" stroke-width="2"/><polygon points="${cx + 30},${66} ${cx + 28},${76} ${cx + 21},${70}" fill="${INK}"/>` +
  `<circle cx="${cx - 32}" cy="94" r="19" fill="#fff" stroke="${INK}" stroke-width="2"/>${T(cx - 32, 94, l, 15)}<circle cx="${cx + 32}" cy="94" r="19" fill="#fff" stroke="${INK}" stroke-width="2"/>${T(cx + 32, 94, rr, 15)}`

function buildBranch(h: H): GItem[] {
  const r = h.rng(7404), ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  const out: GItem[] = []
  for (let t = 0; t < 8000 && out.length < 300; t++) {
    const d = ([1, 2, 3] as D[])[t % 3]
    const pool = ONE.filter((x) => x.d <= d)
    const g1 = pool[ri(0, pool.length - 1)], g2 = ONE.filter((x) => x.d === d)[ri(0, ONE.filter((x) => x.d === d).length - 1)]
    if (g1.t === g2.t) continue
    const xs = [ri(1, 9), ri(1, 9), ri(1, 9)]
    if (new Set(xs).size < 3) continue
    const L = xs.map(g1.f), R = xs.map(g2.f)
    if ([...L, ...R].some((v) => v === null || v! > 99)) continue
    const missRight = r() < 0.6
    const g = missRight ? g2 : g1, V = missRight ? R : L
    if (ONE.filter((o) => xs.slice(0, 2).every((x, i) => o.f(x) === V[i])).length !== 1) continue
    const right = V[2]!
    const others = ONE.map((o) => o.f(xs[2])).filter((v): v is number => v !== null && v !== right)
    const body = tree(320, xs[0], L[0]!, R[0]!) + tree(190, xs[1], L[1]!, R[1]!) + tree(60, xs[2], missRight ? L[2]! : '?', missRight ? '?' : R[2]!)
    out.push(h.pack('tmp', 'numshape', `<div class="g-sent">בכל ציור, החץ השמאלי עושה תרגיל אחד והחץ הימני תרגיל אחר. אותם תרגילים בכל הציורים.</div>${svg(380, 118, body)}`, String(right),
      h.nums(right, [...others.slice(0, 3), right + xs[2]]), `עיגול מתפצל: ${xs.join(',')} (${g1.t} , ${g2.t})`, r, d))
    void g
  }
  return finish(out, 36, 'pb', 'nbranch', 'איזה מספר חסר בעיגול?')
}

// ---------- 4b. pyramid made of small triangles ----------
const PYR: R2[] = [
  { t: 'a+b', d: 1, f: (a, b) => pos(a + b) }, { t: 'a+b+1', d: 2, f: (a, b) => pos(a + b + 1) }, { t: 'a+b-1', d: 2, f: (a, b) => pos(a + b - 1) },
  { t: '|a-b|', d: 2, f: (a, b) => pos(Math.abs(a - b)) }, { t: 'a*b', d: 3, f: (a, b) => pos(a * b) }, { t: '2(a+b)', d: 3, f: (a, b) => pos(2 * (a + b)) },
]
function triPyr(ox: number, cells: (number | string)[][]) {
  // rows: 0 = top (1 cell), 1 = middle (2), 2 = bottom (3). side 52
  const s = 52, hgt = s * 0.866
  let b = ''
  for (let row = 0; row < 3; row++) for (let i = 0; i <= row; i++) {
    const x = ox + (2 - row) * (s / 2) + i * s, y = row * hgt
    b += `<polygon points="${x + s / 2},${y} ${x + s},${y + hgt} ${x},${y + hgt}" fill="${row === 0 ? '#fff4d6' : '#fff'}" stroke="${INK}" stroke-width="2"/>${T(x + s / 2, y + hgt * 0.62, cells[row][i], 15)}`
  }
  return b
}
function buildPyr(h: H): GItem[] {
  const r = h.rng(7402), ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  const out: GItem[] = []
  for (let t = 0; t < 8000 && out.length < 300; t++) {
    const d = ([1, 2, 3] as D[])[t % 3]
    const rules = PYR.filter((x) => x.d === d); const R = rules[ri(0, rules.length - 1)]
    const mk = () => { const bot = [ri(1, d === 3 ? 4 : 9), ri(1, d === 3 ? 4 : 9), ri(1, d === 3 ? 4 : 9)]; const mid = [R.f(bot[0], bot[1]), R.f(bot[1], bot[2])]; const top = mid.every((v) => v !== null) ? R.f(mid[0]!, mid[1]!) : null; return { bot, mid, top } }
    const e = mk(), q = mk()
    if (e.top === null || q.top === null || e.top > 99 || q.top > 99) continue
    const pairs: [number, number, number][] = [[e.bot[0], e.bot[1], e.mid[0]!], [e.bot[1], e.bot[2], e.mid[1]!], [e.mid[0]!, e.mid[1]!, e.top]]
    if (PYR.filter((x) => pairs.every(([a, b, c]) => x.f(a, b) === c)).length !== 1) continue
    const hideMid = d > 1
    const right = q.top
    const others = PYR.map((x) => { const m0 = x.f(q.bot[0], q.bot[1]), m1 = x.f(q.bot[1], q.bot[2]); return m0 !== null && m1 !== null ? x.f(m0, m1) : null }).filter((v): v is number => v !== null && v !== right)
    const body = triPyr(4, [[e.top], e.mid as number[], e.bot]) + triPyr(196, [['?'], hideMid ? ['', ''] : (q.mid as number[]), q.bot])
    out.push(h.pack('tmp', 'numshape', `<div class="g-sent">בכל משולש קטן יש מספר שבא משני המשולשים שמתחתיו, לפי אותו כלל.</div>${svg(360, 140, body)}`, String(right),
      h.nums(right, [...others.slice(0, 2), q.mid[0]! + q.mid[1]!, right + 2]), `פירמידת משולשים (${R.t}): ${q.bot.join(',')}`, r, d))
  }
  return finish(out, 36, 'pt', 'npyr', 'איזה מספר חסר בראש הפירמידה?')
}

// ---------- 5. figural helpers ----------
const W = '#fff'
function polyPts(cx: number, cy: number, n: number, rad: number, rot = 0) {
  return Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + rot + (2 * Math.PI * i) / n; return `${(cx + rad * Math.cos(a)).toFixed(1)},${(cy + rad * Math.sin(a)).toFixed(1)}` }).join(' ')
}
const cell = (inner: string, sz = 64) => svg(sz, sz, inner)
const qCell = (sz = 64) => cell(`<rect x="3" y="3" width="${sz - 6}" height="${sz - 6}" fill="none" stroke="#e5533d" stroke-width="2" stroke-dasharray="5 4"/>${T(sz / 2, sz / 2, '?', 24)}`, sz)
const rowHtml = (cells: string[]) => `<div class="g-row4">${cells.map((c) => `<span class="g-cell">${c}</span>`).join('')}</div>`

// 5a-1: circle with dots added each step (clockwise ring positions), optional centre dot that alternates colour
function dotsCircle(n: number, start: number, centre: 'b' | 'w' | 'none', ringN = 8) {
  let b = `<circle cx="32" cy="32" r="28" fill="${W}" stroke="${INK}" stroke-width="2"/>`
  if (centre !== 'none') b += `<circle cx="32" cy="32" r="5.5" fill="${centre === 'b' ? INK : W}" stroke="${INK}" stroke-width="1.6"/>`
  for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (2 * Math.PI * ((start + i) % ringN)) / ringN; b += `<circle cx="${(32 + 19 * Math.cos(a)).toFixed(1)}" cy="${(32 + 19 * Math.sin(a)).toFixed(1)}" r="4" fill="${W}" stroke="${INK}" stroke-width="1.6"/>` }
  return cell(b)
}
function buildDotSeries(h: H): GItem[] {
  const r = h.rng(7501), ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  const out: GItem[] = []
  for (let t = 0; t < 3000 && out.length < 300; t++) {
    const d = ([1, 2, 3] as D[])[t % 3]
    const step = d === 3 ? 2 : 1, n0 = ri(0, 2), st = ri(0, 7)
    const cen = (i: number): 'b' | 'w' | 'none' => (d === 1 ? 'none' : i % 2 === 0 ? 'b' : 'w')
    const RN = d === 3 ? 12 : 8
    const dc = (n: number, c: 'b' | 'w' | 'none') => dotsCircle(n, st, c, RN)
    const seq = [0, 1, 2, 3].map((i) => dc(n0 + i * step, cen(i)))
    const n4 = n0 + 4 * step
    if (n4 > RN) continue
    const right = dc(n4, cen(4))
    const wr = [dc(n4 - 1, cen(4)), dc(n4 + 1 <= RN ? n4 + 1 : n4 - 2, cen(4)), d === 1 ? dc(n4, 'b') : dc(n4, cen(3))]
    out.push(h.pack('tmp', 'figural', rowHtml([...seq, qCell()]), right, wr, `עיגולים עם נקודות שנוספות (${n0}+${step})`, r, d))
  }
  return finish(out, 36, 'pd', 'fdots', 'מה הצורה הבאה בשורה?')
}

// 5a-2: polygon inside a circle, sides change by a fixed step
function polyInCircle(n: number, fill = W, circle = true, rot = 0) {
  return cell(`${circle ? `<circle cx="32" cy="32" r="29" fill="${W}" stroke="${INK}" stroke-width="2"/>` : ''}<polygon points="${polyPts(32, 32, n, 21, rot)}" fill="${fill}" stroke="${INK}" stroke-width="2"/>`)
}
function buildPolySeries(h: H): GItem[] {
  const r = h.rng(7502), ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  const out: GItem[] = []
  const PALS = [['#ffd59f', '#9fd3ff'], ['#b9f0c0', '#f5b8d0'], ['#d8c8ff', '#fff3a0'], ['#ffffff', '#cfcfcf']]
  for (let t = 0; t < 3000 && out.length < 300; t++) {
    const d = ([1, 2, 3] as D[])[t % 3]
    const up = d === 3 && r() < 0.5 ? false : true
    const step = d === 3 ? (up ? 2 : 1) : 1
    const len = d === 1 ? 3 : 4
    const n0 = up ? ri(3, 4) : ri(7, 9)
    const s = (i: number) => (up ? n0 + i * step : n0 - i * step)
    if (n0 === 3 && step === 1 && len === 4 && up) continue
    const F = PALS[ri(0, 3)], rot = [0, 0.26, 0.52][ri(0, 2)]
    const fill = (i: number) => (d === 1 ? F[0] : F[i % 2])
    const nq = s(len)
    if (nq < 3 || nq > 10) continue
    const P = (n: number, f: string, c = true) => polyInCircle(n, f, c, rot)
    const seq = Array.from({ length: len }, (_, i) => P(s(i), fill(i)))
    const right = P(nq, fill(len))
    const wr = [P(nq + 1, fill(len)), P(nq - 1 >= 3 ? nq - 1 : nq + 2, fill(len)), d === 1 ? P(nq, fill(len), false) : P(nq, fill(len + 1))]
    out.push(h.pack('tmp', 'figural', rowHtml([...seq, qCell()]), right, wr, `מצולעים בתוך עיגול: ${Array.from({ length: len }, (_, i) => s(i)).join(',')}`, r, d))
  }
  return finish(out, 36, 'pc', 'fpoly', 'מה הצורה הבאה בשורה?')
}

// 5b: 3x3 matrix of dots: every row grows by the same step, rows start differently
const DOTPOS = [[1, 1], [0, 0], [2, 2], [0, 2], [2, 0], [0, 1], [2, 1], [1, 0], [1, 2]]
function dotsBox(n: number) {
  let b = `<rect x="2" y="2" width="56" height="56" fill="${W}" stroke="${INK}" stroke-width="1.6"/>`
  const order = n % 2 === 1 ? DOTPOS : DOTPOS.slice(1)
  for (let i = 0; i < n; i++) { const [cx, cy] = order[i]; b += `<circle cx="${14 + cx * 16}" cy="${14 + cy * 16}" r="4.3" fill="${INK}"/>` }
  return cell(b, 60)
}
function buildDotMatrix(h: H): GItem[] {
  const r = h.rng(7503), ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  const out: GItem[] = []
  for (let t = 0; t < 3000 && out.length < 300; t++) {
    const d = ([1, 2, 3] as D[])[t % 3]
    const starts = [ri(1, 3), ri(1, 3), ri(1, 3)]
    const steps = d === 1 ? [1, 1, 1] : d === 2 ? [2, 2, 2] : [ri(1, 2), ri(1, 2), ri(1, 2)]
    if (d === 3 && new Set(steps).size < 2) continue
    const grid = starts.map((s, row) => [0, 1, 2].map((c) => s + c * steps[row]))
    const right = grid[2][2]
    if (grid.flat().some((v) => v > 9 || v < 1)) continue
    if (new Set(starts).size < 2) continue
    const cells = grid.flat().map((v, i) => (i === 8 ? qCell(60) : dotsBox(v)))
    const wr = [right + 1, right - 1, right + 2 <= 9 ? right + 2 : right - 2].filter((v) => v >= 1 && v <= 9)
    if (wr.length < 3) continue
    const stepTxt = d === 3 ? 'בכל שורה כלל משלה' : ''
    out.push(h.pack('tmp', 'figural', `<div class="g-mat3">${cells.map((c) => `<span>${c}</span>`).join('')}</div>${stepTxt ? `<div class="g-sent">${stepTxt}.</div>` : ''}`, dotsBox(right), wr.map(dotsBox), `טבלת נקודות 3×3: ${grid.map((x) => x.join(',')).join(' | ')}`, r, d))
  }
  return finish(out, 36, 'pm', 'fmatrix', 'מה חסר בטבלה?')
}

// 5c: carpet with a missing square piece
type Tile = { m: number; c: number; rot: number }
const PAL = [['#2d3a8c', '#f2c14e'], ['#b23a48', '#fcefe9'], ['#1f6f50', '#d9f2e6'], ['#5b3b8c', '#f3e8ff'], ['#333', '#eee']]
function tileSvg(t: Tile, x: number, y: number, s: number, pal: string[]) {
  const [a, b] = [PAL[t.c % PAL.length][0], pal[1]]
  const c = `${x + s / 2} ${y + s / 2}`
  let m = ''
  if (t.m === 0) m = `<polygon points="${x + s / 2},${y + 4} ${x + s - 4},${y + s / 2} ${x + s / 2},${y + s - 4} ${x + 4},${y + s / 2}" fill="${a}"/>`
  else if (t.m === 1) m = `<polygon points="${x},${y} ${x + s},${y} ${x},${y + s}" fill="${a}"/>`
  else if (t.m === 2) m = `<circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s / 3}" fill="${a}"/><circle cx="${x + s / 2}" cy="${y + s / 2}" r="${s / 7}" fill="${b}"/>`
  else if (t.m === 3) m = `<rect x="${x}" y="${y + s / 4}" width="${s}" height="${s / 4}" fill="${a}"/><rect x="${x}" y="${y + (s * 5) / 8}" width="${s / 2}" height="${s / 6}" fill="${a}"/>`
  else m = `<polygon points="${x + s / 2},${y + 4} ${x + s - 6},${y + s - 6} ${x + 6},${y + s - 6}" fill="${a}"/>`
  return `<g transform="rotate(${t.rot} ${c})"><rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${b}"/>${m}</g><rect x="${x}" y="${y}" width="${s}" height="${s}" fill="none" stroke="#0003" stroke-width="0.6"/>`
}
const tkey = (t: Tile) => `${t.m}.${t.c}.${((t.rot % 360) + 360) % 360}`
function buildCarpet(h: H): GItem[] {
  const r = h.rng(7504), ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  const out: GItem[] = []
  for (let t = 0; t < 4000 && out.length < 300; t++) {
    const d = ([1, 2, 3] as D[])[t % 3]
    const pal = PAL[ri(0, PAL.length - 1)]
    const mA = ri(0, 4), mB = (mA + ri(1, 4)) % 5, cA = ri(0, 4), cB = (cA + ri(1, 4)) % 5
    const rotStep = [0, 90, 180, 270]
    let f: (i: number, j: number) => Tile
    if (d === 1) f = (i, j) => ((i + j) % 2 === 0 ? { m: mA, c: cA, rot: 0 } : { m: mB, c: cB, rot: 0 })
    else if (d === 2) f = (i, j) => ({ m: [mA, mB, (mB + 1) % 5][(i + j) % 3], c: [cA, cB, cA][(i + j) % 3], rot: 0 })
    else f = (i, j) => ({ m: mA === 2 ? 1 : mA, c: i % 2 === 0 ? cA : cB, rot: rotStep[j % 4] })
    const COLS = 6, ROWS = 4, S = 46
    const mi = ri(1, ROWS - 2), mj = ri(1, COLS - 2)
    const right = f(mi, mj)
    // candidate wrong tiles: other tiles of the carpet + a turned / recoloured copy
    const cands: Tile[] = []
    for (let i = 0; i < ROWS; i++) for (let j = 0; j < COLS; j++) cands.push(f(i, j))
    cands.push({ ...right, rot: right.rot + 90 }, { ...right, c: (right.c + 1) % 5 }, { ...right, m: (right.m + 2) % 5 }, { ...right, rot: right.rot + 180 })
    const wr: Tile[] = []
    for (const c of cands.sort(() => r() - 0.5)) if (tkey(c) !== tkey(right) && !wr.some((w) => tkey(w) === tkey(c)) && !(right.m === 2 && c.m === 2 && c.c === right.c) && !(right.m === 0 && c.m === 0 && c.c === right.c && c.rot % 90 === 0) && wr.length < 3) wr.push(c)
    if (wr.length < 3) continue
    // a circle/diamond rotated by 90 looks the same -> skip such carpets for rotation level
    if (d === 3 && (right.m === 2 || right.m === 0)) continue
    let body = ''
    for (let i = 0; i < ROWS; i++) for (let j = 0; j < COLS; j++) body += i === mi && j === mj ? `<rect x="${j * S}" y="${i * S}" width="${S}" height="${S}" fill="#fff" stroke="#e5533d" stroke-width="2" stroke-dasharray="4 3"/>${T(j * S + S / 2, i * S + S / 2, '?', 22)}` : tileSvg(f(i, j), j * S, i * S, S, pal)
    const one = (tl: Tile) => svg(S, S, tileSvg({ ...tl }, 0, 0, S, pal))
    out.push(h.pack('tmp', 'figural', svg(COLS * S, ROWS * S, body), one(right), wr.map(one), `שטיח עם חתיכה חסרה (רמה ${d})`, r, d))
  }
  return finish(out, 36, 'pk', 'fcarpet', 'איזו חתיכה משלימה את השטיח?')
}

export function buildOfficial(h: H): GItem[] {
  const sect = finish(twoArg(h, 7401, SECT, (ri, d) => [ri(d === 3 ? 2 : 3, d === 1 ? 15 : 9), ri(1, d === 1 ? 9 : 6)].sort((a, b) => b - a) as [number, number],
    (ex) => `<div class="g-sent">בכל עיגול, המספר שלמטה בא משני המספרים שלמעלה, לפי אותו כלל.</div>${svg(380, 98, ex.map(([a, b, c], i) => sectCircle(a, b, c, 320 - i * 128)).join(''))}`), 36, 'ps', 'ncirc', 'איזה מספר חסר בעיגול?')
  const oper = finish(twoArg(h, 7403, OPER, (ri, d) => [ri(2, d === 1 ? 20 : 9), ri(1, d === 1 ? 9 : 5)],
    (ex) => `<div class="g-sent">המספר בריבוע אומר כמה להפעיל. בכל השורות אותו תרגיל.</div>${svg(290, 192, `<text x="44" y="14" text-anchor="middle" font-size="13" fill="#556">מספר</text><text x="145" y="14" text-anchor="middle" font-size="13" fill="#556">מספר בריבוע</text><text x="246" y="14" text-anchor="middle" font-size="13" fill="#556">תוצאה</text>` + ex.map(([a, k, c], i) => operRow(a, k, c, 50 + i * 56)).join(''))}`), 36, 'po', 'noper', 'איזה מספר חסר באליפסה?')
  return [...sect, ...buildPyr(h), ...oper, ...buildBranch(h), ...buildDotSeries(h), ...buildPolySeries(h), ...buildDotMatrix(h), ...buildCarpet(h)]
}
