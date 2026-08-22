// Farbe ausschliesslich über Rollentoken.
//
// Vier Behauptungen:
//
//   1. Ausserhalb einer Tokendefinition nennt keine Deklaration einen Farbwert.
//      Farbtragende Eigenschaften nehmen nur `var(...)` entgegen.
//   2. Kein Token heisst nach seinem Aussehen statt nach seiner Aufgabe.
//   3. Zwischen einem Komma in Selektorposition und dem nächsten Selektor steht
//      kein Kommentar.
//   4. Jede definierte Farbrolle hat mindestens einen Verbraucher.
//
// Diese Prüfung liest den Quelltext und nicht den Browser, und das ist hier
// richtig: Ein Literal, das zufällig dieselbe Farbe ergibt wie das Token, ist
// trotzdem ein Bruch der Regel, weil es beim nächsten Kontextwechsel nicht
// mitgeht. Genau daran scheitern Abschnitte, die später dunkel werden.
//
// Behauptung 3 ist billig und fängt eine ganze Familie. CSS überliest
// Kommentare: Endet ein Selektor mit einem Komma und folgt danach ein
// Kommentarblock, verschmilzt der nächste Selektor mit ihm zu einer Liste, und
// die eigentlich gemeinte Regel bekommt nie einen eigenen Rumpf. Gefunden wurde
// das an zehn Verweisen, die dadurch ein Raster und 64 px Aussenabstand aus
// einer fremden Regel trugen. Farbe und Kontrast stimmten dabei, weshalb kein
// anderes Gate anschlagen konnte.
import { readFileSync } from 'node:fs';
import { konfig, projektpfad, melden } from '../lib/pruefstand.mjs';

if (!konfig.stylesheet) {
  console.log('Farben: übersprungen, das Projekt führt kein Stylesheet als Datei (siehe Konfiguration).');
  process.exit(0);
}

const pfad = projektpfad(konfig.stylesheet);
const css = readFileSync(pfad, 'utf8');
const befunde = [];

// Kommentare durch Leerzeichen ersetzen, Zeilenumbrüche behalten. Damit
// stimmen alle Positionen weiterhin, und ein Beispiel in einem Kommentar wird
// nicht als Verstoss gezählt. In gut kommentierten Stylesheets ist das kein
// Detail: Der Kommentaranteil liegt dort schnell über der Hälfte.
const ohneKommentare = css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
const zeileVon = (pos) => css.slice(0, pos).split('\n').length;

// --- 1. Farbwerte ausserhalb von Tokendefinitionen ------------------------
const FARBEIGENSCHAFTEN =
  'color|background|background-color|background-image|border|border-color|' +
  'border-top|border-bottom|border-left|border-right|' +
  'border-top-color|border-bottom-color|border-left-color|border-right-color|' +
  'outline|outline-color|fill|stroke|box-shadow|text-shadow|' +
  'text-decoration|text-decoration-color|text-emphasis-color|caret-color|' +
  'column-rule|column-rule-color|accent-color|mask-image|filter';
const LITERAL = /#[0-9a-fA-F]{3,8}\b|\brgba?\(\s*\d|\bhsla?\(\s*\d|\b(?:aliceblue|aqua|azure|beige|black|blue|brown|coral|crimson|cyan|fuchsia|gold|gray|green|grey|indigo|ivory|khaki|lime|magenta|maroon|navy|olive|orange|orchid|pink|plum|purple|red|salmon|silver|tan|teal|tomato|violet|wheat|white|yellow)\b/;

const muster = new RegExp(`(?:^|[;{}\\s])(${FARBEIGENSCHAFTEN})\\s*:\\s*([^;{}]+);`, 'g');
let m;
while ((m = muster.exec(ohneKommentare))) {
  if (!LITERAL.test(m[2])) continue;
  befunde.push(`1) Zeile ${zeileVon(m.index)}: ${m[1]}: ${m[2].trim()}`);
}

// --- 2. Namen nach Aussehen ------------------------------------------------
const AUSSEHEN = /(gruen|green|rot|red|blau|blue|gelb|yellow|orange|lila|purple|grau|gray|grey|hell|light|dunkel|dark|weiss|white|schwarz|black)$/i;
const deklarationen = [...ohneKommentare.matchAll(/(?:^|[;{])\s*(--[a-z0-9-]+)\s*:/gim)].map((x) => x[1]);
for (const name of new Set(deklarationen)) {
  if (konfig.farbtoken.grundfarben.test(name)) continue; // Grundfarben duerfen die Farbe nennen
  if (!name.startsWith(konfig.farbtoken.rolle)) continue;
  if (AUSSEHEN.test(name)) befunde.push(`2) Token nach Aussehen benannt: ${name}`);
}

// --- 3. Kommentar zwischen Komma und Selektor ------------------------------
{
  let tiefe = 0;
  for (let i = 0; i < css.length; i++) {
    if (css.startsWith('/*', i)) {
      const e = css.indexOf('*/', i + 2);
      i = e < 0 ? css.length : e + 1;
      continue;
    }
    if (css[i] === '{') { tiefe++; continue; }
    if (css[i] === '}') { tiefe = Math.max(0, tiefe - 1); continue; }
    if (css[i] !== ',' || tiefe > 0) continue;
    let j = i + 1;
    while (j < css.length && /\s/.test(css[j])) j++;
    if (!css.startsWith('/*', j)) continue;
    const davor = css.slice(Math.max(0, i - 120), i).split('\n').pop().trim();
    befunde.push(
      `3) Zeile ${zeileVon(i)}: Kommentar zwischen Komma und Selektor, nach „${davor}“. ` +
        `Der nächste Selektor verschmilzt mit dieser Liste.`
    );
  }
}

// --- 4. Rollen ohne Verbraucher --------------------------------------------
const rolle = new RegExp(`^${konfig.farbtoken.rolle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
const definiert = [...new Set(deklarationen.filter((n) => rolle.test(n)))];
const benutzt = new Set(
  [...ohneKommentare.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((x) => x[1])
);
for (const r of definiert) {
  if (!benutzt.has(r)) {
    befunde.push(
      `4) Farbrolle ohne Verbraucher: ${r}. Definiert, aber nirgends über var() benutzt. ` +
        `Entweder fehlt die Komponente, oder die Rolle ist mit ihr entfallen.`
    );
  }
}

melden(
  befunde,
  `Farben: vier Behauptungen halten. ${definiert.length} Rollen definiert, alle mit Verbraucher.`
);
