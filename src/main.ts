import './style.css'
import { GTYPES, GTYPE_META, GIFTED_TIPS, pickGiftedItems, pickExamChapter, type GItem, type GType, type GStats } from './gifted'
import { PHASES, PLAN_WEEKS, weekOf, phaseOf, taskFor, progress, dayKey } from './plan'
import { conclusions, renderLogPanel, secs } from './insights'
import { load, save, wipe, todayKey, type Data, type ExerciseLog } from './storage'

const app = document.querySelector<HTMLDivElement>('#app')!
let data: Data = load()
type Screen = 'home' | 'practice' | 'summary' | 'exam' | 'plan' | 'pin' | 'parent' | 'about'
let screen: Screen = 'home'
const HELP_MSG = 'כדאי לבקש מאמא, מאבא או מהמורה להסביר את התרגיל הזה'
const SESSION_N = 12
const OFFICIAL_DESC = 'https://meyda.education.gov.il/files/gifted/test-shlav2-description.pdf'
const OFFICIAL_EX = 'https://meyda.education.gov.il/files/gifted/test-shlav2-example.pdf'
const OFFICIAL_ANS = 'https://meyda.education.gov.il/files/gifted/test-shlav2-example-answers.pdf'
const DISCLAIMER = 'לא קשור למשרד החינוך. תרגול בלבד. לא מבטיח הצלחה במבחן.'
const PRIVACY = 'שום מידע לא נשלח לשום מקום. אין הרשמה, אין פרסומות ואין מעקב. כל ההתקדמות נשמרת רק במכשיר הזה.'
const label = (t: string) => (t.startsWith('g:') ? GTYPE_META[t.slice(2) as GType]?.title || t : t)
const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!))

function shell(inner: string, right = ''): void {
  app.innerHTML = `<div class="wrap"><div class="top"><div class="hello brand"><img src="${import.meta.env.BASE_URL}marina-logo.png" alt="MARINA" class="brand-logo"/> חושבים בכיף</div><div class="top-actions">${right}</div></div>${inner}
  <footer class="foot"><p>${DISCLAIMER}</p><p>🔒 ${PRIVACY}</p><p><a href="#" id="lnkAbout">אודות ופרטיות</a></p></footer></div>`
  app.querySelector('#lnkAbout')?.addEventListener('click', (e) => { e.preventDefault(); go('about') })
}
function go(s: Screen): void { stopTimer(); screen = s; render(); window.scrollTo(0, 0) }
function render(): void {
  ;({ home: renderHome, practice: renderPractice, summary: renderSummary, exam: renderExam, plan: renderPlan, pin: renderPin, parent: renderParent, about: renderAbout } as Record<Screen, () => void>)[screen]()
}

function gStats(): { stats: GStats; typeErr: Record<string, number> } {
  const stats: GStats = {}
  const agg: Record<string, { n: number; bad: number }> = {}
  for (const r of data.log) {
    const s = (stats[r.itemId] ||= { tries: 0, fails: 0, firstOk: 0, last: 0, lastFail: 0 })
    s.tries++; s.last = Math.max(s.last, r.at)
    if (r.outcome === 'first') s.firstOk++
    else { s.fails++; s.lastFail = Math.max(s.lastFail, r.at) }
    const a = (agg[r.type.slice(2)] ||= { n: 0, bad: 0 }); a.n++; if (r.outcome !== 'first') a.bad++
  }
  const typeErr: Record<string, number> = {}
  for (const [t, a] of Object.entries(agg)) typeErr[t] = a.n ? a.bad / a.n : 0
  return { stats, typeErr }
}

