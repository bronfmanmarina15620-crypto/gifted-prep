# usage: shots.py URL outprefix id1,id2,...  -> one screenshot per item (full exercise card, 390px)
import json,sys,time
from playwright.sync_api import sync_playwright
URL,pre,ids=sys.argv[1],sys.argv[2],sys.argv[3].split(',')
B={b['id']:b for b in json.load(open('/tmp/bank.json'))}
now=int(time.time()*1000); d=time.strftime('%Y-%m-%d')
log=[{'at':now-i*1000,'date':d,'area':'gifted','type':'g:'+B[x]['type'],'itemId':x,'answers':['א'],'attempts':1,'ms':3000,'outcome':'first','plain':B[x]['plain']} for i,x in enumerate(ids)]
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':390,'height':844},device_scale_factor=2)
    pg.goto(URL); pg.evaluate("([l])=>{localStorage.setItem('gifted-prep-skip-landing','1');localStorage.setItem('gifted-prep-v1',JSON.stringify({log:l,mocks:[]}))}",[log]); pg.reload(); pg.wait_for_timeout(700)
    pg.click('#btnParent'); pg.wait_for_timeout(800)
    pg.evaluate("()=>document.querySelectorAll('details').forEach(d=>d.open=true)"); pg.wait_for_timeout(400)
    qs=pg.query_selector_all('details.ex .ex-q')
    for i,q in enumerate(qs): q.screenshot(path=f'{pre}{ids[i]}.png')
    print(len(qs)); b.close()
