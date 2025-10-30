const input = document.getElementById('nicoinput');
const btn = document.getElementById('embedBtn');
const playerArea = document.getElementById('playerArea');
const openLinkWrap = document.getElementById('openLink');
const errorMsg = document.getElementById('errorMsg');

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
  errorMsg.textContent = '';
}

function embedNico(id){
  errorMsg.textContent = '';
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
    errorMsg.textContent = 'Could not find a valid NicoNico watch ID in that input.';
    return;
  }
  embedNico(id);
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