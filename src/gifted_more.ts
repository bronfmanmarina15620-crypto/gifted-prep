// v3 bank expansion: all items original (written / generated here). Formats learned from prep
// simulations, but no wording, numbers or images were copied. New id prefixes only.
import type { GItem, GType } from './gifted'

type H = {
  pack: (id: string, type: GType, stem: string, right: string, wrongs: string[], plain: string, r: () => number, diff?: 1 | 2 | 3) => GItem
  rng: (seed: number) => () => number
  nums: (right: number, cands: number[]) => string[]
}

// A : B = C : ?   [A, B, C, answer, wrongs, diff, kind]
export const AG: [string, string, string, string, string[], 1 | 2 | 3, string][] = [
  ['כבשה', 'צמר', 'דבורה', 'דבש', ['כוורת', 'עוקץ', 'פרח'], 1, 'produce'],
  ['רופא', 'בית חולים', 'מורה', 'בית ספר', ['תלמיד', 'לוח', 'שיעור'], 1, 'worker'],
  ['ציפור', 'קן', 'דבורה', 'כוורת', ['דבש', 'פרח', 'עוקץ'], 1, 'place'],
  ['צייר', 'מכחול', 'סופר', 'עט', ['ספר', 'קורא', 'סיפור'], 1, 'tool'],
  ['ענן', 'גשם', 'שמש', 'אור', ['ענן', 'ירח', 'ים'], 2, 'produce'],
  ['פרח', 'ורד', 'עץ', 'אלון', ['יער', 'עלה', 'שורש'], 2, 'category'],
  ['שבוע', 'יום', 'שנה', 'חודש', ['לוח שנה', 'יום הולדת', 'שעון'], 2, 'part'],
  ['מים', 'צמא', 'אוכל', 'רעב', ['צלחת', 'מטבח', 'שובע'], 2, 'need'],
  ['מספריים', 'לגזור', 'מחט', 'לתפור', ['חוט', 'בד', 'כפתור'], 1, 'tool'],
  ['לחם', 'מאפייה', 'תרופה', 'בית מרקחת', ['רופא', 'כדור', 'מחלה'], 2, 'place'],
  ['שקט', 'רעש', 'חושך', 'אור', ['לילה', 'שחור', 'צל'], 1, 'opp'],
  ['צב', 'שריון', 'קיפוד', 'קוצים', ['חרקים', 'זנב', 'גן'], 2, 'part'],
  ['נהג', 'אוטובוס', 'טייס', 'מטוס', ['שדה תעופה', 'כנף', 'נוסע'], 1, 'worker'],
  ['אריה', 'שאגה', 'כלב', 'נביחה', ['זנב', 'עצם', 'גור'], 1, 'animal'],
  ['קיץ', 'חם', 'חורף', 'קר', ['שמש', 'חופש', 'ים'], 1, 'trait'],
  ['אגם', 'מים', 'מדבר', 'חול', ['גמל', 'חום', 'נווה מדבר'], 2, 'produce'],
  ['עכבר', 'חתול', 'זבוב', 'עכביש', ['דבורה', 'פרפר', 'נמלה'], 3, 'animal'],
  ['גלגל', 'אופניים', 'כנף', 'מטוס', ['נוצה', 'שמיים', 'טייס'], 2, 'part'],
  ['שמח', 'עצוב', 'אמיץ', 'פחדן', ['גיבור', 'חזק', 'אומץ'], 2, 'opp'],
  ['קטן', 'זעיר', 'גדול', 'ענק', ['גבוה', 'רחב', 'קטן'], 2, 'similar'],
  ['ללכת', 'לרוץ', 'ללחוש', 'לצעוק', ['לדבר', 'לשתוק', 'לשמוע'], 3, 'similar'],
  ['דף', 'ספר', 'לבנה', 'קיר', ['אבן', 'בנאי', 'מלט'], 2, 'part'],
  ['קמח', 'עוגה', 'עץ', 'שולחן', ['יער', 'גזע', 'ענף'], 2, 'produce'],
  ['ספר', 'ספרייה', 'ציור', 'מוזיאון', ['צלם', 'מצלמה', 'צבע'], 2, 'place'],
  ['דג', 'סנפיר', 'ציפור', 'כנף', ['קן', 'ביצה', 'מקור'], 2, 'part'],
  ['חתול', 'מיאו', 'פרה', 'מוּ', ['חלב', 'רפת', 'עגל'], 1, 'animal'],
  ['לב', 'דם', 'משאבה', 'מים', ['חשמל', 'צינור', 'ברז'], 3, 'tool'],
  ['תלמיד', 'כיתה', 'חייל', 'צבא', ['רובה', 'מדים', 'מפקד'], 2, 'category'],
  ['סבא', 'נכד', 'אבא', 'בן', ['סבתא', 'דוד', 'אמא'], 2, 'category'],
  ['אחד', 'ראשון', 'שלושה', 'שלישי', ['שלוש', 'שלושים', 'שני'], 2, 'trait'],
  ['עיגול', 'כדור', 'ריבוע', 'קובייה', ['מלבן', 'משולש', 'פירמידה'], 3, 'category'],
  ['ספינה', 'נמל', 'מטוס', 'שדה תעופה', ['טייס', 'שמיים', 'כנף'], 1, 'place'],
  ['סכין', 'לחתוך', 'מטאטא', 'לטאטא', ['רצפה', 'אבק', 'ניקיון'], 1, 'tool'],
  ['שעון', 'זמן', 'מדחום', 'חום', ['מחלה', 'רופא', 'תרופה'], 2, 'tool'],
  ['מורה', 'מלמד', 'תלמיד', 'לומד', ['בית ספר', 'מחברת', 'מבחן'], 2, 'worker'],
  ['אצבע', 'יד', 'בוהן', 'רגל', ['ציפורן', 'נעל', 'ברך'], 2, 'part'],
  ['שעה', 'דקות', 'מטר', 'סנטימטרים', ['קילומטר', 'סרגל', 'ארוך'], 3, 'part'],
  ['הלך', 'ילך', 'אכל', 'יאכל', ['אוכל', 'אכלו', 'לאכול'], 3, 'grammar'],
  ['אש', 'כבאי', 'גנב', 'שוטר', ['כלא', 'גניבה', 'בית'], 2, 'worker'],
  ['שן', 'רופא שיניים', 'עין', 'רופא עיניים', ['משקפיים', 'ראייה', 'דמעה'], 1, 'worker'],
  ['זית', 'שמן', 'ענב', 'מיץ ענבים', ['אשכול', 'כרם', 'גפן'], 2, 'produce'],
  ['קונה', 'מוכר', 'שואל', 'עונה', ['שאלה', 'מורה', 'סקרן'], 2, 'opp'],
  ['שמש', 'יום', 'ירח', 'לילה', ['כוכב', 'שמיים', 'חלל'], 2, 'place'],
  ['נעל', 'שרוך', 'מעיל', 'כפתור', ['חורף', 'כיס', 'קולב'], 3, 'tool'],
  ['עיתון', 'חדשות', 'מפה', 'דרכים', ['מצפן', 'נייר', 'טיול'], 3, 'tool'],
  ['צלם', 'מצלמה', 'רופא', 'מזרק', ['חולה', 'מרפאה', 'אחות'], 2, 'tool'],
  ['מלפפון', 'ירק', 'תפוח', 'פרי', ['עץ', 'אדום', 'מיץ'], 1, 'category'],
  ['שלג', 'לבן', 'פחם', 'שחור', ['אש', 'חם', 'בוער'], 1, 'trait'],
  ['ראש', 'כובע', 'יד', 'כפפה', ['אצבע', 'מרפק', 'כתף'], 1, 'need'],
  ['מוקדם', 'מאוחר', 'התחלה', 'סוף', ['אמצע', 'ראשון', 'פתיחה'], 1, 'opp'],
  ['רעב', 'לאכול', 'עייף', 'לישון', ['לרוץ', 'לשחק', 'לקום'], 2, 'need'],
  ['עוגה', 'תנור', 'גלידה', 'מקפיא', ['קיץ', 'גביע', 'מתוק'], 2, 'place'],
  ['נמל', 'ספינות', 'תחנת רכבת', 'רכבות', ['כבישים', 'כרטיסים', 'נהגים'], 2, 'place'],
  ['מילה', 'אותיות', 'משפט', 'מילים', ['נקודה', 'פסקה', 'שפה'], 2, 'part'],
  ['צמא', 'שותה', 'חולה', 'לוקח תרופה', ['משתעל', 'מתעטש', 'חום'], 3, 'need'],
  ['חיפושית', 'חרק', 'כריש', 'דג', ['ים', 'שן', 'לווייתן'], 2, 'category'],
  ['יולי', 'קיץ', 'ינואר', 'חורף', ['אביב', 'סתיו', 'שנה'], 3, 'category'],
  ['עכשיו', 'אז', 'כאן', 'שם', ['פה', 'עכשיו', 'קרוב'], 3, 'opp'],
  ['זהב', 'צהוב', 'כסף', 'כסוף', ['ארנק', 'זול', 'מטבע'], 3, 'trait'],
  ['מים', 'לשחות', 'שלג', 'לגלוש', ['לשתות', 'קר', 'לבן'], 2, 'need'],
  ['חתן', 'כלה', 'מלך', 'מלכה', ['נסיך', 'כתר', 'ארמון'], 1, 'category'],
  ['שקר', 'שקרן', 'פחד', 'פחדן', ['אומץ', 'מפחיד', 'גיבור'], 3, 'trait'],
  ['מחברת', 'דפים', 'שרשרת', 'חרוזים', ['צוואר', 'תכשיט', 'סוגר'], 2, 'part'],
  ['לבן', 'שחור', 'יום', 'לילה', ['בוקר', 'שמש', 'ערב'], 1, 'opp'],
  ['תינוק', 'עריסה', 'אפרוח', 'קן', ['ביצה', 'כנף', 'תרנגולת'], 1, 'place'],
  ['מברג', 'בורג', 'פטיש', 'מסמר', ['עץ', 'נגר', 'קיר'], 2, 'tool'],
  ['עשר', 'מאה', 'מאה', 'אלף', ['מיליון', 'עשר', 'אפס'], 3, 'part'],
]

