
const CONFIG={DEMO_AUTO:!!(window.SETTI_CONFIG&&window.SETTI_CONFIG.DEMO_AUTO)},VIEW_ONLY=false,KEY='gelo_mvp_v1';let S={c:[],h:[],o:[],d:{}},v='dia',cur=null,per=30;
if(!VIEW_ONLY)try{const x=JSON.parse(localStorage.getItem(KEY));if(x)S=x}catch(e){}
let save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const pad=n=>String(n).padStart(2,'0'),iso=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const T=iso(new Date()),uid=()=>Math.random().toString(36).slice(2,9);
let rt=1;const RK=(n=rt)=>n>1?T+'#'+n:T,rks=()=>{const a=[1];for(let n=2;n<=9;n++)if(S.d[RK(n)])a.push(n);return a};
const otherCids=()=>rks().filter(n=>n!==rt).flatMap(n=>(S.d[RK(n)]?.stops||[]).map(x=>x.cid));
const allStops=()=>{const r=rks().filter(n=>S.d[RK(n)]);return r.length?r.flatMap(n=>S.d[RK(n)].stops):buildPlan(T)};
const rotaChips=()=>`<div class="chips" style="margin-top:8px">${rks().map(n=>`<button class="btn sm ${n===rt?'':'s'}" data-a="x:rt" data-n="${n}">Rota ${n}</button>`).join('')}${rks().length<6?'<button class="btn sm s" data-a="x:nrt">+ Nova rota</button>':''}${S.d[RK()]&&(rt>1||rks().length===1)?`<button class="btn sm s" style="color:var(--er)" data-a="x:delr">🗑 ${rt>1?'Excluir rota '+rt:'Descartar plano'}</button>`:''}</div>`;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dt=s=>s.split('-').reverse().join('/'),wd=s=>new Date(s+'T12:00').getDay();
const DN=['domingo','segunda-feira','terça-feira','quarta-feira','quinta-feira','sexta-feira','sábado'];
const ago=s=>Math.round((new Date(T+'T12:00')-new Date(s+'T12:00'))/864e5);
const C=id=>S.c.find(c=>c.id===id)||{nome:'(removido)'};
const net=h=>(+h.entregue||0)-(+h.voltou||0);
const hist=(cid,days=90)=>S.h.filter(h=>h.c===cid&&ago(h.date)<=days).sort((a,b)=>b.date.localeCompare(a.date));
const mean=a=>a.length?a.reduce((s,x)=>s+x,0)/a.length:0;
// Previsão simples e transparente: média por entrega (90d); se houver >=2 entregas no mesmo dia da semana, usa a média desse dia.
function forecast(c,date){const hs=hist(c.id),avg=hs.length?mean(hs.map(net)):(+c.media||0);
 const same=hs.filter(h=>wd(h.date)===wd(date));let p=same.length>=2?mean(same.map(net)):avg;
 p=Math.round(p);if(c.comodato&&c.cap)p=Math.min(p,+c.cap);return{avg,pred:p,last:hs[0]}}
const ords=(date,cid)=>S.o.filter(o=>o.date===date&&o.status!=='Cancelado'&&(!cid||o.cid===cid));
function buildPlan(date,skip=[]){const out=[];
 S.c.forEach(c=>{if(skip.includes(c.id))return;const os=ords(date,c.id);if(c.pausaAte&&date<c.pausaAte&&!os.length)return;const conf=os.filter(o=>o.tipo==='Conformado').reduce((s,o)=>s+ +o.qtd,0),av=os.filter(o=>o.tipo==='Avulso').reduce((s,o)=>s+ +o.qtd,0);
  const f=forecast(c,date);let qty=0,tipo='';
  if(c.tipo==='Ponto fixo'){qty=conf||f.pred;tipo=conf?'Confirmado':'Previsto';qty+=av;if(av&&!conf)tipo='Previsto + avulso'}
  else if(os.length){qty=conf+av;tipo=conf?'Confirmado':'Avulso'}
  if(qty>0)out.push({id:uid(),cid:c.id,qty,rec:f.pred,conf,tipo,st:'Pendente',done:null,obs:c.recado&&c.pausaAte&&date>=c.pausaAte?'Recado: '+c.recado:'',b:c.bairro||''})});
 return out.sort((a,b)=>a.b.localeCompare(b.b))}
const stops=()=>S.d[RK()]?.stops||buildPlan(T,otherCids());
const sum=a=>a.reduce((s,x)=>s+x,0);
function stats(sts){const st=(sts||allStops()).filter(x=>x.st!=='Adiado'),tot=sum(st.map(s=>s.qty)),ent=sum(st.filter(s=>s.st==='Entregue').map(s=>+s.done||0)),pend=sum(st.filter(s=>s.st!=='Entregue').map(s=>s.qty));
 const os=ords(T);return{st,tot,ent,pend,conf:os.filter(o=>o.tipo==='Conformado').length,av:os.filter(o=>o.tipo==='Avulso').length,rec:Math.ceil(tot*1.1),carga:rks().some(n=>S.d[RK(n)]?.carga!=null)?sum(rks().map(n=>+S.d[RK(n)]?.carga||0)):undefined}}
