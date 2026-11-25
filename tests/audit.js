const {TIMER:APP,MOCK,shot}=require('./_app');
const {chromium,devices}=require('playwright');const ok=(c,m)=>console.log((c?'PASS ':'FAIL ')+m);
(async()=>{const b=await chromium.launch();const H=3600e3,now=Date.now();
const sess=[];for(let i=0;i<12;i++)sess.push({id:'s'+i,cat:i%2?'mat':'git',start:now-(i+1)*30*H-0.5*H,end:now-(i+1)*30*H});
sess.push({id:'t1',cat:'mat',start:now-1.6*H,end:now-1.1*H},{id:'t2',cat:'git',start:now-1*H,end:now-0.75*H},{id:'t3',cat:'main',start:now-0.8*H,end:now-0.2*H});
const seed=JSON.stringify({v:2,set:{target:180,dayStart:4,maxH:3},cats:[
 {id:'mat',name:'Matematika',color:'#0071e3',type:'study',limit:60},{id:'git',name:'Git',color:'#ff9500',type:'study',limit:30},
 {id:'main',name:'Main',color:'#86868b',type:'rest',limit:30},{id:'rest',name:'Istirahat',color:'#34c759',type:'rest',limit:5,cd:true}],sel:'mat',sessions:sess,active:null,sample:false});
async function mk(dev){const c=await b.newContext(dev);await c.addInitScript(s=>{if(!sessionStorage.__s){localStorage.setItem('study_break_v2',s);sessionStorage.__s='1';}},seed);
 const p=await c.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));await p.goto(APP);await p.waitForTimeout(500);return p;}
