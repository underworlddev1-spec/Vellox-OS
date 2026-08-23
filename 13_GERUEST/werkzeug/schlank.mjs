/* Auslieferungsfassung von Stylesheet und Skript erzeugen.

   ## Warum es diese Datei gibt

   Die Quellen in `assets/` tragen ihre Begründungen mit. Eine Regel neben
   ihrem Warum ist der Grund, warum ein Projekt seine Entscheidungen über
   Monate halten kann, statt sie beim nächsten Termindruck wieder aufzuweichen.
   Für den Menschen, der die Datei liest, ist das der ganze Wert.

   Für den Gast, der die Seite öffnet, ist es Ballast auf dem kritischen Pfad.
   Das Stylesheet blockiert das erste Bild, und in dem Projekt, aus dem dieses
   Werkzeug stammt, bestand ein Drittel der Wartezeit bis zum ersten Inhalt aus
   Text, den kein Browser liest: 43,8 KB brotli mit Kommentaren, 9,7 KB ohne.

   Beides ist berechtigt, und beides zugleich geht nur, wenn Quelle und
   Auslieferung getrennt sind.

   ## Warum das keine Werkzeugkette ist

   Es kommt keine Abhängigkeit dazu, kein Paketmanager und kein Schritt, ohne
   den die Seite nicht mehr läuft. Die erzeugten Dateien werden mitversioniert
   und bleiben gültig, auch wenn dieses Werkzeug verschwindet. Dasselbe
   Verhältnis haben Bildableitungen zu ihren Originalen.

   ## Welche Datei ist die Wahrheit

   Bearbeitet wird immer `assets/style.css` und `assets/script.js`.

   Das Skript geht als eigene Datei `assets/script.schlank.js` heraus. Diese
   Richtung ist bewusst so herum: Wer versehentlich die Quelle bearbeitet, tut
   das Richtige und muss nur neu erzeugen. Andersherum, Quelle unter einem
   Sondernamen und Auslieferung unter dem gewohnten, verschwände dieselbe
   Bearbeitung beim nächsten Lauf stillschweigend.

   Das Stylesheet geht überhaupt nicht als Datei heraus, sondern in jede Seite,
   zwischen zwei Marken. Ein verlinktes Stylesheet blockiert das erste Bild und
   kostet dafür eine volle Rundreise durchs Netz; die lässt sich nicht
   verkürzen, nur vermeiden. Der Preis ist die verlorene Zwischenspeicherung:
   Jede Folgeseite bringt die Regeln erneut mit. **Dieser Handel lohnt erst
   unterhalb von rund zehn Kilobyte** und hängt damit an der Entscheidung
   darüber. Ein Projekt, dessen ausgeliefertes Stylesheet deutlich schwerer
   wird, rechnet ihn neu und verlinkt gegebenenfalls wieder.

   ## Welche Seiten bekommen den Stil

   Alle, die es gibt. Die Liste wird nicht gepflegt, sondern gelesen: Dieses
   Werkzeug durchsucht das Projekt nach `.html` und lässt dabei nur aus, was
   ohnehin nicht ausgeliefert wird. Eine gepflegte Liste veraltet an dem Tag,
   an dem jemand eine Seite hinzufügt und den einen Platz vergisst; das ist der
   häufigste Weg, auf dem eine Seite ohne Regeln live geht.

   Eine Seite ohne Marken ist deshalb ein Befund und keine stille Ausnahme.

   ## Was entfernt wird

   Nur Kommentare und die Leerzeilen, die dadurch entstehen. Keine Umbenennung,
   keine Kürzung von Werten, keine Umsortierung: Der Unterschied zwischen
   Quelle und Auslieferung soll mit bloßem Auge nachvollziehbar bleiben. Beim
   Skript werden außerdem nur Blockkommentare entfernt, die allein auf ihren
   Zeilen stehen. Ein `/*` mitten in einer Zeichenkette oder einem regulären
   Ausdruck bliebe sonst unerkannt und würde gültigen Code zerschneiden.

   ## Aufruf

     node werkzeug/schlank.mjs              erzeugt
     node werkzeug/schlank.mjs --pruefen    vergleicht nur und endet mit 1,
                                            wenn die Auslieferung veraltet ist
*/

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const NUR_PRUEFEN = process.argv.includes('--pruefen');

