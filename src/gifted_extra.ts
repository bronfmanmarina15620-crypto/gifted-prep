// v7 bank expansion (Nov 14): thin sub-types brought up to ~30-40 questions with all 3 levels.
// Everything here is written / generated for this app. New id prefixes only.
import type { GItem, GType } from './gifted'
import { keepUnique, ringSvg } from './gifted_more'
import { buildBranch } from './gifted_official'

type H = {
  pack: (id: string, type: GType, stem: string, right: string, wrongs: string[], plain: string, r: () => number, diff?: 1 | 2 | 3) => GItem
  rng: (seed: number) => () => number
  nums: (right: number, cands: number[]) => string[]
}
type D = 1 | 2 | 3

// ---------- word relations, fill format  A : B = C : ?   "A|B|C|answer|w1,w2,w3|level"
const AH: Record<string, string> = {
  grammar: `ילד|ילדים|ספר|ספרים|ספרייה,סופר,ספר|1
כלב|כלבים|חתול|חתולים|חתולה,חתלתול,חתול|1
ילד|ילדה|תלמיד|תלמידה|תלמידים,מורה,כיתה|1
סוס|סוסה|תרנגול|תרנגולת|ביצה,אפרוח,תרנגולים|2
עץ|עצים|פרח|פרחים|פריחה,גינה,פרח|1
בית|בתים|עיר|ערים|כפר,עיר,רחוב|2
אכלתי|אוכל|שתיתי|שותה|שתייה,אשתה,שתינו|3
רץ|ירוץ|שר|ישיר|שירה,שרים,שר|2
כתבתי|אכתוב|קראתי|אקרא|קורא,קריאה,קראנו|2
גדול|גדולה|קטן|קטנה|קטנים,זעיר,גדולה|1
שמח|שמחה|עצוב|עצובה|עצובים,בוכה,שמחה|1
שולחן|שולחנות|חלון|חלונות|דלת,חלונית,חלון|2
אחד|אחת|שלושה|שלוש|שלושים,שלישי,שלושתם|3
אני|אנחנו|הוא|הם|היא,אתם,אתה|2
אתמול|הלכתי|מחר|אלך|הולך,הלכתי,ללכת|2
נמלה|נמלים|דבורה|דבורים|כוורת,דבש,דבורה|1
כתב|כותב|צייר|מצייר|ציור,יצייר,צבע|3
תפוח|תפוחים|אגס|אגסים|עץ,פרי,אגס|1
גבוה|הכי גבוה|חזק|הכי חזק|חזקה,חלש,כוח|2
שותה|שתה|אוכל|אכל|יאכל,אוכלת,לאכול|2
ראיתי|רואה|שמעתי|שומע|שמיעה,ישמע,אוזן|2
מלך|מלכה|נסיך|נסיכה|נסיכים,ארמון,כתר|1
פעם|פעמיים|יום|יומיים|ימים,שבוע,יום|3
עין|עיניים|אוזן|אוזניים|אף,שמיעה,אוזן|2
לרוץ|רץ|לשחות|שוחה|שחייה,ים,בריכה|2
ילדה|ילדות|בובה|בובות|צעצוע,משחק,בובה|1
חכם|חכמים|חזק|חזקים|חזקה,חזק,כוח|2
מחר|אשחק|אתמול|שיחקתי|משחק,שחקן,אשחק|2
היא|הן|הוא|הם|אנחנו,אתן,היא|3
אמא|אמהות|אבא|אבות|סבא,הורים,אבא|3`,
  trait: `לימון|חמוץ|סוכר|מתוק|לבן,קמח,עוגה|1
קרח|קר|תנור|חם|אפייה,מטבח,לחם|1
נוצה|קלה|אבן|כבדה|חצץ,קיר,בונה|2
צב|איטי|צ'יטה|מהיר|נקודות,טורף,אפריקה|2
שמיים|כחולים|דשא|ירוק|גינה,פרה,כיסוח|1
דבש|מתוק|מלח|מלוח|ים,פלפל,אוכל|2
סכין|חדה|כרית|רכה|שינה,מיטה,נוצות|2
ענק|גבוה|גמד|נמוך|זקן,יער,כובע|2
פיל|כבד|נמלה|קלה|חרק,קן,עבודה|2
מדבר|יבש|ים|רטוב|דגים,חוף,גלים|2
ברזל|קשה|ספוג|רך|מים,כלים,צהוב|2
יום|בהיר|לילה|חשוך|ירח,כוכבים,שינה|1
לווייתן|ענק|עכבר|קטן|גבינה,חור,זנב|1
פלפל|חריף|גלידה|קרה|גביע,קיץ,כדור|2
קיפוד|דוקר|ארנבון|רך|גזר,קופץ,אוזניים|3
נהר|זורם|אגם|עומד|מים,דגים,סירה|3
חלב|לבן|דם|אדום|לב,פצע,וריד|1
נחש|ארוך|כדור|עגול|משחק,בעיטה,רגל|2
מגהץ|חם|מקרר|קר|מטבח,חלב,חשמל|1
עוגה|אוכלים|מיץ|שותים|כוס,תפוז,מתוק|1
מגלשה|גולשים|נדנדה|מתנדנדים|יושבים,גן,משחקים|2
מכונית|נוסעת|מטוס|טס|שדה,טייס,כנף|1
קוסם|מפתיע|ליצן|מצחיק|קרקס,אף,בלון|3
אש|שורפת|מים|מרטיבים|כוס,ברז,כחולים|3`,
  similar: `קר|קפוא|חם|רותח|פושר,קר,אש|1
רוח קלה|סופה|טפטוף|מבול|ענן,מטרייה,שלולית|3
שמח|עליז|חכם|נבון|ספר,מורה,שאלה|2
נחל|נהר|גבעה|הר|עמק,שביל,טיול|2
בית|ארמון|סירה|אונייה|משוט,ים,דייג|2
כפר|עיר|שביל|כביש|הליכה,מכונית,עץ|2
לחייך|לצחוק|לזמזם|לשיר|לשמוע,דבורה,לשתוק|3
לחש|צעקה|ניצוץ|שריפה|גפרור,עשן,כבאי|3
טוב|מצוין|רע|נורא|טוב,רשע,בכי|2
גשם|מטר|שמש|חמה|ירח,קיץ,כוכב|3
פחד|אימה|כעס|זעם|שמחה,צעקה,פחד|3
גבוה|ענק|נמוך|גמד|עץ,כובע,ירוק|1
מים|ים|חול|מדבר|חוף,גמל,כוס|1
אבן|סלע|טיפה|שלולית|מטרייה,כוס,רטוב|1
קריר|קר|חמים|חם|קר,פושר,שמש|1
כפית|כף|כוס|קנקן|צלחת,מים,שתייה|2
ערוגה|שדה|שלולית|אגם|גשם,ברווז,בוץ|2
ורוד|אדום|אפור|שחור|צהוב,לבן,ענן|3
שמן|עבה|רזה|דק|גבוה,חלש,קל|2
רעב|רעב מאוד|עייף|מותש|ער,מיטה,שינה|3`,
  produce: `חלב|גבינה|תפוזים|מיץ תפוזים|קליפה,עץ,פרי|1
צמר|סוודר|כותנה|חולצה|שדה,לבן,כבשה|2
עגבניות|רוטב עגבניות|תפוחים|מיץ תפוחים|עץ,אדום,זרע|1
עץ|נייר|חול|זכוכית|ים,חוף,מדבר|3
חלב|פרה|ביצה|תרנגולת|אפרוח,לול,חביתה|1
דבש|דבורה|משי|תולעת משי|פרפר,בד,שמלה|3
קקאו|שוקולד|חיטה|קמח|שדה,צהוב,איכר|2
ענבים|צימוקים|שזיפים|שזיפים מיובשים|עץ,סגול,גרעין|3
שלג|איש שלג|חול|ארמון חול|ים,דלי,חוף|1
עץ|כיסא|ברזל|מסמר|חלודה,מגנט,כבד|2
פרי|ריבה|חלב|גבינה|פרה,לבן,כוס|1
נייר|ספר|בד|בגד|חוט,מחט,ארון|1
גרעין|עץ|ביצה|תרנגולת|חביתה,קן,קליפה|2
צמר|חוט|עץ|קרש|יער,עלה,ציפור|2
פולי קפה|קפה|עלי תה|תה|ספל,חם,סוכר|2
עור|נעל|גומי|צמיג|מכונית,כביש,שחור|3
אבן|פסל|חימר|כד|ידיים,מים,אדמה|3
ביצים|חביתה|תפוחי אדמה|פירה|אדמה,קליפה,צלחת|2`,
  category: `כלב|חיה|ורד|פרח|קוץ,גינה,אדום|1
כיסא|רהיט|חולצה|בגד|כפתור,ארון,כביסה|1
פטיש|כלי עבודה|גיטרה|כלי נגינה|מיתר,מוזיקה,זמר|2
ראשון|יום|ינואר|חודש|שנה,חורף,שבוע|2
אדום|צבע|משולש|צורה|צלע,פינה,שלוש|1
כדורגל|משחק כדור|שחמט|משחק לוח|מלך,ריבוע,ניצחון|3
נמלה|חרק|נחש|זוחל|ארס,מדבר,ארוך|3
תפוח|פרי|גזר|ירק|כתום,ארנב,אדמה|1
חיפה|עיר|ישראל|מדינה|דגל,ים,ירושלים|2
ב|אות|7|מספר|שבוע,חשבון,ספר|2
אוטובוס|כלי תחבורה|מקרר|מכשיר חשמלי|קור,מטבח,חלב|3
קיץ|עונה|שבת|יום|מנוחה,נר,שבוע|2
פסנתר|כלי נגינה|עיפרון|כלי כתיבה|מחק,ציור,מחברת|2
פרה|חיית משק|אריה|חיית בר|רעמה,ג'ונגל,שאגה|3
ארנב|יונק|יונה|ציפור|נוצה,שלום,קן|2
רופא|מקצוע|טניס|ספורט|מחבט,כדור,מגרש|2
עגבנייה|ירק|לימון|פרי|חמוץ,צהוב,עץ|1
אורן|עץ|חרצית|פרח|שדה,צהוב,עלה|3`,
  animal: `כבשה|טלה|עז|גדי|עזים,חלב,גבינה|2
תרנגול|קוקוריקו|ברווז|גע-גע|אגם,נוצה,ברווזון|1
אריה|גור|תרנגולת|אפרוח|ביצה,לול,תרנגול|1
נחש|זוחל|קנגורו|קופץ|כיס,אוסטרליה,זנב|2
דג|שוחה|ציפור|עפה|קן,כנף,נוצה|1
דוב|גור|כלב|כלבלב|עצם,נביחה,זנב|1
צפרדע|מקרקרת|זאב|מיילל|יער,טורף,ירח|2
ברווז|ברווזון|חתול|חתלתול|עכבר,מיאו,שפם|1
יונה|הומה|דבורה|מזמזמת|עוקץ,דבש,פרח|3
דולפין|ים|גמל|מדבר|דבשת,נווד,צמא|2
סוס|דוהר|ארנב|קופץ|גזר,אוזניים,מחילה|2
כלב|נובח|חתול|מיילל|חלב,זנב,שפם|1
קוף|מטפס|נשר|דואה|מקור,הר,טורף|3
פיל|חדק|ציפור|מקור|קן,ביצה,שיר|2
זברה|פסים|נמר|כתמים|טורף,מהיר,זנב|2
צבי|עופר|אריה|גור|רעמה,שאגה,ג'ונגל|3`,
  need: `קר|מעיל|חושך|פנס|לילה,שינה,ירח|1
פצע|פלסטר|שבר|גבס|עצם,רופא,כאב|2
מכתב|בול|מכונית|דלק|נהג,כביש,גלגל|2
צמח|מים|פנס|סוללה|אור,חושך,מתג|2
שיער|מסרק|שיניים|מברשת שיניים|פה,חיוך,רופא|1
רעב|אוכל|עייף|מיטה|לילה,פיהוק,חלום|1
חורף|מעיל|קיץ|כובע|חם,שמש,ים|1
כביסה|מכונת כביסה|כלים|מדיח כלים|צלחת,מטבח,ארון|2
מכתב|מעטפה|מתנה|נייר עטיפה|יום הולדת,הפתעה,חבר|2
חולה|רופא|מכונית מקולקלת|מוסכניק|נהג,דלק,כביש|3
שחייה|בגד ים|רכיבה|קסדה|אופניים,רגליים,דרך|2
דלת|מפתח|מחשב|סיסמה|מסך,מקלדת,עכבר|3
שלג|מגפיים|שמש|משקפי שמש|חם,קיץ,חוף|1
צילום|מצלמה|מדידה|סרגל|מספר,ארוך,מחברת|2
עוגה|קמח|סלט|ירקות|צלחת,מזלג,ארוחה|2
גשר|נהר|סולם|קיר גבוה|מדרגה,צבע,בית|3`,
  place: `דג|אקווריום|ציפור|כלוב|נוצה,זמר,זרעים|1
חלב|מקרר|ספרים|מדף|קריאה,מחברת,סופר|1
שופט|בית משפט|שחקן|במה|הצגה,תסריט,קהל|3
כוכבים|שמיים|דגים|ים|סנפיר,דייג,קשקשים|1
כסף|ארנק|מכתבים|תיבת דואר|בול,דוור,כתובת|2
מכונית|כביש|רכבת|מסילה|קרון,נוסע,כרטיס|2
שחקן כדורגל|מגרש|שחיין|בריכה|מגבת,מדליה,שחייה|1
מלך|ארמון|רופא|מרפאה|חולה,תרופה,חלוק|2
תמונה|אלבום|מילה|מילון|אות,לכתוב,שפה|3
גרעין|תפוח|פנינה|צדפה|ים,שרשרת,לבן|3
אסטרונאוט|חלל|צוללן|מעמקי הים|חמצן,סנפירים,דגים|3
חיות|גן חיות|צמחים|חממה|מים,פרחים,גנן|3
עננים|שמיים|שורשים|אדמה|עץ,מים,ענף|2
תלמידים|כיתה|חולים|בית חולים|רופא,תרופה,אחות|1
מיטה|חדר שינה|תנור|מטבח|עוגה,חם,אופה|1`,
  worker: `דוור|מכתבים|שליח|חבילות|משאית,דלת,בית|2
צלם|תמונות|אופה|עוגות|תנור,קמח,מאפייה|1
כבאי|שריפה|מציל|טובע|ים,חוף,כיסא|2
וטרינר|בעלי חיים|רופא ילדים|ילדים|תרופות,מרפאה,אחות|1
מלצר|מסעדה|מוכר|חנות|קונה,כסף,מדף|1
בנאי|בית|סנדלר|נעליים|מסמרים,רגל,חנות|2
מאמן|שחקנים|מורה|תלמידים|בית ספר,שיעור,לוח|2
חקלאי|ירקות|דייג|דגים|סירה,ים,רשת|1
מנצח|תזמורת|מאמן|קבוצה|כדור,מגרש,שריקה|3
צייר|ציור|מלחין|מנגינה|זמר,פסנתר,קונצרט|3
אסטרונאוט|חללית|רב-חובל|ספינה|ים,מפרש,מלח|3
רוקח|תרופות|אופטיקאי|משקפיים|עיניים,חנות,רופא|3
גנן|גינה|רועה|עדר|מקל,שדה,חלב|2
שען|שעונים|צורף|תכשיטים|חנות,זכוכית,מתנה|3
טבח|מתכון|מוזיקאי|תווים|שיר,כלי,במה|3`,
  part: `גג|בית|מכסה|סיר|מטבח,מרק,כף|1
מקש|מקלדת|כפתור|חולצה|חור,חוט,ארון|2
עין|פנים|חלון|בית|וילון,זכוכית,אור|1
עלה כותרת|פרח|נוצה|ציפור|קן,עפה,שיר|2
מסך|טלוויזיה|עדשה|מצלמה|תמונה,צלם,אור|3
ידית|דלת|שרוך|נעל|רגל,גרב,הליכה|1
שורה|שיר|צעד|ריקוד|רגל,מוזיקה,במה|3
זנב|כלב|חדק|פיל|ג'ונגל,גדול,בוטנים|1
פרק|ספר|חדר|בית|רחוב,שכן,מפתח|2
קומה|בניין|קרון|רכבת|נוסע,מסילה,תחנה|2
שן|מסרק|מיתר|גיטרה|מוזיקה,נגן,שיר|2
גרעין|אבטיח|חלמון|ביצה|תרנגולת,חביתה,קן|2`,
  opp: `פתוח|סגור|רטוב|יבש|מים,גשם,רטוב|1
מלא|ריק|כבד|קל|חזק,גדול,כבד|1
למעלה|למטה|קדימה|אחורה|ימינה,מהר,ישר|1
לקנות|למכור|לתת|לקחת|לשלוח,מתנה,לתת|2
ראשון|אחרון|לפני|אחרי|עכשיו,תחילה,ליד|2
נכנס|יוצא|עולה|יורד|מטפס,מדרגות,רץ|1
רחוק|קרוב|זול|יקר|כסף,מחיר,חנות|2
לזכור|לשכוח|להתחיל|לסיים|להמשיך,להתחיל,ראשון|2
מסודר|מבולגן|נקי|מלוכלך|סבון,רחצה,מקלחת|1
שווה|שונה|מותר|אסור|חוק,מותר,רשות|3
נדיר|נפוץ|זמני|קבוע|שעון,רגע,ארוך|3`,
  tool: `מסור|לנסר|מקדחה|לקדוח|חור,קיר,בורג|2
מזלג|לאכול|כוס|לשתות|מים,שולחן,זכוכית|1
מכחול|לצבוע|מגהץ|לגהץ|בגדים,חם,חשמל|1
זכוכית מגדלת|להגדיל|רמקול|להגביר|לשמוע,מוזיקה,שיר|3
מפתח|לפתוח|מנעול|לנעול|דלת,מפתח,בית|2
מגבת|לנגב|סבון|לרחוץ|מים,קצף,אמבטיה|1
סרגל|למדוד|מחשבון|לחשב|מספרים,כפתור,סוללה|2
מטף|לכבות|משרוקית|לשרוק|שופט,רעש,פה|2
מצפן|כיוון|שעון|שעה|יד,מחוגים,מעורר|2
מקלדת|להקליד|מיקרופון|לדבר|קול,זמר,במה|3
מברג|להבריג|פטיש|לדפוק|מסמר,קיר,נגר|2`,
}

