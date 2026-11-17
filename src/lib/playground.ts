import { randomVoice } from './meows';
type CatData = { name: string; image: string; mood: string; color: string };
type View = 'pictures' | 'meows' | 'status';
declare global { interface Window { nekotail: { assignedCat: CatData; deviceId: string } } }
const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const image = $<HTMLImageElement>('cat-image');
const audio = $<HTMLAudioElement>('meow-audio');
const dialog = $<HTMLDialogElement>('info-dialog');
let current = window.nekotail.assignedCat;
let busy = false;
let lastVoice: string | undefined;
let meowRequest = 0;
let favorites: string[] = [];
try {
  const saved = JSON.parse(localStorage.getItem('nekotail-favorites') ?? '[]');
  if (Array.isArray(saved)) favorites = saved.filter(value => typeof value === 'string');
} catch {}
const message = (text: string) => { $('inline-message').textContent = text; };
const announce = (text: string) => { $('announcement').textContent = text; };
function favoriteState() { $('favorite').setAttribute('aria-pressed', String(favorites.includes(current.name))); }
function showCat(cat: CatData) {
  current = cat;
  image.src = cat.image;
  image.alt = `${cat.name}, a ${cat.color.toLowerCase()} cat`;
  favoriteState();
}
function changeView(next: View) {
  audio.pause(); message('');
  meowRequest++;
  $<HTMLButtonElement>('play-meow').disabled = false;
  $('cat-stage').setAttribute('aria-labelledby', `tab-${next}`);
  document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button => {
    const active = button.dataset.view === next;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
  });
  $('sound-overlay').hidden = next !== 'meows';
  $('status-overlay').hidden = next !== 'status';
  $('download').hidden = next !== 'pictures';
}
async function playMeow() {
  const request = ++meowRequest;
  const button = $<HTMLButtonElement>('play-meow');
  const voice = randomVoice(lastVoice);
  lastVoice = voice.id;
  button.disabled = true;
  message('');
  audio.pause();
  audio.src = `/api/meow?voice=${encodeURIComponent(voice.id)}`;
  try {
    await audio.play();
    if (request === meowRequest) announce(voice.title);
  } catch {
    if (request === meowRequest) message('Audio could not play. Try the speaker again.');
  } finally {
    if (request === meowRequest) button.disabled = false;
  }
}
async function serve(next: View) {
  if (busy) return;
  busy = true;
  const controls = [...document.querySelectorAll<HTMLButtonElement>('#serve-cat, #surprise, [data-view]')];
  controls.forEach(button => button.disabled = true);
  message('');
  try {
    if (next === 'meows') { changeView(next); await playMeow(); return; }
    const path = next === 'pictures' ? `/api/cat?random=1&exclude=${encodeURIComponent(current.name)}` : '/api/status';
    const response = await fetch(path);
    const data = await response.json();
    if (next === 'pictures' && (!response.ok || !data.image)) throw new Error('Cat unavailable');
    if (next === 'status' && (!data.cat || !data.code)) throw new Error('Status unavailable');
    changeView(next);
    if (next === 'pictures') { showCat(data); announce(data.name); }
    else {
      showCat(data.cat);
      $('status-code').textContent = String(data.code);
      $('status-title').textContent = data.title;
      announce(`${data.code} ${data.title}`);
    }
  } catch { message('Could not fetch a cat. Please try again.'); }
  finally { busy = false; controls.forEach(button => button.disabled = false); }
}
$('serve-cat').addEventListener('click', () => void serve('pictures'));
$('surprise').addEventListener('click', () => {
  const choices: View[] = ['pictures', 'meows', 'status'];
  void serve(choices[Math.floor(Math.random() * choices.length)]);
});
$('play-meow').addEventListener('click', () => void playMeow());
document.querySelectorAll<HTMLButtonElement>('[data-view]').forEach(button => button.addEventListener('click', () => {
  const next = button.dataset.view as View;
  if (next === 'status') void serve(next);
  else changeView(next);
}));
document.querySelector('[role=tablist]')?.addEventListener('keydown', event => {
  const e = event as KeyboardEvent;
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
  e.preventDefault();
  const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role=tab]')];
  const index = tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
  const next = e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : (index + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length;
  tabs[next].click(); tabs[next].focus();
});
$('favorite').addEventListener('click', () => {
  favorites = favorites.includes(current.name) ? favorites.filter(name => name !== current.name) : [...favorites, current.name];
  try { localStorage.setItem('nekotail-favorites', JSON.stringify(favorites)); } catch {}
  favoriteState(); announce(favorites.includes(current.name) ? 'Favorite saved.' : 'Favorite removed.');
});
$('download').addEventListener('click', () => {
  const link = document.createElement('a'); link.href = current.image; link.download = `nekotail-${current.name.toLowerCase()}.jpg`; link.click();
});
image.addEventListener('error', () => message('Picture could not load. Try serving another cat.'));
document.addEventListener('keydown', event => {
  if (event.code === 'Space' && !dialog.open && !['BUTTON', 'INPUT', 'TEXTAREA', 'A'].includes((event.target as HTMLElement).tagName)) {
    event.preventDefault(); void serve('pictures');
  }
});
function openModal(kind: string) {
  const content = $('dialog-content'); content.replaceChildren();
  $('dialog-title').textContent = ({ menu: 'Nekotail', api: 'API', network: 'Connection', credits: 'Credits' } as Record<string, string>)[kind] ?? 'Nekotail';
  // Fixed application copy only; runtime values below use textContent.
  if (kind === 'menu') {
    content.innerHTML = '<div class="menu-actions"><button data-action="resident">Your assigned cat <span>↗</span></button><button data-action="api">API <span>↗</span></button><button data-action="network">Connection <span>↗</span></button><button data-action="credits">Credits <span>↗</span></button></div>';
    content.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(button => button.addEventListener('click', () => {
      if (button.dataset.action === 'resident') { changeView('pictures'); showCat(window.nekotail.assignedCat); dialog.close(); }
      else openModal(button.dataset.action!);
    }));
  }
  if (kind === 'api') {
    content.innerHTML = '<h3>GET /api/cat</h3><p>Your assigned cat as JSON. Add <code>?random=1</code> for a random picture.</p><h3>GET /api/meow</h3><p>A random meow, served as audio/ogg. Add <code>?exclude=voice-id</code> to avoid repeating a voice, or <code>?voice=voice-id</code> to select one. The <code>X-Meow-Voice</code> response header identifies the recording.</p><h3>GET /api/status?code=418</h3><p>A cat response with its actual HTTP status. Omit the code for a random one.</p>';
    const pre = document.createElement('pre');
    pre.textContent = `curl ${location.origin}/api/cat\ncurl -i ${location.origin}/api/status?code=418\ncurl ${location.origin}/api/meow -o meow.ogg`;
    content.append(pre);
  }
  if (kind === 'network') {
    const p = document.createElement('p'); p.textContent = 'Checking connection…'; content.append(p);
    const pre = document.createElement('pre'); pre.textContent = `Device: ${window.nekotail.deviceId}`; content.append(pre);
    void fetch('/api/network').then(response => { if (!response.ok) throw new Error(); return response.json(); }).then(network => {
      p.textContent = network.online ? `Connected · ${network.hostname} · ${network.peers} other devices online` : 'Local mode';
      if (network.dns) pre.textContent = `https://${network.dns}\nDevice: ${window.nekotail.deviceId}`;
    }).catch(() => { p.textContent = 'Connection status unavailable.'; });
  }
  if (kind === 'credits') content.innerHTML = '<p>Cat photographs from Unsplash and Wikimedia Commons. <a href="/photo-credits">View all photographer credits and licenses</a>.</p><p>Real meow recordings from Wikimedia Commons. <a href="/audio-credits">View all recording credits, licenses, and audio edits</a>.</p><p>Lucide icons: ISC license.</p>';
  if (!dialog.open) dialog.showModal();
}
document.querySelectorAll<HTMLElement>('[data-modal]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.modal!)));
$('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
changeView('pictures'); favoriteState();
