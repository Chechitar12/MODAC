const vistaPolo = document.querySelector('#poloVista');
const botonesAngulo = [...document.querySelectorAll('.polo-angulos button')];
const descripcionesAngulo = [
  'Vista frontal en tres cuartos, con estampado de cerezas en el pecho y la manga',
  'Vista lateral del estampado de cerezas en la manga',
  'Vista ilustrativa de la espalda lisa del polo azul marino'
];
let anguloActual = 0;
let inicioGesto;

function mostrarAngulo(indice) {
  anguloActual = (indice + botonesAngulo.length) % botonesAngulo.length;
  vistaPolo.dataset.angulo = botonesAngulo[anguloActual].dataset.angulo;
  vistaPolo.setAttribute('aria-label', descripcionesAngulo[anguloActual]);
  botonesAngulo.forEach((boton, posicion) => {
    boton.setAttribute('aria-pressed', String(posicion === anguloActual));
  });
}

botonesAngulo.forEach((boton, indice) => {
  boton.addEventListener('click', () => mostrarAngulo(indice));
});
vistaPolo.addEventListener('pointerdown', evento => {
  if (!evento.isPrimary || evento.button !== 0) return;
  inicioGesto = { id: evento.pointerId, x: evento.clientX, y: evento.clientY };
  vistaPolo.setPointerCapture(evento.pointerId);
});
vistaPolo.addEventListener('pointerup', evento => {
  if (inicioGesto?.id !== evento.pointerId) return;
  const distancia = evento.clientX - inicioGesto.x;
  const vertical = evento.clientY - inicioGesto.y;
  inicioGesto = undefined;
  if (Math.abs(distancia) > 32 && Math.abs(distancia) > Math.abs(vertical)) {
    mostrarAngulo(anguloActual + (distancia < 0 ? 1 : -1));
  }
});
vistaPolo.addEventListener('lostpointercapture', () => { inicioGesto = undefined; });
