// Ist das Gerüst noch ein Gerüst?
//
// Zwei Behauptungen:
//
//   1. Keine Route trägt mehr das Attribut `data-geruest`.
//   2. Kein sichtbarer Text nennt mehr das Wort GERUESTWERT.
//
// ## Warum diese Prüfung am ersten Tag rot ist
//
// Sie ist die einzige hier, die absichtlich rot startet. Ein Gerüst liefert
// vollständige Seiten mit Überschriften, Absätzen, einem Formular und zwei
// Rechtstexten aus. Alles daran ist echt gebaut und nichts davon ist wahr: Der
// Betreiber heißt nicht „Projektname“, das Impressum nennt keine Anschrift, und
// die Farben sind gesetzt, damit die Messungen etwas zu messen haben.
//
// Genau dieser Zustand ist gefährlich, weil er funktioniert. Zwölf Prüfungen
// melden grün, die Seite sieht aufgeräumt aus, und nichts an ihr sagt, dass sie
// noch niemandem gehört. Ein Rechtstext, der die Pflichtabschnitte in der
// richtigen Reihenfolge zeigt und keine einzige Angabe enthält, ist schlechter
// als eine leere Datei: Er sieht aus wie erledigt.
//
// Deshalb steht der Nachweis hier und nicht in einer Aufgabenliste. Wer die
// Attribute entfernt, ohne die Texte zu ersetzen, hat die Prüfung umgangen und
// nicht bestanden; das lässt sich nicht messen, sondern nur schreiben. Aber
// niemand entfernt sie versehentlich, und das ist der Unterschied zu einem
// Haken in einer Übergabeliste.
//
// ## Was mit dieser Datei geschieht, wenn das Projekt steht
//
// Sie bleibt. Ihre beiden Behauptungen kosten nichts, sobald sie grün sind, und
// sie fangen den Fall, dass jemand später eine neue Route aus einer alten
// Gerüstseite kopiert.
import { konfig, adresse, browserStarten, kontextOeffnen, melden } from '../lib/pruefstand.mjs';

const MARKE = 'GERUESTWERT';

const browser = await browserStarten();
const { ctx, p } = await kontextOeffnen(browser, { breite: 1440 });
const befunde = [];

for (const route of konfig.routen) {
  await p.goto(adresse(route));
  await p.waitForTimeout(120);

  const fund = await p.evaluate((marke) => ({
    traeger: [...document.querySelectorAll('[data-geruest]')].map(
      (el) => el.tagName.toLowerCase() + '[data-geruest="' + el.dataset.geruest + '"]'
    ),
    imText: document.body.innerText.includes(marke),
  }), MARKE);

  for (const traeger of fund.traeger) {
    befunde.push(
      `1) ${route}: ${traeger} steht noch da. Die Seite trägt Gerüsttext und ` +
        `keine Aussage dieses Projekts.`
    );
  }
  if (fund.imText) {
    befunde.push(`2) ${route}: „${MARKE}“ steht im sichtbaren Text.`);
  }
}

await ctx.close();
await browser.close();
melden(
  befunde,
  `Gerüst: keine Route trägt data-geruest, kein sichtbarer Text nennt ${MARKE}, ` +
    `${konfig.routen.length} Routen.`
);