const MARKE_A = '<!--stil:anfang-->';
const MARKE_E = '<!--stil:ende-->';

/* Ordner, die keine ausgelieferten Seiten enthalten. `pruefstand` steht
   ausdrücklich dabei: Dort liegen fremde Pakete mit eigenen HTML-Dateien, und
   die gehören nicht diesem Projekt. */
const AUSGELASSEN = new Set([
  'node_modules', '.git', 'pruefstand', 'werkzeug', 'assets', 'dist', 'build',
]);

function seitenSuchen(ordner, relativ = '') {
  const gefunden = [];
  for (const eintrag of fs.readdirSync(ordner, { withFileTypes: true })) {
    if (eintrag.name.startsWith('.')) continue;
    const rel = relativ ? `${relativ}/${eintrag.name}` : eintrag.name;
    if (eintrag.isDirectory()) {
      if (AUSGELASSEN.has(eintrag.name)) continue;
      gefunden.push(...seitenSuchen(path.join(ordner, eintrag.name), rel));
    } else if (eintrag.name.endsWith('.html')) {
      gefunden.push(rel);
    }
  }
  return gefunden;
}

/* CSS: Blockkommentare sind die einzige Kommentarform. Steht in einer
   Zeichenkette des Stylesheets ein Kommentarzeichen, greift dieser einfache
   Weg daneben; das ist selten genug, um es zu prüfen statt zu bauen. */
