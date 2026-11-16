const fs=require('fs'),vm=require('vm'),assert=require('assert');
for(let i=1;i<=7;i++){
 const html=fs.readFileSync(`public/upsell/pggsp/up${i}/index.html`,'utf8');
 assert(!/api\.paggins|centerpag|clarity\.ms|utmify|zs-analytics/.test(html));
 const elements=new Map();
 function el(id){if(!elements.has(id))elements.set(id,{style:{},classList:{add(){},remove(){}},listeners:{},addEventListener(k,f){this.listeners[k]=f},showModal(){this.open=true},close(){this.open=false}});return elements.get(id)}
 const intervals=[],timeouts=[];
 const context={document:{getElementById:el,querySelectorAll:()=>[]},window:{scrollTo(){}},setInterval:f=>(intervals.push(f),1),clearInterval(){},setTimeout:f=>timeouts.push(f)};
 vm.createContext(context);
 for(const m of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))vm.runInContext(m[1],context);
 for(let tick=0;tick<50;tick++)intervals.forEach(f=>f());
 timeouts.forEach(f=>f());
 assert.equal(el('pbar').style.width,'100%');assert.equal(el('loader').style.display,'none');assert.equal(el('offer').style.display,'block');
 el('cta-yes').listeners.click({preventDefault(){}});assert.equal(el('preview-dialog').open,true);
 el('preview-close').listeners.click();assert.equal(el('preview-dialog').open,false);
 const next=i<7?`/upsell/pggsp/up${i+1}/`:'/';assert(html.includes(`href="${next}" class="cta-no"`));
 const original=fs.readFileSync(`reference-upsells/up${i}.html`,'utf8');assert.equal(html.match(/<style>([\s\S]*?)<\/style>/)[1],original.match(/<style>([\s\S]*?)<\/style>/)[1]);
 console.log(`PASS up${i}: original CSS, loader completion, demo open/close, next route, no checkout/tracking`);
}