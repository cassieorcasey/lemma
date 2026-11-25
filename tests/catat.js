const {APP,MOCK,shot}=require('./_app');
// Uji layar Catat, Progres, dan hubungan timer → catatan hasil, dengan jam palsu.
const {chromium,devices}=require('playwright');const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
const T0=Date.parse('2026-11-18T03:00:00Z');          // Rabu 10.00 WIB
(async()=>{const b=await chromium.launch();
async function fresh(extra,ctx,hash){const c=await b.newContext(ctx||{viewport:{width:1366,height:768}});const p=await c.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));
  await p.clock.install({time:T0});
  const seed=JSON.stringify(Object.assign({v:2,set:{target:180,dayStart:4,maxH:3},cats:[
    {id:'mat',name:'Matematika',color:'#0071e3',type:'study',limit:60},{id:'git',name:'Git',color:'#ff9500',type:'study',limit:30},
    {id:'main',name:'Main',color:'#86868b',type:'rest',limit:30}],sel:'mat',sessions:[],active:null,sample:false},extra||{}));
  await c.addInitScript(s=>{if(!localStorage.getItem('study_break_v2'))localStorage.setItem('study_break_v2',s);},seed);
  await c.route(/cdn\.jsdelivr\.net/,r=>r.fulfill({contentType:'application/javascript',body:MOCK}));
  await p.goto(APP+(hash||''));await p.waitForFunction(()=>window.StudyO);await p.waitForTimeout(100);return p;}
const S=p=>p.evaluate(()=>JSON.parse(localStorage.getItem('study_break_v2')));
const errs=[];

// 1. Layar pertama: Catat, tanpa angka jam atau target
let p=await fresh();
ok(await p.isVisible('#viewLog')&&await p.isHidden('#viewTimer'),'layar pertama adalah Catat');
ok((await p.getAttribute('#tabLog','aria-selected'))==='true','tab Catat terpilih');
const logTxt=await p.textContent('#viewLog');ok(!/target|\/ 3j|jam/i.test(logTxt),'layar Catat tanpa target atau total jam');
ok((await p.locator('#logCats .chip').allTextContents()).join()==='Matematika,Git','topik: hanya kategori belajar');
ok((await p.getAttribute('#logCats .chip.on','aria-pressed'))==='true'&&(await p.textContent('#logCats .chip.on'))==='Matematika','topik terakhir sudah terpilih');
ok((await p.locator('#kinds .kind').allTextContents()).join()==='Bab selesai,Rangkuman,Latihan soal,Paham konsep','4 jenis hasil');
ok(await p.isDisabled('#logSave'),'Simpan nonaktif sebelum jenis dipilih');

// 2. Catat dalam dua ketukan: jenis lalu Simpan
await p.click('#kinds .kind:has-text("Bab selesai")');ok(!(await p.isDisabled('#logSave')),'jenis dipilih: Simpan aktif');
await p.click('#logSave');
let s=await S(p);ok(s.notes.length===1&&s.notes[0].kind==='bab'&&s.notes[0].cat==='mat'&&s.notes[0].n===null&&s.notes[0].min===null&&s.notes[0].text==='','catatan minimal tersimpan (jumlah dan menit kosong)');
ok(/Tercatat · Bab selesai · Matematika/.test(await p.textContent('#toast')),'toast konfirmasi');
ok(await p.isDisabled('#logSave')&&!(await p.locator('#kinds .kind[aria-pressed="true"]').count()),'form kembali kosong, topik tetap');
// catatan lengkap lewat Enter
await p.click('#logCats .chip:has-text("Git")');await p.click('#kinds .kind:has-text("Latihan soal")');
await p.fill('#logN','12');await p.fill('#logMin','45');await p.fill('#logText','  Rebase interaktif sudah paham  ');await p.press('#logText','Enter');
s=await S(p);const n2=s.notes[1];ok(n2&&n2.cat==='git'&&n2.kind==='soal'&&n2.n===12&&n2.min===45&&n2.text==='Rebase interaktif sudah paham','catatan lengkap lewat Enter: jumlah, menit, kalimat dirapikan');
ok(s.logCat==='git','topik terakhir diingat');
const today=await p.textContent('#logToday');ok(/Latihan soal.*Rebase interaktif.*Git · 10\.00 · 12 soal · 45m/.test(today.replace(/\s+/g,' ')),'Hari ini: jenis, kalimat, topik, jam, jumlah, menit');
ok((await p.locator('#logToday .note').first().textContent()).includes('Rebase'),'Hari ini: terbaru di atas');
await p.reload();await p.waitForFunction(()=>window.StudyO&&document.querySelectorAll('#logToday .note').length===2,null,{timeout:5000}).catch(()=>{});ok((await p.locator('#logToday .note').count())===2&&(await p.textContent('#logCats .chip.on'))==='Git','setelah muat ulang: catatan dan topik tetap');

