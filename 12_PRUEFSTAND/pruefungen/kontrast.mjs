// Kontrast am gerenderten Pixel.
//
// Zwei Behauptungen:
//
//   1. Jeder sichtbare Text erfüllt WCAG AA: 4,5 zu 1, bei grossem Text 3 zu 1.
//   2. Die Grenze jedes bedienbaren Elements erfüllt 3 zu 1 gegen ihre Fläche
//      (WCAG 1.4.11).
//
// Die Hintergrundfarbe wird über die Elternkette aufgelöst und nicht am
// Element selbst gelesen. Ein Element ohne eigene Fläche liegt auf der seines
// Elternteils, und eine Fläche mit Deckkraft ist nicht die Farbe, die im
// Stylesheet steht. Genau daran scheitern Prüfungen, die `backgroundColor`
// direkt vergleichen.
//
// Text über einem Bild kann diese Prüfung nicht messen, weil dort kein
// berechenbarer Untergrund existiert. Solche Stellen werden geometrisch
// erkannt, übersprungen und am Ende gezählt gemeldet. Sie brauchen eine
// eigene Prüfung am fotografierten Pixel, und zwar eine, die den Hintergrund
// wirklich fotografiert: Ein Werkzeug, das ihn nachbaut, prüft am Ende sein
// eigenes Modell.
//
// Erkannt wird geometrisch und nicht über einen Klassennamen. Die Fassung,
// aus der diese Prüfung stammt, trug dafür `.kopfbereich--ueber-hero` im
// Quelltext des Gates. Das funktioniert genau so lange, wie die Klasse heisst,
// wie sie heisst.
//
// Nicht gemessen wird ausserdem, was als Grafik ausgezeichnet ist. Eine
// Sternreihe mit `role="img"` und Beschriftung ist kein Text im Sinne von
// WCAG 1.4.3; für sie gilt 1.4.11 mit 3 zu 1.
//
// Die Kantenbehauptung gilt nur für Elemente mit einer Kante auf allen vier
// Seiten. Eine einzelne Linie an einer Seite ist ein Trenner und keine
// Grenze, die ein Bedienelement identifiziert.
//
// Und sie gilt nur dort, wo die Grenze wirklich Information trägt: bei
// Formularfeldern und Knöpfen. Ein Verweis, der als Chip gestaltet ist, wird
// über seine Beschriftung erkannt und nicht über seine Kante; WCAG 1.4.11
// verlangt 3 zu 1 für das, was zur Identifikation nötig ist, und nicht für
// jede Linie. Projekte, die Verweise als Knöpfe gestalten, erweitern den
// Selektor über `kontrast.bedienelemente` in der Konfiguration.
import { konfig, adresse, browserStarten, kontextOeffnen, melden } from '../lib/pruefstand.mjs';

const browser = await browserStarten();
const befunde = [];
const breiten = [konfig.breiten.telefon[1] ?? 390, 1280];
let ueberMedienGesamt = 0;
const BEDIENELEMENTE =
  konfig.kontrast?.bedienelemente ?? 'input, select, textarea, button, [role="button"]';

