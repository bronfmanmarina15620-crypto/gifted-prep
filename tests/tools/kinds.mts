import { GIFTED_BANK, kindOf, KIND_HE } from '../../src/gifted'
const m: Record<string, { t: string; d: number[]; f: Set<string> }> = {}
for (const it of GIFTED_BANK) { if (it.retired) continue; const k = kindOf(it.id); const x = (m[k] ||= { t: it.type, d: [0, 0, 0], f: new Set() }); x.d[it.diff - 1]++; x.f.add(it.id.replace(/\d+[a-c]?$/, '')) }
const rows = Object.entries(m).sort((a, b) => a[1].t.localeCompare(b[1].t) || a[1].d.reduce((p, q) => p + q) - b[1].d.reduce((p, q) => p + q))
for (const [k, x] of rows) { const n = x.d.reduce((p, q) => p + q); console.log(`${x.t}\t${k}\t${KIND_HE[k] ?? '?'}\t${n}\t${x.d.join('/')}\t${[...x.f].join(',')}${n < 30 || x.d.some((v) => v === 0) ? '\tTHIN' : ''}`) }
console.log('total', GIFTED_BANK.filter((i) => !i.retired).length, 'all', GIFTED_BANK.length)