// 3. Hapus: ketukan pertama meminta konfirmasi
const x=p.locator('#logToday .note .x').first();await x.click();ok((await x.textContent())==='Hapus'&&(await S(p)).notes.length===2,'ketuk pertama: minta konfirmasi');
await x.click();ok((await S(p)).notes.length===1&&(await p.locator('#logToday .note').count())===1,'ketuk kedua: catatan terhapus');
errs.push(...p.errs);

// 4. Timer → catatan: menit terisi dari timer
p=await fresh();
await p.click('#tabTimer');await p.click('#toggle');await p.clock.fastForward('25:00');
await p.click('#tabLog');await p.waitForTimeout(400);
ok(/\d{2}:\d{2}/.test(await p.textContent('#navTime'))&&await p.evaluate(()=>document.getElementById('tabTimer').classList.contains('live')),'timer berjalan terlihat di navigasi saat di Catat ('+(await p.textContent('#navTime'))+')');
await p.click('#tabTimer');await p.click('#toggle');await p.waitForTimeout(200);
ok(await p.isVisible('#logAsk')&&/Matematika · 25m dari timer/.test(await p.textContent('#logAskText')),'jeda: tawaran mencatat hasil muncul ('+(await p.textContent('#logAskText'))+')');
await p.click('#logAskGo');await p.waitForTimeout(200);
ok(await p.isVisible('#viewLog')&&(await p.inputValue('#logMin'))==='25'&&await p.isVisible('#logFrom'),'Catat hasil: layar Catat, menit 25 terisi dari timer');
await p.click('#kinds .kind:has-text("Paham konsep")');await p.click('#logSave');
s=await S(p);ok(s.notes[0].min===25&&!s.drafts.mat,'tersimpan dengan menit dari timer, draf terhapus');
await p.click('#tabTimer');ok(await p.isHidden('#logAsk'),'tawaran hilang setelah dicatat');
// dua jeda pada topik yang sama dijumlahkan
await p.click('#reset');await p.click('#toggle');await p.clock.fastForward('10:00');await p.click('#toggle');await p.click('#toggle');await p.clock.fastForward('05:00');await p.click('#toggle');
ok(/15m dari timer/.test(await p.textContent('#logAskText')),'dua jeda dijumlahkan: 15m');
await p.click('#logAskLater');ok(await p.isHidden('#logAsk')&&!(await S(p)).drafts.mat,'Nanti: tawaran dan draf dibuang');
// Break tidak menawarkan catatan
await p.click('#mBr');await p.click('#toggle');await p.clock.fastForward('05:00');await p.click('#toggle');
ok(await p.isHidden('#logAsk')&&!Object.keys((await S(p)).drafts).length,'istirahat tidak menawarkan catatan hasil');
errs.push(...p.errs);

// 5. Countdown selesai saat layar Catat terbuka
p=await fresh();
await p.click('#tabTimer');await p.click('#mCd');await p.click('#presets button:has-text("15m")');await p.click('#toggle');
await p.click('#tabLog');await p.clock.fastForward('15:30');await p.waitForTimeout(400);
ok((await p.textContent('#navTime'))==='Selesai'&&await p.evaluate(()=>document.getElementById('tabTimer').classList.contains('done')),'countdown habis di layar Catat: navigasi menandai Selesai');
s=await S(p);ok(s.sessions.length===1&&Math.abs(s.sessions[0].end-s.sessions[0].start-15*60e3)<3000,'sesi countdown tersimpan tepat 15 menit');
await p.click('#tabTimer');ok(await p.isVisible('#logAsk'),'countdown selesai: tawaran mencatat muncul');
errs.push(...p.errs);

