const stage = document.querySelector('.presentation-stage');
const canvas = document.querySelector('.presentation-canvas');
function fit() {
  const box = stage.getBoundingClientRect();
  canvas.style.setProperty('--scale', Math.min((box.width - 48) / 1280, (box.height - 24) / 720));
}
window.addEventListener('resize', fit);
fit();

const slides = [...canvas.querySelectorAll('.slide')];
if (slides.length) {
  const previous = document.querySelector('#previous');
  const next = document.querySelector('#next');
  let current = 0;
  function show(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === current);
      slide.inert = i !== current;
    });
    previous.disabled = current === 0;
    next.disabled = current === slides.length - 1;
    document.querySelector('#announcement').textContent = `第 ${current + 1} 頁，共 ${slides.length} 頁`;
    history.replaceState(null, '', '#' + slides[current].id);
    if (innerWidth <= 960) window.scrollTo(0, 0);
  }
  function readHash() {
    const index = slides.findIndex(slide => '#' + slide.id === location.hash);
    show(index < 0 ? 0 : index);
  }
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('a,button,input,textarea,select,[contenteditable]')) return;
    const destinations = { ArrowRight:current + 1, PageDown:current + 1, ArrowLeft:current - 1, PageUp:current - 1, Home:0, End:slides.length - 1 };
    if (event.key in destinations) {
      event.preventDefault();
      show(destinations[event.key]);
    }
  });
  window.addEventListener('hashchange', readHash);
  readHash();
}