const p=await mk({viewport:{width:1366,height:820}});
const st=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('study_break_v2')));
// 1 chip 1-klik
ok((await p.locator('#chips .chip:not(.manage)').count())===2,'topik tampil langsung sebagai chip (2 belajar)');
ok((await p.textContent('#glabel'))==='Topik belajar','label grup: Topik belajar');
const on=p.locator('#chips .chip.on');ok((await on.textContent())==='Matematika'&&/linear-gradient\(135deg, rgb\(36, 50, 55\)/.test(await on.evaluate(e=>getComputedStyle(e).backgroundImage)),'chip aktif: gradasi kaca Obsidian Mist (G1)');
await p.click('#chips .chip:has-text("Git")');ok((await p.textContent('#chips .chip.on'))==='Git','ganti topik cukup 1 klik');
await p.click('#mBr');ok((await p.textContent('#glabel'))==='Kategori istirahat'&&(await p.locator('#chips .chip:not(.manage)').allTextContents()).join()==='Main,Istirahat','Break: label & chip istirahat');
// 2 Break dijelaskan
ok((await p.textContent('#tlabel')).includes('istirahat hari ini'),'Break: label "'+await p.textContent('#tlabel')+'"');
ok((await p.textContent('#tmeta')).includes('tidak mulai dari 0'),'Break: penjelasan akumulasi harian: '+await p.textContent('#tmeta'));
await p.click('#mSw');ok((await p.textContent('#tlabel'))==='Sesi ini','Stopwatch: label Sesi ini');
ok((await p.textContent('#tmeta')).includes('Git hari ini 15m dari 30m'),'Stopwatch: progres target topik: '+await p.textContent('#tmeta'));
ok((await p.$eval('#tbarFill',e=>e.style.width))==='50%','bar progres 50%');
// 3 status visual & toast
await p.click('#toggle');await p.waitForTimeout(1300);
ok((await p.getAttribute('#app','class')).includes('run'),'kartu punya status berjalan');
const appSt=await p.$eval('#app',e=>{const c=getComputedStyle(e),r=getComputedStyle(document.documentElement);return [c.boxShadow+' '+c.backgroundImage,c.backgroundImage===getComputedStyle(document.querySelector('#viewTimer .card:not(#app)')||e).backgroundImage];});
ok(!appSt[0].includes('0, 113, 227')&&appSt[1],'kartu timer tetap polos tanpa warna topik (sama dengan kartu lain)');
ok((await p.textContent('#toggle'))==='Jeda'&&(await p.getAttribute('#toggle','class')).includes('pause'),'tombol Jeda bergaya sekunder abu-abu');
const c1=await p.$eval('#toggle',e=>getComputedStyle(e).backgroundColor);
await p.click('#chips .chip:has-text("Matematika")');await p.waitForTimeout(300);
ok(/Git \d+ dtk tersimpan · lanjut Matematika/.test(await p.textContent('#toast')),'toast saat pindah topik: '+await p.textContent('#toast'));
await p.waitForTimeout(1100);await p.click('#toggle');await p.waitForTimeout(250);
ok(/Matematika \d+ dtk tersimpan/.test(await p.textContent('#toast'))&&await p.isVisible('#toast'),'toast saat jeda: '+await p.textContent('#toast'));
ok((await p.getAttribute('#app','class')).includes('paused')&&(await p.textContent('#toggle'))==='Lanjutkan','status dijeda');
const c2=await p.$eval('#toggle',e=>getComputedStyle(e).backgroundColor);ok(c1!==c2,'warna Mulai/Lanjutkan beda dari Jeda');
await p.click('#reset');await p.waitForTimeout(250);ok((await p.textContent('#toast')).includes('tetap tersimpan'),'toast saat Kembali ke 0');
ok((await p.textContent('#reset'))==='Kembali ke 0','label tombol reset jelas');
// 4 keyboard
await p.mouse.click(5,700);await p.keyboard.press('Space');await p.waitForTimeout(400);ok(!!(await st()).active,'Spasi memulai timer');
await p.keyboard.press('Space');await p.waitForTimeout(300);ok(!(await st()).active,'Spasi menjeda timer');
await p.keyboard.press('r');await p.waitForTimeout(200);ok((await p.textContent('#time'))==='00:00:00','R kembali ke 0');
ok(await p.isVisible('#kbd'),'petunjuk pintasan terlihat di desktop');
// 5 countdown
await p.click('#mCd');ok(await p.isVisible('#cdHint')&&(await p.textContent('#cdHint')).includes('1:30'),'petunjuk format j:mm terlihat');
await p.click('#cdPlus');ok((await p.inputValue('#cdIn'))==='65'&&(await p.textContent('#time'))==='01:05:00','+5 menit');
await p.click('#cdMinus');await p.click('#cdMinus');ok((await p.inputValue('#cdIn'))==='55','−5 menit');
ok((await p.textContent('#tlabel'))==='Sisa waktu','Countdown: label Sisa waktu');
await p.click('#cdIn');await p.keyboard.press('Space');ok(!(await st()).active,'Spasi saat mengetik tidak memulai timer');
await p.click('#mSw');
// 6 Hari ini
ok((await p.locator('#todayStack i').count())===2,'stacked bar multi-warna (2 topik)');
const segc=await p.locator('#todayStack i').evaluateAll(a=>a.map(e=>getComputedStyle(e).backgroundColor));ok(segc[0]!==segc[1],'segmen berwarna sesuai topik');
ok((await p.locator('#rows .mbar').count())>=3,'mini progress bar per topik bertarget');
const mainBar=p.locator('#rows .row',{hasText:'Main'}).locator('.mbar');ok((await mainBar.getAttribute('class')).includes('over'),'istirahat lewat batas ditandai');
{const q=p.locator('#rows .qp').first();await p.mouse.move(5,5);await p.waitForTimeout(250);const o0=await q.evaluate(e=>getComputedStyle(e).opacity);
await p.locator('#rows .row').first().hover();await p.waitForTimeout(250);const o1=await q.evaluate(e=>getComputedStyle(e).opacity);
ok(Number(o0)>=0.4&&Number(o0)<1&&o1==='1','▶ redup saat diam, tegas saat baris di-hover ('+o0+' → '+o1+')');}
// 7 Riwayat & pengaturan
await p.click('#tabSt');await p.waitForTimeout(500);
await p.mouse.move(5,5);const h0=p.locator('#hist .hrow').first();
ok((await h0.locator('.x').evaluate(e=>getComputedStyle(e).opacity))==='1'&&(await h0.locator('select').evaluate(e=>getComputedStyle(e).borderTopColor))!=='rgba(0, 0, 0, 0)','kontrol riwayat selalu terlihat');
ok(!(await p.locator('#viewStats details').count()),'pengaturan tidak lagi tersembunyi di Statistik');
await p.click('#toSet');ok(await p.isVisible('#viewCats')&&await p.isVisible('#setTarget')&&(await p.getAttribute('#tabKat','aria-pressed'))==='true','Pengaturan berisi target harian + kategori');
ok((await p.locator('#cats input[type=text]').count())===4,'kategori ada di Pengaturan');
await p.fill('#setTarget','4');await p.press('#setTarget','Tab');ok((await st()).set.target===240,'ubah target dari Pengaturan tersimpan');
await p.click('#tabTimer');await p.click('#chips .chip.manage');ok(await p.isVisible('#viewCats'),'chip "+ Kelola" membuka Pengaturan');
ok(p.errs.length===0,'tanpa error JS '+p.errs);
await p.click('#tabTimer');await p.click('#chips .chip:has-text("Git")');await p.click('#toggle');await p.waitForTimeout(1200);await p.screenshot({path:shot('au-win-run.png')});
await p.click('#toggle');await p.waitForTimeout(150);await p.screenshot({path:shot('au-win-toast.png')});
// phone + dark
const q=await mk({...devices['iPhone 13'],colorScheme:'dark'});
ok(await q.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'HP: tanpa overflow');
ok(!(await q.isVisible('#kbd')),'HP: petunjuk keyboard disembunyikan');
await q.click('#toggle');await q.waitForTimeout(1200);await q.screenshot({path:shot('au-hp-run.png')});
await q.click('#toggle');await q.click('#mCd');await q.screenshot({path:shot('au-hp-cd.png'),fullPage:true});
ok(q.errs.length===0,'HP tanpa error JS');
await b.close();})();
