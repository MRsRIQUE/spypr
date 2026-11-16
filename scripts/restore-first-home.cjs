const fs=require('fs'),vm=require('vm'),assert=require('assert');
fs.copyFileSync('public/index.html','reference-upsells/before-education/educational-home-before-visual-restore.html');
let h=fs.readFileSync('reference-upsells/before-education/index.html','utf8');
h=h.replace('<script src="js/urgency-bar.js?v=sl2"></script>','');
h=h.replace('<span id="act-count">476</span>','<span id="act-count">676</span>').replace('<strong id="online-c">174 people</strong>','<strong id="online-c">248 people</strong>');
h=h.replace('class="option" onclick="go(this,\'female\')"','class="option active" onclick="go(this,\'female\')"').replace("var gender = '';","var gender = 'female';");
const start=h.indexOf('var ac = 476;'),end=h.indexOf('</script>',start);assert(start>=0&&end>start);h=h.slice(0,start)+'// Static example counters match the supplied visual reference.\n'+h.slice(end);
fs.writeFileSync('public/index.html',h);
for(const s of h.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
for(const m of h.matchAll(/(?:src|href)="([^"?#]+)(?:[?#][^"]*)?"/g)){if(!/^(https?:|#)/.test(m[1]))assert(fs.existsSync('public/'+m[1].replace(/^\//,'')),m[1]);}
assert(h.includes('You Deserve <span>The Truth</span>'));assert(h.includes('class="option active"'));assert(!h.includes('urgency-bar.js'));console.log('PASS: restored visual markup, selected Woman, matching static counters, valid scripts and assets.');