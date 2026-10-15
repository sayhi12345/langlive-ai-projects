(() => {
  const pages = [...document.querySelectorAll('.slide')];
  const position = document.querySelector('.deck-position');
  function updatePosition() {
    const index = pages.findIndex(page => !page.hidden && getComputedStyle(page).display !== 'none');
    if (index < 0) return;
    position.textContent = `${String(index + 1).padStart(2, '0')} / ${pages.length}`;
  }
  const observer = new MutationObserver(updatePosition);
  pages.forEach(page => observer.observe(page, { attributeFilter:['class', 'hidden'] }));
  updatePosition();

  const root = document.documentElement;
  const controls = position.closest('nav');
  const fullscreenButton = document.createElement('button');
  fullscreenButton.type = 'button';
  fullscreenButton.className = 'deck-fullscreen-button';
  fullscreenButton.textContent = '全螢幕';
  fullscreenButton.title = '全螢幕（F），Esc 離開';
  fullscreenButton.setAttribute('aria-pressed', 'false');
  controls.append(fullscreenButton);
  const status = document.createElement('p');
  status.className = 'fullscreen-status';
  status.setAttribute('role', 'status');
  document.body.append(status);
  let statusTimer;
  function setFullscreen(active) {
    root.classList.toggle('deck-fullscreen', active);
    fullscreenButton.textContent = active ? '離開全螢幕' : '全螢幕';
    fullscreenButton.setAttribute('aria-pressed', String(active));
    if (active) fullscreenButton.focus({ preventScroll:true });
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  }
  async function toggleFullscreen() {
    const active = root.classList.contains('deck-fullscreen');
    if (active) {
      if (document.fullscreenElement) await document.exitFullscreen();
      setFullscreen(false);
      status.textContent = '';
      return;
    }
    setFullscreen(true);
    try {
      await root.requestFullscreen();
    } catch {
      status.textContent = '已展開為滿版；此瀏覽器無法進入原生全螢幕。按 Esc 可離開。';
      clearTimeout(statusTimer);
      statusTimer = setTimeout(() => { status.textContent = ''; }, 4000);
    }
  }
  fullscreenButton.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => setFullscreen(document.fullscreenElement === root));
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat || document.querySelector('dialog[open]') || event.target.closest('input,textarea,select,[contenteditable]')) return;
    if (root.classList.contains('deck-fullscreen') && ['ArrowLeft','ArrowRight','PageUp','PageDown'].includes(event.key)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      controls.querySelector(['ArrowLeft','PageUp'].includes(event.key) ? '#previous,#prev' : '#next').click();
      return;
    }
    if (event.key.toLowerCase() === 'f' || (event.key === 'Escape' && root.classList.contains('deck-fullscreen') && !document.fullscreenElement)) {
      event.preventDefault();
      toggleFullscreen();
    }
  }, { capture:true });
})();
