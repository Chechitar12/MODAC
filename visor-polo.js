const poloViews = [...document.querySelectorAll('[data-polo-view]')];
const poloZoom = document.querySelector('#poloZoom');
const viewNames = ['Frente', 'Manga', 'Espalda'];
let currentPoloView = 0;
let pointerStart;
let pauseUntil = 0;

function showPoloView(index) {
  currentPoloView = (index + viewNames.length) % viewNames.length;
  const position = ['0%', '50%', '100%'][currentPoloView];
  for (const view of poloViews) {
    view.style.setProperty('--polo-position', position);
    view.setAttribute('aria-label', `Vista ${viewNames[currentPoloView].toLowerCase()} del polo MODAC`);
  }
  document.querySelectorAll('.polo-carousel-dots').forEach(dots => {
    [...dots.children].forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === currentPoloView);
    });
  });
}

document.querySelectorAll('[data-polo-step]').forEach(button => {
  button.addEventListener('click', () => {
    showPoloView(currentPoloView + Number(button.dataset.poloStep));
    pauseUntil = Date.now() + 7000;
  });
});

for (const view of poloViews) {
  view.addEventListener('pointerdown', event => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
    view.setPointerCapture(event.pointerId);
  });
  view.addEventListener('pointerup', event => {
    if (pointerStart?.id !== event.pointerId) return;
    const horizontal = event.clientX - pointerStart.x;
    const vertical = event.clientY - pointerStart.y;
    pointerStart = undefined;
    if (Math.abs(horizontal) > 28 && Math.abs(horizontal) > Math.abs(vertical)) {
      showPoloView(currentPoloView + (horizontal < 0 ? 1 : -1));
      pauseUntil = Date.now() + 7000;
    }
  });
  view.addEventListener('lostpointercapture', () => { pointerStart = undefined; });
  view.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      showPoloView(currentPoloView + (event.key === 'ArrowRight' ? 1 : -1));
      pauseUntil = Date.now() + 7000;
    }
  });
}

document.querySelector('#openPoloZoom').addEventListener('click', () => poloZoom.showModal());
document.querySelector('#closePoloZoom').addEventListener('click', () => poloZoom.close());

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setInterval(() => {
    if (!document.hidden && Date.now() >= pauseUntil) showPoloView(currentPoloView + 1);
  }, 4500);
}

showPoloView(0);