// ---------- home ----------
function renderHome(): void {
  shell(`
    <p class="lead">תרגול חינמי לשלב ב׳ של מבחן המחוננים, כיתה ג׳. חמישה סוגי שאלות, מבחן דמה ותוכנית ל-5 חודשים.</p>
    <div class="mod-grid" id="mods"></div>
    <button class="primary" id="btnMixed">🎲 תרגול מעורב</button>
    <button class="primary" id="btnExam">📝 מבחן דמה מלא</button>
    <button class="ghost" id="btnPlan">🗓️ תוכנית ל-5 חודשים</button>
    <button class="ghost" id="btnParent">👪 מסך הורים</button>
    <p class="note">בכל שאלה יש עד 3 ניסיונות. התשובה לא נחשפת – כך לומדים לחשוב.</p>
    <p class="note">מידע רשמי על המבחן (קישור לאתר משרד החינוך): <a href="${OFFICIAL_DESC}" target="_blank" rel="noopener">תיאור המבחן (PDF)</a></p>`)
  const grid = app.querySelector('#mods')!
  GTYPES.forEach((t) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'mod-card'
    b.innerHTML = `<div class="mod-emoji">${GTYPE_META[t].emoji}</div><div class="mod-title">${GTYPE_META[t].title}</div>`
    b.addEventListener('click', () => startPractice(t)); grid.appendChild(b)
  })
  app.querySelector('#btnMixed')!.addEventListener('click', () => startPractice('mixed'))
  app.querySelector('#btnExam')!.addEventListener('click', startExam)
  app.querySelector('#btnPlan')!.addEventListener('click', () => go('plan'))
  app.querySelector('#btnParent')!.addEventListener('click', () => go(data.pin ? 'pin' : 'parent'))
}

// ---------- practice ----------
let items: GItem[] = []
let qi = 0, attempts = 0, answers: string[] = [], itemStart = 0, okCount = 0, firstCount = 0
let helpList: string[] = []
let curType: GType | 'mixed' = 'mixed'
function startPractice(t: GType | 'mixed'): void {
  const { stats, typeErr } = gStats()
  curType = t; items = pickGiftedItems(t, stats, typeErr, SESSION_N)
  qi = 0; attempts = 0; answers = []; okCount = 0; firstCount = 0; helpList = []; itemStart = Date.now()
  go('practice')
}
function itemHtml(it: GItem): string {
  return `<div class="qcard gcard"><div class="name-badge">${GTYPE_META[it.type].title}</div><div class="prompt">${GTYPE_META[it.type].promptHe}</div><div class="g-stem">${it.stem}</div>
  <div class="opt-grid g-opts">${it.options.map((o, i) => `<button type="button" class="opt g-opt" data-i="${i}"><span class="g-letter">${'אבגד'[i]}.</span> <span class="g-optbody">${o}</span></button>`).join('')}</div></div>`
}
function renderPractice(): void {
  const it = items[qi]
  shell(`
    <div class="stats"><div class="chip"><b>${qi + 1}/${items.length}</b><small>שאלה</small></div><div class="chip"><b>${okCount}</b><small>נכון</small></div></div>
    <div class="progress"><div class="bar" style="width:${(qi / items.length) * 100}%"></div></div>
    ${attempts > 0 ? `<p class="note">ניסיון ${attempts + 1} מתוך 3</p>` : ''}
    <div id="qhost">${itemHtml(it)}</div><div class="msg" id="msg"></div>
    <button class="ghost" id="btnStop">סיום</button>`)
  app.querySelectorAll<HTMLButtonElement>('.g-opt').forEach((b) => b.addEventListener('click', () => answer(Number(b.dataset.i))))
  app.querySelector('#btnStop')!.addEventListener('click', () => { if (confirm('לסיים את התרגול עכשיו?')) (qi > 0 ? go('summary') : go('home')) })
}
function log(it: GItem, outcome: ExerciseLog['outcome']): void {
  data.log = [...data.log, { at: Date.now(), date: todayKey(), area: 'gifted' as const, type: 'g:' + it.type, itemId: it.id, answers: [...answers], attempts, ms: Date.now() - itemStart, outcome, plain: it.plain }].slice(-3000)
  save(data)
}
function answer(i: number): void {
  const it = items[qi]
  app.querySelectorAll<HTMLButtonElement>('.g-opt').forEach((b) => (b.disabled = true))
  attempts++; answers.push('אבגד'[i])
  const msg = app.querySelector<HTMLElement>('#msg')!
  if (i === it.correct) {
    msg.className = 'msg ok'; msg.textContent = attempts > 1 ? 'יופי! עכשיו נכון ⭐' : 'כל הכבוד! ⭐'
    okCount++; if (attempts === 1) firstCount++
    log(it, attempts === 1 ? 'first' : 'solved'); setTimeout(next, 700); return
  }
  msg.className = 'msg no'
  if (attempts < 3) { msg.textContent = attempts === 1 ? 'כמעט... אפשר לנסות שוב 💛' : 'עוד ניסיון אחד. חושבים בשקט ובודקים שוב 💛'; setTimeout(render, 1000); return }
  msg.textContent = HELP_MSG + ' 💛'; helpList.push(it.plain); log(it, 'help'); setTimeout(next, 2600)
}
function next(): void {
  qi++; attempts = 0; answers = []; itemStart = Date.now()
  if (qi >= items.length) go('summary'); else render()
}
function renderSummary(): void {
  const tip = curType === 'mixed' ? '' : `<div class="panel"><b>טיפ:</b> ${GIFTED_TIPS[curType]}</div>`
  shell(`<h2>סיימנו! 🎉</h2>
    <div class="stats"><div class="chip"><b>${okCount}/${qi}</b><small>נכון</small></div><div class="chip"><b>${firstCount}</b><small>בניסיון ראשון</small></div></div>
    ${helpList.length ? `<div class="panel"><b>כדאי לבקש מאמא, מאבא או מהמורה להסביר את התרגילים האלה:</b><ul class="help-list">${helpList.map((h) => `<li>${esc(h)}</li>`).join('')}</ul></div>` : '<p class="lead">כל התרגילים נפתרו. כל הכבוד! ⭐</p>'}
    ${tip}
    <button class="primary" id="again">עוד סבב</button><button class="ghost" id="home">לדף הבית</button>`)
  app.querySelector('#again')!.addEventListener('click', () => startPractice(curType))
  app.querySelector('#home')!.addEventListener('click', () => go('home'))
}

