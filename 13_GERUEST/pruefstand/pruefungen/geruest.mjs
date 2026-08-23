// Ist das Gerüst noch ein Gerüst?
//
// Drei Behauptungen:
//
//   1. Keine Route trägt mehr das Attribut `data-geruest`.
//   2. Kein sichtbarer Text nennt mehr das Wort GERUESTWERT.
//   3. Kein Kommentar im Stylesheet nennt mehr das Wort GERUESTWERT.
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
// ## Warum die dritte Behauptung den Quelltext liest
//
// Der übrige Prüfstand fragt, ob eine Seite richtig gebaut ist. Keine einzige
// seiner Behauptungen fragt, ob sie diesem Projekt gehört, und das ist keine
// Lücke im Werkzeug, sondern die Grenze des Messbaren: Ob eine Kopfzeile für
// diese Marke die richtige ist, entscheidet kein Programm.
//
// Messbar ist eine schwächere, aber nützliche Frage: Hat jemand die Entscheidung
// überhaupt angesehen? Jeder Wert, den das Gerüst trifft, obwohl er dem Projekt
// gehört, trägt im Stylesheet den Marker GERUESTWERT. Die Rundung, der
// Abschnittsrhythmus, die Raumskala, der obere Rand der typografischen Staffel.
// Das sind die Entscheidungen, die niemand bemerkt, weil sie funktionieren, und
// die deshalb unverändert in das fünfte Projekt wandern.
//
// **Der Marker verlangt nicht, dass sich die Zahl ändert. Er verlangt, dass
// jemand sie entscheidet.** Wer nach dem Messen zu dem Schluss kommt, dass zwei
// Pixel Rundung richtig sind, streicht den Marker und hat die Entscheidung
// übernommen. Wer ihn stehen lässt, hat sie geerbt, ohne es zu merken.
//
// Gelesen wird die Quelle und nicht die ausgelieferte Seite, denn die
// Kommentare sind genau das, was die Auslieferung entfernt.
//
// ## Was mit dieser Datei geschieht, wenn das Projekt steht
//
// Sie bleibt. Ihre beiden Behauptungen kosten nichts, sobald sie grün sind, und
// sie fangen den Fall, dass jemand später eine neue Route aus einer alten
// Gerüstseite kopiert.
import { readFileSync } from 'node:fs';
import { konfig, adresse, browserStarten, kontextOeffnen, melden, projektpfad } from '../lib/pruefstand.mjs';

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

// --- 3. Marker im Regelwerk ------------------------------------------------
let marker = null;
if (konfig.stylesheet) {
  const css = readFileSync(projektpfad(konfig.stylesheet), 'utf8');
  const zeilen = css.split('\n');
  marker = [];
  for (let i = 0; i < zeilen.length; i++) {
    if (zeilen[i].includes(MARKE)) marker.push(i + 1);
  }
  for (const zeile of marker) {
    const text = zeilen[zeile - 1].trim().replace(/\s+/g, ' ').slice(0, 90);
    befunde.push(
      `3) ${konfig.stylesheet}, Zeile ${zeile}: „${text}“. Diese Entscheidung ` +
        `gehört dem Projekt und ist noch die des Gerüsts.`
    );
  }
}

melden(
  befunde,
  `Gerüst: keine Route trägt data-geruest, kein sichtbarer Text nennt ${MARKE}, ` +
    (konfig.stylesheet
      ? `kein Kommentar in ${konfig.stylesheet} nennt ihn`
      : 'Regelwerk nicht geprüft (konfig.stylesheet fehlt)') +
    `, ${konfig.routen.length} Routen.`
);