// [sentence with ___, right, wrongs]
export const SC: [string, string, string[]][] = [
  ['הלווייתן חי בים, ___ הוא אינו ___ אלא יונק.', 'אבל / דג', ['ולכן / דג', 'אבל / יונק', 'כי / ציפור']],
  ['כדי לראות את הכוכבים טוב יותר, השתמשנו ב___.', 'טלסקופ', ['מיקרוסקופ', 'מצפן', 'מדחום']],
  ['הזמר עמד על ה___ ושר מול ה___.', 'במה / קהל', ['במה / במה', 'כיסא / מראה', 'מגרש / שופט']],
  ['הגננת ביקשה מהילדים ___ את הצעצועים בסוף היום.', 'לסדר', ['לפזר', 'לשבור', 'להסתיר']],
  ['מי שלא מכיר את הדרך יכול להיעזר ב___.', 'מפה', ['מטרייה', 'מסרק', 'מחבת']],
  ['השוקולד ___ כי השארנו אותו בשמש החמה.', 'נמס', ['קפא', 'גדל', 'התייבש']],
  ['הנמלים אוספות מזון בקיץ, ___ שיהיה להן מה לאכול ב___.', 'כדי / חורף', ['למרות / חורף', 'כדי / קיץ', 'אבל / אביב']],
  ['סבתא ___ סוודר בעזרת מסרגות וחוט צמר.', 'סרגה', ['תפרה במכונה', 'גזרה', 'גיהצה']],
  ['הכבאים ___ את השריפה בעזרת ___.', 'כיבו / מים', ['הדליקו / מים', 'כיבו / שמן', 'צילמו / מים']],
  ['דני היה ___ מאוד, ולכן אכל שתי צלחות מרק.', 'רעב', ['שבע', 'מנומנם', 'כועס']],
  ['בחורף הדובים ___ במערה עד בוא ה___.', 'ישנים / אביב', ['רוקדים / אביב', 'ישנים / סתיו', 'צדים / קיץ']],
  ['המשחק ___ בגלל הגשם, ונקבע ל___ הבא.', 'נדחה / שבוע', ['התקיים / שבוע', 'נדחה / אתמול', 'הסתיים / שעה']],
  ['שירה ___ את השיר בעל פה, ולכן לא הייתה צריכה את ה___.', 'ידעה / דף', ['שכחה / דף', 'ידעה / שיר', 'לא ידעה / מורה']],
  ['הצבע האהוב על נוי הוא ירוק, ___ הפעם היא בחרה בחולצה ___.', 'אבל / אדומה', ['ולכן / אדומה', 'אבל / ירוקה', 'כי / ירוקה']],
  ['אחרי שה___ שקעה, השמיים נעשו ___.', 'שמש / חשוכים', ['שמש / בהירים', 'ירח / חשוכים', 'עננה / כחולים']],
  ['האופניים של עומר ___, ולכן הוא הלך לבית הספר ___.', 'התקלקלו / ברגל', ['תוקנו / ברגל', 'התקלקלו / באופניים', 'נקנו / ברגל']],
  ['הילדים ___ בתור בסבלנות עד שהגיע ___.', 'עמדו / תורם', ['רבו / תורם', 'עמדו / מחר', 'ישבו / אתמול']],
  ['הרופאה ___ לי לשתות הרבה מים, ___ אני מצוננת.', 'המליצה / כי', ['אסרה / כי', 'המליצה / למרות ש', 'שכחה / כי']],
  ['הלחם שיצא עכשיו מהתנור עדיין ___.', 'חם', ['קפוא', 'ישן', 'רטוב']],
  ['בספרייה מבקשים לדבר ב___.', 'שקט', ['צעקות', 'שירה', 'רעש']],
  ['ציפורים רבות ___ לארצות חמות כשמתחיל ה___.', 'נודדות / סתיו', ['נודדות / קיץ', 'ישנות / סתיו', 'שוחות / חורף']],
  ['למרות שהמבחן היה ___, כל הכיתה ___ בו.', 'קשה / הצליחה', ['קל / הצליחה', 'קשה / נכשלה', 'קצר / הצליחה']],
  ['ליה שכחה את ה___ בבית, ולכן לא יכלה לפתוח את הדלת.', 'מפתח', ['מטרייה', 'מחברת', 'כובע']],
  ['ה___ מראה לנו מה השעה.', 'שעון', ['מצפן', 'סרגל', 'משקל']],
  ['הים היה ___, ולכן המציל ___ להיכנס למים.', 'סוער / אסר', ['רגוע / אסר', 'סוער / הרשה', 'שקט / ביקש']],
  ['העץ ___ את עליו בסתיו, ו___ צומחים לו עלים חדשים.', 'משיר / באביב', ['מגדל / באביב', 'משיר / בסתיו', 'צובע / בלילה']],
  ['אורי ___ את כוס המים, ___ הרצפה הייתה רטובה.', 'שפך / ולכן', ['שתה / ולכן', 'שפך / אבל', 'מילא / למרות זאת']],
  ['כשנכנסנו למערה החשוכה, הדלקנו ___.', 'פנס', ['מאוורר', 'מקרר', 'רדיו']],
  ['ה___ שומר על הכבשים בשדה.', 'רועה', ['דייג', 'טבח', 'טייס']],
  ['אי אפשר לשחק כדורגל ___ כדור.', 'בלי', ['עם', 'בזכות', 'בגלל']],
  ['אחי ___ ממני בשנתיים, כלומר הוא נולד ___.', 'מבוגר / לפניי', ['צעיר / לפניי', 'מבוגר / אחריי', 'גבוה / אחריי']],
  ['בצהריים השמש ___ גבוה בשמיים, ובערב היא ___.', 'נמצאת / שוקעת', ['זורחת / עולה', 'נמצאת / זורחת', 'שוקעת / עולה']],
  ['הצמח ___ כי שמנו אותו ליד החלון, שם יש הרבה ___.', 'גדל יפה / אור', ['נבל / אור', 'גדל יפה / חושך', 'קמל / מים']],
  ['מיכאל ___ את הסיפור ב___ רם לכל הכיתה.', 'הקריא / קול', ['כתב / קול', 'הקריא / שקט', 'שמע / קול']],
  ['הגשר נבנה כדי ש___ יוכלו לעבור מעל ה___.', 'מכוניות / נהר', ['דגים / נהר', 'מכוניות / שמיים', 'ציפורים / גשר']],
  ['בגלל ה___ הכבד, הנהגים נסעו לאט.', 'ערפל', ['שמש', 'שקט', 'חופש']],
  ['עדן קמה מוקדם ___ להספיק לראות את ה___.', 'כדי / זריחה', ['כדי / שקיעה', 'למרות / זריחה', 'אבל / ירח']],
  ['הספינה ___ בנמל, והמלחים ___ ממנה לחוף.', 'עגנה / ירדו', ['הפליגה / ירדו', 'עגנה / עלו', 'טסה / ירדו']],
  ['הכלב ___ כשראה את הדוור, ___ הוא לא מכיר אותו.', 'נבח / כי', ['שמח / כי', 'נבח / למרות ש', 'ישן / כי']],
  ['אמא ביקשה שאביא ___ כדי לפרוס את הלחם.', 'סכין', ['כף', 'מזלג', 'קש']],
  ['השלולית ___ כשהשמש יצאה אחרי ה___.', 'התייבשה / גשם', ['גדלה / גשם', 'קפאה / גשם', 'התייבשה / שקיעה']],
  ['האוטובוס היה ___, ולא נשאר בו אף מקום ___.', 'מלא / פנוי', ['ריק / פנוי', 'מלא / תפוס', 'מהיר / פנוי']],
  ['נועם ניצח במרוץ, ___ הוא היה ה___ מכולם.', 'כי / מהיר', ['כי / איטי', 'אבל / מהיר', 'למרות ש / מהיר']],
  ['אחרי שגמרנו לאכול, ___ את הכלים ___.', 'שטפנו / בכיור', ['לכלכנו / בכיור', 'שטפנו / בארון', 'שברנו / בכיור']],
  ['גיל ___ את הכדור גבוה, ו___ תפס אותו.', 'זרק / חברו', ['תפס / חברו', 'זרק / הכדור', 'בעט / השער']],
  ['הספר היה ארוך מאוד, ___ ___ אותו בשבוע אחד.', 'ובכל זאת / קראתי', ['כלומר / קצר', 'ובכל זאת / לא פתחתי', 'כי / קראתי']],
  ['החדר ___ אחרי שפתחנו את החלון והרוח ___ פנימה.', 'התאוורר / נכנסה', ['התחמם / יצאה', 'התאוורר / נעצרה', 'נסגר / נכנסה']],
  ['כדי לשמור על השיניים, ___ אותן פעמיים ב___.', 'מצחצחים / יום', ['מצחצחים / שנה', 'שוברים / יום', 'צובעים / שבוע']],
]

