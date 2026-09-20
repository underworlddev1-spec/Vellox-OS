import { PROBEN } from './proben.js'
import { extrahieren } from '../src/extrahieren.js'
import { pruefen } from '../src/filter.js'
import { bauen } from '../src/nachricht.js'
import { KUNDEN } from '../src/konfiguration.js'

const kunde = Object.values(KUNDEN)[0]
let fehler = 0

console.log('Proben:', PROBEN.length, '\n')

for (const p of PROBEN) {
  const f = extrahieren(p.mail)
  const entscheidung = pruefen(
    { absender: p.mail.absenderAdresse, betreff: p.mail.betreff, text: p.mail.text },
    kunde.filter,
  )
  const probleme = []

  if (p.erwartet.durch !== undefined && entscheidung.durch !== p.erwartet.durch) {
    probleme.push(`Filter: erwartet durch=${p.erwartet.durch}, bekam ${entscheidung.durch} (${entscheidung.grund})`)
  }
  for (const feld of ['datum', 'uhrzeit', 'personen', 'name', 'telefon']) {
    if (p.erwartet[feld] !== undefined && f[feld] !== p.erwartet[feld]) {
      probleme.push(`${feld}: erwartet "${p.erwartet[feld]}", bekam "${f[feld]}"`)
    }
  }
  if (p.erwartet.auszugNichtLeer && !f.auszug) probleme.push('Auszug ist leer')

  // Was schon als Feld dasteht, gehoert nicht nochmal in den Auszug. Steht es
  // doch drin, wurde die Beschriftung nicht erkannt und der Wert kam nur ueber
  // einen Freitext-Rueckfall herein -- das funktioniert heute und faellt beim
  // naechsten Formular um.
  for (const nadel of p.erwartet.auszugOhne || []) {
    if ((f.auszug || '').includes(nadel)) {
      probleme.push(`Auszug wiederholt ein bereits gezogenes Feld: "${nadel}"`)
    }
  }

  const zeichen = probleme.length ? 'ROT ' : 'gruen'
  console.log(`${zeichen}  ${p.name.padEnd(22)} ${entscheidung.durch ? 'durch' : 'blockt'}  ${entscheidung.grund}`)
  if (entscheidung.durch) {
    console.log('       ' + bauen(f, kunde).split('\n').join('\n       '))
  }
  probleme.forEach((x) => console.log('       ! ' + x))
  console.log()
  fehler += probleme.length ? 1 : 0
}

console.log(fehler ? `${fehler} Probe(n) rot` : 'alle Proben gruen')
process.exit(fehler ? 1 : 0)