// sentence completion, easy linking words: [sentence, right, wrongs]
const SD: [string, string, string[]][] = [
  ['היה קר בחוץ, ___ לבשתי מעיל.', 'לכן', ['אבל', 'למרות', 'או']],
  ['רציתי לשחק בחוץ, ___ התחיל לרדת גשם.', 'אבל', ['לכן', 'כי', 'וגם']],
  ['דנה שמחה מאוד ___ קיבלה מתנה.', 'כי', ['אבל', 'או', 'לכן']],
  ['בארוחת בוקר אפשר לאכול לחם ___ דייסה.', 'או', ['כי', 'לכן', 'אבל']],
  ['התינוק היה עייף, ___ הוא נרדם מהר.', 'ולכן', ['אבל', 'כי', 'או']],
  ['יוני לא הלך לבית הספר ___ הוא היה חולה.', 'כי', ['לכן', 'אבל', 'או']],
  ['שתיתי כוס מים ___ הייתי צמא.', 'כי', ['לכן', 'אבל', 'למרות ש']],
  ['צחצחתי שיניים ___ אכלתי ארוחת ערב.', 'אחרי ש', ['או', 'אבל', 'למרות ש']],
  ['קודם לובשים גרביים, ___ נועלים נעליים.', 'ואחר כך', ['כי', 'לפני', 'או']],
  ['תומר רצה לקנות ספר, ___ לא היה לו מספיק כסף.', 'אבל', ['לכן', 'כי', 'וגם']],
  ['הכלב היה רעב, ___ נתנו לו אוכל.', 'לכן', ['אבל', 'כי', 'או']],
  ['אפשר לשחק בגינה ___ בבית.', 'או', ['כי', 'לכן', 'אבל']],
  ['הדלת הייתה נעולה, ___ לא יכולנו להיכנס.', 'ולכן', ['אבל', 'כי', 'או']],
]