export const SEEN = new Set<string>()
export function keepUnique(items: GItem[], n: number, prefix: string): GItem[] {
  const out: GItem[] = []
  for (const it of items) {
    // drawings: compare without the one-line instruction (it is replaced later), stories: full text
    const stem = it.type === 'numshape' || it.type === 'figural' ? it.stem.replace(/<div class="g-sent">[^<]*<\/div>/g, '') : it.stem
    const sig = stem + '|' + [...it.options].sort().join('|')
    if (SEEN.has(sig) || new Set(it.options).size !== 4) continue
    SEEN.add(sig); it.id = prefix + out.length; out.push(it)
    if (out.length === n) break
  }
  return out
}
const hhmm = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`

function buildWordQ(h: H): GItem[] {
  const r = h.rng(9301)
  const ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  const out: GItem[] = []
  const T: ((i: number) => { s: string; right: string; wr: string[]; d: 1 | 2 | 3; kind: string })[] = [
    () => { const st = ri(7, 15) * 60 + ri(0, 3) * 15; const du = ri(1, 3) * 60 + [15, 30, 45, 20, 40][ri(0, 4)]; const e = st + du
      return { s: `${['בניית הדגם','האפייה','ההליכה','החזרה להצגה','מסיבת הכיתה'][ri(0, 4)]} התחילה בשעה ${hhmm(st)} ונמשכה ${Math.floor(du / 60)} שעות ו־${du % 60} דקות בלי הפסקה. באיזו שעה זה נגמר?`, right: hhmm(e), wr: [hhmm(e - 60), hhmm(e + 10), hhmm(e - du % 60)], d: 2, kind: 'wtime' } },
    () => { const st = ri(8, 16) * 60 + ri(0, 5) * 10; const du = ri(3, 11) * 10 + ri(0, 1) * 60; const e = st + du
      return { s: `ההצגה בחוג התחילה בשעה ${hhmm(st)} ונגמרה בשעה ${hhmm(e)}. כמה דקות נמשכה ההצגה?`, right: String(du), wr: h.nums(du, [du + 10, du - 10, du + 60, du - 20]), d: du > 60 ? 3 : 2, kind: 'wtime' } },
    () => { const a = ri(3, 9), b = ri(2, 8), t = ri(2, 5); const v = (a + b) * t
      return { s: `מכונה אחת אורזת ${a} קופסאות בשעה, ומכונה שנייה אורזת ${b} קופסאות בשעה. כמה קופסאות יארזו שתי המכונות יחד ב־${t} שעות?`, right: String(v), wr: h.nums(v, [a * t + b, a + b + t, (a + b) * (t + 1), (a + b) * (t - 1)]), d: 2, kind: 'wrate' } },
    () => { const n = ri(2, 6), p = ri(3, 9), m = ri(2, 5), q = ri(4, 12); const v = n * p + m * q
      return { s: `בחנות הספרים מחברת עולה ${p} ₪ ועט עולה ${q} ₪. קנו ${n} מחברות ו־${m} עטים. כמה שילמו בסך הכול?`, right: String(v), wr: h.nums(v, [n * q + m * p, (n + m) * p, v + p, v - q]), d: 2, kind: 'wratio' } },
    () => { const n = ri(3, 8), each = ri(3, 9), extra = ri(2, 6) * n; const a = n * each - extra
      return { s: `בקופסה היו ${a} מדבקות, וסבא הוסיף עוד ${extra}. אם מחלקים את כל המדבקות שווה בשווה בין ${n} ילדים, כמה מדבקות יקבל כל ילד?`, right: String(each), wr: h.nums(each, [each + 1, each - 1, Math.floor(a / n), each + 2]), d: 2, kind: 'wmissing' } },
    () => { const y = ri(4, 9), k = ri(2, 6), m = ri(2, 3); const old = y + k, v = old * m
      return { s: `נועה בת ${y}. אחיה הגדול מבוגר ממנה ב־${k} שנים, וגיל אבא גדול פי ${m} מגיל האח הגדול. בן כמה אבא?`, right: String(v), wr: h.nums(v, [y * m, v + k, old + m, v - m]), d: 3, kind: 'wratio' } },
    () => { const a = ri(3, 8); const k = ri(1, 4); const tot = a + (a + k) + 2 * a + ri(5, 20); const rest = tot - a - (a + k) - 2 * a
      return { s: `בסל היו ${tot} תפוחים. ביום ראשון אכלו ${a}, ביום שני ${k} יותר מביום ראשון, וביום שלישי פי 2 ממה שאכלו ביום ראשון. כמה תפוחים נשארו?`, right: String(rest), wr: h.nums(rest, [rest + k, rest - a, tot - 3 * a, rest + 2]), d: 3, kind: 'wstory' } },
    () => { const x = ri(3, 9), k = ri(5, 30); const v = x * x + k
      return { s: `חשבתי על מספר. כפלתי אותו בעצמו והוספתי ${k}. יצא ${v}. על איזה מספר חשבתי?`, right: String(x), wr: h.nums(x, [x + 1, x - 1, Math.floor((v - k) / 2), x + 2]), d: 3, kind: 'wmissing' } },
    () => { const per = ri(2, 6), unit = [2, 3, 4, 5][ri(0, 3)], times = ri(3, 7); const v = per * times
      return { s: `כדי לצבוע ${unit} מטרים של גדר צריך ${per} פחיות צבע. כמה פחיות צריך כדי לצבוע ${unit * times} מטרים?`, right: String(v), wr: h.nums(v, [per + times, v + per, unit * times, v - per]), d: 2, kind: 'wratio' } },
    () => { const hrs = ri(2, 5), days = ri(3, 6), off = ri(1, 2); const v = hrs * (days - off)
      return { s: `יעל מתאמנת בשחייה ${hrs} שעות בכל יום, ${days} ימים בשבוע. השבוע היא הייתה חולה ${off === 1 ? 'יום אחד' : 'יומיים'} ולא התאמנה בהם. כמה שעות התאמנה השבוע?`, right: String(v), wr: h.nums(v, [hrs * days, v + hrs, days - off + hrs, v - 1]), d: 1, kind: 'wstory' } },
    () => { const pr = ri(2, 9) + 0.5, n = 2 * ri(1, 4); const v = pr * n
      return { s: `כדור קטן עולה ${pr} ₪. כמה עולים ${n} כדורים כאלה?`, right: String(v), wr: [String(v + 0.5), String(v - 1), String(Math.floor(pr) * n)].filter((x) => x !== String(v)), d: 3, kind: 'wratio' } },
  ]
  for (let i = 0; i < 400; i++) {
    const t = T[i % T.length](i)
    const wr = [...new Set(t.wr.filter((w) => w !== t.right))]
    while (wr.length < 3) wr.push(String(Number(t.right.replace(':', '')) + wr.length + 3))
    const it = h.pack(`wq${i}`, 'word', `<div class="g-sent">${t.s}</div>`, t.right, wr, `בעיה: ${t.s}`, r, t.d)
    it.kind = t.kind
    out.push(it)
  }
  return keepUnique(out, 110, 'wq')
}

// clockwise ring of numbers
export function ringSvg(vals: (number | null)[]): string {
  const n = vals.length, c = 90, R = 62
  let s = `<circle cx="${c}" cy="${c}" r="${R}" fill="none" stroke="#aab" stroke-width="2" stroke-dasharray="4 4"/>`
  vals.forEach((v, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / n
    const x = c + R * Math.cos(a), y = c + R * Math.sin(a)
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="19" fill="${i === 0 ? '#ffe08a' : '#fff'}" stroke="#223" stroke-width="2"/><text x="${x.toFixed(1)}" y="${(y + 6).toFixed(1)}" text-anchor="middle" font-size="17" font-weight="700" fill="#223">${v === null ? '?' : v}</text>`
  })
  s += `<path d="M${c + 18} ${c - 8} A 20 20 0 1 1 ${c - 14} ${c - 14}" fill="none" stroke="#e67" stroke-width="3"/><polygon points="${c - 20},${c - 14} ${c - 8},${c - 20} ${c - 10},${c - 6}" fill="#e67"/>`
  return `<svg viewBox="0 0 180 180" width="180" height="180" class="g-svg">${s}</svg>`
}

