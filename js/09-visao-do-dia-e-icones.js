const svg=p=>`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ICN={dia:svg('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'),rota:svg('<path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'),pedidos:svg('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>'),clientes:svg('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5a3 3 0 0 1 0 6M18 14c2 .6 3 2.5 3 5"/>'),mais:svg('<path d="M4 7h16M4 12h16M4 17h10"/>')};
const IT=svg('<rect x="2" y="9" width="14" height="9" rx="1.5"/><path d="M16 12h3l3 3v3h-6"/>'),IS=svg('<path d="M12 3v18M5 10l7-7 7 7"/>');
function vDia2(){const s=stats(),pct=s.tot?Math.min(100,s.ent/s.tot*100):0,carga=s.carga;
 return`<div class="hero"><div class="l">CARGA RECOMENDADA PARA HOJE</div><div class="n">${s.rec}<span>pacotes</span></div><div class="s">Previsão de consumo + pedidos confirmados + 10% de margem</div>
 <div class="pg"><i style="width:${pct}%"></i></div><div class="pgl"><span>${s.ent} entregues</span><span>${s.pend} pendentes</span></div>
 <div class="hs"><div><b>${s.st.length}</b>clientes</div><div><b>${s.tot}</b>previstos</div><div><b>${s.conf}</b>confirmados</div><div><b>${s.av}</b>avulsos</div></div></div>
 <div class="tiles"><div class="tile"><span class="ic">${IT}</span><div><b>${carga??'—'}</b><small>Carga total</small></div></div><div class="tile"><span class="ic" style="${carga!=null&&carga-s.ent<s.pend?'background:rgba(217,60,47,.14);color:var(--er)':''}">${IS}</span><div><b>${carga==null?'—':carga-s.ent}</b><small>Saldo estimado</small></div></div></div>
 <div class="row" style="margin-top:14px"><button class="btn" data-a="go" data-v="plan">Planejar saída</button><button class="btn s" data-a="go" data-v="rota">Ver rota</button></div>
 ${S.c.length?'':`<div class="card empty">Nenhum cliente ainda. Cadastre seus clientes ${window.__supa?'':'ou <button class="btn s sm" data-a="demo">carregar dados de exemplo</button>'}</div>`}`}
VIEWS.dia=vDia2;
const brand=()=>{const n=(S.cfg.empresa||'Setti Gelo').trim().toUpperCase().split(/\s+/),l=n.length>1?n.pop():'';return'<span>'+esc(n.join(' '))+'</span>'+(l?' <b>'+esc(l)+'</b>':'')};
const canR=()=>!document.querySelector('.ov')&&!/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||'');
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
