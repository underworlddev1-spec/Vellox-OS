// Textfluss: Zeilenlänge und Zwangsspalten.
//
// Zwei Behauptungen:
//
//   1. Keine Zeile trägt mehr Zeichen als das konfigurierte Höchstmass.
//   2. Kein Textblock wird in eine Spalte gezwungen, die schmaler ist als
//      sechs Zeichen seiner eigenen Schriftgrösse.
//
// Gemessen wird an Textknoten und nicht an Elementen. Ein Element liefert die
// Breite seines Kastens; die sagt nichts darüber, wie viele Zeichen wirklich in
// einer Zeile stehen, sobald der Text kürzer ist als sein Kasten oder in
// mehreren Knoten liegt.
//
// Behauptung 2 fängt den Fall, in dem eine Spur ohne feste Breite auf ihren
// Inhalt schrumpft und ein Wort senkrecht ausbuchstabiert wird. Er entsteht
// zuverlässig dann, wenn eine Ausrichtungsregel ohne Medienabfrage vom Desktop
// auf das Telefon durchschlägt.
import { konfig, adresse, browserStarten, kontextOeffnen, melden } from '../lib/pruefstand.mjs';

const HOECHST = konfig.mobil.hoechstZeichenJeZeile;
const browser = await browserStarten();
const befunde = [];
const breiten = [...konfig.breiten.telefon, ...konfig.breiten.zwischen, ...konfig.breiten.desktop];

for (const breite of breiten) {
  const { ctx, p } = await kontextOeffnen(browser, { breite, telefon: breite < 600 });
  for (const route of konfig.routen) {
    await p.goto(adresse(route));
    await p.waitForTimeout(120);
    for (const fund of await p.evaluate((hoechst) => {
      const out = [];
      const lauf = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      let k;
      while ((k = lauf.nextNode())) {
        const text = k.textContent;
        if (!/\S/.test(text)) continue;
        const el = k.parentElement;
        if (!el || !window.vx.sichtbar(el)) continue;
        const grad = parseFloat(getComputedStyle(el).fontSize) || 16;

        const g = document.createRange();
        g.selectNodeContents(k);
        const zeilen = [...g.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
        if (!zeilen.length) continue;

        // 2. Zwangsspalte: Die breiteste Zeile trägt weniger als sechs Zeichen
        // Platz. Das braucht mehrere Zeilen, sonst ist ein kurzes Wort in
        // einer schmalen Spur schon ein Befund.
        const breiteste = Math.max(...zeilen.map((r) => r.width));
        if (zeilen.length >= 3 && text.trim().length >= 30 && text.trim().length / zeilen.length < 6) {
          out.push({
            art: 'zwang',
            text: text.trim().slice(0, 40),
            breite: Math.round(breiteste),
            zeilen: zeilen.length,
          });
        }

        // 1. Zeichen je Zeile.
        //
        // Der Vorfilter spart das teure Zählen: Eine Zeile kann höchstens
        // `breiteste / (0,3 x Schriftgrad)` Zeichen tragen, und 0,3 em ist
        // schmaler als jede vorkommende Laufweite. Wer darunter bleibt, kann
        // die Grenze nicht reissen.
        //
        // Der Vorfilter darf sich ausdrücklich NICHT auf die Zeilenzahl
        // beziehen. Genau daran hatte die Fassung, aus der diese Prüfung
        // stammt, ein Loch: Sie sah nur Knoten ab drei Zeilen an, weil die
        // Zwangsspalte das braucht, und übersah damit jede zu lange Zeile in
        // einem zweizeiligen Absatz. Gefunden wurde eine mit rund hundert
        // Zeichen bei 768 px, während das Gate grün meldete.
        if (breiteste / (0.3 * grad) <= hoechst) continue;

        // Gezählt wird jedes Zeichen mit einer eigenen Fläche. Damit zählen
        // gesetzte Leerzeichen mit, wie es die Konvention verlangt, und
        // eingezogener Quelltext, den der Browser zu nichts zusammenfaltet,
        // zählt nicht.
        const eimer = new Map();
        const rz = document.createRange();
        for (let i = 0; i < text.length; i++) {
          rz.setStart(k, i);
          rz.setEnd(k, i + 1);
          const kasten = rz.getBoundingClientRect();
          if (!kasten.width) continue;
          const oben = Math.round(kasten.top);
          eimer.set(oben, (eimer.get(oben) || 0) + 1);
        }
        const vollste = Math.max(0, ...eimer.values());
        if (vollste > hoechst) {
          out.push({ art: 'lang', text: text.trim().slice(0, 40), zeichen: vollste });
        }
      }
      return out;
    }, HOECHST)) {
      if (fund.art === 'lang') {
        befunde.push(`1) ${route} @${breite}px: Zeile mit ${fund.zeichen} Zeichen (erlaubt ${HOECHST}) in „${fund.text}…“`);
      } else {
        befunde.push(
          `2) ${route} @${breite}px: Text auf ${fund.zeilen} Zeilen in einer Spalte von ` +
            `${fund.breite}px: „${fund.text}…“`
        );
      }
    }
  }
  await ctx.close();
}

await browser.close();
melden(
  befunde,
  `Textfluss: keine Zeile über ${HOECHST} Zeichen und keine Zwangsspalte, ` +
    `${konfig.routen.length} Routen x ${breiten.length} Breiten.`
);
