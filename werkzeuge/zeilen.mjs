/**
 * ZEILENLAENGEN MESSEN
 * ====================
 * Findet Absaetze, deren Zeilen zu lang sind — exakt in Zeichen, nicht
 * geschaetzt.
 *
 * Lesbar sind 45 bis 75 Zeichen je Zeile. Darueber verliert das Auge beim
 * Zeilenwechsel den Anschluss und muss den naechsten Zeilenanfang suchen. Bei
 * einer Zielgruppe ab 45 Jahren ist das kein Feinschliff, sondern der
 * Unterschied zwischen gelesen und ueberflogen.
 *
 * WIE GEMESSEN WIRD: Ein Bereich ueber die ersten n Zeichen eines Textknotens
 * liefert so lange genau ein Rechteck, wie diese Zeichen in eine Zeile passen.
 * Das groesste n mit einem Rechteck ist die Zeichenzahl der ersten Zeile. Die
 * naheliegende Schaetzung — Breite geteilt durch halbe Schriftgroesse — waere
 * falsch genug, um Befunde zu erfinden oder zu uebersehen.
 *
 * WOFUER ES DIESES WERKZEUG GIBT: Zeilenlaenge ist unsichtbar, solange man in
 * der Breite arbeitet, in der entworfen wurde. Zwei Faelle machen sie
 * sichtbar, und beide sind in einem Projekt tatsaechlich eingetreten.
 *
 * Erstens: Absaetze ohne eigene Breitenbegrenzung. Sie fallen nicht auf, weil
 * die Huelle sie zufaellig begrenzt — bis jemand die Huelle aendert. Vier
 * solche Absaetze liefen ueber die volle Breite, der laengste mit 150 Zeichen.
 *
 * Zweitens, und schwerer zu finden: Eine neue Regel fuer die Huelle stand in
 * der Datei weiter unten als eine engere Grenze am selben Element. Ab einer
 * Bruchstelle gewann die neue Regel, die engere war ausgehebelt, und ein
 * Vorspann sprang von 768 auf 1408 Pixel. 17 Stellen betroffen, in der
 * Entwurfsbreite nichts davon zu sehen.
 *
 * Deshalb laeuft diese Messung nach jeder Aenderung an Breiten, und zwar bei
 * mehreren Breiten. Erwartet wird ueberall Null.
 *
 * Gehoert zu:
 *   04_UI/08-grosse-bildschirme-und-obergrenzen.md
 *   04_UI/01-layout-grid-und-spacing.md
 *
 * AUFRUF
 *   node werkzeuge/zeilen.mjs --verzeichnis dist --adresse http://localhost:3000
 *   node werkzeuge/zeilen.mjs ... --breiten 390,1280,1920,2560 --grenze 90
 *
 * Das Verzeichnis wird nur nach `index.html` durchsucht, um die Adressliste zu
 * bilden; geladen wird ueber die Adresse, damit CSS und Schriften so wirken
 * wie im Betrieb. Ein Projekt ohne diese Dateistruktur bekommt seine Adressen
 * ueber --seiten als Komma-Liste.
 */
import { readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'

/**
 * Playwright suchen statt voraussetzen — dasselbe Vorgehen wie in
 * markeninventur.mjs, um eine Stelle erweitert.
 *
 * Die Erweiterung ist der haeufigste Fall: Dieses Werkzeug wird im Ordner des
 * gemessenen Projekts aufgerufen, und dort liegt Playwright meist lokal. Ein
 * `import` aus einer Datei in Vellox-OS sucht aber neben DIESER Datei und
 * findet es deshalb nicht. Der Auflöser ueber das Arbeitsverzeichnis schliesst
 * diese Luecke.
 */
async function chromiumFinden() {
  const versuche = []
  const orte = [
    ['Projektordner', createRequire(pathToFileURL(resolve(process.cwd()) + '/'))],
    ['neben diesem Werkzeug', createRequire(import.meta.url)],
  ]
  try {
    const wurzel = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim()
    orte.push(['global', createRequire(pathToFileURL(wurzel + '/'))])
  } catch (e) {
    versuche.push(`npm root -g: ${e.message.split('\n')[0]}`)
  }
  for (const [wo, aufloesen] of orte) {
    for (const name of ['playwright', 'playwright-core']) {
      try {
        const mod = await import(pathToFileURL(aufloesen.resolve(name)).href)
        const chromium = mod.chromium ?? mod.default?.chromium
        if (chromium) return chromium
      } catch (e) {
        versuche.push(`${wo} ${name}: ${e.message.split('\n')[0]}`)
      }
    }
  }
  console.error(
    'Playwright wurde nicht gefunden. Installation:\n' +
      '  npm install -g playwright && npx playwright install chromium\n\n' +
      'Versuche:\n  ' + versuche.join('\n  ')
  )
  process.exit(2)
}
const chromium = await chromiumFinden()
const opt = (name, standard) => {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? standard : process.argv[i + 1]
}
const BASIS = opt('adresse', 'http://localhost:3000').replace(/\/$/, '')
const BREITEN = opt('breiten', '390,1280,1920,2560').split(',').map(Number)
const GRENZE = Number(opt('grenze', 90))

/**
 * Die Adressliste. Entweder aus dem gebauten Verzeichnis, indem jede
 * `index.html` zu einem Pfad wird, oder direkt als Komma-Liste fuer Projekte
 * ohne diese Dateistruktur. Geladen wird in beiden Faellen ueber die Adresse,
 * damit Stilangaben und Schriften so wirken wie im Betrieb.
 */
const seiten = []
const ausOption = opt('seiten', null)
if (ausOption) {
  seiten.push(...ausOption.split(','))
} else {
  const sammle = (verzeichnis, praefix = '') => {
    for (const eintrag of readdirSync(verzeichnis)) {
      const voll = join(verzeichnis, eintrag)
      if (statSync(voll).isDirectory()) sammle(voll, `${praefix}/${eintrag}`)
      else if (eintrag === 'index.html') seiten.push(praefix === '' ? '/' : `${praefix}/`)
    }
  }
  sammle(opt('verzeichnis', 'dist'))
}
if (!seiten.length) {
  console.error('Keine Seiten gefunden. --verzeichnis oder --seiten pruefen.')
  process.exit(2)
}
/**
 * Der Pfad zum Browser kommt aus der Umgebung, wenn eine gesetzt ist, und
 * sonst von Playwright selbst. Ein fest verdrahteter Pfad haette dieses
 * Werkzeug an genau einen Rechner gebunden.
 */
const browser = await chromium.launch(
  process.env.CHROMIUM_PFAD ? { executablePath: process.env.CHROMIUM_PFAD } : {}
)

/** Zeichenzahl der ersten gesetzten Zeile eines Textknotens, exakt. */
const MESSUNG = `(knoten) => {
  const t = knoten.nodeValue
  const r = document.createRange()
  let lo = 1, hi = t.length, best = 0
  while (lo <= hi) {
    const m = (lo + hi) >> 1
    r.setStart(knoten, 0); r.setEnd(knoten, m)
    if (r.getClientRects().length <= 1) { best = m; lo = m + 1 } else hi = m - 1
  }
  return best
}`

let gesamt = 0

for (const breite of BREITEN) {
  const seite = await browser.newPage({ viewport: { width: breite, height: 1000 } })
  const alle = []

  for (const url of seiten.sort()) {
    await seite.goto(BASIS + url, { waitUntil: 'domcontentloaded' })
    const treffer = await seite.evaluate(
      ({ grenze, messungQuelle }) => {
        const zeichenInErsterZeile = eval(`(${messungQuelle})`)
        const raus = []
        // Kopf und Fuss bleiben aussen vor: Dort stehen Navigation und
        // Rechtstext-Verweise, also kurze Zeilen, die nur Fehlalarm erzeugen.
        for (const el of document.querySelectorAll('p, li, dd, blockquote')) {
          if (el.closest('header, footer')) continue
          if (el.getBoundingClientRect().height === 0) continue
          // Nur eigener Text des Elements, und nur ab einer Laenge, ab der
          // die Frage ueberhaupt sinnvoll ist.
          const knoten = [...el.childNodes].find(
            (n) => n.nodeType === 3 && n.nodeValue.trim().length > 60
          )
          if (!knoten) continue
          const n = zeichenInErsterZeile(knoten)
          if (n > grenze) {
            raus.push({
              n,
              text: knoten.nodeValue.trim().slice(0, 44),
              klasse: (el.className || '').toString().slice(0, 40),
            })
          }
        }
        return raus
      },
      { grenze: GRENZE, messungQuelle: MESSUNG }
    )
    for (const t of treffer) alle.push({ url, ...t })
  }

  // Nach Textanfang zusammenfassen: Ein Absatz aus einer gemeinsamen
  // Komponente steht sonst zwanzigmal in der Liste und verdeckt den Rest.
  const einzig = new Map()
  for (const a of alle) {
    if (!einzig.has(a.text) || einzig.get(a.text).n < a.n) einzig.set(a.text, a)
  }
  const liste = [...einzig.values()].sort((a, c) => c.n - a.n)
  gesamt += liste.length

  console.log(`\n${breite} px — Absaetze ueber ${GRENZE} Zeichen in der ersten Zeile`)
  if (!liste.length) {
    console.log('  keine')
  } else {
    for (const a of liste) {
      console.log(
        `  ${String(a.n).padStart(3)}  ${a.url.padEnd(30)} ${a.klasse.padEnd(30)} "${a.text}..."`
      )
    }
    console.log(`  ${liste.length} verschieden, ${alle.length} Vorkommen`)
  }
  await seite.close()
}

await browser.close()
console.log(`\n${seiten.length} Seiten bei ${BREITEN.length} Breiten. ${gesamt} Befunde.`)
process.exit(gesamt === 0 ? 0 : 1)
