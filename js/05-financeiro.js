
// ===== Módulos 2: Admin, Funcionários, Financeiro, Estoque, Veículos =====
S.f=S.f||[];S.fin=S.fin||[];S.vei=S.vei||[];S.vm=S.vm||[];S.eit=S.eit||[{id:'gelo',nome:'Gelo (pacote)',un:'pct',min:0}];S.em=S.em||[];S.fech=S.fech||{};S.cfg=S.cfg||{preco:0,empresa:'',pin:''};
if(!S.cfg.estStart){S.cfg.estStart=T;save()}
S.pg=S.pg||[];if(!S.cfg.fiadoStart){S.cfg.fiadoStart=T;save()}
let me=null,lerr='',isDb=false,ADM=true,DB=null,RO=false,wErr='',WHO='';const R$=n=>'R$ '+(+n||0).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}),rng=n=>x=>{const a=ago(x);return a>=0&&a<n};
const bk=()=>`<button class="btn s sm" data-a="go" data-v="mais">← Mais</button>`;
const ap=h=>h.ap!==undefined?h.ap:C(h.c).fiado==='sim';
const pc=c=>+c.preco||+S.cfg.preco||0,hs5=x=>{let h=5381;for(const c of x)h=((h<<5)+h+c.charCodeAt(0))|0;return String(h)};
function tot(n){const r=rng(n),hh=S.h.filter(h=>r(h.date)),q=sum(hh.map(net)),rec=sum(hh.map(h=>net(h)*pc(C(h.c)))),
 fia=sum(hh.filter(h=>ap(h)&&h.date>=S.cfg.fiadoStart).map(h=>net(h)*pc(C(h.c)))),rcb=sum(S.pg.filter(x=>r(x.date)).map(x=>+x.valor)),
 rm=sum(S.fin.filter(x=>r(x.date)&&x.tipo==='Receita').map(x=>+x.valor)),dm=sum(S.fin.filter(x=>r(x.date)&&x.tipo==='Despesa').map(x=>+x.valor)),
 vv=sum(S.vm.filter(x=>r(x.date)).map(x=>+x.valor||0)),pe=sum(S.f.filter(f=>f.ativo!=='nao').map(f=>(+f.sal||0)/30))*n,lucro=rec+rm-dm-vv-pe;
 return{q,rec,rm,dm,vv,pe,fia,rcb,rt:rec+rm,ct:dm+vv+pe,lucro,caixa:lucro-fia+rcb}}
const line=(a,b,c='')=>`<div class="row sp" style="padding:5px 0;border-bottom:1px solid var(--br)"><span>${a}</span><b style="${c}">${b}</b></div>`;
function vFin(){const n=S.cfg.fp||1,t=tot(n),fc=Object.entries(S.fech).sort((a,b)=>b[0].localeCompare(a[0])).slice(0,10),ls=[...S.fin].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,12);
 return bk()+`<div class="row sp"><h2>Financeiro</h2><button class="btn sm" data-a="x:novoL">+ Lançamento</button></div>
 ${+S.cfg.preco?'':'<div class="card"><span class="tag wa">Atenção</span> Defina o preço por pacote em Administração para calcular a receita das entregas automaticamente.</div>'}
 <div class="chips">${[[1,'Hoje'],[7,'7 dias'],[30,'30 dias']].map(([k,l])=>`<button class="btn sm ${k===n?'':'s'}" data-a="x:fp" data-n="${k}">${l}</button>`).join('')}</div>
 <div class="card"><div class="mu">Resultado do período</div><div style="font-size:34px;font-weight:800;color:${t.lucro>=0?'var(--ok)':'var(--er)'}">${R$(t.lucro)}</div>
 ${line('Entregas ('+nf(t.q)+' pct)',R$(t.rec))}${line('Outras receitas',R$(t.rm))}${line('Despesas','− '+R$(t.dm))}${line('Veículos (combustível, manut.)','− '+R$(t.vv))}${line('Pessoal (estimado)','− '+R$(t.pe))}${line('Vendido fiado (a receber)','− '+R$(t.fia))}${line('Recebido de fiado','+ '+R$(t.rcb))}${line('Caixa do período',R$(t.caixa),'color:var(--pr)')}</div>
 <button class="btn ok" data-a="x:fechar">Fechar o dia (${dt(T)})</button>
 <h2>Fechamentos</h2>${fc.map(([d,x])=>`<div class="card"><div class="row sp"><b>${dt(d)}</b><b style="color:${x.lucro>=0?'var(--ok)':'var(--er)'}">${R$(x.lucro)}</b></div><div class="mu">Receita ${R$(x.rt)} · Custos ${R$(x.ct)} · ${x.q} pacotes</div></div>`).join('')||'<div class="mu">Nenhum fechamento salvo.</div>'}
 <h2>Últimos lançamentos</h2>${ls.map(x=>`<div class="card" data-a="x:el" data-id="${x.id}" style="cursor:pointer"><div class="row sp"><span>${dt(x.date)} · ${esc(x.cat)}</span><b style="color:${x.tipo==='Receita'?'var(--ok)':'var(--er)'}">${x.tipo==='Receita'?'+':'−'} ${R$(x.valor)}</b></div>${x.obs?`<div class="mu">${esc(x.obs)}</div>`:''}</div>`).join('')||'<div class="mu">Nenhum lançamento.</div>'}`}
function fLanc(id){const x=S.fin.find(y=>y.id===id)||{tipo:'Despesa',date:T};modal(id?'Editar lançamento':'Novo lançamento',SEL('tipo','Tipo',['Despesa','Receita'],x.tipo)+SEL('cat','Categoria',['Energia','Água','Embalagem','Aluguel','Impostos','Funcionários','Outros','Venda balcão'],x.cat)+F('valor','Valor (R$)',x.valor??'','number','step="0.01" min="0" required')+F('date','Data',x.date,'date','required')+F('obs','Observação',x.obs),'Salvar',d=>{const o={...d,valor:+d.valor};if(id)Object.assign(x,o);else S.fin.push({id:uid(),...o});save()},id?()=>{S.fin=S.fin.filter(y=>y.id!==id);save()}:null)}