for (const breite of breiten) {
  const { ctx, p } = await kontextOeffnen(browser, { breite, telefon: breite < 600 });
  for (const route of konfig.routen) {
    await p.goto(adresse(route));
    await p.waitForTimeout(150);
    const ergebnis = await p.evaluate((auswahl) => {
      const out = [];
      const beschreiben = (el) =>
        el.tagName.toLowerCase() +
        (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : '');
      // Alles, was einen unberechenbaren Untergrund erzeugt: ersetzte
      // Elemente und Flächen mit Hintergrundbild.
      const medien = [];
      for (const el of document.querySelectorAll('img, video, canvas, svg, picture')) {
        if (window.vx.sichtbar(el)) medien.push({ el, r: el.getBoundingClientRect() });
      }
      for (const el of document.querySelectorAll('body *')) {
        if (getComputedStyle(el).backgroundImage === 'none') continue;
        if (window.vx.sichtbar(el)) medien.push({ el, r: el.getBoundingClientRect() });
      }
      let uebersprungen = 0;
      const ueberMedium = (el) => {
        const r = el.getBoundingClientRect();
        for (const m of medien) {
          if (m.el === el || el.contains(m.el)) continue;
          if (r.left < m.r.right && r.right > m.r.left && r.top < m.r.bottom && r.bottom > m.r.top) return true;
        }
        return false;
      };
      const alsGrafik = (el) => {
        for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
          if (n.getAttribute('role') === 'img' || n.getAttribute('aria-hidden') === 'true') return true;
        }
        return false;
      };

      // 1. Text
      const lauf = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let k;
      const gesehen = new Set();
      while ((k = lauf.nextNode())) {
        if (!/\S/.test(k.textContent)) continue;
        const el = k.parentElement;
        if (!el || !window.vx.sichtbar(el) || gesehen.has(el)) continue;
        gesehen.add(el);
        if (alsGrafik(el)) continue;
        if (ueberMedium(el)) { uebersprungen++; continue; }
        const s = getComputedStyle(el);
        const vorne = (s.color.match(/rgba?\(([^)]+)\)/) || [])[1];
        if (!vorne) continue;
        const v = vorne.split(/[,\s\/]+/).filter(Boolean).map(Number);
        const hinten = window.vx.hintergrund(el);
        const misch = v.length > 3 && v[3] < 1
          ? [0, 1, 2].map((i) => v[i] * v[3] + hinten[i] * (1 - v[3]))
          : v.slice(0, 3);
        const wert = window.vx.kontrast(misch, hinten);
        const grad = parseFloat(s.fontSize);
        const fett = Number(s.fontWeight) >= 700;
        const gross = grad >= 24 || (fett && grad >= 18.66);
        const schwelle = gross ? 3 : 4.5;
        if (wert < schwelle - 0.01) {
          out.push({
            art: 'text',
            was: beschreiben(el),
            wert: wert.toFixed(2),
            schwelle,
            text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40),
          });
        }
      }

      // 2. Kanten bedienbarer Elemente
      for (const el of document.querySelectorAll(auswahl)) {
        if (!window.vx.sichtbar(el)) continue;
        if (el.disabled || el.getAttribute('aria-disabled') === 'true') continue;
        if (el.type === 'hidden' || el.closest('[hidden]')) continue;
        if (ueberMedium(el)) { uebersprungen++; continue; }
        const s = getComputedStyle(el);
        // Nur eine vollständige Grenze identifiziert ein Bedienelement.
        const rundum = ['Top', 'Right', 'Bottom', 'Left'].every(
          (k) => parseFloat(s['border' + k + 'Width']) > 0 && s['border' + k + 'Style'] !== 'none'
        );
        if (!rundum) continue;
        for (const seite of ['Top']) {
          const f = (s['border' + seite + 'Color'].match(/rgba?\(([^)]+)\)/) || [])[1];
          if (!f) continue;
          const v = f.split(/[,\s\/]+/).filter(Boolean).map(Number);
          const hinten = window.vx.hintergrund(el.parentElement || el);
          const misch = v.length > 3 && v[3] < 1
            ? [0, 1, 2].map((i) => v[i] * v[3] + hinten[i] * (1 - v[3]))
            : v.slice(0, 3);
          const wert = window.vx.kontrast(misch, hinten);
          if (wert < 2.99) {
            out.push({ art: 'kante', was: beschreiben(el), wert: wert.toFixed(2), schwelle: 3, text: seite });
          }
          break;
        }
      }
      return { funde: out, uebersprungen };
    }, BEDIENELEMENTE);
    ueberMedienGesamt += ergebnis.uebersprungen;
    for (const f of ergebnis.funde) {
      befunde.push(
        f.art === 'text'
          ? `1) ${route} @${breite}px: ${f.was} misst ${f.wert}:1 (verlangt ${f.schwelle}) bei „${f.text}…“`
          : `2) ${route} @${breite}px: Kante von ${f.was} misst ${f.wert}:1 (verlangt 3)`
      );
    }
  }
  await ctx.close();
}

await browser.close();
melden(
  befunde,
  `Kontrast: Text und Bedienelementgrenzen erfüllen WCAG AA, ${konfig.routen.length} Routen x ` +
    `${breiten.length} Breiten. ${ueberMedienGesamt} Elemente liegen über Medien und brauchen eine ` +
    `eigene Prüfung am fotografierten Pixel.`
);