function cssSchlank(text) {
  let aus = text.replace(/\/\*[\s\S]*?\*\//g, '');
  aus = aus.replace(/[ \t]+$/gm, '');
  aus = aus.replace(/\n{2,}/g, '\n');
  return aus.trim() + '\n';
}

/* JS: nur ganzzeilige Blockkommentare. Eine Zeile zählt als Anfang, wenn vor
   dem Kommentarzeichen nur Weißraum steht; das Ende ist die Zeile, auf der
   nach dem Schluss nur noch Weißraum folgt. Alles andere bleibt unangetastet.
   Das lässt ein paar Kilobyte liegen und kann dafür keinen gültigen Code
   zerschneiden. */
function jsSchlank(text) {
  const aus = [];
  let imKommentar = false;
  for (const zeile of text.split('\n')) {
    if (!imKommentar) {
      if (!/^\s*\/\*/.test(zeile)) { aus.push(zeile); continue; }
      if (/^\s*\/\*[\s\S]*?\*\/\s*$/.test(zeile)) continue;
      if (/\*\//.test(zeile)) { aus.push(zeile); continue; }
      imKommentar = true;
      continue;
    }
    if (/\*\//.test(zeile)) {
      const rest = zeile.slice(zeile.indexOf('*/') + 2);
      imKommentar = false;
      if (rest.trim()) aus.push(rest);
    }
  }
  let t = aus.join('\n');
  t = t.replace(/[ \t]+$/gm, '');
  t = t.replace(/\n{3,}/g, '\n\n');
  return t.trim() + '\n';
}

/* Relative Adressen umschreiben.

   Das ist kein Feinschliff, sondern die Bedingung dafür, dass Inline-Stil
   überhaupt funktioniert. `url("font/x.woff2")` ist relativ zu der Datei, in
   der es steht: In `assets/style.css` zeigt es auf `assets/font/x.woff2`,
   wörtlich in eine Seite kopiert auf `font/x.woff2`, und die Schrift fehlt.

   In dem Projekt, aus dem dieses Werkzeug stammt, ist genau das passiert.
   Aufgefallen ist es nicht an der Bewertungszahl, denn ein Browser wechselt
   stillschweigend auf die Ersatzschrift, sondern an einer Prüfung, die
   fehlgeschlagene Anfragen mitzählt. Eine Messzahl hätte den Fehler nie
   gezeigt.

   Der Präfix hängt an der Tiefe der Seite. Eine Seite in einem Unterordner
   braucht einen Schritt zurück, sonst zeigt derselbe Pfad ins Leere. */
function adressenUmschreiben(text, praefix) {
  return text.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (ganz, anf, ziel) => {
    if (/^(data:|https?:|\/\/|\/|#)/i.test(ziel)) return ganz;
    return `url(${anf}${praefix}${ziel}${anf})`;
  });
}

const seiten = seitenSuchen(WURZEL).sort();
let abweichung = 0;

if (!seiten.length) {
  console.log('FEHLER  keine Seite gefunden -- steht dieses Werkzeug im Projekt?');
  process.exit(1);
}

const stilRoh = cssSchlank(fs.readFileSync(path.join(WURZEL, 'assets/style.css'), 'utf8'));

for (const seite of seiten) {
  const tiefe = seite.split('/').length - 1;
  const praefix = '../'.repeat(tiefe) + 'assets/';
  const block = MARKE_A + '<style>' + adressenUmschreiben(stilRoh, praefix) + '</style>' + MARKE_E;

  const pfad = path.join(WURZEL, seite);
  const roh = fs.readFileSync(pfad, 'utf8');
  const a = roh.indexOf(MARKE_A);
  const e = roh.indexOf(MARKE_E);
  if (a === -1 || e === -1 || e < a) {
    console.log(`FEHLER  ${seite} hat keinen Stil-Bereich (${MARKE_A} ... ${MARKE_E})`);
    abweichung++;
    continue;
  }

  const neu = roh.slice(0, a) + block + roh.slice(e + MARKE_E.length);
  if (NUR_PRUEFEN) {
    if (neu !== roh) {
      console.log(`FEHLER  ${seite} trägt nicht den Stand von assets/style.css`);
      abweichung++;
    } else {
      console.log(`ok      ${seite}`);
    }
  } else if (neu !== roh) {
    fs.writeFileSync(pfad, neu);
    console.log(`${seite.padEnd(30)} Stil eingesetzt (${(stilRoh.length / 1024).toFixed(1)} KB)`);
  } else {
    console.log(`${seite.padEnd(30)} unverändert`);
  }
}

const AUFTRAEGE = [
  { quelle: 'assets/script.js', ziel: 'assets/script.schlank.js', wandeln: jsSchlank },
];

for (const auftrag of AUFTRAEGE) {
  const qPfad = path.join(WURZEL, auftrag.quelle);
  if (!fs.existsSync(qPfad)) continue;
  const zPfad = path.join(WURZEL, auftrag.ziel);
  const roh = fs.readFileSync(qPfad, 'utf8');
  const schlank = auftrag.wandeln(roh);
  const vorhanden = fs.existsSync(zPfad) ? fs.readFileSync(zPfad, 'utf8') : null;

  if (NUR_PRUEFEN) {
    if (vorhanden !== schlank) {
      console.log(`FEHLER  ${auftrag.ziel} passt nicht zu ${auftrag.quelle}`);
      abweichung++;
    } else {
      console.log(`ok      ${auftrag.ziel}`);
    }
    continue;
  }

  fs.writeFileSync(zPfad, schlank);
  const kb = (n) => (n / 1024).toFixed(1) + ' KB';
  console.log(`${auftrag.ziel.padEnd(30)} ${kb(roh.length)} -> ${kb(schlank.length)} ` +
    `(${Math.round((1 - schlank.length / roh.length) * 100)} % weniger)`);
}

console.log(`\n${seiten.length} Seite(n) gefunden: ${seiten.join(', ')}`);
if (NUR_PRUEFEN) process.exit(abweichung ? 1 : 0);