function buildNumMore(h: H): GItem[] {
  const out: GItem[] = []
  const r = h.rng(9401)
  const ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  // ring series
  const ring: GItem[] = []
  for (let i = 0; i < 135; i++) {
    const d: 1 | 2 | 3 = i % 3 === 0 ? 1 : i % 3 === 1 ? 2 : 3
    const n = d === 1 ? 5 : 6
    const a = ri(1, 20)
    const k = d === 1 ? ri(2, 5) : d === 2 ? ri(3, 9) * (r() < 0.3 ? -1 : 1) : ri(2, 6)
    let vals: number[]
    if (d === 3) { const k2 = ri(1, 3); vals = [a]; for (let j = 1; j < n; j++) vals.push(vals[j - 1] + k + (j - 1) * k2) } // growing steps
    else vals = Array.from({ length: n }, (_, j) => a + j * k + (k < 0 ? 60 : 0))
    const miss = ri(2, n - 1)
    const right = vals[miss]
    const step = vals[miss] - vals[miss - 1]
    const shown = vals.map((v, j) => (j === miss ? null : v))
    const it = h.pack(`nr${i}`, 'numshape', `<div class="g-sent">המספרים מסודרים בעיגול לפי כיוון השעון (מתחילים מהעיגול הצהוב).</div>${ringSvg(shown)}`, String(right),
      h.nums(right, [right + 1, right - 1, right + step, right - step, right + 2]), `עיגול מספרים: ${shown.map((v) => v ?? '?').join(', ')}`, r, d)
    it.kind = 'nring'; it.prompt = 'איזה מספר חסר בעיגול?'
    ring.push(it)
  }
  out.push(...keepUnique(ring, 45, 'nr'))
  const chains: GItem[] = []
  // arrow chains: each arrow = same operation
  const box = (v: number | string) => `<span class="g-chbox">${v}</span>`
  const arr = (k: number) => `<span class="g-charr">${'➜'.repeat(k)}</span>`
  for (let i = 0; i < 135; i++) {
    const d: 1 | 2 | 3 = i % 3 === 0 ? 1 : i % 3 === 1 ? 2 : 3
    const mult = d === 3 && i % 2 === 1
    const k = mult ? 2 : d === 1 ? ri(1, 4) : ri(3, 9)
    const f = (x: number, times: number) => (mult ? x * 2 ** times : x + k * times)
    const x0 = mult ? ri(1, 3) : ri(1, 15)
    const y0 = mult ? ri(1, 4) : ri(2, 20)
    const ex = `${box(x0)}${arr(1)}${box(f(x0, 1))}${arr(2)}${box(f(x0, 3))}`
    const q1 = f(y0, 2), right = f(q1, 3)
    const q = `${box(y0)}${arr(2)}${box(q1)}${arr(3)}${box('?')}`
    const per = mult ? 0 : k
    const it = h.pack(`nx${i}`, 'numshape', `<div class="g-sent">כל חץ ➜ הוא אותו תרגיל. עוד חץ = עוד פעם אותו תרגיל.</div><div class="g-chain">${ex}</div><div class="g-chain">${q}</div>`, String(right),
      h.nums(right, mult ? [q1 * 2, q1 * 3, right + 2, right / 2 + q1] : [q1 + per, q1 + 2 * per, right + per, right - 1]), `שרשרת חצים: ${y0} ➜➜ ${q1} ➜➜➜ ?`, r, d)
    it.kind = 'nchain'; it.prompt = 'איזה מספר חסר בסוף השרשרת?'
    chains.push(it)
  }
  out.push(...keepUnique(chains, 45, 'nx'))
  // 3-column table: left -> middle (first rule) -> right (second rule)
  type Op = { t: string; f: (x: number) => number | null }
  const ops = (): Op[] => [
    ...[2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => ({ t: `+${k}`, f: (x: number) => x + k })),
    ...[2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => ({ t: `-${k}`, f: (x: number) => (x - k > 0 ? x - k : null) })),
    ...[2, 3].map((k) => ({ t: `×${k}`, f: (x: number) => x * k })),
    ...[2, 3].map((k) => ({ t: `÷${k}`, f: (x: number) => (x % k === 0 ? x / k : null) })),
  ]
  const OPS = ops()
  let made = 0, tries = 0
  while (made < 45 && tries < 20000) {
    tries++
    const d: 1 | 2 | 3 = made < 15 ? 1 : made < 30 ? 2 : 3
    const o1 = OPS[ri(0, d === 1 ? 8 : OPS.length - 1)], o2 = OPS[ri(d === 1 ? 0 : 9, OPS.length - 1)]
    const rows: number[][] = []
    let bad = false
    for (let j = 0; j < 3; j++) {
      const a = ri(2, 20); const m = o1.f(a); if (m === null) { bad = true; break }
      const z = o2.f(m); if (z === null || z > 99) { bad = true; break }
      rows.push([a, m, z])
    }
    if (bad) continue
    if (new Set(rows.map((x) => x[1])).size < 3) continue
    // solver: rule from middle to right must be the only op fitting both example rows; same for left->middle
    const fits = (i0: number, i1: number) => OPS.filter((o) => rows.slice(0, 2).every((x) => o.f(x[i0]) === x[i1])).length
    if (fits(1, 2) !== 1 || fits(0, 1) !== 1) continue
    const right = rows[2][2]
    const cell = (v: number | string) => `<td>${v}</td>`
    const tbl = `<table class="g-numgrid g-arrowgrid" dir="ltr">${rows.map((x, j) => `<tr>${cell(x[0])}${cell('➜')}${cell(x[1])}${cell('➜')}${cell(j === 2 ? '?' : x[2])}</tr>`).join('')}</table>`
    const it = h.pack(`nz${made}`, 'numshape', `<div class="g-sent">בכל שורה עושים אותו דבר: משמאל לאמצע תרגיל אחד, ומהאמצע לימין תרגיל אחר.</div>${tbl}`, String(right),
      h.nums(right, [o1.f(right) ?? right + 3, right + 1, right - 2, rows[2][1], right * 2]), `טבלת שני שלבים: ${rows.map((x) => x.join(' ➜ ')).join(' | ')}`, r, d)
    it.kind = 'ntwostep'; it.prompt = 'איזה מספר חסר בטבלה?'
    out.push(it); made++
  }
  return out
}

