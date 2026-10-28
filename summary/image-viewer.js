(() => {
  const links = [...document.querySelectorAll('a[data-image-viewer]')];
  if (!links.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'image-viewer';
  dialog.setAttribute('aria-labelledby', 'image-viewer-title');
  dialog.innerHTML = '<div class="image-viewer__heading"><h2 id="image-viewer-title">圖片放大</h2><button type="button">關閉</button></div><p class="image-viewer__caption"></p><img class="image-viewer__image" alt="">';
  document.body.append(dialog);
  const image = dialog.querySelector('img');
  const caption = dialog.querySelector('p');
  const close = dialog.querySelector('button');
  links.forEach(link => link.addEventListener('click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const preview = link.querySelector('img');
    image.src = link.href;
    image.alt = preview?.alt || link.getAttribute('aria-label') || link.textContent.trim();
    caption.textContent = image.alt;
    dialog.showModal();
    dialog.scrollTop = 0;
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => event.stopPropagation());
})();
