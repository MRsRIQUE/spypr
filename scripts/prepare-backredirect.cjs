const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync('reference-upsells/backredirect.html','utf8');
let html=src.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
html=html.replace(/href="https:\/\/paggins\.com\/checkout\/[^\"]+"/g,'href="#preview-dialog"');
html=html.replace(' JS-initiate-checkout js-initiate-checkout','');
html=html.replace('</head>','<meta name="robots" content="noindex,nofollow"><script src="/js/urgency-bar.js" defer></script><style>.demo-dialog{margin:auto;width:calc(100% - 32px);max-width:420px;padding:24px;border:1px solid #e8e8e8;border-radius:16px;font-family:Inter,sans-serif}.demo-dialog::backdrop{background:rgba(0,0,0,.5)}.demo-dialog p{line-height:1.6;margin:14px 0 20px}.demo-dialog a{display:block;text-align:center}.demo-note{font-size:11px;color:#666;text-align:center;margin-top:12px}</style></head>');
html=html.replace('<div class="trust-row">','<p class="demo-note">Visual demonstration · No payment or private-data access</p><div class="trust-row">');
const js=`function claimOffer(e){if(e)e.preventDefault();document.getElementById('preview-dialog').showModal();}
function skipOffer(){window.location.assign('/');}
function closePreview(){document.getElementById('preview-dialog').close();}
(function(){function tick(){var end=Date.now();try{end=Number(localStorage.getItem('sl_accessExpiresAt')||sessionStorage.getItem('sl_accessExpiresAt'))||end;}catch(e){}var remaining=Math.max(0,end-Date.now());document.getElementById('tm').textContent=String(Math.floor(remaining/60000)).padStart(2,'0');document.getElementById('ts').textContent=String(Math.floor(remaining/1000)%60).padStart(2,'0');setTimeout(tick,250);}tick();})();`;
html=html.replace('</body>',`<dialog id="preview-dialog" class="demo-dialog" aria-labelledby="preview-title"><h2 id="preview-title">Visual demonstration</h2><p>No purchase has been made. This preview does not access private messages, photos or accounts.</p><a class="cta-btn" href="/upsell/pggsp/up1/">View upsell previews</a><button class="skip-btn" type="button" onclick="closePreview()">Back to this offer</button></dialog><script>${js}</script></body>`);
assert.equal(src.match(/<style>([\s\S]*?)<\/style>/)[1],html.match(/<style>([\s\S]*?)<\/style>/)[1]);
assert(!/paggins\.com|utmify|zs-analytics|pushState|sendBeacon|fetch\(/.test(html));
const els={};const context={document:{getElementById(id){return els[id]??=( {showModal(){this.open=true},close(){this.open=false}})}},window:{location:{assign(path){context.destination=path}}},localStorage:{getItem(){return String(Date.now()+120000)}},sessionStorage:{getItem(){return null}},setTimeout(){}};
vm.createContext(context);vm.runInContext(js,context);context.claimOffer({preventDefault(){}});assert(els['preview-dialog'].open);context.closePreview();assert(!els['preview-dialog'].open);context.skipOffer();assert.equal(context.destination,'/');assert(/^\d\d$/.test(els.tm.textContent));
fs.writeFileSync('public/backredirect.html',html);
fs.appendFileSync('README.md','\n/backredirect.html: original visual offer and shared countdown. Checkout opens a demo dialog, decline returns home, browser Back works normally.\n');
console.log('PASS: CSS preserved; countdown, demo open/close and return-home tested; no tracking, checkout or history trap.');