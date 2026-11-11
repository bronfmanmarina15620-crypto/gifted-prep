"""Independent solver for every number format in the bank.
For each item we plug each of the 4 options in place of '?' and ask: is there ANY rule from a
wide family (much wider than the generator used) that fits all the numbers shown?
An item is OK only if exactly one option is consistent and it is the marked answer."""
import json, re, sys, itertools
B = json.load(open(sys.argv[1] if len(sys.argv) > 1 else '/tmp/bank.json'))
ONLY = set(sys.argv[2].split(',')) if len(sys.argv) > 2 else None

def F1():
    fs = []
    for k in range(1, 31): fs += [('+%d' % k, lambda x, k=k: x + k), ('-%d' % k, lambda x, k=k: x - k)]
    for k in range(2, 11): fs.append(('x%d' % k, lambda x, k=k: x * k))
    for k in (2, 3, 4):
        for c in (-3, -2, -1, 1, 2, 3): fs.append(('x%d%+d' % (k, c), lambda x, k=k, c=c: x * k + c))
    for k in (2, 3, 4, 5): fs.append(('/%d' % k, lambda x, k=k: x // k if x % k == 0 else None))
    fs.append(('sq', lambda x: x * x)); fs.append(('sq+x', lambda x: x * x + x))
    return fs
def F2():
    base = [lambda x, y: x + y, lambda x, y: x - y, lambda x, y: x * y, lambda x, y: 2 * (x + y), lambda x, y: 2 * x + y, lambda x, y: 2 * x - y,
            lambda x, y: x * y - x, lambda x, y: x * y + x, lambda x, y: 2 * (x - y), lambda x, y: x // y if y and x % y == 0 else None, lambda x, y: x * x + y,
            lambda x, y: x * x - y, lambda x, y: 3 * (x + y), lambda x, y: (x + y) * y, lambda x, y: (x - y) * y, lambda x, y: x * y * 2, lambda x, y: abs(x - y) + x, lambda x, y: abs(x - y)]
    for k in range(1, 6): base += [lambda x, y, k=k: x + y + k, lambda x, y, k=k: x + y - k]
    for k in range(1, 4): base += [lambda x, y, k=k: x * y + k, lambda x, y, k=k: x * y - k]
    out = []
    for f in base: out += [f, lambda x, y, f=f: f(y, x)]
    return out
def F3():
    pats = [lambda p, q, r: p + q + r, lambda p, q, r: p * q * r, lambda p, q, r: p * q - r, lambda p, q, r: p * q + r, lambda p, q, r: (p + q) * r,
            lambda p, q, r: 2 * p + q + r, lambda p, q, r: q + r - p, lambda p, q, r: (p - q) * r, lambda p, q, r: p * (q - r), lambda p, q, r: p * q + p * r,
            lambda p, q, r: p + q * r * 0 + q * r, lambda p, q, r: (p + q + r) * 2]
    for k in range(1, 4): pats += [lambda p, q, r, k=k: p + q + r + k, lambda p, q, r, k=k: p + q + r - k]
    out = []
    for f in pats:
        for perm in itertools.permutations(range(3)): out.append(lambda a, b, c, f=f, perm=perm: f(*[(a, b, c)[i] for i in perm]))
    return out
def F4():
    pats = [lambda a, b, c, d: a + b + c + d, lambda a, b, c, d: a + b - c - d, lambda a, b, c, d: a * b + c + d, lambda a, b, c, d: a * d + b * c,
            lambda a, b, c, d: a * b - c * d, lambda a, b, c, d: (a + b) * (c + d), lambda a, b, c, d: a * b + c * d, lambda a, b, c, d: a * c + b * d,
            lambda a, b, c, d: (a + c) * (b + d), lambda a, b, c, d: (a + d) * (b + c), lambda a, b, c, d: a + b + c - d, lambda a, b, c, d: a * b * c * d,
            lambda a, b, c, d: a * c - b * d, lambda a, b, c, d: a * d - b * c, lambda a, b, c, d: (a + b + c + d) * 2, lambda a, b, c, d: a * b - c - d]
    out = []
    for f in pats:
        for perm in itertools.permutations(range(4)): out.append(lambda a, b, c, d, f=f, perm=perm: f(*[(a, b, c, d)[i] for i in perm]))
    return out
FAM1, FAM2, FAM3, FAM4 = F1(), F2(), F3(), F4()

def nums_of(stem):
    t = re.sub(r'<div class="g-sent">.*?</div>', '', stem)
    return [x.strip() for x in re.findall(r'>([^<>]+)<', t) if x.strip() and x.strip() not in ('⟵', '⟶') and not set(x.strip()) <= {'➜'} and re.fullmatch(r'-?\d+|\?', x.strip())]
def fits(fam, tuples):
    for f in fam:
        try:
            if all(f(*t[:-1]) == t[-1] for t in tuples): return True
        except Exception: pass
    return False
def seq_ok(s):
    d = [b - a for a, b in zip(s, s[1:])]
    if len(set(d)) == 1: return True
    dd = [b - a for a, b in zip(d, d[1:])]
    if len(set(dd)) == 1: return True
    if all(a and b % a == 0 for a, b in zip(s, s[1:])) and len({b // a for a, b in zip(s, s[1:])}) == 1: return True
    if len(d) >= 3 and d[0::2].count(d[0]) == len(d[0::2]) and d[1::2].count(d[1]) == len(d[1::2]): return True
    return False

def consistent(p, v, it):
    n = nums_of(it['stem']); n = [v if x == '?' else (int(x) if re.fullmatch(r'-?\d+', x) else x) for x in n]
    g = lambda k: [tuple(n[i:i + k]) for i in range(0, len(n), k)]
    if p in ('nc', 'ps', 'ng', 'po'):
        return fits(FAM2, [t if p != 'ps' else t for t in g(3)])
    if p == 'ns': return fits(FAM3, g(4))
    if p == 'nq': return fits(FAM4, g(5))
    if p == 'na':  # rows: L, c, R  (left = g1(c), right = g2(c))
        rows = g(3); return fits(FAM1, [(c, L) for L, c, R in rows]) and fits(FAM1, [(c, R) for L, c, R in rows])
    if p == 'pb':  # trees: top, l, r
        t = g(3); return fits(FAM1, [(a, l) for a, l, r in t]) and fits(FAM1, [(a, r) for a, l, r in t])
    if p in ('np', 'pt'):
        out = []
        cnt = len(n)
        pyrs = [n[:6], n[6:]] if cnt == 12 else [n[:6], [n[6], None, None] + n[7:]]
        for P in pyrs:
            t, m0, m1, b0, b1, b2 = P
            if m0 is None: out.append(('hid', t, b0, b1, b2))
            else: out += [(b0, b1, m0), (b1, b2, m1), (m0, m1, t)]
        full = [x for x in out if x[0] != 'hid']; hid = [x for x in out if x[0] == 'hid']
        for f in FAM2:
            try:
                if all(f(a, b) == c for a, b, c in full) and all(f(f(b0, b1), f(b1, b2)) == t for _, t, b0, b1, b2 in hid): return True
            except Exception: pass
        return False
    if p == 'nr': return seq_ok(n)
    if p == 'nx':  # x0 ->1 x1 ->2 x2 ; y0 ->2 y1 ->3 y2
        x0, x1, x2, y0, y1, y2 = n
        def rep(f, x, k):
            for _ in range(k):
                x = f(x)
                if x is None: return None
            return x
        return any(rep(f, x0, 1) == x1 and rep(f, x1, 2) == x2 and rep(f, y0, 2) == y1 and rep(f, y1, 3) == y2 for _, f in FAM1)
    if p == 'nz':
        rows = g(3); return any(all(f(a) == m for a, m, z in rows) for _, f in FAM1) and any(all(f(m) == z for a, m, z in rows) for _, f in FAM1)
    return None

FAM1 = [(n, f) for n, f in FAM1]
_f1 = [f for _, f in FAM1]
def fits1(tuples):
    return any(all(f(a) == b for a, b in tuples) for f in _f1)
# na / pb use FAM1 as plain functions
_orig = consistent
def consistent(p, v, it):
    global FAM1
    if p in ('na', 'pb'):
        n = nums_of(it['stem']); n = [v if x == '?' else int(x) for x in n]
        rows = [tuple(n[i:i + 3]) for i in range(0, len(n), 3)]
        if p == 'na': return fits1([(c, L) for L, c, R in rows]) and fits1([(c, R) for L, c, R in rows])
        return fits1([(a, l) for a, l, r in rows]) and fits1([(a, r) for a, l, r in rows])
    return _orig(p, v, it)

bad, total, per = [], 0, {}
for it in B:
    p = re.sub(r'\d+[a-c]?$', '', it['id'])
    if it['type'] != 'numshape' or (ONLY and p not in ONLY) or it.get('retired'): continue
    ok_opts = []
    for i, o in enumerate(it['options']):
        if consistent(p, int(o), it): ok_opts.append(i)
    total += 1; per.setdefault(p, [0, 0]); per[p][0] += 1
    if ok_opts != [it['correct']]:
        per[p][1] += 1; bad.append((it['id'], [it['options'][i] for i in ok_opts], it['options'][it['correct']]))
for p, (n, b) in per.items(): print(f'{p}: {n} items, {b} not exactly-one')
print('TOTAL', total, 'bad', len(bad))
json.dump([b[0] for b in bad], open('/tmp/solver_bad.json', 'w'))
for b in bad[:40]: print(' ', b)
sys.exit(1 if bad else 0)
