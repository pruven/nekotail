export {};
type CatData = { name: string; image: string; mood: string; color: string };
declare global { interface Window { nekotail: { assignedCat: CatData; deviceId: string; statusOptions: { code: number; title: string; message: string }[] } } }
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
let view = 'pictures';
let current = window.nekotail.assignedCat;
let busy = false;
let favorites: string[] = [];
try { favorites = JSON.parse(localStorage.getItem('nekotail-favorites') ?? '[]'); if (!Array.isArray(favorites)) favorites = []; } catch {}
const image = $<HTMLImageElement>('cat-image');
const audio = $<HTMLAudioElement>('meow-audio');
const dialog = $<HTMLDialogElement>('info-dialog');
let network: { online: boolean; hostname: string; dns?: string; peers: number; serving: boolean } | undefined;
const message = (text: string) => { $('inline-message').textContent = text; };
function favoriteState() { $('favorite').setAttribute('aria-pressed', String(favorites.includes(current.name))); }
function showCat(cat: CatData) {
  current = cat; image.src = cat.image; image.alt = `${cat.name}, a ${cat.color.toLowerCase()} cat`;
  $('cat-name').firstChild!.textContent = cat.name;
  $('cat-color').textContent = cat.color; $('cat-mood').textContent = cat.mood; favoriteState();
}
function changeView(next: string) {
  audio.pause(); view = next; message('');
  $('cat-stage').setAttribute('aria-labelledby', `tab-${next}`);
  document.querySelectorAll<HTMLElement>('[data-view]').forEach(button => {
    const active = button.dataset.view === next;
    if (button.getAttribute('role') === 'tab') { button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; }
    else button.classList.toggle('active', active);
  });
  $('breadcrumb-current').textContent = ({ pictures: 'Cat pictures', meows: 'Meow station', status: 'HTTP cats' } as Record<string,string>)[next];
  $('sound-overlay').hidden = next !== 'meows'; $('status-overlay').hidden = next !== 'status';
  $('serve-label').textContent = ({ pictures: 'Serve another cat', meows: 'Play a meow', status: 'Serve a cat code' } as Record<string,string>)[next];
  $('download').hidden = next !== 'pictures';
  $('endpoint-path').textContent = `/api/${next === 'pictures' ? 'cat' : next === 'meows' ? 'meow' : 'status'}`;
  $('curl-command').textContent = `curl${next === 'meows' ? ' -o meow.ogg' : ''} ${location.origin}${$('endpoint-path').textContent}`;
  if (next !== 'status') $('response-badge').textContent = '200 OK';
}
document.querySelectorAll<HTMLElement>('[data-view]').forEach(button => button.addEventListener('click', () => { changeView(button.dataset.view!); if(view === 'status') void serve(); }));
document.querySelector('[role=tablist]')?.addEventListener('keydown', event => {
  const e = event as KeyboardEvent; if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
  e.preventDefault(); const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role=tab]')];
  const index = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? 2 : (index + (e.key === 'ArrowRight' ? 1 : 2)) % 3;
  tabs[next].click(); tabs[next].focus();
});
function logRequest(path: string, response: string, status: number, started: number) {
  const rows = $('activity-rows'); rows.querySelector('.empty-activity')?.remove();
  const row = document.createElement('div'); row.className = 'activity-row';
  const requestCell = document.createElement('span');
  const method = document.createElement('span'); method.className = 'method'; method.textContent = 'GET';
  const code = document.createElement('code'); code.textContent = path; requestCell.append(method,code); row.append(requestCell);
  for (const text of [response, `${Math.round(performance.now()-started)} ms`, String(status)]) { const cell = document.createElement('span'); cell.textContent = text; row.append(cell); }
  row.lastElementChild!.className = 'row-status'; rows.prepend(row);
  while(rows.children.length > 3) rows.lastElementChild?.remove();
}
async function playMeow() {
  const started = performance.now();
  audio.currentTime = 0;
  try { await audio.play(); logRequest('/meow.ogg', 'Silas says meow', 200, started); message('A hello from Silas.'); }
  catch { message('Audio could not play. Press the speaker to try again.'); }
}
async function serve() {
  if (busy) return;
  if (view === 'meows') { await playMeow(); return; }
  busy = true; const button = $<HTMLButtonElement>('serve-cat'); button.disabled = true;
  const started = performance.now(); const target = view; message('');
  try {
    if (target === 'pictures') {
      const response = await fetch(`/api/cat?random=1&exclude=${encodeURIComponent(current.name)}`);
      if (!response.ok) throw new Error('Cat service unavailable');
      const data = await response.json(); if(view === target) { showCat(data); $('image-chip-text').textContent = 'Fresh from your cat server'; }
      logRequest('/api/cat', `${data.name} · Picture`, response.status, started);
    } else {
      const response = await fetch('/api/status'); const data = await response.json();
      if (!data.cat || !data.code) throw new Error('Status service unavailable');
      if(view === target) { showCat(data.cat); $('status-code').textContent = data.code; $('status-title').textContent = data.title; $('status-message').textContent = data.message; $('response-badge').textContent = `${data.code} ${data.title}`; }
      logRequest('/api/status', `${data.code} · ${data.title}`, response.status, started);
    }
  } catch { message('The cat server is taking a nap. Please try again.'); }
  finally { busy = false; button.disabled = false; }
}
$('serve-cat').addEventListener('click', () => void serve());
$('surprise').addEventListener('click', () => { const views = ['pictures','meows','status'].filter(item=>item!==view); changeView(views[Math.floor(Math.random()*views.length)]); void serve(); });
$('play-meow').addEventListener('click', () => void playMeow());
$('my-cat').addEventListener('click', () => { changeView('pictures'); showCat(window.nekotail.assignedCat); $('image-chip-text').textContent = 'Your very own cat'; });
$('favorite').addEventListener('click', () => { favorites = favorites.includes(current.name) ? favorites.filter(name=>name!==current.name) : [...favorites,current.name]; try { localStorage.setItem('nekotail-favorites',JSON.stringify(favorites)); } catch {} favoriteState(); message(favorites.includes(current.name) ? `${current.name} saved as a favorite on this browser.` : `${current.name} removed from favorites.`); });
$('download').addEventListener('click', () => { const a = document.createElement('a'); a.href = current.image; a.download = `nekotail-${current.name.toLowerCase()}.jpg`; a.click(); });
$('copy-endpoint').addEventListener('click', async () => { try { await navigator.clipboard.writeText(`${location.origin}${$('endpoint-path').textContent}`); message('Endpoint copied to clipboard.'); } catch { message(`Copy this URL: ${location.origin}${$('endpoint-path').textContent}`); } });
document.addEventListener('keydown', event => { if(event.code==='Space' && !dialog.open && !['BUTTON','INPUT','TEXTAREA','A'].includes((event.target as HTMLElement).tagName)){event.preventDefault();void serve();} });
image.addEventListener('error', () => message('This picture could not load. Serve another cat to try a different one.'));
function openModal(kind: string) {
  const content = $('dialog-content'); content.replaceChildren();
  // All HTML below is fixed application copy. Runtime values are appended with textContent.
  if(kind==='api') content.innerHTML = '<h2>A small API. Plenty of cat.</h2><p>No API keys. Reach these endpoints from a device on your tailnet.</p><h3>GET /api/cat</h3><p>Your device’s assigned cat as JSON. Add <code>?random=1</code> for a random cat.</p><h3>GET /api/meow</h3><p>A real meow recording served as audio/ogg.</p><h3>GET /api/status?code=418</h3><p>A cat response with the actual HTTP status. Omit the code for a random one. Supported codes: 200, 201, 400, 401, 403, 404, 418, 429, 500, 503.</p><h3>Try it in your terminal</h3>';
  if(kind==='api'){const pre=document.createElement('pre');pre.textContent=`curl ${location.origin}/api/cat\ncurl -i ${location.origin}/api/status?code=418\ncurl ${location.origin}/api/meow -o meow.ogg`;content.append(pre);}
  if(kind==='network') { content.innerHTML = '<h2>Your private cat connection.</h2><p>Tailscale Serve routes HTTPS traffic to the Astro server on localhost. Tailnet access follows your Tailscale access policy.</p>'; const p = document.createElement('p'); p.textContent = network ? `${network.online ? 'Connected' : 'Disconnected'} · ${network.hostname} · ${network.peers} other devices online` : 'Checking the host’s Tailscale connection…';content.append(p); const pre=document.createElement('pre');pre.textContent=network?.dns ? `https://${network.dns}\n\nThis device: ${window.nekotail.deviceId}` : `This device: ${window.nekotail.deviceId}`;content.append(pre);content.insertAdjacentHTML('beforeend','<p>Over Serve, your Tailscale IP determines your stable cat identity. Locally, a browser cookie keeps your assignment. Cat identities are unique; photos are shared from a collection of six.</p>'); }
  if(kind==='about') content.innerHTML = '<h2>Make yourself at home.</h2><p>Serve another cat for a fresh picture. Visit the meow station to hear Silas, or try HTTP cats for a status code with personality.</p><p>The space bar serves another response. The heart saves a favorite in this browser, and the download button keeps a picture.</p><p>Your assigned cat stays the same when you come back. Open this service from another device on your tailnet to meet its cat.</p>';
  if(kind==='credits') content.innerHTML = '<h2>Good cats. Good credits.</h2><p>Cat photographs via <a href="https://unsplash.com" target="_blank" rel="noreferrer">Unsplash</a>. The bundled collection is used under the <a href="https://unsplash.com/license" target="_blank" rel="noreferrer">Unsplash license</a>.</p><p>“Meow.ogg”: Silas meowing, recorded by Dan Crosby (Dcrosby), via <a href="https://commons.wikimedia.org/wiki/File:Meow.ogg" target="_blank" rel="noreferrer">Wikimedia Commons</a>. Unmodified audio, licensed <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank" rel="noreferrer">CC BY-SA 3.0</a>.</p><p>Interface icons by Lucide, under the ISC license.</p>';
  dialog.showModal();
}
document.querySelectorAll<HTMLElement>('[data-modal]').forEach(button=>button.addEventListener('click',()=>openModal(button.dataset.modal!)));
$('close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
async function refreshNetwork(){try{const response=await fetch('/api/network');network=await response.json();$('network-state').textContent=network?.online?'Tailnet connected':'Local mode';$('network-dot').style.background=network?.online?'#6c926c':'#b69a62';}catch{$('network-state').textContent='Connection unavailable';}}
void refreshNetwork(); setInterval(()=>void refreshNetwork(),60000);
changeView('pictures');favoriteState();
