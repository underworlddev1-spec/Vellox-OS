/* VELLOX-Gerüst: Skriptquelle.
 *
 * Diese Datei ist die QUELLE. `node werkzeug/schlank.mjs` erzeugt daraus
 * `assets/script.schlank.js`, und nur die wird ausgeliefert.
 *
 * ## Der Vertrag dieses Skripts
 *
 * Es darf die Seite verbessern und es darf sie nicht tragen. Alles, was hier
 * steht, ist eine Ergänzung zu etwas, das ohne Skript bereits funktioniert.
 * Der Prüfstand hält das fest: `ausfall.mjs` misst mit abgeschaltetem
 * JavaScript, dass jedes Bild sichtbar und keine Route leer ist.
 *
 * Ein Abschnitt, der ein Skript braucht, um seinen Inhalt zu zeigen, hat ohne
 * dieses Skript keinen Inhalt. Wo eine Funktion ohne Skript nicht sinnvoll
 * bedienbar ist, wird sie ausgeblendet und durch einen sichtbaren Ersatz in
 * <noscript> vertreten, statt unbedienbar dazustehen.
 */

(() => {
  'use strict';

  /* Die js-Klasse setzt das Skript selbst und so früh wie möglich. Sie ist der
     Schalter, mit dem das Stylesheet zwischen der Fassung mit und ohne Skript
     unterscheidet, ohne dabei zu flackern. */
  document.documentElement.classList.add('js');

  /* ----------------------------------------------------------------------
     Ladeflächen

     Das Bild wird eingeblendet, sobald es dekodiert ist, und nicht schon,
     wenn seine Daten angekommen sind. Der Unterschied ist bei großen Bildern
     ein sichtbarer Sprung.

     Zwei Ausfallrichtungen sind eingebaut. Ein Bild, das bereits vollständig
     ist, wird sofort gezeigt, ohne auf ein Ereignis zu warten, das nicht mehr
     kommt. Und `decode()` kann scheitern, etwa bei einer beschädigten Datei;
     dann wird das Bild trotzdem sichtbar gemacht, weil ein sichtbares
     kaputtes Bild besser ist als eine leere Fläche ohne Erklärung.
     ---------------------------------------------------------------------- */
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

  /* ----------------------------------------------------------------------
     Formularmeldungen

     Der Browser prüft bereits. Was ihm fehlt, ist eine Sammelmeldung an einer
     Stelle, die ein Vorlesewerkzeug ansagt: Seine eigenen Blasen erscheinen
     einzeln, nacheinander und verschwinden von selbst.

     **Die Übernahme wird hier gesetzt und steht nicht im Markup.** Solange ein
     Formular seine eigene Prüfung behält, blockiert der Browser das Absenden
     und das Absende-Ereignis feuert nie; ein Skript, das darauf lauscht, wartet
     dann für immer auf einen Zustand, den es selbst verhindert hat. Genau
     deshalb steht `novalidate` nicht in der Seite: Ohne dieses Skript bleibt
     die Browserprüfung vollständig wirksam, und nur mit ihm wird sie
     übernommen.

     `role="status"` und nicht `alert`: Eine fehlende Angabe unterbricht nicht
     mitten im Satz.
     ---------------------------------------------------------------------- */
  for (const formular of document.querySelectorAll('form[data-sammelmeldung]')) {
    const ziel = document.getElementById(formular.dataset.sammelmeldung);
    if (!ziel) continue;

    formular.noValidate = true;

    formular.addEventListener('submit', (ereignis) => {
      const ungueltig = formular.querySelectorAll(':invalid');
      if (!ungueltig.length) return;
      ereignis.preventDefault();
      /* Die Meldung bekommt ihre Klassen erst, wenn sie etwas zu sagen hat.
         Eine leere, aber gestaltete Fläche stünde sonst dauerhaft im Formular
         und wäre ein Kasten ohne Aufgabe. */
      ziel.className = 'meldung meldung--fehler';
      ziel.textContent =
        ungueltig.length === 1
          ? 'Ein Feld braucht noch eine Angabe.'
          : `${ungueltig.length} Felder brauchen noch eine Angabe.`;
      ungueltig[0].focus();
    });
  }
})();