// ---------- word problems ----------
type WQ = { s: string; right: number | string; wr: (number | string)[]; d: D; kind: string; plain?: string }
const DAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']
const BOYS = ['רון', 'עומר', 'איתי', 'נדב', 'יואב', 'גיא']
const GIRLS = ['נועה', 'מאיה', 'שירה', 'טל', 'הילה', 'ליה']

function wordGen(h: H, seed: number, prefix: string, count: number, kind: string, gens: ((ri: (a: number, b: number) => number, r: () => number) => WQ | null)[]): GItem[] {
  const r = h.rng(seed), ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  const out: GItem[] = []
  for (let i = 0; i < count * 12 && out.length < count * 4; i++) {
    const q = gens[i % gens.length](ri, r)
    if (!q) continue
    const right = String(q.right)
    const wr = [...new Set(q.wr.map(String).filter((w) => w !== right && w !== '' && !w.startsWith('-') && w !== '0'))]
    if (wr.length < 3) continue
    const it = h.pack('tmp', 'word', `<div class="g-sent">${q.s}</div>`, right, wr.slice(0, 3), q.plain ?? `בעיה: ${q.s}`, r, q.d)
    it.kind = kind
    out.push(it)
  }
  // level balance: equal thirds where possible
  const by = [1, 2, 3].map((d) => out.filter((x) => x.diff === d))
  const mix: GItem[] = []
  for (let k = 0; k < out.length; k++) for (const g of by) if (g[k]) mix.push(g[k])
  return keepUnique(mix, count, prefix)
}

