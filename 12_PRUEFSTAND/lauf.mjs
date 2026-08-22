// Der Läufer. Fährt jede Prüfung aus der Konfiguration als eigenen Prozess und
// endet mit einem Rückgabewert ungleich null, sobald eine davon scheitert.
//
// Eigene Prozesse und nicht Importe, aus zwei Gründen. Erstens beendet jede
// Prüfung sich selbst mit einem Rückgabewert; das ist die Eigenschaft, die sie
// zu einem Gate macht, und sie soll nicht durch den Läufer verlorengehen.
// Zweitens kann eine abgestürzte Prüfung den Lauf so nicht mitreißen: Ein
// Absturz ist ein Befund und kein Ergebnis.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { konfig } from './lib/pruefstand.mjs';

const ordner = fileURLToPath(new URL('./pruefungen/', import.meta.url));
const nurDiese = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const liste = nurDiese.length ? nurDiese : konfig.pruefungen;

const fahren = (datei) =>
  new Promise((fertig) => {
    const pfad = ordner + datei;
    if (!existsSync(pfad)) return fertig({ datei, code: 127, aus: 'Die Prüfung steht in der Liste, aber nicht im Ordner.' });
    const kind = spawn(process.execPath, [pfad], { env: process.env });
    let aus = '';
    kind.stdout.on('data', (d) => (aus += d));
    kind.stderr.on('data', (d) => (aus += d));
    kind.on('close', (code) => fertig({ datei, code, aus: aus.trim() }));
  });

console.log(
  `Prüfstand: ${liste.length} Prüfungen, ${konfig.routen.length} Routen, Basis ${konfig.basis}\n`
);

const ergebnisse = [];
for (const datei of liste) {
  const e = await fahren(datei);
  ergebnisse.push(e);
  const kopf = e.code === 0 ? '  OK  ' : ' ROT  ';
  const erste = (e.aus.split('\n')[0] || '').slice(0, 96);
  console.log(`${kopf}${datei.replace(/\.mjs$/, '').padEnd(14)}${erste}`);
  if (e.code !== 0) console.log(e.aus.split('\n').slice(1).map((z) => '        ' + z).join('\n'));
}

const rot = ergebnisse.filter((e) => e.code !== 0);
console.log(
  rot.length
    ? `\n${rot.length} von ${ergebnisse.length} Prüfungen rot: ${rot.map((e) => e.datei.replace(/\.mjs$/, '')).join(', ')}`
    : `\nAlle ${ergebnisse.length} Prüfungen grün.`
);
process.exit(rot.length ? 1 : 0);
