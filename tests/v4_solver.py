# independent re-check of the v4 two-number items (circles in 3 parts, oval/square/oval)
import json,re,sys
B=json.load(open(sys.argv[1] if len(sys.argv)>1 else '/tmp/bank.json')); bad=0; n=0
R={'a+b':lambda a,b:a+b,'a-b':lambda a,b:a-b,'a*b':lambda a,b:a*b,'2(a+b)':lambda a,b:2*(a+b),'a*b+1':lambda a,b:a*b+1,'a*b-1':lambda a,b:a*b-1,'a*b-a':lambda a,b:a*b-a,'2a-b':lambda a,b:2*a-b,
 'a+k':lambda a,k:a+k,'a-k':lambda a,k:a-k,'a*k':lambda a,k:a*k,'a+2k':lambda a,k:a+2*k,'2a+k':lambda a,k:2*a+k,'a*k+1':lambda a,k:a*k+1,'a*k-1':lambda a,k:a*k-1,'2(a+k)':lambda a,k:2*(a+k),'a*k-k':lambda a,k:a*k-k,
 'a/b':lambda a,b:a/b,'a+a+b':lambda a,b:2*a+b,'a+b+b':lambda a,b:a+2*b,'a*b+a':lambda a,b:a*b+a,'b-a':lambda a,b:b-a}
for k in (1,2,3): R[f'a+b+{k}']=lambda a,b,k=k:a+b+k
for k in (1,2): R[f'a+b-{k}']=lambda a,b,k=k:a+b-k
for b in B:
  if not re.match(r'(ps|po)\d',b['id']): continue
  t,rows=b['plain'].split(': ',1); rows=[[int(v) for v in x.split(',')[:2]]+[x.split(',')[2]] for x in rows.split(' | ')]
  n+=1; ans=R[t](rows[2][0],rows[2][1])
  ok=all(R[t](a,c)==int(v) for a,c,v in rows[:2]) and [o==str(ans) for o in b['options']].count(True)==1 and b['options'][b['correct']]==str(ans)
  answers={g(rows[2][0],rows[2][1]) for g in R.values() if all(g(a,c)==int(v) for a,c,v in rows[:2])}
  if not ok or len(answers)!=1: bad+=1; print('BAD',b['id'],b['plain'],answers)
print('v4 numeric items checked',n,'bad',bad); sys.exit(1 if bad else 0)
