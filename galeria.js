(() => {
  const baralho = document.getElementById('baralho');
  if (!baralho) return;

  const cartas = Array.from(baralho.querySelectorAll('.carta'));
  const pontosWrap = document.getElementById('baralhoPontos');
  const btnAnterior = document.getElementById('btnAnterior');
  const btnProxima = document.getElementById('btnProxima');
  const zoomOverlay = document.getElementById('zoomOverlay');
  const zoomImg = document.getElementById('zoomImg');

  let atual = 0;
  const total = cartas.length;

  // monta os pontinhos de navegação
  cartas.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('ativo');
    pontosWrap.appendChild(dot);
  });
  const pontos = Array.from(pontosWrap.children);

  function render() {
    cartas.forEach((carta, i) => {
      let estado = 'hidden';
      if (i === atual) estado = 'active';
      else if (i === (atual + 1) % total) estado = 'next';
      else if (i === (atual - 1 + total) % total) estado = 'prev';
      carta.dataset.state = estado;
    });
    pontos.forEach((dot, i) => dot.classList.toggle('ativo', i === atual));
  }

  function proxima() {
    atual = (atual + 1) % total;
    render();
  }

  function anterior() {
    atual = (atual - 1 + total) % total;
    render();
  }

  btnProxima.addEventListener('click', proxima);
  btnAnterior.addEventListener('click', anterior);

  // ---- arrastar / deslizar a carta do topo ----
  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let arrastando = false;
  let foiArraste = false;
  const LIMIAR_TROCA = 70;
  const LIMIAR_TAP = 8;

  function pegarCartaAtiva() {
    return cartas[atual];
  }

  function onStart(x, y) {
    arrastando = true;
    foiArraste = false;
    startX = x;
    startY = y;
    deltaX = 0;
    const carta = pegarCartaAtiva();
    carta.classList.add('dragging');
  }

  function onMove(x, y) {
    if (!arrastando) return;
    deltaX = x - startX;
    if (Math.abs(deltaX) > LIMIAR_TAP || Math.abs(y - startY) > LIMIAR_TAP) {
      foiArraste = true;
    }
    const carta = pegarCartaAtiva();
    const rotacao = deltaX / 18;
    carta.style.transform = `translateX(${deltaX}px) rotate(${rotacao}deg)`;
  }

  function onEnd() {
    if (!arrastando) return;
    arrastando = false;
    const carta = pegarCartaAtiva();
    carta.classList.remove('dragging');
    carta.style.transform = '';

    if (Math.abs(deltaX) > LIMIAR_TROCA) {
      if (deltaX < 0) proxima();
      else anterior();
    }
    deltaX = 0;
  }

  baralho.addEventListener('pointerdown', (e) => {
    if (e.target.closest('.carta') !== pegarCartaAtiva()) return;
    onStart(e.clientX, e.clientY);
  });
  window.addEventListener('pointermove', (e) => onMove(e.clientX, e.clientY));
  window.addEventListener('pointerup', onEnd);
  window.addEventListener('pointercancel', onEnd);

  // ---- teclado ----
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') proxima();
    if (e.key === 'ArrowLeft') anterior();
    if (e.key === 'Escape') fecharZoom();
  });

  // ---- zoom com brilho ao tocar na foto ----
  function abrirZoom(src, alt) {
    zoomImg.src = src;
    zoomImg.alt = alt || '';
    zoomOverlay.classList.add('aberto');
    zoomOverlay.setAttribute('aria-hidden', 'false');
  }

  function fecharZoom() {
    zoomOverlay.classList.remove('aberto');
    zoomOverlay.setAttribute('aria-hidden', 'true');
  }

  cartas.forEach((carta) => {
    const btn = carta.querySelector('.carta-foto-btn');
    const img = carta.querySelector('.carta-foto');
    btn.addEventListener('click', () => {
      // só abre o zoom se não foi um arraste (senão todo swipe abriria a foto)
      if (foiArraste) return;
      abrirZoom(img.src, img.alt);
    });
  });

  zoomOverlay.addEventListener('click', fecharZoom);

  render();
})();
