(async()=>{const d=await (await fetch('data/content.json?v='+Date.now())).json();const $=i=>document.getElementById(i),e=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const set=(i,f)=>{const n=$(i);if(n)f(n)};
document.documentElement.style.setProperty('--heroimg',`url('${new URL(d.hero,location.href).href}')`);
set('h-name',n=>n.innerHTML=d.name_html||e(d.name));set('h-tag',n=>n.textContent=d.tagline||'');
set('h-rating',n=>n.innerHTML=`<span class="st" aria-hidden="true">★★★★★</span> <b>${e(d.rating)}</b>/5 · ${e(d.reviews_count)} avis Google`);
const tel='tel:'+(d.tel||'');['h-call','fab','c-call','bar'].forEach(i=>set(i,n=>n.href=tel));
['h-call','c-call'].forEach(i=>set(i,n=>n.textContent='📞 '+(d.phone||'Appeler')));set('bar-t',n=>n.textContent='Appeler · '+(d.phone||''));
if(d.booking)$('h-book').href=d.booking;else $('h-book').remove();
set('about-t',n=>n.textContent=d.about||'');
const ic={cut:'<path d="M6 7a3 3 0 100-.1M6 17a3 3 0 100 .1M8.5 8.5L20 19M8.5 15.5L20 5"/>',fade:'<path d="M4 20h16M6 16h12M8 12h8M10 8h4"/>',beard:'<path d="M5 6v5a7 7 0 0014 0V6M9 15h6"/>',kid:'<circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0114 0"/>',mil:'<path d="M12 3l3 6 6 .9-4.5 4.3 1 6.3L12 17.5 6.5 20.5l1-6.3L3 9.9 9 9z"/>'};
const pick=t=>{t=t.toLowerCase();return t.includes('barbe')?ic.beard:t.includes('enfant')?ic.kid:t.includes('militaire')?ic.mil:t.includes('dégradé')?ic.fade:ic.cut};
set('svc',n=>n.innerHTML=(d.services||[]).map(s=>`<div class="svc"><svg viewBox="0 0 24 24" aria-hidden="true">${pick(s[0]||'')}</svg><span>${e(s[0])}</span><b>${e(s[1])}</b></div>`).join(''));
set('svc-note',n=>n.textContent=d.services_note||'');set('pay',n=>n.textContent=d.payment?'Paiement : '+d.payment:'');
const g=d.gallery||[];set('gal',n=>n.innerHTML=g.map((x,i)=>`<button class="gi" data-i="${i}" aria-label="Agrandir la photo ${i+1}"><img loading="lazy" src="${e(x.sm)}" data-i="${i}" alt="${e(x.alt||d.name+' – photo '+(i+1))}"></button>`).join(''));
set('rev-sum',n=>n.innerHTML=`<span class="big">${e(d.rating)}</span><span class="st">★★★★★</span><span>${e(d.reviews_count)} avis Google · extraits d'avis publics</span>`);
set('revs',n=>n.innerHTML=(d.reviews||[]).map(r=>`<figure class="card"><div class="st" aria-label="5 étoiles">★★★★★</div><blockquote>${e(r[1])}</blockquote><figcaption><span class="av" aria-hidden="true">${e((r[0]||'?')[0])}</span>${e(r[0])} <span class="mut">· ${e(r[2])}</span></figcaption></figure>`).join(''));
// horaires + ouvert maintenant (heure de Paris)
const hs=d.hours||[];let now;try{const p=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).map(x=>[x.type,x.value]));now={d:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].indexOf(p.weekday),m:+p.hour*60+ +p.minute}}catch(_){const t=new Date();now={d:(t.getDay()+6)%7,m:t.getHours()*60+t.getMinutes()}}
const rng=s=>[...String(s||'').matchAll(/(\d{1,2})[:h](\d{2})\s*[–-]\s*(\d{1,2})[:h](\d{2})/g)].map(m=>[m[1]*60+ +m[2],m[3]*60+ +m[4]]);
set('hrs',n=>n.innerHTML=hs.map((h,i)=>`<tr class="${i==now.d?'today':''}"><td>${e(h[0])}${i==now.d?' <small>(aujourd\'hui)</small>':''}</td><td>${e(h[1])}</td></tr>`).join(''));
if(hs.length==7){const f=x=>`${String(x/60|0).padStart(2,'0')}h${String(x%60).padStart(2,'0')}`;let txt,op=false;const r=rng(hs[now.d][1]).find(([a,b])=>now.m>=a&&now.m<b);
if(r){op=true;txt=`Ouvert maintenant · jusqu'à ${f(r[1])}`}else{const later=rng(hs[now.d][1]).find(([a])=>a>now.m);if(later)txt=`Fermé · ouvre à ${f(later[0])}`;else for(let k=1;k<=7;k++){const j=(now.d+k)%7,q=rng(hs[j][1])[0];if(q){txt=`Fermé · ouvre ${k==1?'demain':(hs[j][0]||'').toLowerCase()} à ${f(q[0])}`;break}}}
if(txt)['h-open','o-open'].forEach(i=>set(i,n=>{n.hidden=false;n.className='open '+(op?'on':'off');n.innerHTML=`<i></i>${e(txt)}`}))}
set('addr',n=>n.textContent=d.address||'');if(d.coords){const [la,lo]=d.coords,dd=.004,dir=`https://www.google.com/maps/dir/?api=1&destination=${la},${lo}`;
$('osm').src=`https://www.openstreetmap.org/export/embed.html?bbox=${lo-dd},${la-dd/2},${lo+dd},${la+dd/2}&layer=mapnik&marker=${la},${lo}`;
$('osml').href=`https://www.openstreetmap.org/?mlat=${la}&mlon=${lo}#map=18/${la}/${lo}`;['gmaps','h-dir','c-dir'].forEach(i=>set(i,n=>n.href=dir))}else['h-dir','c-dir'].forEach(i=>set(i,n=>n.remove()));
set('soc',n=>n.innerHTML=(d.social||[]).map(s=>`<a href="${e(s[1])}" target="_blank" rel="noopener">${e(s[0])}</a>`).join('·'));
set('foot',n=>n.textContent=`© ${new Date().getFullYear()} ${d.name} · ${d.address} · ${d.phone}`);
// apparition au scroll
const rv=document.querySelectorAll('.rv,.svc,.card,.gi');if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.body.classList.add('anim');const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{rootMargin:'0px 0px -8% 0px'});rv.forEach(x=>io.observe(x))}
// barre d'appel mobile après le hero
const bar=$('bar'),hero=$('top');if(bar&&'IntersectionObserver'in window)new IntersectionObserver(([x])=>document.body.classList.toggle('past',!x.isIntersecting)).observe(hero);
const lb=$('lb'),im=lb.querySelector('img');let c=0;const show=i=>{c=(i+g.length)%g.length;im.src=g[c].lg;im.alt=g[c].alt||'';lb.classList.add('on')};
$('gal').onclick=ev=>{const t=ev.target.closest('[data-i]');if(t)show(+t.dataset.i)};lb.querySelector('.x').onclick=()=>lb.classList.remove('on');
lb.querySelector('.p').onclick=()=>show(c-1);lb.querySelector('.n').onclick=()=>show(c+1);lb.onclick=ev=>{if(ev.target==lb)lb.classList.remove('on')};
document.onkeydown=ev=>{if(!lb.classList.contains('on'))return;if(ev.key=='Escape')lb.classList.remove('on');if(ev.key=='ArrowLeft')show(c-1);if(ev.key=='ArrowRight')show(c+1)};})();