// 6. Progres: per topik, hitungan minggu ini, kategori terhapus tetap tampil
const D=864e5,mk=(id,cat,kind,ago,text)=>({id,cat,kind,text:text||'',n:null,min:null,at:T0-ago*D});
const notes=[mk('a','mat','bab',0,'Turunan'),mk('b','mat','soal',1),mk('c','git','rangkuman',2,'Branching'),mk('d','old','konsep',0,'Big-O'),mk('e','mat','bab',9,'Limit')];
for(let i=0;i<5;i++)notes.push(mk('m'+i,'mat','konsep',3+i*0.1));
p=await fresh({notes,gone:{old:{id:'old',name:'Algoritma',color:'#30b0c7',type:'study',limit:0}}},null,'#progres');
ok(await p.isVisible('#viewProg')&&(await p.getAttribute('#tabProg','aria-selected'))==='true','alamat #progres membuka Progres');
const sum=(await p.textContent('#progSum')).replace(/\s+/g,' ');ok(/1Rangkuman/.test(sum)&&/1Paham konsep/.test(sum)&&/1Bab selesai/.test(sum)&&/1Latihan soal/.test(sum),'hitungan per jenis minggu ini (Senin–hari ini), catatan sebelum Senin tidak dihitung');
ok(!/jam|target|%/i.test(await p.textContent('#viewProg').then(t=>t.replace('Lihat jam belajar di Statistik',''))),'Progres tanpa jam, target, atau persen');
const heads=await p.locator('#progTopics .tcard h3').allTextContents();ok(heads[0].startsWith('Matematika')||heads[0].startsWith('Algoritma'),'topik terbaru di atas: '+heads.join(' | '));
ok(heads.some(h=>/Algoritma.*dihapus/.test(h)),'kategori terhapus tetap tampil dengan label dihapus');
const matCard=p.locator('#progTopics .tcard',{hasText:'Matematika'});
ok((await matCard.locator('.note').count())===5&&/Lihat semua \(8\)/.test(await matCard.textContent()),'per topik: 5 terbaru + Lihat semua (8)');
await matCard.locator('.more button').click();ok((await p.locator('#progTopics .tcard',{hasText:'Matematika'}).locator('.note').count())===8,'Lihat semua: 8 catatan');
ok(/8 hasil · 2 minggu ini/.test(await p.locator('#progTopics .tcard',{hasText:'Matematika'}).locator('.tsub').textContent()),'subjudul: total dan minggu ini');
await p.screenshot({path:shot('catat-progres-win.png'),fullPage:true});
await p.click('#toStats');ok(await p.isVisible('#viewStats'),'tautan ke Statistik jam (layar sekunder)');
errs.push(...p.errs);

// 7. Muat ulang saat timer berjalan membuka Timer; HP tidak bergeser horizontal
p=await fresh({active:{cat:'mat',start:T0-60e3,ok:false}});ok(await p.isVisible('#viewTimer'),'timer masih berjalan dari kunjungan lalu: langsung ke Timer');
for(const [nm,dev] of [['hp',devices['iPhone 13']],['hp-dark',{...devices['iPhone SE'],colorScheme:'dark'}]]){
  p=await fresh({notes},dev);
  const w=await p.evaluate(()=>[document.documentElement.scrollWidth,innerWidth]);
  const wrap=await p.evaluate(()=>[...document.querySelectorAll('#kinds .kind')].every(k=>k.scrollWidth<=k.clientWidth+1));
  ok(w[0]<=w[1]&&wrap,nm+': tanpa geser horizontal, label jenis muat ('+w.join('/')+')');
  await p.waitForTimeout(700);await p.screenshot({path:shot('catat-'+nm+'.png'),fullPage:true});
  await p.click('#tabProg');await p.waitForTimeout(700);await p.screenshot({path:shot('progres-'+nm+'.png'),fullPage:true});
  errs.push(...p.errs);
}
ok(errs.length===0,'tanpa error JS '+errs.join('|'));
await b.close();})();
