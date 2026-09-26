/**
 * Der Antwortweg.
 *
 * Der Betrieb hat gefragt, wie er einem Gast zurueckschreiben kann. Die
 * Antwort steckt in zwei Angaben, die vorher da waren und nicht benutzbar
 * gemacht wurden: die Rufnummer und die Mailadresse des Gastes.
 *
 * Geprueft wird deshalb nicht "steht etwas da", sondern **ist es antippbar**:
 * eine Nummer in internationaler Form, und eine Adresse, die dem Gast gehoert
 * und nicht der eigenen Technik.
 */
import { telefonInternational, gastMailFinden, extrahieren } from '../src/extrahieren.js'
import { vorlagenParameter, bauen } from '../src/nachricht.js'
import { kundeFinden } from '../src/konfiguration.js'

const kunde = kundeFinden('pfaelzerhof@saphirweb.de')
const eigene = kunde.filter.eigeneDomains
let fehler = 0

function pruefe(name, ist, soll) {
  const ok = ist === soll
  console.log(`${ok ? 'gruen' : 'ROT  '}  ${name.padEnd(46)} ${JSON.stringify(ist)}`)
  if (!ok) { console.log(`       ! erwartet ${JSON.stringify(soll)}`); fehler++ }
}

console.log('\n--- Rufnummer wird antippbar ---\n')
pruefe('national mit Null',        telefonInternational('01608896350'),      '491608896350')
pruefe('mit Leerzeichen',          telefonInternational('0160 8896350'),     '491608896350')
pruefe('schon international',      telefonInternational('+49 160 8896350'),  '491608896350')
pruefe('mit doppelter Null',       telefonInternational('0049 160 8896350'), '491608896350')
pruefe('auslaendisch bleibt echt', telefonInternational('+43 660 1234567'),  '436601234567')
pruefe('zu kurz: nicht raten',     telefonInternational('12345'),            null)
pruefe('leer: nicht raten',        telefonInternational(''),                 null)

console.log('\n--- Die Adresse des Gastes, nicht die eigene Technik ---\n')
pruefe('no-reply wird uebergangen',
  gastMailFinden('From: [your-name] <gast@web.de>\nno-reply@pfaelzer-hof-walldorf.de', eigene), 'gast@web.de')
pruefe('eigene Domain wird uebergangen',
  gastMailFinden('post@pfaelzerhofwalldorf.de schrieb an gast@web.de', eigene), 'gast@web.de')
pruefe('nur eigene Adressen: nichts',
  gastMailFinden('no-reply@pfaelzer-hof-walldorf.de an post@pfaelzerhofwalldorf.de', eigene), null)

console.log('\n--- Am echten Formular dieses Hauses ---\n')
const text = `From: [your-name] <manfred.neskudla@sap.com>

Message Body:

Customer : Neskudla

Phone number : 01608896350

Message: Hallo Pfälzer Hof, ich möchte für Morgen 24.09.2026 um 19:00 einen Tisch für 3 Personen reservieren.`

const f = extrahieren({
  betreff: 'Kontaktformular von Neskudla', text,
  absenderName: 'WordPress', absenderAdresse: 'no-reply@pfaelzer-hof-walldorf.de',
  eigeneDomains: eigene,
})
pruefe('Name kommt aus "Customer"', f.name, 'Neskudla')
pruefe('Nummer antippbar',          f.telefonWa, '491608896350')
pruefe('Gastmail erkannt',          f.gastMail, 'manfred.neskudla@sap.com')

const p = vorlagenParameter(f, kunde)
pruefe('Vorlage hat weiter drei Parameter', p.length, 3)
pruefe('Parameter 3 traegt die antippbare Nummer', p[2], 'Neskudla · +491608896350')
pruefe('kein Zeilenumbruch im Parameter', /[\r\n\t]/.test(p.join('')), false)

const text2 = bauen(f, kunde)
pruefe('Mailadresse steht genau einmal',
  (text2.match(/manfred\.neskudla@sap\.com/g) || []).length, 1)


console.log('\n--- Die Zeile "Wann:" behauptet keinen Termin, den es nicht gibt ---\n')
const ohne = extrahieren({
  betreff: 'Kontaktformular von Pierree', text: 'Message Body:\n\nCustomer : Pierree\n\nMessage: Test',
  absenderName: 'WordPress', absenderAdresse: 'no-reply@pfaelzer-hof-walldorf.de',
  eigeneDomains: eigene,
})
const po = vorlagenParameter(ohne, kunde)
pruefe('ohne Termin steht kein Betreff unter "Wann"', po[0].includes('Kontaktformular'), false)
pruefe('ohne Termin sagt die Zeile, dass keiner erkannt wurde', po[0], 'kein Termin erkannt')
pruefe('der Name traegt die Zeile trotzdem', po[2], 'Pierree')

console.log(fehler ? `\n${fehler} Behauptung(en) rot` : '\nalle Behauptungen gruen')
process.exit(fehler ? 1 : 0)