// digit riddles: clue list, brute force over 10..99 (or 100..999) so exactly one number fits
type Clue = { t: string; f: (n: number) => boolean }
const dg = (n: number) => String(n).split('').map(Number)
function digitRiddle(ri: (a: number, b: number) => number, d: D): WQ | null {
  const three = d === 3 && ri(0, 1) === 1
  const lo = three ? 100 : 10, hi = three ? 999 : 99
  const n = ri(lo, hi)
  const [a, b, c] = dg(n)
  const last = three ? c : b
  const pool: Clue[] = [
    { t: `ספרת העשרות שלי היא ${three ? b : a}`, f: (x) => dg(x)[three ? 1 : 0] === (three ? b : a) },
    { t: `ספרת האחדות שלי היא ${last}`, f: (x) => x % 10 === last },
    { t: last % 2 === 0 ? 'אני מספר זוגי' : 'אני מספר אי־זוגי', f: (x) => x % 2 === last % 2 },
    { t: `סכום הספרות שלי הוא ${dg(n).reduce((p, q) => p + q)}`, f: (x) => dg(x).reduce((p, q) => p + q) === dg(n).reduce((p, q) => p + q) },
    { t: `אני גדול מ־${Math.max(lo, n - ri(3, 15))}`, f: () => true },
    { t: `אני קטן מ־${Math.min(hi + 1, n + ri(3, 15))}`, f: () => true },
  ]
  pool[4].f = ((L: number) => (x: number) => x > L)(Number(pool[4].t.match(/\d+/)![0]))
  pool[5].f = ((L: number) => (x: number) => x < L)(Number(pool[5].t.match(/\d+/)![0]))
  if (!three) {
    if (b > a) pool.push({ t: `ספרת האחדות שלי גדולה מספרת העשרות ב־${b - a}`, f: (x) => dg(x)[1] - dg(x)[0] === b - a })
    if (a > b) pool.push({ t: `ספרת העשרות שלי גדולה מספרת האחדות ב־${a - b}`, f: (x) => dg(x)[0] - dg(x)[1] === a - b })
    if (a * b > 0) pool.push({ t: `כשכופלים את שתי הספרות שלי מקבלים ${a * b}`, f: (x) => dg(x)[0] * dg(x)[1] === a * b })
    if (a === b) pool.push({ t: 'שתי הספרות שלי שוות', f: (x) => dg(x)[0] === dg(x)[1] })
  } else pool.push({ t: `ספרת המאות שלי היא ${a}`, f: (x) => dg(x)[0] === a })
  // choose clues: level 1 = 2 clues (no products), 2 = 3 clues, 3 = 3-4 clues incl. relation / product / sum
  const want = d === 1 ? 2 : d === 2 ? 3 : 3 + ri(0, 1)
  const allowed = pool.filter((c, i) => (d === 1 ? i < 3 || i === 4 || i === 5 : true) && !(d === 1 && /כופלים|סכום/.test(c.t)))
  if (d === 1 && allowed.filter((c) => /עשרות|אחדות/.test(c.t)).length === 0) return null
  for (let tries = 0; tries < 60; tries++) {
    const sh = [...allowed]; for (let q = sh.length - 1; q > 0; q--) { const j = ri(0, q); [sh[q], sh[j]] = [sh[j], sh[q]] }
    const pick = sh.slice(0, want)
    if (d >= 2 && pick.filter((c) => /ספרת (העשרות|האחדות|המאות) שלי היא/.test(c.t)).length > 1) continue
    if (d === 3 && !pick.some((c) => /כופלים|סכום|גדולה מספרת/.test(c.t))) continue
    const fits: number[] = []
    for (let x = lo; x <= hi; x++) if (pick.every((c) => c.f(x))) fits.push(x)
    if (fits.length !== 1 || fits[0] !== n) continue
    // distractors: numbers that break exactly one clue
    const near: number[] = []
    for (let x = lo; x <= hi; x++) if (x !== n && pick.filter((c) => !c.f(x)).length === 1) near.push(x)
    if (near.length < 3) continue
    near.sort((p, q) => Math.abs(p - n) - Math.abs(q - n))
    const wr = [near[0], near[Math.floor(near.length / 3)], near[near.length - 1]]
    const clueTxt = pick.map((c) => c.t).join('. ')
    return { s: `חידה: אני מספר בן ${three ? 3 : 2} ספרות. ${clueTxt}. מי אני?`, right: n, wr, d, kind: 'wdigits', plain: `חידת ספרות: ${clueTxt}` }
  }
  return null
}

