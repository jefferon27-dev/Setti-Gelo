// ===== Sincronização com banco compartilhado (com fila offline e mesclagem) =====
const KEYS={c:[],h:[],o:[],d:{},f:[],fin:[],vei:[],vm:[],eit:[{id:'gelo',nome:'Gelo (pacote)',un:'pct',min:0}],em:[],fech:{},cfg:{preco:0,empresa:'',pin:''},pg:[],acc:[]},lastW={},busy={},seen={},ADMK=['f','cfg'],J=JSON.stringify;
try{Object.assign(lastW,JSON.parse(localStorage.getItem(KEY+'_w')||'{}'))}catch(e){}
const persW=()=>{try{localStorage.setItem(KEY+'_w',J(lastW))}catch(e){}};
const ensure=()=>{for(const k in KEYS)if(S[k]==null)S[k]=KEYS[k];migrateNotas();if(/^Polar Gelo/.test(S.cfg.empresa||''))S.cfg.empresa='Setti Gelo';if(!S.cfg.estStart)S.cfg.estStart=T;if(!S.cfg.fiadoStart)S.cfg.fiadoStart=T};
const canW=k=>ADM||!ADMK.includes(k),dirtyKeys=()=>Object.keys(KEYS).filter(k=>canW(k)&&S[k]!=null&&J(S[k])!==lastW[k]);
// mescla por id: o que foi alterado/criado aqui prevalece; o que outros criaram/alteraram é mantido
function merge(rem,loc,base){
 if(Array.isArray(rem)&&Array.isArray(loc)){const bm=new Map((Array.isArray(base)?base:[]).filter(x=>x&&x.id).map(x=>[x.id,J(x)])),rm=new Map(rem.map(x=>[x.id,x])),lm=new Set(loc.map(x=>x.id)),out=[];
  loc.forEach(x=>{const r=rm.get(x.id);if(r)out.push(J(x)!==bm.get(x.id)?x:r);else if(!bm.has(x.id))out.push(x)});
  rem.forEach(x=>{if(!lm.has(x.id)&&!bm.has(x.id))out.push(x)});return out}
 if(rem&&loc&&typeof rem==='object'&&!Array.isArray(rem)){const o={...rem},b=base&&typeof base==='object'?base:{};for(const k in loc)if(J(loc[k])!==J(b[k]))o[k]=loc[k];for(const k in b)if(!(k in loc))delete o[k];return o}
 return loc}
async function pushKey(k){if(!DB||!canW(k)||S[k]==null)return;if(J(S[k])===lastW[k])return;if(busy[k]){setTimeout(()=>pushKey(k),600);return}
 busy[k]=1;let merged=false;try{const ref=DB.doc('app/'+k),sn=await ref.get(),rv=sn.exists?sn.data().v:undefined;
  if(rv!==undefined&&rv!==lastW[k]){let base=null;try{base=lastW[k]?JSON.parse(lastW[k]):null}catch(e){}S[k]=merge(JSON.parse(rv),S[k],base);merged=true}
  const out=J(S[k]);if(out!==rv)await ref.set({v:out});lastW[k]=out;persW();save0();wErr=''}catch(e){wErr=(e&&e.code)||'erro'}finally{busy[k]=0;updSub();if(merged&&canR())render()}}
const subTxt=()=>DN[wd(T)]+', '+dt(T)+(isDb?' · ☁ '+(ADM?'admin':'equipe')+(navigator.onLine===false?' · 📴 sem internet':'')+(RO?' · 👁 somente leitura':wErr?' · ⚠ não gravou na nuvem':dirtyKeys().length?' · ⏳ envio pendente':' · sincronizado'):' · só neste aparelho');
const updSub=()=>{const e=document.getElementById('sub');if(e)e.textContent=subTxt()};
const save0=save;save=function(){save0();if(DB)Object.keys(KEYS).forEach(pushKey);updSub()};
const retry=()=>{if(DB)Object.keys(KEYS).forEach(pushKey);updSub()};
setInterval(()=>{if(navigator.onLine!==false)retry();else updSub()},15000);addEventListener('online',retry);addEventListener('offline',updSub);
(async()=>{try{try{DLd=await claude.use('downloads')}catch(e){}try{PR.a=await claude.use('assets');PR.ok=!!PR.a}catch(e){}const db=await claude.use('db');if(!db)return;const u=await claude.use('user');ADM=u?await u.canEdit():true;try{WHO=(await u.me()).name||''}catch(e){}try{RO=u?(await u.can('data.write'))===false:false}catch(e){}U=u;try{MYID=u?(await u.me()).id:null}catch(e){}try{CANADD=u?await u.can('people.add'):null}catch(e){}DB=db;isDb=true;
 Object.keys(KEYS).forEach(k=>DB.doc('app/'+k).onSnapshot(sn=>{
  if(sn.exists){const str=sn.data().v;if(str!==lastW[k]){if(lastW[k]!==undefined&&canW(k)&&S[k]!=null&&J(S[k])!==lastW[k])pushKey(k);else{lastW[k]=str;try{S[k]=JSON.parse(str)}catch(e){}ensure();save0();persW()}}}
  else if(ADM&&!seen[k]&&S[k]!=null){ensure();pushKey(k)}
  seen[k]=true;if(k==='acc'){registerMe();loadNames()}if(canR())render()},()=>{}));
 render()}catch(e){}})();
// ===== Dados fictícios para apresentação =====
