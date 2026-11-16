const fs=require('fs'),path=require('path');
(async()=>{
for(const name of ['login','dashboard-auth']){
 let html=fs.readFileSync(`reference-upsells/${name}.html`,'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<link\b[^>]*rel="preload"[^>]*>/g,'');
 for(const m of html.matchAll(/href="([^\"]+)"/g)){if(!m[1].includes('.css')&&!m[1].includes('/icon.svg'))continue;const u=new URL(m[1],'https://www.getlovescope.com');const dest='public'+u.pathname;fs.mkdirSync(path.dirname(dest),{recursive:true});let data=Buffer.from(await(await fetch(u)).arrayBuffer());fs.writeFileSync(dest,data);if(u.pathname.endsWith('.css')){for(const f of data.toString().matchAll(/url\(([^)]+)\)/g)){const raw=f[1].replace(/["']/g,'');if(raw.startsWith('data:'))continue;const asset=new URL(raw,u);const out='public'+asset.pathname;fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,Buffer.from(await(await fetch(asset)).arrayBuffer()));}}}
 html=html.replace(/Loading recent analyses…/g,'No demo analyses yet.').replace('Locating target','Demo map');
 const dest=name==='login'?'public/login/index.html':'public/login/dashboard/index.html';fs.mkdirSync(path.dirname(dest),{recursive:true});
 html=html.replace('</body>','<script src="/login/demo.js" defer></script></body>');
 html=html.replace('</head>','<style>.spy-dialog{margin:auto;width:calc(100% - 32px);max-width:480px;border:1px solid #334155;border-radius:16px;background:#111827;color:#e2e8f0;padding:24px}.spy-dialog::backdrop{background:#0009}.spy-dialog p{margin:14px 0;line-height:1.6}.spy-dialog button{padding:10px 18px;background:#18a765;border-radius:8px}.spy-demo{position:relative;z-index:35;background:#10281c;color:#b6ffd4;padding:7px 12px;text-align:center;font:11px system-ui}.spy-row{padding:20px;border-bottom:1px solid #334155;display:flex;justify-content:space-between;gap:12px}.spy-row button{color:#86efac}body{overflow-x:hidden}</style></head>');
 html=html.replace(/(<body[^>]*>)/,'$1<div class="spy-demo">DEMO · Any email accepted · Simulated data · No external analysis or payments</div>');
 fs.writeFileSync(dest,html);
}
console.log('Login/dashboard HTML, original CSS and fonts saved.');
})();