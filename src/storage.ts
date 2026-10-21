// Everything stays on this device (localStorage). Nothing is sent anywhere.
export type ExerciseLog = {
  at: number; date: string; area: 'gifted'; type: string; itemId: string
  answers: string[]; attempts: number; ms: number; outcome: 'first' | 'solved' | 'help'; plain?: string
}
export type Data = { log: ExerciseLog[]; pin?: string; planStart?: string; mocks: { at: number; ok: number; total: number }[] }
const KEY = 'gifted-prep-v1'
export function load(): Data {
  try { const d = JSON.parse(localStorage.getItem(KEY) || '{}'); return { log: d.log || [], pin: d.pin, planStart: d.planStart, mocks: d.mocks || [] } }
  catch { return { log: [], mocks: [] } }
}
export function save(d: Data): void { localStorage.setItem(KEY, JSON.stringify(d)) }
export function wipe(): void { localStorage.removeItem(KEY) }
export const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