// ---------- mock test ----------
const EXAM_ORDER: GType[] = ['analogy', 'sentence', 'word', 'numshape', 'figural']
const EXAM_N = 10
const EXAM_CHAPTER_MS = 14 * 60 * 1000
const EXAM_INSTR: Record<GType, string> = {
  analogy: 'למעלה יש שתי מילים שיש ביניהן קשר. מה הקשר? מחפשים בתשובות זוג מילים עם אותו קשר בדיוק, ובאותו סדר.',
  sentence: 'במשפט חסרות מילים, ובמקומן יש קו. בוחרים את התשובה שמשלימה את המשפט כך שיהיה הכי הגיוני.',
  word: 'קוראים את הסיפור לאט, עד הסוף. אפשר לצייר או לכתוב בצד. ואז בוחרים את התשובה הנכונה.',
  numshape: 'בתוך הצורה יש מספרים, והם מסודרים לפי חוק של חשבון. מוצאים את החוק ובודקים איזה מספר מתאים במקום סימן השאלה.',
  figural: 'הצורות משתנות לפי חוק. מוצאים את החוק ובוחרים את הצורה שחסרה.',
}
type Ch = { type: GType; items: GItem[]; ans: (number | null)[]; start: number; ms: number[] }
let exam: Ch[] = [], ec = 0, eq = 0, qStart = 0
let ephase: 'intro' | 'ch' | 'q' | 'res' = 'intro'
let timerId: number | undefined
function stopTimer(): void { if (timerId) clearInterval(timerId); timerId = undefined }
function startExam(): void {
  exam = EXAM_ORDER.map((t) => { const it = pickExamChapter(t, EXAM_N); return { type: t, items: it, ans: it.map(() => null), start: 0, ms: it.map(() => 0) } })
  ec = 0; eq = 0; ephase = 'intro'; go('exam')
}
const left = () => Math.max(0, EXAM_CHAPTER_MS - (Date.now() - exam[ec].start))
const fmt = (ms: number) => `${Math.floor(ms / 60000)}:${String(Math.floor((ms % 60000) / 1000)).padStart(2, '0')}`
function tick(): void {
  stopTimer()
  timerId = window.setInterval(() => {
    const el = document.querySelector('#gtimer'); if (el) el.textContent = `⏱ ${fmt(left())} לחלק הזה`
    if (left() === 0) { stopTimer(); alert('הזמן של החלק הזה נגמר. עוברים לחלק הבא.'); nextCh() }
  }, 1000)
}
function nextCh(): void {
  stopTimer(); ec++; eq = 0
  if (ec >= exam.length) finishExam(); else { ephase = 'ch'; render() }
}
function finishExam(): void {
  stopTimer(); ec = exam.length - 1
  let ok = 0, total = 0
  exam.forEach((ch) => ch.items.forEach((it, i) => {
    const a = ch.ans[i]; total++; if (a === it.correct) ok++
    data.log.push({ at: Date.now(), date: todayKey(), area: 'gifted', type: 'g:' + it.type, itemId: it.id, answers: a == null ? [] : ['אבגד'[a]], attempts: a == null ? 0 : 1, ms: ch.ms[i], outcome: a === it.correct ? 'first' : 'help', plain: it.plain })
  }))
  data.mocks.push({ at: Date.now(), ok, total }); save(data)
  ephase = 'res'; render()
}
function renderExam(): void {
  if (ephase === 'intro') {
    shell(`<h2>מבחן דמה 📝</h2><div class="panel exam-instr"><p>5 חלקים, 10 שאלות בכל חלק. בכל שאלה בוחרים תשובה אחת מתוך 4. אם לא בטוחים – מנחשים. בכל חלק יש שעון.</p><p class="note">במבחן הדמה יש תשובה אחת לכל שאלה, בלי ניסיונות נוספים. 14 דקות לכל חלק (החלוקה שלנו).</p></div>
    <button class="primary" id="go">מתחילים</button><button class="ghost" id="back">חזרה</button>`)
    app.querySelector('#go')!.addEventListener('click', () => { ephase = 'ch'; render() })
    app.querySelector('#back')!.addEventListener('click', () => go('home')); return
  }
  if (ephase === 'ch') {
    const t = exam[ec].type
    shell(`<h2>חלק ${ec + 1}: ${GTYPE_META[t].title}</h2><div class="panel exam-instr"><strong>הוראות</strong><p>${EXAM_INSTR[t]}</p><p class="note">${EXAM_N} שאלות · 14 דקות</p></div><button class="primary" id="go">מתחילים את החלק</button>`)
    app.querySelector('#go')!.addEventListener('click', () => { exam[ec].start = Date.now(); qStart = Date.now(); ephase = 'q'; tick(); render() }); return
  }
  if (ephase === 'q') {
    const ch = exam[ec]
    shell(`<div class="g-timer" id="gtimer">⏱ ${fmt(left())} לחלק הזה</div><p class="note">חלק ${ec + 1} מתוך 5 · שאלה ${eq + 1} מתוך ${ch.items.length}</p><div id="qhost">${itemHtml(ch.items[eq])}</div>`)
    app.querySelectorAll<HTMLButtonElement>('.g-opt').forEach((b) => b.addEventListener('click', () => {
      ch.ans[eq] = Number(b.dataset.i); ch.ms[eq] = Date.now() - qStart; qStart = Date.now(); eq++
      if (eq >= ch.items.length) nextCh(); else render()
    }))
    return
  }
  let ok = 0, tot = 0
  const rows = exam.map((ch, ci) => { const g = ch.items.filter((it, i) => ch.ans[i] === it.correct).length; ok += g; tot += ch.items.length; return `<tr><td>${ci + 1}. ${GTYPE_META[ch.type].title}</td><td>${g}/${ch.items.length}</td><td>${secs(ch.ms.reduce((a, b) => a + b, 0))}</td></tr>` }).join('')
  shell(`<h2>תוצאות מבחן הדמה</h2><div class="stats"><div class="chip"><b>${ok}/${tot}</b><small>נכון</small></div></div>
  <table class="xlog-t"><tr><th>חלק</th><th>נכון</th><th>זמן</th></tr>${rows}</table>
  <p class="note">התשובות הנכונות לא מוצגות. את השאלות שהיו קשות כדאי לתרגל שוב, ולבקש ממבוגר להסביר. הפירוט המלא נמצא במסך ההורים.</p>
  <button class="primary" id="home">לדף הבית</button>`)
  app.querySelector('#home')!.addEventListener('click', () => go('home'))
}

