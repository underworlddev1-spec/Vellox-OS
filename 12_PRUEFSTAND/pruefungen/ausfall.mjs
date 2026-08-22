// Ausfallrichtung ohne JavaScript.
//
// Drei Behauptungen:
//
//   1. Ohne JavaScript ist jedes Bild sichtbar. Ein Bild darf nie unsichtbar
//      auf ein Skript warten, das nicht kommt.
//   2. Ohne JavaScript ist keine Route leer.
//   3. Was ohne JavaScript verschwindet, wird ersetzt und nicht weggelassen.
//      Geprüft wird das am strengsten Fall, den ein generisches Gate erkennen
//      kann: Ist ein Formular im Dokument und ohne Skript unsichtbar, muss auf
//      derselben Route ein sichtbarer Ersatz stehen.
//
// ## Warum hier keine Zeichenzahl steht
//
// Die erste Fassung dieser Prüfung verlangte, dass ohne JavaScript mindestens
// neunzig Prozent des sichtbaren Textes übrig bleiben. Sie meldete sofort rot,
// und zwar an einer Seite, die alles richtig machte: Ein Reservierungsformular
// war ohne Skript ausgeblendet, weil seine Pflichtfelder für Datum und Uhrzeit
// ohne Skript null wählbare Optionen tragen. Das Formular wäre dauerhaft
// ungültig gewesen, und wer es ausfüllt, hätte das erst beim Absenden erfahren.
// An seiner Stelle stand ein kürzerer Hinweis mit Telefonnummer.
//
// Die Prüfung bestrafte damit genau die richtige Entscheidung. **Ein rotes Gate
// kann dasselbe bedeuten wie eine grüne Gegenprobe: dass die Behauptung falsch
// ist und nicht die Seite.** Der Ersatz ist kürzer als das Ersetzte, und das
// ist kein Mangel.
//
// Ob ein Abschnitt ohne Skript inhaltlich vollständig bleibt, etwa ein Schieber
// mit neun Stimmen, der ohne Wischgeste nur eine zeigt, ist eine
// projektspezifische Behauptung. Sie wird im Projekt geschrieben und nennt die
// Zahl, die dort gilt.
import { konfig, adresse, browserStarten, kontextOeffnen, melden } from '../lib/pruefstand.mjs';

const browser = await browserStarten();
const befunde = [];
const MINDESTZEICHEN = 200;

for (const route of konfig.routen) {
  const { ctx, p } = await kontextOeffnen(browser, { breite: 1280, javascript: false });
  await p.goto(adresse(route));
  await p.waitForTimeout(150);

  const fund = await p.evaluate(() => {
    const versteckt = (el) => {
      for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
        const s = getComputedStyle(n);
        if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return true;
      }
      return false;
    };
    const formulare = [...document.querySelectorAll('form')];
    const ersatzSichtbar = [...document.querySelectorAll('noscript')].some((n) => {
      // Ohne Skript rendert der Browser den Inhalt von `noscript`. Ein
      // Ersatz zählt nur, wenn er dabei wirklich Fläche bekommt.
      //
      // Gemessen wird die Fläche und nicht `innerText`. Der fällt bei einem
      // nicht gerenderten Element auf `textContent` zurück und meldet damit
      // Text, den niemand sieht. Die Gegenprobe „Ersatz ausblenden“ blieb
      // dadurch grün, und das war ein Fehler des Gates.
      const r = n.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return false;
      return (n.textContent || '').replace(/\s+/g, ' ').trim().length > 20;
    });
    return {
      // Sichtbare Zeichen, gezählt an gerenderten Textknoten. Dieselbe Falle
      // wie oben: `document.body.innerText` liefert auch dann Text, wenn
      // nichts davon eine Fläche hat.
      zeichen: (() => {
        let z = 0;
        const lauf = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = lauf.nextNode())) {
          const el = n.parentElement;
          if (!el || !window.vx.sichtbar(el)) continue;
          z += n.textContent.replace(/\s+/g, ' ').trim().length;
        }
        return z;
      })(),
      dunkleBilder: [...document.querySelectorAll('img')]
        .filter((i) => {
          const r = i.getBoundingClientRect();
          if (r.width < 40 || r.height < 40) return false;
          const o = getComputedStyle(i).opacity;
          return o !== '' && Number(o) < 0.5;
        })
        .map((i) => (i.getAttribute('src') || '').split('/').pop()),
      formulareVersteckt: formulare.filter(versteckt).length,
      formulareGesamt: formulare.length,
      ersatzSichtbar,
    };
  });

  for (const bild of fund.dunkleBilder) {
    befunde.push(`${route}: ohne JavaScript ist das Bild ${bild} unsichtbar`);
  }
  if (fund.zeichen < MINDESTZEICHEN) {
    befunde.push(`${route}: ohne JavaScript nur ${fund.zeichen} sichtbare Zeichen (verlangt ${MINDESTZEICHEN})`);
  }
  if (fund.formulareVersteckt > 0 && !fund.ersatzSichtbar) {
    befunde.push(
      `${route}: ${fund.formulareVersteckt} von ${fund.formulareGesamt} Formularen sind ohne ` +
        `JavaScript unsichtbar, ohne dass ein sichtbarer Ersatz danebensteht`
    );
  }
  await ctx.close();
}

await browser.close();
melden(
  befunde,
  `Ausfallrichtung: ohne JavaScript sind Bilder sichtbar, keine Route ist leer, ` +
    `und ausgeblendete Formulare haben einen Ersatz. ${konfig.routen.length} Routen.`
);
