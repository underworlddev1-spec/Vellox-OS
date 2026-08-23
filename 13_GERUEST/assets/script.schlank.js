(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const zeigen = (bild) => bild.classList.add('ist-da');

  for (const bild of document.querySelectorAll('.ladeflaeche img')) {
    if (bild.complete && bild.naturalWidth > 0) {
      zeigen(bild);
      continue;
    }
    if (typeof bild.decode === 'function') {
      bild.decode().then(() => zeigen(bild), () => zeigen(bild));
    } else {
      bild.addEventListener('load', () => zeigen(bild), { once: true });
      bild.addEventListener('error', () => zeigen(bild), { once: true });
    }
  }

  for (const formular of document.querySelectorAll('form[data-sammelmeldung]')) {
    const ziel = document.getElementById(formular.dataset.sammelmeldung);
    if (!ziel) continue;

    formular.noValidate = true;

    formular.addEventListener('submit', (ereignis) => {
      const ungueltig = formular.querySelectorAll(':invalid');
      if (!ungueltig.length) return;
      ereignis.preventDefault();
      ziel.className = 'meldung meldung--fehler';
      ziel.textContent =
        ungueltig.length === 1
          ? 'Ein Feld braucht noch eine Angabe.'
          : `${ungueltig.length} Felder brauchen noch eine Angabe.`;
      ungueltig[0].focus();
    });
  }
})();