function wlogicGens(): ((ri: (a: number, b: number) => number, r: () => number) => WQ | null)[] {
  const pick3 = (ri: (a: number, b: number) => number, arr: string[]) => { const a = [...arr]; const o: string[] = []; while (o.length < 3) o.push(a.splice(ri(0, a.length - 1), 1)[0]); return o }
  return [
    (ri) => { const [x, y, z] = pick3(ri, BOYS); const tall = ri(0, 1) === 1
      return { s: `${x} גבוה מ${y}. ${y} גבוה מ${z}. מי הכי ${tall ? 'גבוה' : 'נמוך'}?`, right: tall ? x : z, wr: [tall ? z : x, y, 'כולם באותו גובה'], d: 1, kind: 'wlogic' } },
    (ri) => { const [x, y, z] = pick3(ri, GIRLS)
      return { s: `${x} מבוגרת מ${y}. ${z} צעירה מ${y}. מי הכי צעירה?`, right: z, wr: [x, y, 'אי אפשר לדעת'], d: 2, kind: 'wlogic' } },
    (ri) => { const a = ri(3, 9), b = ri(2, 8); const n = a + b - 1
      return { s: `ילדים עומדים בתור. ${GIRLS[ri(0, 5)]} עומדת במקום ה־${a} מההתחלה, ובמקום ה־${b} מהסוף. כמה ילדים עומדים בתור?`, right: n, wr: [n + 1, n - 1, a + b + 2], d: 2, kind: 'wlogic' } },
    (ri) => { const g = ri(2, 5), k = ri(3, 7); const L = g * k; const n = k + 1
      return { s: `שותלים עצים בשורה ישרה. בין כל שני עצים יש ${g} מטרים. אורך השורה ${L} מטרים, ויש עץ גם בהתחלה וגם בסוף. כמה עצים שתלו?`, right: n, wr: [k, k + 2, L], d: 3, kind: 'wlogic' } },
    (ri) => { const pieces = ri(3, 7), m = ri(2, 5); const v = (pieces - 1) * m
      return { s: `כדי לחתוך קרש אחד ל־${pieces} חתיכות, מנסרים אותו כמה פעמים. כל ניסור לוקח ${m} דקות. כמה דקות לוקח לחתוך את כל הקרש?`, right: v, wr: [pieces * m, v - m + 1, pieces + m], d: 3, kind: 'wlogic' } },
    (ri) => { const n = ri(3, 6); const v = (n * (n - 1)) / 2
      return { s: `${n} חברים נפגשו, וכל אחד לחץ יד לכל אחד מהאחרים פעם אחת בלבד. כמה לחיצות ידיים היו?`, right: v, wr: [n * (n - 1), n, v + 1], d: 3, kind: 'wlogic' } },
    (ri) => { const t = ri(0, 6), k = ri(2, 6); const ans = DAYS[(t + k) % 7]
      return { s: `היום יום ${DAYS[t]}. איזה יום יהיה בעוד ${k} ימים?`, right: ans, wr: [DAYS[(t + k + 1) % 7], DAYS[(t + k + 6) % 7], DAYS[(t + 3) % 7] === ans ? DAYS[(t + 4) % 7] : DAYS[(t + 3) % 7]], d: 1, kind: 'wlogic' } },
    (ri) => { const t = ri(0, 6), k = ri(8, 20); const ans = DAYS[(t + k) % 7]
      return { s: `היום יום ${DAYS[t]}. איזה יום יהיה בעוד ${k} ימים? (רמז: כל 7 ימים חוזרים לאותו יום)`, right: ans, wr: [DAYS[(t + k + 1) % 7], DAYS[(t + k + 6) % 7], DAYS[(t + k + 2) % 7]], d: 3, kind: 'wlogic' } },
    (ri) => { const red = ri(15, 30), k = ri(2, 6), m = ri(2, 5); const green = red - k, yellow = green + m
      return { s: `שלושה מגדלי קוביות: אדום, ירוק וצהוב. במגדל האדום ${red} קוביות. הירוק נמוך מהאדום ב־${k} קוביות. הצהוב גבוה מהירוק ב־${m} קוביות. כמה קוביות יש במגדל הצהוב?`, right: yellow, wr: [red + m, green, red - k - m], d: 2, kind: 'wlogic' } },
    (ri) => { const [x, y] = pick3(ri, BOYS); const a = ri(2, 5), b = a + ri(1, 3)
      return { s: `ל${x} יש ${a} גולות. ל${y} יש ${b - a === 1 ? 'גולה אחת' : `${b - a} גולות`} יותר מ${x}. כמה גולות יש לשניהם יחד?`, right: a + b, wr: [b, a + b - 1, a + b + 1], d: 1, kind: 'wlogic' } },
    (ri) => { const up = ri(3, 6), down = ri(1, up - 2), H = ri(10, 20)
      let pos = 0, m = 0; while (true) { m++; pos += up; if (pos >= H) break; pos -= down }
      return { s: `חילזון רוצה לטפס על קיר בגובה ${H} מטרים. בכל יום הוא עולה ${up} מטרים, ובכל לילה הוא מחליק ${down === 1 ? 'מטר אחד' : down + ' מטרים'} למטה. באיזה יום (ראשון, שני, שלישי...) הוא יגיע לראש הקיר? (בוחרים את מספר היום)`, right: m, wr: [Math.ceil(H / (up - down)), Math.ceil(H / up), m + 1], d: 3, kind: 'wlogic' } },
  ]
}