// odd one out (figural)
function poly(sides: number, opts: { size?: number; rot?: number; dots?: number; fill?: string } = {}): string {
  const box = 70, c = 35, s = opts.size ?? 24, rot = ((opts.rot ?? 0) * Math.PI) / 180
  let body: string
  if (sides === 0) body = `<circle cx="${c}" cy="${c}" r="${s}" fill="${opts.fill ?? '#9fd3ff'}" stroke="#223" stroke-width="2"/>`
  else {
    const pts = Array.from({ length: sides }, (_, i) => { const a = -Math.PI / 2 + rot + (2 * Math.PI * i) / sides; return `${(c + s * Math.cos(a)).toFixed(1)},${(c + s * Math.sin(a)).toFixed(1)}` }).join(' ')
    body = `<polygon points="${pts}" fill="${opts.fill ?? '#9fd3ff'}" stroke="#223" stroke-width="2"/>`
  }
  let dots = ''
  const n = opts.dots ?? 0
  for (let i = 0; i < n; i++) { const cols = n > 4 ? 3 : 2; const x = c - (cols - 1) * 5 + (i % cols) * 10; const y = c - 4 + Math.floor(i / cols) * 9; dots += `<circle cx="${x}" cy="${y}" r="3.2" fill="#223"/>` }
  return `<svg viewBox="0 0 ${box} ${box}" width="${box}" height="${box}" class="g-svg">${body}${dots}</svg>`
}

