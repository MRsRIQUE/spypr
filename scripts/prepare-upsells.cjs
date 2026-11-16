const fs=require('fs');
const root='public/upsell/pggsp';
fs.mkdirSync(root,{recursive:true});
for(let i=1;i<=7;i++){
 const source=fs.readFileSync(`reference-upsells/up${i}.html`,'utf8');
 let html=source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
 let animation=source.slice(source.indexOf('  function showOffer(){'),source.indexOf('  var TIER ='));
 if(!animation||!animation.includes('setInterval'))throw Error(`Animation missing ${i}`);
 animation=animation.replace(/\s*applyUtmPriceFilter\(\);/g,'');
 const next=i<7?`/upsell/pggsp/up${i+1}/`:'/';
 html=html.replace(/href="https:\/\/api\.paggins\.com\/[^\"]+\/accept[^\"]*"/g,'href="#preview-dialog"');
 html=html.replace(/href="https:\/\/api\.paggins\.com\/[^\"]+\/decline[^\"]*"/g,`href="${next}"`);
 html=html.replace('</head>','<meta name="robots" content="noindex,nofollow"><style>dialog.preview-dialog{margin:auto;width:calc(100% - 32px);max-width:420px;border:1px solid #e8e8e8;border-radius:16px;padding:24px;font-family:Inter,system-ui,sans-serif}dialog.preview-dialog::backdrop{background:rgba(0,0,0,.5)}.preview-dialog p{line-height:1.6;margin:12px 0 20px}.preview-dialog button{font:inherit;padding:10px;cursor:pointer}.preview-label{text-align:center;font-size:11px;color:#666;padding:12px}</style></head>');
 html=html.replace('</body>',`<div class="preview-label">Visual demonstration · No payment or private-data access</div><dialog class="preview-dialog" id="preview-dialog" aria-labelledby="preview-heading"><h2 id="preview-heading">Visual demonstration</h2><p>No purchase has been made. This preview does not access private messages, cameras, locations or accounts.</p><a class="cta-yes" href="${next}">${i<7?'View next upsell':'Return to home'}</a><button class="cta-no" id="preview-close">Back to this offer</button></dialog><script>${animation}\ndocument.getElementById('cta-yes').addEventListener('click',function(e){e.preventDefault();document.getElementById('preview-dialog').showModal();});document.getElementById('preview-close').addEventListener('click',function(){document.getElementById('preview-dialog').close();});</script></body>`);
 fs.mkdirSync(`${root}/up${i}`,{recursive:true});
 fs.writeFileSync(`${root}/up${i}/index.html`,html);
 console.log(`up${i}: ${html.length} characters, loader animation preserved`);
}
fs.appendFileSync('README.md','\nSeven upsell previews: /upsell/pggsp/up1 through /upsell/pggsp/up7. Original loader timing and CSS preserved. Decline advances locally; accept opens a demo dialog. All original checkout/analytics JavaScript removed.\n');
fs.writeFileSync('.vercelignore','reference-upsells\nscripts\n.env*\n');