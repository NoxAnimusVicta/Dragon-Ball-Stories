'use strict';
(() => {
  const button = document.getElementById('music-toggle');
  const slider = document.getElementById('music-volume');
  const output = document.getElementById('music-volume-value');
  const status = document.getElementById('music-status');
  const key = 'db-stories:music:' + new URL('./', location.href).pathname;
  const version = document.querySelector('meta[name="app-release"]')?.content || '';
  let enabled = true, volume = .25, context, gain, source;
  const audio = document.createElement('audio');
  audio.id = 'background-audio'; audio.preload = 'auto'; audio.loop = true;
  audio.setAttribute('playsinline',''); audio.hidden = true;
  audio.src = './background-music.mp3?v=' + encodeURIComponent(version);
  document.body.append(audio);
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    enabled = saved?.enabled !== false;
    if (Number.isFinite(saved?.volume)) volume = Math.min(1, Math.max(0, saved.volume));
  } catch { /* Storage is optional. */ }
  window.getAdventureAudioContext = () => {
    try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch { /* Optional. */ }
    context ||= new (window.AudioContext || window.webkitAudioContext)();
    return context;
  };
  function save() {
    try { localStorage.setItem(key, JSON.stringify({enabled, volume})); } catch { /* Optional. */ }
  }
  function sync() {
    button.textContent = enabled ? 'Music on' : 'Music off';
    button.title = enabled ? 'Turn background music off' : 'Turn background music on';
    button.setAttribute('aria-pressed', String(enabled));
    slider.value = String(Math.round(volume * 100)); output.value = slider.value + '%';
  }
  function start() {
    if (!enabled || document.hidden || document.body.classList.contains('launch-pending')) return;
    try {
      const ctx = window.getAdventureAudioContext();
      if (!source) {
        gain = ctx.createGain(); gain.gain.value = volume; gain.connect(ctx.destination);
        source = ctx.createMediaElementSource(audio); source.connect(gain);
      }
      // Both calls occur synchronously in the launch/toggle gesture, before any await.
      const resumed = ctx.resume();
      const playing = audio.play();
      Promise.all([resumed,playing]).then(() => {
        if (!enabled || document.hidden) audio.pause();
        else status.textContent = '';
      }).catch(error => {
        if (error.name !== 'AbortError') status.textContent = 'Audio could not start. Tap Retry audio below.';
      });
    } catch { status.textContent = 'Audio could not start. Tap Retry audio below.'; }
  }
  button.addEventListener('click', () => {
    enabled = !enabled; save(); sync();
    if (enabled) start(); else audio.pause();
  });
  slider.addEventListener('input', () => {
    volume = Number(slider.value) / 100;
    if (gain) gain.gain.setValueAtTime(volume, context.currentTime);
    save(); sync();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('#music-toggle') && enabled && (audio.paused || context?.state !== 'running')) start();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) audio.pause(); else start();
  });
  document.addEventListener('launch-adventure', start);
  const retry = document.createElement('button');
  retry.type = 'button'; retry.className = 'primary'; retry.textContent = 'Retry audio';
  retry.addEventListener('click', () => { enabled = true; save(); sync(); start(); });
  status.after(retry);
  sync();
})();
