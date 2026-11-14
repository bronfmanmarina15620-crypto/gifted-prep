"""Independent checks for the v7 word problems.
wv (digit riddles): parse every clue sentence and brute-force all 2/3-digit numbers -> exactly one fits, and it is the marked answer,
and every wrong option breaks at least one clue."""
import json, re, sys
B = json.load(open(sys.argv[1] if len(sys.argv) > 1 else '/tmp/bank.json'))
def clue(c):
    c = c.strip()
    m = re.fullmatch(r'ספרת (העשרות|האחדות|המאות) שלי היא (\d)', c)
    if m: pos = {'העשרות': -2, 'האחדות': -1, 'המאות': -3}[m[1]]; v = int(m[2]); return lambda x: len(str(x)) >= -pos and int(str(x)[pos]) == v
    if c == 'אני מספר זוגי': return lambda x: x % 2 == 0
    if c == 'אני מספר אי־זוגי': return lambda x: x % 2 == 1
    m = re.fullmatch(r'סכום הספרות שלי הוא (\d+)', c)
    if m: return lambda x, s=int(m[1]): sum(map(int, str(x))) == s
    m = re.fullmatch(r'אני גדול מ־(\d+)', c)
    if m: return lambda x, L=int(m[1]): x > L
    m = re.fullmatch(r'אני קטן מ־(\d+)', c)
    if m: return lambda x, L=int(m[1]): x < L
    m = re.fullmatch(r'ספרת האחדות שלי גדולה מספרת העשרות ב־(\d+)', c)
    if m: return lambda x, k=int(m[1]): x % 10 - x // 10 % 10 == k
    m = re.fullmatch(r'ספרת העשרות שלי גדולה מספרת האחדות ב־(\d+)', c)
    if m: return lambda x, k=int(m[1]): x // 10 % 10 - x % 10 == k
    m = re.fullmatch(r'כשכופלים את שתי הספרות שלי מקבלים (\d+)', c)
    if m: return lambda x, p=int(m[1]): (x // 10) * (x % 10) == p
    if c == 'שתי הספרות שלי שוות': return lambda x: x // 10 == x % 10
    raise ValueError('unknown clue: ' + c)
bad = 0; n = 0
for it in B:
    if not re.match(r'wv\d', it['id']): continue
    n += 1
    s = re.sub('<[^>]+>', '', it['stem'])
    three = 'בן 3 ספרות' in s
    body = s.split('ספרות.', 1)[1].rsplit('. מי אני?', 1)[0]
    fs = [clue(c) for c in body.split('. ')]
    rng = range(100, 1000) if three else range(10, 100)
    fit = [x for x in rng if all(f(x) for f in fs)]
    ans = it['options'][it['correct']]
    ok = fit == [int(ans)] and all(not all(f(int(o)) for f in fs) for o in it['options'] if o != ans)
    if not ok: bad += 1; print('BAD', it['id'], s, it['options'], ans, fit[:5])
print('digit riddles checked', n, 'bad', bad)
sys.exit(1 if bad else 0)