function rateGens(): ((ri: (a: number, b: number) => number) => WQ | null)[] {
  return [
    (ri) => { const a = ri(2, 6), t = ri(2, 5); return { s: `ברז ממלא ${a} ליטרים של מים בכל דקה. כמה ליטרים ימלא ב־${t} דקות?`, right: a * t, wr: [a + t, a * t + a, a * (t - 1)], d: 1, kind: 'wrate' } },
    (ri) => { const a = ri(2, 5), t = ri(2, 6); return { s: `${GIRLS[ri(0, 5)]} מקפלת ${a} ציפורי נייר בכל שעה. כמה ציפורים תקפל ב־${t} שעות?`, right: a * t, wr: [a + t, a * t + 1, a * (t + 1)], d: 1, kind: 'wrate' } },
    (ri) => { const a = ri(3, 8), b = ri(2, 6), t = ri(2, 4); return { s: `${BOYS[ri(0, 5)]} צובע ${a} כיסאות ביום, וחבר שלו צובע ${b} כיסאות ביום. כמה כיסאות יצבעו שניהם יחד ב־${t} ימים?`, right: (a + b) * t, wr: [a * t + b, (a + b) * (t + 1), a + b + t], d: 2, kind: 'wrate' } },
    (ri) => { const a = ri(2, 6), t = ri(3, 8); const tot = a * t; return { s: `מכונה מכינה ${a} עוגיות בכל דקה. כמה דקות ייקח לה להכין ${tot} עוגיות?`, right: t, wr: [tot - a, t + 1, t - 1], d: 2, kind: 'wrate' } },
    (ri) => { const a = ri(2, 6), b = ri(2, 6), t = ri(2, 5); const tot = (a + b) * t; return { s: `שני ברזים ממלאים יחד בריכה קטנה. הברז הראשון ממלא ${a} ליטרים בדקה, והשני ${b} ליטרים בדקה. בבריכה נכנסים ${tot} ליטרים. אחרי כמה דקות היא תתמלא?`, right: t, wr: [tot / a > 0 && Number.isInteger(tot / a) ? tot / a : t + 2, t + 1, a + b], d: 3, kind: 'wrate' } },
    (ri) => { const a = ri(3, 9), t2 = ri(2, 4); return { s: `${GIRLS[ri(0, 5)]} קוראת ${a} עמודים בכל יום. בשבוע הראשון היא קראה 3 ימים, ובשבוע השני עוד ${t2} ימים. כמה עמודים קראה בסך הכול?`, right: a * (3 + t2), wr: [a * 3 + t2, a * t2, a * (3 + t2) - a], d: 2, kind: 'wrate' } },
    (ri) => { const a = ri(5, 9), b = ri(2, a - 2), t = ri(2, 5); return { s: `בכל שעה נכנסים לבריכה ${a} ליטרים של מים, ובאותה שעה יוצאים ממנה ${b} ליטרים דרך חור קטן. בהתחלה הבריכה ריקה. כמה ליטרים יהיו בה אחרי ${t} שעות?`, right: (a - b) * t, wr: [a * t, (a + b) * t, (a - b) * t + b], d: 3, kind: 'wrate' } },
  ]
}
function timeGens(): ((ri: (a: number, b: number) => number) => WQ | null)[] {
  return [
    (ri) => { const h = ri(1, 9), k = ri(1, 3); return { s: `השעה עכשיו ${h}:00. מה תהיה השעה בעוד ${k === 1 ? 'שעה אחת' : k === 2 ? 'שעתיים' : '3 שעות'}?`, right: `${h + k}:00`, wr: [`${h + k + 1}:00`, `${h + k - 1}:00`, `${h}:${k}0`], d: 1, kind: 'wtime' } },
    (ri) => { const h = ri(4, 10), k = ri(1, 2); return { s: `השעה עכשיו ${h}:30. מה הייתה השעה לפני ${k === 1 ? 'שעה אחת' : 'שעתיים'}?`, right: `${h - k}:30`, wr: [`${h + k}:30`, `${h - k}:00`, `${h - k - 1}:30`], d: 1, kind: 'wtime' } },
    () => ({ s: 'כמה דקות יש בשעה וחצי?', right: 90, wr: [60, 30, 130], d: 1, kind: 'wtime' }),
    () => ({ s: 'כמה דקות יש בחצי שעה?', right: 30, wr: [50, 15, 60], d: 1, kind: 'wtime' }),
    () => ({ s: 'כמה דקות יש ברבע שעה?', right: 15, wr: [25, 4, 30], d: 1, kind: 'wtime' }),
    () => ({ s: 'כמה שעות יש ביממה (יום ולילה יחד)?', right: 24, wr: [12, 60, 7], d: 1, kind: 'wtime' }),
    (ri) => { const h = ri(1, 9), m = [10, 15, 20, 25][ri(0, 3)]; return { s: `השעה עכשיו ${h}:${m}. מה תהיה השעה בעוד 30 דקות?`, right: `${h}:${m + 30}`, wr: [`${h + 1}:${m}`, `${h}:${m + 20}`, `${h}:${m}`], d: 2, kind: 'wtime' } },
    (ri) => { const n = ri(2, 4); return { s: `שיעור אחד נמשך 45 דקות. כמה דקות נמשכים ${n} שיעורים כאלה, בלי הפסקות?`, right: 45 * n, wr: [45 + n, 40 * n, 45 * n + 15], d: 2, kind: 'wtime' } },
  ]
}
function ratioEasyGens(): ((ri: (a: number, b: number) => number) => WQ | null)[] {
  return [
    (ri) => { const p = ri(2, 6), n = ri(2, 5); return { s: `מחברת עולה ${p} שקלים. כמה עולות ${n} מחברות?`, right: p * n, wr: [p + n, p * n + p, p * (n - 1)], d: 1, kind: 'wratio' } },
    (ri) => { const y = ri(4, 8), k = ri(1, 4); return { s: `דן בן ${y}. אחותו מבוגרת ממנו ${k === 1 ? 'בשנה אחת' : `ב־${k} שנים`}. בת כמה אחותו?`, right: y + k, wr: [y - k, y, y + k + 1], d: 1, kind: 'wratio' } },
    (ri) => { const n = 2 * ri(2, 10); return { s: `לליה היו ${n} סוכריות. היא נתנה חצי מהן לחברה. כמה סוכריות נשארו לליה?`, right: n / 2, wr: [n - 2, n / 2 + 1, n * 2], d: 1, kind: 'wratio' } },
    (ri) => { const p = ri(3, 9), pay = 10 * ri(1, 2) + (ri(0, 1) ? 0 : 10); if (pay <= p) return null; return { s: `כדור עולה ${p} שקלים. נתתי למוכר ${pay} שקלים. כמה עודף קיבלתי?`, right: pay - p, wr: [pay + p, p, pay - p + 1], d: 1, kind: 'wratio' } },
    (ri) => { const a = ri(5, 9), b = ri(2, a - 1); return { s: `סבתא בת ${a}0 וסבא בן ${a}${b}. בכמה שנים סבא מבוגר מסבתא?`, right: b, wr: [b + 1, a, b + 10], d: 2, kind: 'wratio' } },
    (ri) => { const n = 4 * ri(2, 6); return { s: `פיצה חתוכה ל־${n} משולשים. אכלנו רבע מהפיצה. כמה משולשים אכלנו?`, right: n / 4, wr: [n / 2, n - 4, 4], d: 2, kind: 'wratio' } },
  ]
}

