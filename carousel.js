const carouselInterval = 2000;
const carouselCards = new Map();
let slides = [];
let slideIndex = 0;
let slideTimer;
let lastDirection = 1;

function initCarousel() {
  slides = data.productos.filter(visible).flatMap(p => p.variantes
    .filter(v => v.visible && !(p.id === 'diseno-13' && v.color === 'Blanco'))
    .map(v => ({ p, v })));
  if (!slides.length) {
    document.querySelector('.hero-images').hidden = true;
    return;
  }

  slides = alternatePolos(slides);
  slideIndex = 0;
  showSlide();
  document.addEventListener('visibilitychange', syncCarousel);
  syncCarousel();
}

function alternatePolos(items) {
  const remaining = [...items];
  const firstIndex = Math.max(0, remaining.findIndex(({ v }) => v.id === 'MODAC-023'));
  const ordered = remaining.splice(firstIndex, 1);
  const color = ({ v }) => v.color.toLowerCase().replace(/azul marino.*/, 'azul marino');
  const different = (a, b) => a.p.id !== b.p.id && color(a) !== color(b);
  while (remaining.length) {
    const previous = ordered.at(-1);
    const recent = ordered.slice(-2);
    const preferences = [
      item => recent.every(shown => different(item, shown)),
      item => different(item, previous),
      item => item.p.id !== previous.p.id
    ];
    let index = -1;
    for (const preference of preferences) {
      index = remaining.findIndex(item => preference(item) &&
        (remaining.length > 1 || different(item, ordered[0])));
      if (index >= 0) break;
    }
    ordered.push(remaining.splice(Math.max(0, index), 1)[0]);
  }
  return ordered;
}

function carouselIndex(index) {
  return (index + slides.length) % slides.length;
}

function showSlide() {
  const track = $('#coverflow');
  const visibleCards = new Set();
  const visibleCount = Math.min(3, slides.length);
  for (let offset = 0; offset < visibleCount; offset++) {
    const index = carouselIndex(slideIndex + offset);
    const item = slides[index];
    visibleCards.add(index);
    let card = carouselCards.get(index);

    if (!card) {
      card = document.createElement('button');
      card.type = 'button';
      card.className = 'coverflow-card';
      const img = document.createElement('img');
      img.src = photo(item.v.foto);
      img.alt = '';
      card.append(img);
      card.setAttribute('aria-label', `${item.p.nombre} · ${item.v.color} · ${item.v.talla}`);
      card.onclick = () => {
        openProduct(item.p.id);
        selectVariant(item.v.id);
      };
      placeCarouselCard(card, offset + lastDirection, true);
      track.append(card);
      carouselCards.set(index, card);
      void card.offsetWidth;
    }

    placeCarouselCard(card, offset, false);
    card.tabIndex = 0;
  }

  for (const [index, card] of carouselCards) {
    if (visibleCards.has(index)) continue;
    carouselCards.delete(index);
    card.disabled = true;
    placeCarouselCard(card, Number(card.dataset.offset) - lastDirection, true);
    setTimeout(() => card.remove(), 550);
  }


}

function placeCarouselCard(card, offset, hidden) {
  card.dataset.offset = offset;
  card.style.setProperty('--position', offset);
  card.style.opacity = hidden ? 0 : 1;
}

function moveSlide(step) {
  lastDirection = Math.sign(step);
  slideIndex = carouselIndex(slideIndex + step);
  showSlide();
  syncCarousel();
}

function syncCarousel() {
  clearInterval(slideTimer);
  if (!document.hidden) slideTimer = setInterval(() => moveSlide(1), carouselInterval);
}