function buildOdd(h: H): GItem[] {
  const out: GItem[] = []
  const r = h.rng(9501)
  const ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  const pick = <T,>(a: T[]) => a.splice(ri(0, a.length - 1), 1)[0]
  const FILLS = ['#9fd3ff', '#ffd59f', '#b9f0c0', '#f5b8d0', '#d8c8ff', '#fff3a0']
  for (let i = 0; i < 600; i++) {
    const v = i % 3
    const fill = FILLS[ri(0, FILLS.length - 1)], rr = ri(0, 5) * 15
    let right = '', wr: string[] = [], d: 1 | 2 | 3 = 1, plain = ''
    if (v === 0) { // same shape (turned / bigger) vs different shape
      const pool = [0, 3, 4, 5, 6]; const a = pick(pool), b = pick(pool)
      const sizes = [16, 20, 24]; const sz = () => sizes[ri(0, 2)]
      const s1 = sz()
      wr = [poly(a, { size: 16, rot: ri(0, 3) * 20, fill }), poly(a, { size: 20, rot: ri(0, 3) * 20, fill }), poly(a, { size: 24, rot: ri(0, 3) * 20, fill })]
      right = poly(b, { size: s1, rot: ri(0, 3) * 20, fill }); d = 1; plain = 'יוצא דופן: צורה שונה'
    } else if (v === 1) { // same number of dots, one differs; all shapes different
      const pool = [0, 3, 4, 5, 6]; const n = ri(2, 5); const odd = n + (r() < 0.5 ? 1 : -1)
      wr = [poly(pick(pool), { dots: n, fill, rot: rr }), poly(pick(pool), { dots: n, fill, rot: rr }), poly(pick(pool), { dots: n, fill, rot: rr })]
      right = poly(pick(pool), { dots: odd, fill, rot: rr }); d = 2; plain = 'יוצא דופן: מספר נקודות'
    } else { // dots = number of sides, one breaks it
      const pool = [3, 4, 5, 6]; const sides = [pick(pool), pick(pool), pick(pool)]; const os = pick(pool)
      wr = sides.map((s) => poly(s, { dots: s, rot: rr, fill }))
      right = poly(os, { dots: os + (os === 6 ? -1 : r() < 0.5 ? 1 : -1), rot: rr, fill }); d = 3; plain = 'יוצא דופן: נקודות וצלעות'
    }
    const it = h.pack(`fo${i}`, 'figural', `<div class="g-sent">שלוש צורות דומות לפי כלל אחד, ואחת שונה מהן.</div>`, right, wr, plain, r, d)
    it.kind = 'fodd'; it.prompt = 'איזו צורה יוצאת דופן?'
    out.push(it)
  }
  // balance the three rules: take items round-robin by rule
  const byV = [0, 1, 2].map((v) => out.filter((_, i) => i % 3 === v))
  const mix: GItem[] = []
  for (let i = 0; i < 200; i++) for (const g of byV) if (g[i]) mix.push(g[i])
  return keepUnique(mix, 60, 'fo')
}

