function demo(){const mk=(n,b,t,cap,base)=>{const c={id:uid(),nome:n,tel:'(00) 90000-0000',end:'Rua Exemplo, '+Math.ceil(Math.random()*500),bairro:b,cidade:'Sua cidade',tipo:t,comodato:!!cap,cap:cap,media:base,obs:''};S.c.push(c);
 for(let i=1;i<=30;i++){const d=new Date();d.setDate(d.getDate()-i);const q=Math.max(5,Math.round(base*(0.7+Math.random()*0.6)*(d.getDay()===0?1.3:1)));S.h.push({id:uid(),c:c.id,date:iso(d),entregue:q,solicitada:q,voltou:0,obs:''})}};
 mk('Mercadinho Central','Centro','Ponto fixo',170,60);mk('Bar do Zé','Centro','Ponto fixo',102,35);mk('Pescados Silva','Porto','Ponto fixo',72,24);mk('Padaria Estrela','Jardim','Ponto fixo',44,15);
 mk('Evento Maria','Jardim','Pedido avulso',0,0);S.c[4].media=0;S.h=S.h.filter(h=>h.c!==S.c[4].id);
 S.o.push({id:uid(),cid:S.c[0].id,date:T,time:'07:00',qtd:80,tipo:'Conformado',status:'Pendente',obs:''},{id:uid(),cid:S.c[4].id,date:T,time:'10:00',qtd:20,tipo:'Avulso',status:'Pendente',obs:'Festa'});save()}
document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t||t.tagName==='INPUT'||t.dataset.a.startsWith('x:'))return;const a=t.dataset.a,id=t.dataset.id;
 if(a==='go'){v=t.dataset.v}else if(a==='cd'){cur=id;v='cd'}else if(a==='per'){per=+t.dataset.n}
 else if(a==='novoc')return formCliente();else if(a==='editc')return formCliente(id);else if(a==='novoh')return formHist(id);
 else if(a==='novop')return formPedido();else if(a==='editp')return formPedido(id);
 else if(a==='gerar'){const old=S.d[RK()],done=(old?.stops||[]).filter(s=>s.st==='Entregue'||s.st==='Adiado');S.d[RK()]={carga:old?.carga,stops:done.concat(buildPlan(T,done.map(s=>s.cid).concat(otherCids())))};save()}
 else if(a==='up'||a==='dn')move(id,a==='up'?-1:1);else if(a==='ent')return entregar(id);else if(a==='demo'){demo()}
 render()});
document.addEventListener('change',e=>{const t=e.target,a=t.dataset.a;if(a==='qtd'){const s=S.d[RK()].stops.find(x=>x.id===t.dataset.id);s.qty=+t.value||0;save();render()}
 if(a==='carga'){S.d[RK()].carga=t.value===''?null:+t.value;save();render()}});
render();

