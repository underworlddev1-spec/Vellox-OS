/**
 * Mehrere Empfaenger je Betrieb.
 *
 * Der Betrieb hat gefragt, ob seine Mitarbeiter die Anfragen auch bekommen
 * koennen. Bis dahin ging jede Nachricht an genau eine Nummer, und das war
 * keine Einstellung, sondern eine Zeile Code.
 *
 * Geprueft wird deshalb nicht "es kommt an", sondern drei Aussagen, die der
 * Betrieb im Alltag nicht selbst pruefen kann:
 *   1. Aus einem Feld werden mehrere Nummern, und zwar genau die richtigen.
 *   2. Ein totes Geraet nimmt die anderen nicht mit.
 *   3. Ein Teilausfall ist sichtbar und keine stille Luecke.
 */
import { nummernLesen, whatsappVerteilen } from '../src/kanaele.js'

let fehler = 0
function pruefe(name, ist, soll) {
  const ok = JSON.stringify(ist) === JSON.stringify(soll)
  console.log(`${ok ? 'gruen' : 'ROT  '}  ${name.padEnd(48)} ${JSON.stringify(ist)}`)
  if (!ok) { console.log(`       ! erwartet ${JSON.stringify(soll)}`); fehler++ }
}

console.log('\n--- Aus einem Feld werden mehrere Nummern ---\n')
pruefe('eine Nummer bleibt eine',      nummernLesen('491608896350'), ['491608896350'])
pruefe('Komma trennt',                 nummernLesen('491608896350,4915112345678'), ['491608896350', '4915112345678'])
pruefe('Komma mit Leerzeichen',        nummernLesen('491608896350, 4915112345678'), ['491608896350', '4915112345678'])
pruefe('Semikolon und Zeilenumbruch',  nummernLesen('491608896350;\n4915112345678'), ['491608896350', '4915112345678'])
pruefe('Plus und Leerzeichen fallen weg', nummernLesen('+49 160 8896350'), ['491608896350'])
pruefe('doppelte Nummer nur einmal',   nummernLesen('491608896350, 491608896350'), ['491608896350'])
pruefe('Bruchstueck faellt weg',       nummernLesen('491608896350, 1234'), ['491608896350'])
pruefe('zwei Nummern je Zeile',        nummernLesen('491608896350\n+49 151 1234567'), ['491608896350', '491511234567'])
pruefe('zusammengelaufenes faellt weg', nummernLesen('491608896350 4915112345678'), [])
pruefe('leeres Feld ergibt nichts',    nummernLesen(''), [])
pruefe('undefiniert ergibt nichts',    nummernLesen(undefined), [])

// --- Zustellung mit gestelltem fetch -------------------------------------
const env = { WHATSAPP_TOKEN: 'x', WHATSAPP_TELEFON_ID: '1' }
const param = ['a', 'b', 'c']
const echtesFetch = globalThis.fetch

function fetchStellen(scheitern = []) {
  globalThis.fetch = async (_url, init) => {
    const an = JSON.parse(init.body).to
    if (scheitern.includes(an)) {
      return { ok: false, status: 400, text: async () => JSON.stringify({ error: { message: 'Recipient not in allowed list' } }) }
    }
    return { ok: true, status: 200, text: async () => '{}' }
  }
}

const A = '491608896350', B = '4915112345678', C = '4917099998888'

console.log('\n--- Ein totes Geraet nimmt die anderen nicht mit ---\n')

fetchStellen([])
let r = await whatsappVerteilen({ nummern: [A, B, C], parameter: param, env })
pruefe('alle drei erreicht', [r.zugestellt, r.gescheitert.length], [3, 0])

fetchStellen([B])
r = await whatsappVerteilen({ nummern: [A, B, C], parameter: param, env })
pruefe('einer tot: die anderen kommen an', r.zugestellt, 2)
pruefe('einer tot: der Ausfall steht drin', r.gescheitert.length, 1)

console.log('\n--- Ein Teilausfall ist sichtbar, und zwar ohne volle Nummer ---\n')
pruefe('Ausfall nennt die letzten vier Ziffern', r.gescheitert[0].startsWith('…5678'), true)
pruefe('Ausfall nennt NICHT die ganze Nummer',   r.gescheitert[0].includes(B), false)

console.log('\n--- Kein Empfaenger erreicht ist ein Fehler, kein Erfolg ---\n')
fetchStellen([A, B, C])
let geworfen = null
try { await whatsappVerteilen({ nummern: [A, B, C], parameter: param, env }) }
catch (e) { geworfen = e.message }
pruefe('alle tot: wirft', geworfen !== null, true)
pruefe('alle tot: Meldung sagt es', (geworfen || '').includes('kein Empfaenger erreicht'), true)

geworfen = null
try { await whatsappVerteilen({ nummern: [], parameter: param, env }) }
catch (e) { geworfen = e.message }
pruefe('leere Liste: wirft', (geworfen || '').includes('keine Zielnummer'), true)

globalThis.fetch = echtesFetch
console.log('\n' + (fehler ? `${fehler} Behauptung(en) rot` : 'alle Behauptungen gruen') + '\n')
process.exit(fehler ? 1 : 0)
