// Vollständige Accessibility-Prüfung mit axe-core.
//
// Eine Behauptung: Auf keiner Route und keinem Gerät meldet axe-core einen
// Verstoss gegen WCAG 2.0, 2.1 und 2.2 auf Stufe A und AA sowie gegen die
// Best-Practice-Regeln.
//
// axe prüft, was eine Maschine prüfen kann, und das ist mehr, als ein Team im
// Kopf behält. Es prüft aber ausdrücklich nicht alles: Ob eine Beschriftung
// verständlich ist, ob eine Reihenfolge sinnvoll ist und ob ein Kontrast über
// einem Foto hält, entscheidet keine Regel. Die übrigen Prüfungen dieses
// Prüfstands ergänzen genau das.
//
// axe-core wird aus `node_modules` geladen. Wer den Prüfstand ohne npm fahren
// will, legt `axe.min.js` neben diese Datei.
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { konfig, adresse, browserStarten, kontextOeffnen, melden } from '../lib/pruefstand.mjs';

const kandidaten = [
  new URL('../node_modules/axe-core/axe.min.js', import.meta.url),
  new URL('./axe.min.js', import.meta.url),
];
const quelle = kandidaten.map(fileURLToPath).find((p) => existsSync(p));
if (!quelle) {
  console.log(
    'BEFUNDE (1):\n - axe-core ist nicht auffindbar. `npm install` im Prüfstand ausführen ' +
      'oder axe.min.js neben pruefungen/axe.mjs legen.'
  );
  process.exit(1);
}
const axeQuelle = readFileSync(quelle, 'utf8');

const browser = await browserStarten();
const befunde = [];
const geraete = [
  { name: 'Desktop', breite: 1280, telefon: false },
  { name: 'Handy', breite: konfig.breiten.telefon[1] ?? 390, telefon: true },
];

for (const g of geraete) {
  const { ctx, p } = await kontextOeffnen(browser, { breite: g.breite, telefon: g.telefon });
  for (const route of konfig.routen) {
    await p.goto(adresse(route));
    await p.waitForTimeout(200);
    await p.addScriptTag({ content: axeQuelle });
    const ergebnis = await p.evaluate(async () => {
      const r = await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] },
      });
      return r.violations.map((v) => ({
        id: v.id,
        wirkung: v.impact,
        beschreibung: v.help,
        knoten: v.nodes.slice(0, 3).map((n) => n.target.join(' ')),
      }));
    });
    for (const v of ergebnis) {
      befunde.push(
        `${route} [${g.name}]: ${v.id} (${v.wirkung}) ${v.beschreibung}. Betroffen: ${v.knoten.join(', ')}`
      );
    }
  }
  await ctx.close();
}

await browser.close();
melden(
  befunde,
  `axe-core: keine Verstösse gegen WCAG 2.0/2.1/2.2 A und AA sowie Best Practice, ` +
    `${konfig.routen.length} Routen x ${geraete.length} Geräte.`
);
