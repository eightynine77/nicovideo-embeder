const input = document.getElementById('nicoinput');
const btn = document.getElementById('embedBtn');
const pasteBtn = document.getElementById('pasteBtn')
const playerArea = document.getElementById('playerArea');
const openLinkWrap = document.getElementById('openLink');

function extractWatchId(text){
  if(!text) return null;
  text = text.trim();
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?nicovideo\.jp\/watch\/((?:sm|nm|so)\d+)/i,
    /(?:https?:\/\/)?nico\.ms\/((?:sm|nm|so)\d+)/i,
    /^((?:sm|nm|so)\d+)$/i
  ];
  for(const p of patterns){
    const m = text.match(p);
    if(m) return m[1];
  }
  const m = text.match(/(sm|nm|so)\d+/i);
  return m ? m[0] : null;
}

function clearPlayer(){
  playerArea.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#ddd;font-size:0.95rem;">paste a NicoNico link and press Embed</div>';
  openLinkWrap.innerHTML = '';
}

function showInPlayerError(msg) {
  playerArea.innerHTML = `<div class="error">${msg}</div>`;
  openLinkWrap.innerHTML = '';
}

function embedNico(id){
  playerArea.innerHTML = '';
  const script = document.createElement('script');
  script.type = 'application/javascript';
  script.src = `https://embed.nicovideo.jp/watch/${encodeURIComponent(id)}/script?w=320&h=180`;
  playerArea.appendChild(script);
  const nos = document.createElement('noscript');
  nos.innerHTML = `<a href="https://www.nicovideo.jp/watch/${encodeURIComponent(id)}">Open on NicoNico — ${id}</a>`;
  playerArea.appendChild(nos);
  openLinkWrap.innerHTML = `<a href="https://www.nicovideo.jp/watch/${encodeURIComponent(id)}" target="_blank" rel="noopener noreferrer">Open on NicoNico — ${id}</a>`;
}

btn.addEventListener('click', () => {
  const val = input.value;
  const id = extractWatchId(val);
  if(!id){
    showInPlayerError('not a valid nicovideo video link or ID');
    return;
  }
  embedNico(id);
});

pasteBtn.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    input.value = text; 
    
    const id = extractWatchId(text);
    if(!id){
      showInPlayerError('not a valid nicovideo video link or ID');
      return;
    }
    embedNico(id);
  } catch (err) {
    showInPlayerError('Failed to paste link. Please paste manually.');
  }
});

input.addEventListener('keydown', (ev) => {
  if(ev.key === 'Enter'){
    ev.preventDefault();
    btn.click();
  }
  if(ev.key === 'Escape'){
    input.value = '';
    clearPlayer();
  }
});

input.addEventListener('paste', (ev) => {
  setTimeout(() => {
    const id = extractWatchId(input.value || '');
    if(id){
      embedNico(id);
    }
  }, 10);
});
clearPlayer();