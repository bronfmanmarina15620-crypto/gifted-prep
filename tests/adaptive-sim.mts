// 200 mixed sessions + 200 mock tests from a history like Eva's parent screen (Nov 14).
// Compares the old picker (v5) with the adaptive one (v6). Prints % of questions per sub-type.
import { GIFTED_BANK, GTYPES, pickSession, pickSessionOld, pickExamChapter, pickExamChapterOld, kindOf, KIND_HE } from '../src/gifted'
const now = Date.now()
const HIST: Record<string, [number, number]> = { // kind: [answers, first-try %]
  nbranch: [4, 0], wlogic: [5, 20], ntwostep: [5, 20], wdigits: [4, 25], nchain: [6, 33],
  svocab: [68, 90], fseries: [30, 90], ftable: [22, 90],
}
const kinds = [...new Set(GIFTED_BANK.map((i) => kindOf(i.id)))]
const log: any[] = []
let t = now - 13 * 86400000
for (const k of kinds) {
  const [n, p] = HIST[k] ?? [8, 75] // other sub-types: assume 8 answers, 75% first try
  const its = GIFTED_BANK.filter((i) => kindOf(i.id) === k && !i.retired)
  for (let j = 0; j < n; j++) {
    const it = its[j % its.length]
    log.push({ at: (t += 60000), date: '', area: 'gifted', type: 'g:' + it.type, itemId: it.id, answers: ['א'], attempts: 1, ms: 1, outcome: j < Math.round((n * p) / 100) ? 'first' : 'help', plain: '' })
  }
}
log.sort((a, b) => a.at - b.at)
function dist(f: () => { id: string }[], runs = 200) {
  const c: Record<string, number> = {}; let tot = 0, dup = 0
  for (let r = 0; r < runs; r++) { const s = f(); if (new Set(s.map((x) => x.id)).size !== s.length) dup++; for (const it of s) { const k = kindOf(it.id); c[k] = (c[k] ?? 0) + 1; tot++ } }
  return { pc: (k: string) => (100 * (c[k] ?? 0)) / tot, dup }
}
const oldM = dist(() => pickSessionOld('mixed', log, 12, now)), newM = dist(() => pickSession('mixed', log, 12, now))
const exOld = dist(() => GTYPES.flatMap((t) => pickExamChapterOld(t, 10, {}))), exNew = dist(() => GTYPES.flatMap((t) => pickExamChapter(t, 10, {}, log, now)))
const show = ['nbranch', 'wlogic', 'ntwostep', 'wdigits', 'nchain', 'svocab', 'fseries', 'ftable']
console.log('sub-type | mixed old % | mixed new % | mock old % | mock new %')
for (const k of show) console.log(`${KIND_HE[k]} | ${oldM.pc(k).toFixed(1)} | ${newM.pc(k).toFixed(1)} | ${exOld.pc(k).toFixed(1)} | ${exNew.pc(k).toFixed(1)}`)
const weak = show.slice(0, 5).reduce((a, k) => a + newM.pc(k), 0), weakOld = show.slice(0, 5).reduce((a, k) => a + oldM.pc(k), 0)
console.log(`5 weak together: mixed ${weakOld.toFixed(1)}% -> ${weak.toFixed(1)}% ; per 12-question session ${(weakOld * 0.12).toFixed(1)} -> ${(weak * 0.12).toFixed(1)}`)
console.log('sessions with a repeated question: old', oldM.dup, 'new', newM.dup, '| mocks', exOld.dup, exNew.dup)
// mock structure must stay 5 parts x 10, with 3 easy / 4 medium / 3 hard where possible
const m = GTYPES.map((t) => pickExamChapter(t, 10, {}, log, now))
console.log('mock parts:', m.map((x) => x.length).join(','), 'levels part1:', m[0].map((x) => x.diff).join(''))
// evolving run: 200 consecutive mixed sessions (one a day); Eva answers each sub-type at her own rate
function evolve(pick: typeof pickSession) {
  const L = log.map((r) => ({ ...r })); const c: Record<string, number> = {}; let tot = 0; let day = now
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
  for (let s = 0; s < 200; s++) {
    day += 86400000
    for (const it of pick('mixed', L, 12, day)) {
      const k = kindOf(it.id); c[k] = (c[k] ?? 0) + 1; tot++
      const p = (HIST[k]?.[1] ?? 75) / 100
      L.push({ at: (day += 30000), date: '', area: 'gifted', type: 'g:' + it.type, itemId: it.id, answers: ['א'], attempts: 1, ms: 1, outcome: rnd() < p ? 'first' : 'help', plain: '' })
    }
  }
  return (k: string) => (100 * (c[k] ?? 0)) / tot
}
const eo = evolve(pickSessionOld), en = evolve(pickSession)
console.log('\n200 consecutive mixed sessions (history grows): sub-type | old % | new %')
for (const k of show) console.log(`${KIND_HE[k]} | ${eo(k).toFixed(1)} | ${en(k).toFixed(1)}`)
console.log(`5 weak together: ${show.slice(0, 5).reduce((a, k) => a + eo(k), 0).toFixed(1)}% -> ${show.slice(0, 5).reduce((a, k) => a + en(k), 0).toFixed(1)}%`)
process.exit(newM.dup || exNew.dup || m.some((x) => x.length !== 10) ? 1 : 0)