export function buildMore(h: H): GItem[] {
  const r1 = h.rng(9101)
  const ag = AG.map(([a, b, c, right, wr, d, kind], i) => {
    const it = h.pack(`ag${i}`, 'analogy', `<div class="g-big">${a} : ${b}</div><div class="g-big">${c} : ______</div>`, right, wr, `השלמת קשר: ${a} : ${b} / ${c} : ?`, r1, d)
    it.kind = kind; it.prompt = 'איזו מילה משלימה את הזוג השני באותו קשר?'
    return it
  })
  const r2 = h.rng(9201)
  const sc = SC.map(([s, right, wr], i) => {
    const blanks = (s.match(/___/g) || []).length
    const it = h.pack(`sc${i}`, 'sentence', `<div class="g-sent">${s}</div>`, right, wr, `השלמת משפט: ${s}`, r2, blanks >= 2 && /אבל|למרות|כי|כדי|ולכן|ובכל זאת|כלומר/.test(right) ? 3 : blanks >= 2 ? 2 : 1)
    it.kind = /\b(אבל|למרות|כי|כדי|ולכן|ובכל זאת|כלומר)/.test(right) ? 'sconn' : 'svocab'
    return it
  })
  return [...ag, ...sc, ...buildWordQ(h), ...buildNumMore(h), ...buildOdd(h)]
}