// ---------- plan ----------
function planStart(): Date {
  if (!data.planStart) { data.planStart = dayKey(new Date()); save(data) }
  const [y, m, d] = data.planStart.split('-').map(Number); return new Date(y, m - 1, d)
}
function renderPlan(): void {
  const start = planStart(), today = new Date()
  const week = Math.min(PLAN_WEEKS, Math.max(1, weekOf(start, today)))
  const ph = phaseOf(week) || PHASES[PHASES.length - 1]
  const task = taskFor(start, today, data.log), pr = progress(start, today, data.log)
  const btn = task.kind === 'practice' ? `<button class="primary" id="doTask">${pr.todayDone ? 'עוד סבב (היום כבר בוצע ⭐)' : 'מתחילים'} ▶</button>` : task.kind === 'mock' ? `<button class="primary" id="doTask">למבחן הדמה ▶</button>` : ''
  const nxt = [...Array(7)].map((_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i + 1), t = taskFor(start, d, data.log)
    return `<div class="pl-day ${t.kind}"><b>יום&nbsp;${['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'][d.getDay()]}</b><span>${t.kind === 'rest' ? 'מנוחה' : t.kind === 'mock' ? '📝 מבחן דמה' : t.kind === 'done' ? '—' : t.text}</span></div>`
  }).join('')
  const phases = PHASES.map((p) => `<div class="pl-ph ${p === ph ? 'on' : week > p.to ? 'past' : ''}"><b>${p.name}</b><small>${p.to > p.from ? 'שבועות' : 'שבוע'}</small><small class="pl-wk" dir="ltr">${p.to > p.from ? `${p.from}–${p.to}` : p.from}</small></div>`).join('')
  shell(`<h2>🗓️ תוכנית ל-5 חודשים</h2><p class="lead">שבוע ${week} מתוך ${PLAN_WEEKS} · שלב: <b>${ph.name}</b></p>
    <div class="pl-phases">${phases}</div>
    <div class="panel pl-today"><h3>המשימה של היום</h3><p>${task.text}</p>${btn}</div>
    <div class="panel"><b>התקדמות:</b> ${pr.done} מתוך ${pr.planned} ימי תרגול בוצעו<div class="pl-bar"><i style="width:${pr.planned ? Math.round((pr.done / pr.planned) * 100) : 0}%"></i></div><small class="note">יום נחשב בוצע אחרי 10 תרגילים או יותר.</small></div>
    <p class="note">${ph.goal}</p><h3>7 הימים הבאים</h3><div class="pl-next">${nxt}</div>
    <button class="ghost" id="restart">להתחיל את התוכנית מהיום</button><button class="ghost" id="back">→ חזרה</button>`)
  app.querySelector('#back')!.addEventListener('click', () => go('home'))
  app.querySelector('#restart')!.addEventListener('click', () => { if (confirm('להתחיל את התוכנית מחדש מהיום?')) { data.planStart = dayKey(new Date()); save(data); render() } })
  app.querySelector('#doTask')?.addEventListener('click', () => { if (task.kind === 'mock') startExam(); else if (task.kind === 'practice') startPractice(task.type) })
}

