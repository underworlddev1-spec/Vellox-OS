/* Bildableitungen erzeugen.

   ## Warum ein Browser und kein Bildwerkzeug

   Ein Projekt braucht für eine Handvoll Dateien keine eigene Bildbibliothek.
   Das Chromium, das ohnehin für jede Prüfung läuft, kann dasselbe: Es
   dekodiert die Quelle, zeichnet sie in eine Leinwand der Zielbreite und
   kodiert sie neu. Die Ableitungen sind mitversionierte Dateien neben ihren
   Originalen, so wie die ausgelieferte Fassung des Stylesheets neben seiner
   Quelle liegt.

   Ein Projekt mit vielen Bildern ersetzt dieses Werkzeug durch eine richtige
   Bildpipeline. Bis dahin ist das hier billiger als die Abhängigkeit.

   ## Der Dateiname ist Teil des Vertrags

   Trägt ein Dateiname eine Zahl, ist das seine tatsächliche Breite. Das ist
   keine Kosmetik: Ein `-800`, das 765 Pixel misst, lässt jeden w-Deskriptor
   lügen, der sich darauf verlässt, und der Browser wählt dann nach einer
   falschen Zahl. `bilder.mjs` prüft beides.

   ## Aufruf

     node werkzeug/ableiten.mjs <stamm> <breite> [<breite> ...]

   Beispiel: `node werkzeug/ableiten.mjs hof 400 800 1200` erzeugt aus
   `assets/img/hof.webp` und `assets/img/hof.jpg` je drei Ableitungen.

   Ein Server wird nicht gebraucht. Die Quelle wird von der Festplatte gelesen
   und als Datenadresse in eine leere Seite gegeben; damit bleibt die Leinwand
   gleichen Ursprungs und lässt sich auslesen. Ein Bild über `file://` oder von
   einem fremden Host färbt sie ein, und `toDataURL` wirft.
*/

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Playwright liegt beim Prüfstand und nicht in der Projektwurzel. Der Auflöser
   für nackte Modulnamen sucht vom Ort der importierenden Datei nach oben und
   nicht vom Arbeitsverzeichnis; deshalb wird hier ausdrücklich von dort
   aufgelöst. Das ist ehrlicher als eine zweite Kopie derselben Abhängigkeit. */
const verlangen = createRequire(new URL('../pruefstand/', import.meta.url));
let chromium;
try {
  ({ chromium } = verlangen('playwright'));
} catch {
  console.error('Playwright nicht gefunden. Im Ordner `pruefstand` einmal `npm install` laufen lassen.');
  process.exit(2);
}

const [stamm, ...breiten] = process.argv.slice(2);
if (!stamm || !breiten.length) {
  console.error('Aufruf: node werkzeug/ableiten.mjs <stamm> <breite> [...]');
  process.exit(2);
}

/* Denselben Umweg kennt der Prüfstand: Findet Playwright seinen Browser nicht,
   nennt ihn die Umgebung. */
const start = process.env.PRUEFSTAND_BROWSER
  ? { executablePath: process.env.PRUEFSTAND_BROWSER }
  : {};

const FORMATE = [
  ['webp', 'image/webp', 0.82],
  ['jpg', 'image/jpeg', 0.84],
  ['png', 'image/png', 1],
];

const browser = await chromium.launch(start);
const seite = await browser.newPage();
await seite.goto('about:blank');

let erzeugt = 0;
for (const breiteRoh of breiten) {
  const breite = Number(breiteRoh);
  if (!Number.isFinite(breite) || breite < 1) {
    console.error(`FEHLER  "${breiteRoh}" ist keine Breite`);
    continue;
  }
  for (const [endung, typ, guete] of FORMATE) {
    const quelle = path.join(WURZEL, 'assets/img', `${stamm}.${endung}`);
    if (!existsSync(quelle)) continue;

    const datenAdresse = `data:${typ};base64,${readFileSync(quelle).toString('base64')}`;
    const ergebnis = await seite.evaluate(
      async ({ datenAdresse, breite, typ, guete }) => {
        const bild = new Image();
        bild.src = datenAdresse;
        await bild.decode();
        if (bild.naturalWidth < breite) {
          return { fehler: `Quelle misst ${bild.naturalWidth}px und wird auf ${breite}px hochgerechnet` };
        }
        const hoehe = Math.round((breite / bild.naturalWidth) * bild.naturalHeight);
        const leinwand = document.createElement('canvas');
        leinwand.width = breite;
        leinwand.height = hoehe;
        const stift = leinwand.getContext('2d');
        stift.imageSmoothingEnabled = true;
        stift.imageSmoothingQuality = 'high';
        stift.drawImage(bild, 0, 0, breite, hoehe);
        return { adresse: leinwand.toDataURL(typ, guete), quellbreite: bild.naturalWidth, hoehe };
      },
      { datenAdresse, breite, typ, guete }
    );

    if (ergebnis.fehler) {
      console.error(`FEHLER  ${stamm}.${endung}: ${ergebnis.fehler}`);
      continue;
    }

    const ziel = path.join(WURZEL, 'assets/img', `${stamm}-${breite}.${endung}`);
    writeFileSync(ziel, Buffer.from(ergebnis.adresse.split(',')[1], 'base64'));
    console.log(`${path.relative(WURZEL, ziel).padEnd(46)} ${breite}x${ergebnis.hoehe} aus ${ergebnis.quellbreite}px`);
    erzeugt++;
  }
}

await browser.close();
if (!erzeugt) {
  console.error(`Keine Ableitung erzeugt. Liegt assets/img/${stamm}.<webp|jpg|png> vor?`);
  process.exit(1);
}