// ---------- numbers in shapes: new items in existing renderers ----------
function ringMore(h: H): GItem[] {
  const r = h.rng(9701), ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  const out: GItem[] = []
  for (let i = 0; i < 300; i++) {
    const d: D = ([1, 2, 3] as D[])[i % 3]
    const n = d === 1 ? 5 : 6
    const a = ri(1, 25)
    let vals: number[]
    if (d === 1) { const k = ri(2, 6); vals = Array.from({ length: n }, (_, j) => a + j * k) }
    else if (d === 2) { const k = ri(3, 11) * (r() < 0.35 ? -1 : 1); vals = Array.from({ length: n }, (_, j) => a + j * k + (k < 0 ? 70 : 0)) }
    else if (r() < 0.5) { const k = ri(2, 5), k2 = ri(1, 3); vals = [a]; for (let j = 1; j < n; j++) vals.push(vals[j - 1] + k + (j - 1) * k2) }
    else { const p = ri(2, 6), q = ri(1, 4); vals = [a]; for (let j = 1; j < n; j++) vals.push(vals[j - 1] + (j % 2 ? p : -q)) } // +p, −q, +p, −q ...
    if (vals.some((v) => v <= 0 || v > 120)) continue
    const miss = ri(2, n - 1), right = vals[miss], step = vals[miss] - vals[miss - 1]
    const shown = vals.map((v, j) => (j === miss ? null : v))
    const it = h.pack('tmp', 'numshape', ringSvg(shown), String(right), h.nums(right, [right + 1, right - 1, right + step, right - step, right + 2]), `עיגול מספרים: ${shown.map((v) => v ?? '?').join(', ')}`, r, d)
    it.kind = 'nring'
    out.push(it)
  }
  return keepUnique(out, 36, 'nh')
}
function chainMore(h: H): GItem[] {
  const r = h.rng(9702), ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  const box = (v: number | string) => `<span class="g-chbox">${v}</span>`
  const arr = (k: number) => `<span class="g-charr">${'➜'.repeat(k)}</span>`
  const out: GItem[] = []
  for (let i = 0; i < 300; i++) {
    const d: D = ([1, 2, 3] as D[])[i % 3]
    const kind = d === 3 ? ['x2', 'minus', 'plus'][ri(0, 2)] : d === 2 ? ['plus', 'minus'][ri(0, 1)] : 'plus'
    const k = kind === 'x2' ? 2 : d === 1 ? ri(1, 5) : ri(3, 9)
    const f = (x: number, times: number) => (kind === 'x2' ? x * 2 ** times : kind === 'minus' ? x - k * times : x + k * times)
    const x0 = kind === 'x2' ? ri(1, 3) : kind === 'minus' ? ri(40, 80) : ri(1, 15)
    const y0 = kind === 'x2' ? ri(1, 4) : kind === 'minus' ? ri(50, 90) : ri(2, 20)
    const q1 = f(y0, 2), right = f(q1, 3)
    if ([f(x0, 1), f(x0, 3), q1, right].some((v) => v <= 0 || v > 200)) continue
    const per = kind === 'x2' ? 0 : k
    const it = h.pack('tmp', 'numshape', `<div class="g-chain">${box(x0)}${arr(1)}${box(f(x0, 1))}${arr(2)}${box(f(x0, 3))}</div><div class="g-chain">${box(y0)}${arr(2)}${box(q1)}${arr(3)}${box('?')}</div>`, String(right),
      h.nums(right, kind === 'x2' ? [q1 * 2, q1 * 3, right + 2] : kind === 'minus' ? [q1 - per, q1 - 2 * per, right - per, right + 1] : [q1 + per, q1 + 2 * per, right + per, right - 1]), `שרשרת חצים: ${y0} ➜➜ ${q1} ➜➜➜ ?`, r, d)
    it.kind = 'nchain'
    out.push(it)
  }
  return keepUnique(out, 36, 'nj')
}
function twoStepMore(h: H): GItem[] {
  const r = h.rng(9703), ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  type Op = { t: string; f: (x: number) => number | null }
  const OPS: Op[] = [
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => ({ t: `+${k}`, f: (x: number) => x + k })),
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => ({ t: `-${k}`, f: (x: number) => (x - k > 0 ? x - k : null) })),
    ...[2, 3].map((k) => ({ t: `×${k}`, f: (x: number) => x * k })),
    ...[2, 3].map((k) => ({ t: `÷${k}`, f: (x: number) => (x % k === 0 ? x / k : null) })),
  ]
  const out: GItem[] = []
  for (let t = 0; t < 30000 && out.length < 300; t++) {
    const d: D = ([1, 2, 3] as D[])[t % 3]
    const add = OPS.slice(0, 20)
    const o1 = d === 1 ? add[ri(0, 9)] : d === 2 ? add[ri(0, 19)] : OPS[ri(0, OPS.length - 1)]
    const o2 = d === 1 ? add[ri(0, 19)] : OPS[ri(d === 2 ? 0 : 20, OPS.length - 1)]
    const rows: number[][] = []
    let bad = false
    for (let j = 0; j < 3; j++) { const a = ri(2, 20); const m = o1.f(a); if (m === null) { bad = true; break } const z = o2.f(m); if (z === null || z > 99) { bad = true; break } rows.push([a, m, z]) }
    if (bad || new Set(rows.map((x) => x[1])).size < 3) continue
    const fits = (i0: number, i1: number) => OPS.filter((o) => rows.slice(0, 2).every((x) => o.f(x[i0]) === x[i1])).length
    if (fits(1, 2) !== 1 || fits(0, 1) !== 1) continue
    const right = rows[2][2]
    const cell = (v: number | string) => `<td>${v}</td>`
    const tbl = `<table class="g-numgrid g-arrowgrid" dir="ltr">${rows.map((x, j) => `<tr>${cell(x[0])}${cell('➜')}${cell(x[1])}${cell('➜')}${cell(j === 2 ? '?' : x[2])}</tr>`).join('')}</table>`
    const it = h.pack('tmp', 'numshape', tbl, String(right), h.nums(right, [right + 1, right - 2, rows[2][1], right * 2, right + 3]), `טבלת שני שלבים: ${rows.map((x) => x.join(' ➜ ')).join(' | ')}`, r, d)
    it.kind = 'ntwostep'
    out.push(it)
  }
  return keepUnique(out, 36, 'ny')
}
// arrows out of a square (left / right), now with TWO full rows so each arrow's job is clear
function sideArrows(h: H): GItem[] {
  const r = h.rng(9704), ri = (a: number, b: number) => a + Math.floor(r() * (b - a + 1))
  type R1 = { d: D; f: (x: number) => number }
  const F: R1[] = [
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => ({ d: 1 as D, f: (x: number) => x + k })),
    ...[2, 3, 4, 5].map((k) => ({ d: 2 as D, f: (x: number) => x * k })),
    ...[2, 3].flatMap((k) => [1, -1].map((c) => ({ d: 3 as D, f: (x: number) => x * k + c }))),
  ]
  const row = (c: number | string, l: number | string, rr: number | string) => `<div class="g-chain" dir="ltr"><span class="g-node">${l}</span><span>⟵</span><span class="g-box">${c}</span><span>⟶</span><span class="g-node">${rr}</span></div>`
  const out: GItem[] = []
  for (let t = 0; t < 20000 && out.length < 300; t++) {
    const d: D = ([1, 2, 3] as D[])[t % 3]
    const lvl = F.filter((x) => x.d === d), any = F.filter((x) => x.d <= d)
    const g1 = lvl[ri(0, lvl.length - 1)], g2 = any[ri(0, any.length - 1)]
    if (g1 === g2) continue
    const cs = [ri(2, 9), ri(2, 9), ri(2, 9)]
    if (new Set(cs).size < 3) continue
    const L = cs.map(g1.f), R = cs.map(g2.f)
    if ([...L, ...R].some((v) => v > 99 || v <= 0)) continue
    const missLeft = t % 2 === 0
    const g = missLeft ? g1 : g2, V = missLeft ? L : R
    if (F.filter((o) => cs.slice(0, 2).every((x, i) => o.f(x) === V[i])).length !== 1) continue
    const right = V[2]
    const stem = `<div>${row(cs[0], L[0], R[0])}${row(cs[1], L[1], R[1])}${row(cs[2], missLeft ? '?' : L[2], missLeft ? R[2] : '?')}</div>`
    const it = h.pack('tmp', 'numshape', stem, String(right), h.nums(right, [...F.map((o) => o.f(cs[2])).filter((v) => v !== right).slice(0, 2), right + 1, right + cs[2]]), `חצים לשני הצדדים: ${cs.join(',')}`, r, d)
    it.kind = 'narrow'
    void g
    out.push(it)
  }
  return keepUnique(out, 36, 'nk')
}

