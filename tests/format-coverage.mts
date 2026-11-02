// Simulates Eva: sessions answered all first-try. Reports how many sessions until every format is met.
import { GIFTED_BANK, GTYPES, pickSession, pickExamChapter, formatOf } from '../src/gifted'
let fail = 0
const fmtsOf = (t: string) => new Set(GIFTED_BANK.filter((i) => i.type === t).map((i) => formatOf(i.id)))
for (const mode of [...GTYPES, 'mixed'] as const) {
  const log: any[] = []; const met = new Set<string>(); let now = Date.now(); let s = 0
  const all = mode === 'mixed' ? new Set(GIFTED_BANK.map((i) => formatOf(i.id))) : fmtsOf(mode)
  for (; s < 40 && met.size < all.size; s++) {
    const items = pickSession(mode as any, log, 12, now)
    const ids = new Set(items.map((i) => i.id)); if (ids.size !== items.length) { console.log('DUP in session', mode); fail++ }
    for (const it of items) { met.add(formatOf(it.id)); log.push({ at: now, date: '', area: 'gifted', type: 'g:' + it.type, itemId: it.id, answers: ['א'], attempts: 1, ms: 1, outcome: 'first', plain: '' }) }
    now += 86400000
  }
  console.log(`${mode}: ${all.size} formats, all met after ${s} sessions`)
  if (met.size < all.size) { fail++; console.log(' missing', [...all].filter((f) => !met.has(f))) }
}
for (const t of GTYPES) {
  const seen: Record<string, number> = {}; const met = new Set<string>(); let e = 0
  for (; e < 10 && met.size < fmtsOf(t).size; e++) for (const it of pickExamChapter(t, 10, seen)) { met.add(formatOf(it.id)); seen[it.id] = (seen[it.id] ?? 0) + 1 }
  console.log(`exam ${t}: all ${fmtsOf(t).size} formats met after ${e} exams`)
  if (met.size < fmtsOf(t).size) fail++
}
process.exit(fail ? 1 : 0)