// ---------- parent ----------
function renderPin(): void {
  shell(`<h2>מסך הורים 🔒</h2><p class="lead">הקוד שבחרתם:</p><input id="pin" type="password" inputmode="numeric" class="pin-in" maxlength="8"/><button class="primary" id="ok">כניסה</button><button class="ghost" id="back">חזרה</button>
  <p class="note">שכחתם את הקוד? אפשר למחוק את נתוני האתר בהגדרות הדפדפן (כל ההתקדמות תימחק).</p>`)
  const inp = app.querySelector<HTMLInputElement>('#pin')!; inp.focus()
  const ok = () => { if (inp.value === data.pin) go('parent'); else { alert('הקוד לא נכון'); inp.value = '' } }
  app.querySelector('#ok')!.addEventListener('click', ok); inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') ok() })
  app.querySelector('#back')!.addEventListener('click', () => go('home'))
}
function renderParent(): void {
  const c = conclusions(data.log, label)
  const mocks = data.mocks.slice(-5).map((m) => `<li>${new Date(m.at).toLocaleDateString('he-IL')}: ${m.ok}/${m.total}</li>`).join('')
  shell(`<h2>מסך הורים 👪</h2>
    <div class="panel" id="bline"><b>השורה התחתונה:</b> ${c.bottom}</div>
    ${c.points.length ? `<div class="panel" id="concl"><b>מסקנות:</b><ul>${c.points.map((p) => `<li>${p}</li>`).join('')}</ul></div>` : ''}
    ${mocks ? `<div class="panel"><b>מבחני דמה אחרונים:</b><ul>${mocks}</ul></div>` : ''}
    <div class="panel"><b>טיפים למחר:</b><ul>${GTYPES.map((t) => `<li><b>${GTYPE_META[t].title}:</b> ${GIFTED_TIPS[t]}</li>`).join('')}</ul></div>
    <h3>יומן תרגילים</h3><div id="xlog"></div>
    <div class="panel"><b>קוד הורים (לא חובה)</b><p class="note">${data.pin ? 'יש קוד. ' : 'אין קוד – כל אחד יכול להיכנס למסך הזה. '}הקוד נשמר רק במכשיר הזה.</p>
      <input id="npin" type="password" inputmode="numeric" maxlength="8" class="pin-in" placeholder="קוד חדש (4–8 ספרות)"/><button class="ghost" id="setpin">שמירת קוד</button>${data.pin ? '<button class="ghost" id="rmpin">ביטול הקוד</button>' : ''}</div>
    <button class="danger" id="wipe">מחיקת כל הנתונים מהמכשיר</button>
    <button class="ghost" id="back">→ חזרה</button>`)
  renderLogPanel(app.querySelector('#xlog')!, data.log, label)
  app.querySelector('#setpin')!.addEventListener('click', () => { const v = app.querySelector<HTMLInputElement>('#npin')!.value; if (!/^\d{4,8}$/.test(v)) { alert('קוד של 4 עד 8 ספרות'); return } data.pin = v; save(data); alert('הקוד נשמר'); render() })
  app.querySelector('#rmpin')?.addEventListener('click', () => { data.pin = undefined; save(data); render() })
  app.querySelector('#wipe')!.addEventListener('click', () => { if (confirm('למחוק את כל ההתקדמות מהמכשיר הזה?')) { wipe(); data = load(); go('home') } })
  app.querySelector('#back')!.addEventListener('click', () => go('home'))
}
function renderAbout(): void {
  shell(`<h2>אודות ופרטיות</h2>
  <div class="panel"><p><b>מה זה?</b> אתר תרגול חינמי לשלב ב׳ של מבחן המחוננים לכיתה ג׳. כל השאלות נכתבו במיוחד לאתר הזה.</p>
  <p><b>חשוב:</b> ${DISCLAIMER} האתר לא רשמי ואין לו שום קשר למשרד החינוך או לגוף שעורך את המבחן.</p>
  <p><b>פרטיות:</b> ${PRIVACY} אין שרת שאוסף נתונים, אין עוגיות מעקב ואין כלי ניתוח. אפשר למחוק הכול ממסך ההורים.</p>
  <p><b>מידע רשמי:</b> קישורים לאתר משרד החינוך: <a href="${OFFICIAL_DESC}" target="_blank" rel="noopener">תיאור המבחן</a> · <a href="${OFFICIAL_EX}" target="_blank" rel="noopener">מבחן לדוגמה</a> · <a href="${OFFICIAL_ANS}" target="_blank" rel="noopener">תשובות לדוגמה</a> (PDF)</p>
  <p class="note">נבנה בהתנדבות על ידי MARINA. נמצאה טעות? נשמח לשמוע.</p></div>
  <button class="ghost" id="back">→ חזרה</button>`)
  app.querySelector('#back')!.addEventListener('click', () => go('home'))
}
render()
