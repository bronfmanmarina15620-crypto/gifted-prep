import json, sys, time
from playwright.sync_api import sync_playwright
URL=sys.argv[1]; ids=json.load(open('/tmp/ids.json'))
now=int(time.time()*1000); d=time.strftime('%Y-%m-%d'); outs=['first','solved','help']
log=[{'at':now-i*1000,'date':d,'area':'gifted','type':'g:'+x['type'],'itemId':x['id'],'answers':['א','ב','ג'][:1+i%3],'attempts':1+i%3,'ms':3000,'outcome':outs[i%3],'plain':x['plain']} for i,x in enumerate(ids)]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    pg.goto(URL); pg.evaluate("([l])=>{localStorage.setItem('gifted-prep-skip-landing','1');localStorage.setItem('gifted-prep-v1',JSON.stringify({log:l,mocks:[]}))}",[log]); pg.reload(); pg.wait_for_timeout(600)
    pg.click('#btnParent'); pg.wait_for_timeout(800)
    res=pg.evaluate("""()=>{document.querySelectorAll('details').forEach(d=>d.open=true);
      const rows=[...document.querySelectorAll('details.ex')];const bad=[];
      for(const r of rows){const t=r.innerText;const n=r.querySelectorAll('.ex-opt').length;const title=r.querySelector('summary').innerText;
        if(n!==4||/[<>]|span/.test(t)||!r.querySelector('.is-key'))bad.push(title.slice(0,60)+' opts='+n)}
      return {rows:rows.length,bad}}""")
    print('rows',res['rows'],'bad',len(res['bad'])); [print(' ',x) for x in res['bad'][:30]]
    b.close()
    sys.exit(1 if res['bad'] or res['rows']!=len(ids) else 0)
