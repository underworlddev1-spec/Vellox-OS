/**
 * Der Alarmkanal.
 *
 * Er ist die einzige Stelle der Bruecke, die etwas verschickt, und die
 * einzige, deren Ausfall niemand bemerkt: Wenn die WhatsApp-Zustellung
 * kaputtgeht und die Meldung darueber auch, glaubt der Betrieb, es kaemen
 * keine Anfragen, und der Gast glaubt, er habe angefragt. Beide merken es
 * Samstag um neunzehn Uhr.
 *
 * Geprueft wird deshalb ohne Worker-Laufzeit, mit gestelltem `fetch` und
 * gestelltem Binding. **Ein Gate, das eine echte Meldung verschickt, ist
 * kein Gate, sondern ein Absender.**
 *
 * Was hier nicht geprueft werden kann, steht am Ende der Datei.
 */
import { meldungMime, betreiberMelden } from '../src/kanaele.js'

let fehler = 0
const pruefe = (name, bedingung, hinweis = '') => {
  console.log(`${bedingung ? 'gruen' : 'ROT  '}  ${name}${bedingung || !hinweis ? '' : '\n       ! ' + hinweis}`)
  if (!bedingung) fehler += 1
}

/** Laeufe mit gestelltem fetch und mitgeschriebenem Protokoll. */
async function lauf(env, antwort) {
  const rufe = []
  const protokoll = []
  const echtesFetch = globalThis.fetch
  const echtesLog = console.log
  globalThis.fetch = async (url, opt) => {
    rufe.push({ url, opt })
    return antwort || { ok: true, status: 200, text: async () => '{"id":"x"}' }
  }
  console.log = (...a) => protokoll.push(a.join(' '))
  try {
    const ergebnis = await betreiberMelden('WhatsApp antwortete 401 Unauthorized.', env)
    return { ergebnis, rufe, protokoll }
  } finally {
    globalThis.fetch = echtesFetch
    console.log = echtesLog
  }
}

const UMLAUTE = 'Zustellung gescheitert für Gasthaus Pfälzer Hof. Grüße, Brücke.'
const mime = meldungMime({
  von: 'bruecke@saphirweb.de',
  an: 'betreiber@example.com',
  betreff: 'Anfragen-Brücke: Störung',
  text: UMLAUTE,
  kennung: 'abc-123@saphirweb.de',
})
const [kopf, ...rumpf] = mime.split('\r\n\r\n')
const entschluesselt = Buffer.from(rumpf.join('\r\n\r\n').replace(/\r\n/g, ''), 'base64').toString('utf8')

console.log('\n--- Die Nachricht selbst ---\n')

pruefe(
  'Betreff ist nach RFC 2047 kodiert und traegt den Umlaut',
  (() => {
    const treffer = kopf.match(/^Subject: =\?UTF-8\?B\?(.+)\?=$/m)
    return Boolean(treffer) && Buffer.from(treffer[1], 'base64').toString('utf8') === 'Anfragen-Brücke: Störung'
  })(),
  'ohne Kodierung kommt "St?rung" an oder der Empfaenger verwirft die Zeile',
)

pruefe('Rumpf kommt Zeichen fuer Zeichen zurueck', entschluesselt === UMLAUTE,
  `bekam: ${JSON.stringify(entschluesselt.slice(0, 60))}`)

pruefe(
  'keine Rumpfzeile ueber 76 Zeichen (RFC 2045)',
  rumpf.join('').split('\r\n').every((z) => z.length <= 76),
)

pruefe('jedes Zeilenende ist CRLF', !/[^\r]\n/.test(mime))

pruefe(
  'Kopf traegt alle Pflichtzeilen',
  ['From:', 'To:', 'Subject:', 'Message-ID:', 'Date:', 'MIME-Version:'].every((k) => kopf.includes(k)),
)

pruefe(
  'Date ist eine Zonenangabe und kein "GMT"',
  / \+0000$/.test(kopf.match(/^Date: (.+)$/m)[1]),
)

console.log('\n--- Welcher Weg genommen wird ---\n')

{
  const { ergebnis, rufe, protokoll } = await lauf({})
  pruefe('ohne jede Einrichtung: kein Versand, aber im Protokoll',
    ergebnis === false && rufe.length === 0 && protokoll.some((z) => z.startsWith('STOERUNG |')))
}

{
  const env = { BETREIBER_MAIL: 'b@example.com', ABSENDER_MAIL: 'bruecke@saphirweb.de', RESEND_TOKEN: 're_geheim_123' }
  const { ergebnis, rufe } = await lauf(env)
  const leib = rufe[0] && JSON.parse(rufe[0].opt.body)
  pruefe('ohne Binding: Resend, an die richtige Adresse',
    ergebnis === true && rufe.length === 1 && rufe[0].url === 'https://api.resend.com/emails'
      && leib.to[0] === 'b@example.com' && leib.subject === 'Anfragen-Brücke: Störung')
}

{
  // Der Prueffall fuer den zweiten Weg. Das Binding ist da, aber
  // `cloudflare:email` gibt es ausserhalb der Worker-Laufzeit nicht -- der
  // Import scheitert also von selbst, ohne dass der Test ihn stellen muss.
  let binding = 0
  const env = {
    BETREIBER_MAIL: 'b@example.com', ABSENDER_MAIL: 'bruecke@saphirweb.de',
    RESEND_TOKEN: 're_geheim_123', MELDUNG: { send: async () => { binding += 1 } },
  }
  const { ergebnis, rufe, protokoll } = await lauf(env)
  pruefe('Binding scheitert: faellt auf Resend zurueck statt zu schweigen',
    ergebnis === true && binding === 0 && rufe.length === 1
      && protokoll.some((z) => z.includes('send_email gescheitert')))
}

{
  const env = { BETREIBER_MAIL: 'b@example.com', ABSENDER_MAIL: 'bruecke@saphirweb.de', RESEND_TOKEN: 're_geheim_123' }
  const { ergebnis, protokoll } = await lauf(env, {
    ok: false, status: 401, text: async () => '{"message":"API key is invalid"}',
  })
  pruefe('Resend lehnt ab: false statt stillem Erfolg', ergebnis === false)
  pruefe('der Token steht in keiner Protokollzeile',
    !protokoll.some((z) => z.includes('re_geheim_123')))
}

console.log(`
--- Was hier nicht geprueft wird ---

Der Versand ueber das Binding selbst. \`cloudflare:email\` gibt es nur in der
Worker-Laufzeit; in Node scheitert schon der Import, und genau das macht den
Rueckfall oben pruefbar. Die Gegenprobe dafuer ist keine Datei, sondern ein
Lauf: deployen, KANAL auf whatsapp ohne Token stellen, eine Mail schicken --
die Zustellung scheitert, und es muss eine Stoerungsmail ankommen.
`)

console.log(fehler ? `${fehler} Behauptung(en) rot` : 'alle Behauptungen gruen')
process.exit(fehler ? 1 : 0)
