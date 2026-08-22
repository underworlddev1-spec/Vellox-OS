// Gegenprobe: baut einen Fehler ein und weist nach, dass eine Prüfung rot wird.
//
// Eine Prüfung, die nie rot war, ist keine Prüfung, sondern eine Behauptung
// über sich selbst. Dieses Werkzeug macht den Nachweis billig genug, dass ihn
// niemand auslässt.
//
//   node gegenprobe.mjs kontrast.mjs --css "p { color: #eee }"
//   node gegenprobe.mjs a11y.mjs --js  "document.querySelector('h1').remove()"
//   node gegenprobe.mjs farben.mjs --quelle ".x { color: #f00; }"
//
// `--css` und `--js` bauen den Fehler in die ausgelieferte Antwort ein, ohne
// das Projekt anzufassen. `--quelle` hängt eine Zeile an das Stylesheet des
// Projekts und nimmt sie danach wieder heraus; das brauchen nur die Prüfungen,
// die den Quelltext lesen.
//
// Aufgeräumt wird in `finally` und zusätzlich bei jedem Beendigungssignal. Der
// Grund steht in der Prüfdoktrin: Ein Werkzeug, das aufräumt, darf sein
// Ergebnis nicht durch eine Pipe schicken, die es töten kann.
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { konfig, projektpfad } from './lib/pruefstand.mjs';

const [pruefung, ...rest] = process.argv.slice(2);
if (!pruefung) {
  console.log('Aufruf: node gegenprobe.mjs <pruefung.mjs> [--css "..."] [--js "..."] [--quelle "..."]');
  process.exit(2);
}
const hole = (schalter) => {
  const i = rest.indexOf(schalter);
  return i >= 0 ? rest[i + 1] : null;
};
const css = hole('--css');
const js = hole('--js');
const quelle = hole('--quelle');

let stylesheet = null;
let sicherung = null;
const aufraeumen = () => {
  if (stylesheet && sicherung !== null) {
    writeFileSync(stylesheet, sicherung, 'utf8');
    sicherung = null;
  }
};
process.on('exit', aufraeumen);
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => { aufraeumen(); process.exit(130); });

try {
  if (quelle) {
    if (!konfig.stylesheet) throw new Error('Das Projekt führt kein Stylesheet als Datei; --quelle ist hier nicht anwendbar.');
    stylesheet = projektpfad(konfig.stylesheet);
    sicherung = readFileSync(stylesheet, 'utf8');
    writeFileSync(stylesheet, sicherung + '\n' + quelle + '\n', 'utf8');
  }

  const umgebung = { ...process.env };
  if (css) umgebung.PRUEFSTAND_EINSPRITZUNG = css;
  if (js) umgebung.PRUEFSTAND_EINSPRITZUNG_JS = js;

  const pfad = fileURLToPath(new URL('./pruefungen/' + pruefung, import.meta.url));
  const lauf = spawnSync(process.execPath, [pfad], { env: umgebung, encoding: 'utf8' });
  const aus = (lauf.stdout || '') + (lauf.stderr || '');

  console.log(`Gegenprobe: ${pruefung}`);
  console.log(`  Fehler:        ${css || js || quelle}`);
  console.log(`  Rückgabewert:  ${lauf.status}`);
  console.log(`  Ergebnis:      ${lauf.status === 0 ? 'GRÜN, die Prüfung hat den Fehler nicht gefunden' : 'ROT, wie erwartet'}`);
  const zeilen = aus.trim().split('\n');
  console.log(zeilen.slice(0, 6).map((z) => '    ' + z).join('\n'));
  if (zeilen.length > 6) console.log(`    ... und ${zeilen.length - 6} weitere Zeilen`);
  process.exitCode = lauf.status === 0 ? 1 : 0;
} finally {
  aufraeumen();
}