export function buildExtra(h: H): GItem[] {
  const ah: GItem[] = []
  const r1 = h.rng(9601)
  let i = 0
  for (const [kind, txt] of Object.entries(AH)) for (const line of txt.trim().split('\n')) {
    const [a, b, c, right, w, d] = line.split('|')
    const it = h.pack(`ah${i++}`, 'analogy', `<div class="g-big">${a} : ${b}</div><div class="g-big">${c} : ______</div>`, right, w.split(','), `השלמת קשר: ${a} : ${b} / ${c} : ?`, r1, Number(d) as D)
    it.kind = kind
    ah.push(it)
  }
  const r2 = h.rng(9602)
  const sd = SD.map(([s, right, wr], k) => { const it = h.pack(`sd${k}`, 'sentence', `<div class="g-sent">${s}</div>`, right, wr, `השלמת משפט: ${s}`, r2, 1); it.kind = 'sconn'; return it })
  const digits = wordGen(h, 9611, 'wv', 36, 'wdigits', [(ri) => digitRiddle(ri, 1), (ri) => digitRiddle(ri, 2), (ri) => digitRiddle(ri, 3)])
  const logic = wordGen(h, 9612, 'wl', 33, 'wlogic', wlogicGens())
  const rate = wordGen(h, 9613, 'wy', 27, 'wrate', rateGens())
  const time = wordGen(h, 9614, 'wz', 15, 'wtime', timeGens())
  const ratio = wordGen(h, 9615, 'wu', 15, 'wratio', ratioEasyGens())
  return [...ah, ...sd, ...digits, ...logic, ...rate, ...time, ...ratio, ...ringMore(h), ...chainMore(h), ...twoStepMore(h), ...sideArrows(h), ...buildBranch(h, 9705, 'pf', 36)]
}
