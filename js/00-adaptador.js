
/* ===== Setti Gelo — adaptador de hospedagem =====
   Se URL e CHAVE do Supabase estiverem preenchidas abaixo: login por e-mail/senha + banco compartilhado.
   Se NÃO estiverem: o app funciona só no aparelho (localStorage), como na versão anterior. */
(function(){
 if(window.claude)return;
 const SC=window.SETTI_CONFIG||{},CFG={url:String(SC.SUPABASE_URL||'').trim(),key:String(SC.SUPABASE_ANON_KEY||'').trim()};
 const POLL=window.__POLL||5000, EPOCH='1970-01-01T00:00:00+00:00';
 const baixar=async({filename,data})=>{const tipo=/\.csv$/i.test(filename)?'text/csv;charset=utf-8':/\.json$/i.test(filename)?'application/json':'application/octet-stream';
  const b=data instanceof Blob?data:new Blob([data],{type:tipo}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),5000);return{}};
 const configurado=/^https:\/\//.test(CFG.url)&&CFG.key.length>20&&!/COLE_AQUI/.test(CFG.url+CFG.key);
 if(!configurado){ /* ---------- MODO LOCAL ---------- */
  const idb=()=>new Promise((res,rej)=>{const r=indexedDB.open('cargacerta_arquivos',1);r.onupgradeneeded=()=>r.result.createObjectStore('f');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
  const put=async(id,blob)=>{const db=await idb();return new Promise((res,rej)=>{const t=db.transaction('f','readwrite');t.objectStore('f').put(blob,id);t.oncomplete=res;t.onerror=()=>rej(t.error)})};
  const get=async id=>{const db=await idb();return new Promise((res,rej)=>{const q=db.transaction('f').objectStore('f').get(id);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})};
  window.__fileStore={get};
  const mods={downloads:{save:baixar},assets:{upload:async blob=>{const id='f'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);await put(id,blob);return{id,url:''}}}};
  window.claude={use:async n=>mods[n]||null};return}
 /* ---------- MODO SUPABASE ---------- */
 window.__supa=true;
 const LS=localStorage,SK='cc_sess',enc=encodeURIComponent,sleep=ms=>new Promise(r=>setTimeout(r,ms));
 let sess=null,role=null,perfil=null,names={};
 const salvarSess=j=>{sess={access_token:j.access_token,refresh_token:j.refresh_token,expires_at:Date.now()/1000+(j.expires_in||3600),user:j.user||(sess&&sess.user)};LS.setItem(SK,JSON.stringify(sess))};
 const raw=(p,o={})=>fetch(CFG.url+p,{...o,headers:{apikey:CFG.key,Authorization:'Bearer '+(sess?sess.access_token:CFG.key),...(o.headers||{})}});
 async function renovar(){try{const r=await fetch(CFG.url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:CFG.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:sess.refresh_token})});
  if(!r.ok){if(r.status>=400&&r.status<500){sess=null;LS.removeItem(SK)}return false}salvarSess(await r.json());return true}catch(e){return false}}
 async function api(p,o){let r=await raw(p,o);if(r.status===401&&sess&&await renovar())r=await raw(p,o);return r}
 setInterval(()=>{if(sess&&sess.expires_at-Date.now()/1000<120)renovar()},30000);
 const msgErro=j=>{const m=String(j.msg||j.error_description||j.message||j.error||'Erro');
  return /Invalid login/i.test(m)?'E-mail ou senha incorretos.':/already registered|already been registered/i.test(m)?'Este e-mail já tem conta. Toque em Entrar.':/at least|weak/i.test(m)?'A senha precisa ter pelo menos 6 caracteres.':/not confirmed/i.test(m)?'Confirme o e-mail antes de entrar (veja a caixa de entrada).':/rate limit|too many/i.test(m)?'Muitas tentativas. Aguarde alguns minutos.':/valid email|invalid.*email/i.test(m)?'E-mail inválido.':m};
 const post=async(p,b)=>{const r=await fetch(CFG.url+p,{method:'POST',headers:{apikey:CFG.key,'Content-Type':'application/json'},body:JSON.stringify(b)});const j=await r.json().catch(()=>({}));if(!r.ok)throw new Error(msgErro(j));return j};
 function telaLogin(aviso){return new Promise(res=>{let modo='entrar';const logo=(document.querySelector('.lg')||{}).src||'';
  const o=document.createElement('div');o.style.cssText='position:fixed;inset:0;z-index:100;background:linear-gradient(160deg,#0c1619,#10343a 60%,#0e6a72);display:flex;align-items:center;justify-content:center;padding:18px;overflow:auto';
  const pintar=(msg)=>{o.innerHTML=`<div style="width:100%;max-width:380px;background:var(--card,#fff);color:var(--tx,#0f2230);border-radius:24px;padding:22px;box-shadow:0 20px 50px rgba(0,0,0,.4);font-family:Inter,system-ui,sans-serif"><div style="text-align:center"><img src="${logo}" alt="" style="width:92px;height:92px">
   <div style="font:400 36px/1 Anton,Impact,'Arial Black',sans-serif;letter-spacing:.06em;margin-top:4px">SETTI <span style="color:#0f9aa0">GELO</span></div><div style="font:700 10px Inter,sans-serif;letter-spacing:.28em;color:#0f9aa0;margin:6px 0 14px">DISTRIBUIDORA DE GELO</div></div>
   <form id="lf">${modo==='criar'?'<label>Seu nome</label><input name="nome" required autocomplete="name">':''}<label>E-mail</label><input name="email" type="email" required autocomplete="email"><label>Senha</label><input name="senha" type="password" required minlength="6" autocomplete="${modo==='criar'?'new-password':'current-password'}">
   <div id="lm" style="color:${msg&&msg.ok?'#12a150':'#d93c2f'};font-size:13px;min-height:18px;margin-top:8px">${msg?msg.t:''}</div><button class="btn" type="submit" style="width:100%;margin-top:8px">${modo==='criar'?'Criar conta':'Entrar'}</button></form>
   <button type="button" id="lt" class="btn s" style="width:100%;margin-top:8px">${modo==='criar'?'Já tenho conta':'Criar conta'}</button><div class="mu" style="text-align:center;margin-top:10px">${modo==='criar'?'Depois de criar, aguarde o administrador liberar o seu acesso.':''}</div></div>`;
   o.querySelector('#lt').onclick=()=>{modo=modo==='criar'?'entrar':'criar';pintar()};
   o.querySelector('#lf').onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target)),b=o.querySelector('button[type=submit]');b.disabled=true;b.textContent='Aguarde...';
    try{if(modo==='criar'){const j=await post('/auth/v1/signup',{email:f.email,password:f.senha,data:{nome:f.nome}});if(j.access_token)salvarSess(j);else throw new Error('Conta criada. Confirme o e-mail recebido e depois toque em Entrar.')}
     else salvarSess(await post('/auth/v1/token?grant_type=password',{email:f.email,password:f.senha}));o.remove();res()}
    catch(err){pintar({t:err.message,ok:/Conta criada/.test(err.message)})}}};
  pintar(aviso?{t:aviso}:null);document.body.appendChild(o)})}
 async function carregarPerfil(){try{const r=await api('/rest/v1/perfis?id=eq.'+sess.user.id+'&select=nome,role');if(r.ok){const j=await r.json();if(j[0]){perfil=j[0];role=j[0].role;LS.setItem('cc_perfil',JSON.stringify(j[0]))}}}catch(e){}
  if(!perfil){try{perfil=JSON.parse(LS.getItem('cc_perfil')||'null');role=perfil&&perfil.role}catch(e){}}}
 const pronto=(async()=>{try{sess=JSON.parse(LS.getItem(SK)||'null')}catch(e){}
  if(sess&&sess.expires_at-Date.now()/1000<60)await renovar();
  while(!sess||!sess.user)await telaLogin();
  const ult=LS.getItem('cc_uid');LS.setItem('cc_uid',sess.user.id);
  if(ult&&ult!==sess.user.id){LS.removeItem('gelo_mvp_v1');LS.removeItem('gelo_mvp_v1_w');location.reload();await new Promise(()=>{})}
  await carregarPerfil()})();
 /* ---- banco: tabela kv (chave/valor) + 'app/acc' virtual = tabela perfis ---- */
 const cache={},subs={},ult={};let desde=EPOCH,timer=null,ocupado=false;
 const snap=p=>({exists:cache[p]!==undefined,data:()=>({v:cache[p]})});
 async function lerPerfis(){const r=await api('/rest/v1/perfis?select=id,nome,role,criado&order=criado.asc');if(!r.ok)throw new Error('perfis');const l=await r.json();names={};l.forEach(p=>names[p.id]=p.nome||'');
  const eu=l.find(p=>p.id===sess.user.id);if(eu){perfil=eu;role=eu.role}cache['app/acc']=JSON.stringify(l.map(p=>({id:p.id,role:p.role,seen:String(p.criado||'').slice(0,10)})))}
 async function lerKv(depois){const r=await api('/rest/v1/kv?select=key,v,updated_at&order=updated_at.asc&updated_at=gte.'+enc(depois));if(!r.ok)throw new Error('kv');const l=await r.json();l.forEach(x=>{cache[x.key]=x.v;if(x.updated_at>desde)desde=x.updated_at})}
 const inicial=pronto.then(async()=>{for(;;){try{await Promise.all([lerPerfis(),lerKv(EPOCH)]);return}catch(e){await sleep(3000)}}});
 async function tick(){if(ocupado)return;ocupado=true;try{const antes=role;await lerPerfis();if(role!==antes)desde=EPOCH;await lerKv(desde);
  Object.keys(subs).forEach(p=>{if(cache[p]!==ult[p]){ult[p]=cache[p];subs[p].forEach(cb=>{try{cb(snap(p))}catch(e){}})}})}catch(e){}finally{ocupado=false}}
 async function lerUm(p){if(p==='app/acc'){await lerPerfis();return}const r=await api('/rest/v1/kv?select=v,updated_at&key=eq.'+enc(p));if(!r.ok)throw new Error('kv');const l=await r.json();if(l[0])cache[p]=l[0].v;else delete cache[p]}
 async function gravar(p,v){if(p==='app/acc'){let novo=[];try{novo=JSON.parse(v)}catch(e){}const atual=JSON.parse(cache['app/acc']||'[]');
   for(const n of novo){const a=atual.find(x=>x.id===n.id);if(a&&a.role!==n.role){const r=await api('/rest/v1/perfis?id=eq.'+n.id,{method:'PATCH',headers:{'Content-Type':'application/json',Prefer:'return=minimal'},body:JSON.stringify({role:n.role})});if(!r.ok)throw Object.assign(new Error('perm'),{code:'permission-denied'})}}
   await lerPerfis();return}
  const r=await api('/rest/v1/kv?on_conflict=key',{method:'POST',headers:{'Content-Type':'application/json',Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({key:p,v})});
  if(!r.ok)throw Object.assign(new Error('falha '+r.status),{code:r.status===401||r.status===403?'permission-denied':'unavailable'});cache[p]=v}
 const db={doc:p=>({get:async()=>{await inicial;await lerUm(p);return snap(p)},set:async d=>{await inicial;await gravar(p,d.v)},
   onSnapshot:cb=>{(subs[p]=subs[p]||[]).push(cb);inicial.then(()=>{ult[p]=cache[p];cb(snap(p))});if(!timer)timer=setInterval(tick,POLL);return()=>{}}})};
 const ativo=()=>role&&role!=='semacesso';
 const user={me:async()=>({id:sess.user.id,name:(perfil&&perfil.nome)||'',email:null}),canEdit:async()=>role==='admin',isOwner:async()=>role==='admin',
  can:async n=>n==='data.write'?true:n==='people.add'?false:null,profiles:async ids=>{const o={};ids.forEach(i=>o[i]={name:names[i]||(sess.user.id===i&&perfil?perfil.nome:'')||''});return o}};
 const assets={upload:async blob=>{await pronto;const id='f'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
  const r=await api('/storage/v1/object/comprovantes/'+id,{method:'POST',headers:{'Content-Type':blob.type||'application/octet-stream'},body:blob});if(!r.ok)throw new Error('upload');return{id,url:''}}};
 window.__fileStore={get:async id=>{const r=await api('/storage/v1/object/authenticated/comprovantes/'+id);return r.ok?await r.blob():null}};
 window.__supa={logout:async()=>{try{await api('/auth/v1/logout',{method:'POST'})}catch(e){}['cc_sess','cc_uid','cc_perfil','gelo_mvp_v1','gelo_mvp_v1_w'].forEach(k=>LS.removeItem(k));location.reload()}};
 window.claude={use:async n=>{if(n==='downloads')return{save:baixar};if(n==='assets')return assets;await pronto;return n==='db'?db:n==='user'?user:null}};
})();
