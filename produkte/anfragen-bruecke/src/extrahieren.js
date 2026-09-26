/**
 * Aus einer E-Mail die vier Angaben ziehen, die ein Wirt in drei Sekunden
 * braucht: Wann, wie viele, wer, wie erreichbar.
 *
 * Der schwierige Teil ist nicht das Erkennen, sondern das Scheitern. Die
 * Quellen sind unbekannt und werden sich aendern: ein altes Kontaktformular
 * mit unbekanntem Aufbau, ein Portal mit eigener Tabelle, ein Gast der frei
 * schreibt. **Deshalb faellt jede Erkennung auf den Rohtext zurueck statt
 * auf eine leere Meldung.** Lieber vier Zeilen Fliesstext aufs Handy als
 * ein Feld, das "unbekannt" sagt und den Gast verliert.
 */

const MONATE = {
  januar: 1, februar: 2, maerz: 3, märz: 3, april: 4, mai: 5, juni: 6,
  juli: 7, august: 8, september: 9, oktober: 10, november: 11, dezember: 12,
  jan: 1, feb: 2, mrz: 3, apr: 4, jun: 6, jul: 7, aug: 8, sep: 9, okt: 10,
  nov: 11, dez: 12,
}

/**
 * Hoefliche Praefixe, die deutsche Formulare vor die Beschriftung setzen.
 * "Ihr Name:" ist dasselbe Feld wie "Name:".
 */
const PRAEFIXE = 'ihr|ihre|dein|deine|mein|meine'

/**
 * Erlaubte Komposita-Endungen, mit optionalem Fugen-s.
 *
 * **Eine geschlossene Liste und ausdruecklich kein `\w*`.** Die freie Endung
 * waere die naheliegende Loesung und sie ist gefaehrlich: In der
 * Uhrzeitliste steht die Beschriftung "um", die damit auf "Umsatz:" und
 * "Umgebung:" treffen wuerde, und in der Personenliste steht "anzahl", das
 * auf "Anzahlung:" treffen wuerde. Eine Feier mit "Anzahlung: 100 Euro"
 * haette dann hundert Gaeste.
 *
 * Die Liste deckt, was ein Formular wirklich schreibt, und nichts darueber
 * hinaus. Wer eine Endung ergaenzt, prueft sie gegen die kurzen
 * Beschriftungen der anderen Felder.
 */
const ENDUNGEN = 'nummer|nr|zahl|anzahl|wunsch|angabe|datum|zeit'

/**
 * Die Beschriftungen, je Feld, an genau einer Stelle.
 *
 * Sie standen bis zum 20. September 2026 zweimal im Code: einmal verteilt in
 * den Finder-Funktionen und einmal als eigene Liste in auszugBauen. Beide
 * mussten uebereinstimmen, und sie taten es nicht mehr, sobald die eine
 * Praefixe und Endungen lernte und die andere nicht. Sichtbar wurde das
 * daran, dass "Telefonnummer:" als Feld erkannt wurde und trotzdem im Auszug
 * stehenblieb -- die Nummer stand zweimal in derselben Nachricht.
 *
 * **Zwei Listen, die uebereinstimmen muessen, sind eine Liste, die noch nicht
 * zusammengefuehrt wurde.**
 *
 * Innerhalb eines Feldes gilt: die laengste Beschriftung zuerst.
 * beschriftet() steigt beim ersten Treffer aus, und "anzahl" wuerde sonst
 * "Anzahl Personen" vorwegnehmen und "Personen - 6" als Wert liefern.
 */
export const FELDNAMEN = {
  datum: ['wunschtermin', 'datum', 'termin', 'tag', 'date'],
  uhrzeit: ['uhrzeit', 'zeit', 'ankunft', 'um', 'time'],
  personen: [
    'anzahl der personen', 'anzahl der g(?:ä|ae)ste',
    'anzahl personen', 'anzahl g(?:ä|ae)ste',
    'personenzahl', 'personen', 'anzahl', 'g(?:ä|ae)ste', 'guests', 'pax',
  ],
  // "phone number" steht hier als ganze Beschriftung und nicht als Endung.
  //
  // Das Formular dieses Hauses schreibt sie mit Leerzeichen, und ENDUNGEN
  // kennt nur angewachsene Endungen wie "telefonnummer". Gemessen an der
  // Anfrage vom 23. September kam die Nummer deshalb allein ueber den
  // Freitext-Rueckfall herein -- als Feld richtig, im Auszug ein zweites
  // Mal, in einer Nachricht mit vier Zeilen Platz.
  //
  // **Ein Wert, der ueber den Rueckfall hereinkommt, sieht aus wie ein
  // erkanntes Feld und ist keines.** Sichtbar wird der Unterschied erst an
  // der Wiederholung, und die faellt in der Eile niemandem auf.
  telefon: ['rufnummer', 'phone number', 'telefon', 'handy', 'mobil', 'phone', 'tel'],
  name: ['nachname', 'vorname', 'name', 'customer', 'gast', 'von'],
  // Kein eigener Finder, aber im Auszug ebenso ueberfluessig wie der Rest.
  sonstige: ['e-?mail', 'mail', 'adresse', 'anlass', 'betreff', 'website'],
}

/**
 * Das Muster einer Beschriftung, mit Praefix, Endung und weichem Leerraum.
 *
 * Der weiche Leerraum -- ein Leerzeichen in der Beschriftung wird zu `\\s+` --
 * hat eine Geschichte, die hier stehenbleibt, weil sie die Doktrin des
 * Projekts an einem echten Fall zeigt.
 *
 * Seine Gegenprobe blieb gruen: Das Skript mit ausgebauter Regel meldete
 * keinen einzigen Befund. Das haette drei Bedeutungen haben koennen -- die
 * Regel ist tot, das Gate ist blind, oder die Gegenprobe taugt nichts -- und
 * welche davon zutrifft, entscheidet keine Vermutung, sondern eine zweite
 * Messung. Die ergab: "Anzahl Personen: 6" trifft auch ohne die Regel,
 * "Anzahl  Personen: 6" mit doppeltem Leerzeichen trifft nur mit ihr.
 *
 * **Die Regel war also nicht tot, der Pruefstand war blind.** Repariert wird
 * deshalb der Pruefstand und nicht der Code: Die Probe "formular_weicher_raum"
 * traegt seitdem genau diesen doppelten Leerraum.
 *
 * Warum der Fall echt ist: Diese Bruecke liest Mail aus unbekannten und sich
 * aendernden Quellen. Wer eine HTML-Tabelle in Text wandelt, bekommt
 * Leerraum, den niemand getippt hat.
 */
function musterFuer(name) {
  const kern = name.replace(/ +/g, '\\s+')
  return `(?:(?:${PRAEFIXE})\\s+)?${kern}(?:s?(?:${ENDUNGEN}))?`
}

/**
 * Wert hinter einer beschrifteten Zeile: "Datum: 04.10.2026"
 *
 * Gemessen am Kontaktformular des Gasthauses wurde "Telefonnummer:" nicht
 * erkannt, weil die erste Fassung den Doppelpunkt unmittelbar hinter der
 * Beschriftung verlangte. Die Nummer kam nur ueber den Freitext-Rueckfall
 * herein und stand dadurch doppelt in der Nachricht: einmal als Feld und
 * einmal im Auszug.
 */
function beschriftet(text, namen) {
  for (const name of namen) {
    const re = new RegExp(`^[\\s>*-]*${musterFuer(name)}\\s*[:\\-]\\s*(.+)$`, 'im')
    const m = text.match(re)
    if (m && m[1].trim()) return m[1].trim().replace(/\s{2,}/g, ' ')
  }
  return null
}

function datumFinden(text) {
  const b = beschriftet(text, FELDNAMEN.datum)
  if (b) return b

  // 04.10.2026 | 4.10.26 | 4.10.
  const punkt = text.match(/\b(\d{1,2})\.\s?(\d{1,2})\.(\s?\d{2,4})?/)
  if (punkt) {
    const tag = punkt[1].padStart(2, '0')
    const monat = punkt[2].padStart(2, '0')
    const jahr = (punkt[3] || '').trim()
    return jahr ? `${tag}.${monat}.${jahr}` : `${tag}.${monat}.`
  }

  // "4. Oktober" | "am 12. Dez"
  const wort = text.match(/\b(\d{1,2})\.?\s+([A-Za-zÄÖÜäöü]{3,9})\b/)
  if (wort) {
    const monat = MONATE[wort[2].toLowerCase()]
    if (monat) return `${wort[1]}. ${wort[2]}`
  }

  // "am Samstag", "uebermorgen" -- woertlich uebernommen und ausdruecklich
  // nicht in ein Datum gerechnet.
  //
  // **Rechnen hiesse raten.** Wer "Samstag" in ein Datum wandelt, braucht
  // das Absendedatum, die Zeitzone und die Entscheidung, ob dieser oder der
  // naechste Samstag gemeint ist. Die letzte kann niemand treffen ausser dem
  // Gast. Das Wort stehenzulassen kostet nichts und behauptet nichts: Der
  // Wirt liest "Samstag" und weiss so viel wie der Gast geschrieben hat.
  const tag = text.match(WOCHENTAG)
  if (tag) return gross(tag[1])
  const zeitwort = text.match(ZEITWORT)
  if (zeitwort) return gross(zeitwort[1])
  return null
}

const WOCHENTAG =
  /\b(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonnabend|sonntag)\b/i

/**
 * "morgen" ist zwei Woerter, und nur eines davon ist ein Tag.
 *
 * "Guten Morgen" ist eine Begruessung und "am Morgen" eine Tageszeit; beide
 * stehen in Anfragen, und beide wuerden sonst als Wunschtermin auf dem Handy
 * landen. Ausgeschlossen wird deshalb das, was davorsteht, und nicht das
 * Wort selbst. "Morgens" faengt die Wortgrenze.
 */
const ZEITWORT = /(?<!\b(?:guten|am)\s{1,3})\b(heute|(?:ü|ue)bermorgen|morgen)\b/i

const gross = (w) => w.charAt(0).toUpperCase() + w.slice(1)

function uhrzeitFinden(text, datumTreffer) {
  const b = beschriftet(text, FELDNAMEN.uhrzeit)
  if (b) return normalisiereZeit(b) || b

  // Das gefundene Datum wird ausgeblendet, bevor nach der Uhrzeit gesucht
  // wird. Ohne das liest "04.10.2026" als "04:10 Uhr" -- gemessen beim
  // ersten Testlauf, und es waere niemandem aufgefallen, weil 04:10 eine
  // gueltige Uhrzeit ist.
  let rest = text
  if (datumTreffer) rest = rest.split(datumTreffer).join(' ')
  rest = rest.replace(/\b\d{1,2}\.\s?\d{1,2}\.(\s?\d{2,4})?/g, ' ')

  return normalisiereZeit(rest)
}

/** Nur der Doppelpunkt gilt als Trenner. Der Punkt nur, wenn "Uhr" folgt. */
function normalisiereZeit(text) {
  const doppel = text.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/)
  if (doppel) return `${doppel[1].padStart(2, '0')}:${doppel[2]} Uhr`

  const punktMitUhr = text.match(/\b([01]?\d|2[0-3])\.([0-5]\d)\s*uhr\b/i)
  if (punktMitUhr) return `${punktMitUhr[1].padStart(2, '0')}:${punktMitUhr[2]} Uhr`

  const nurStunde = text.match(/\b([01]?\d|2[0-3])\s*uhr\b/i)
  if (nurStunde) return `${nurStunde[1].padStart(2, '0')}:00 Uhr`
  return null
}

function personenFinden(text) {
  const b = beschriftet(text, FELDNAMEN.personen)
  if (b) {
    const nur = b.match(/\d{1,3}/)
    if (nur) return nur[0]
    return b
  }
  const m = text.match(/\b(\d{1,3})\s*(personen|pers\.?|gäste|gaeste|leute|erwachsene)\b/i)
  if (m) return m[1]

  const fuer = text.match(/\bf(?:ü|ue)r\s+(\d{1,3})\b/i)
  if (fuer) return fuer[1]
  return null
}

function telefonFinden(text) {
  const b = beschriftet(text, FELDNAMEN.telefon)
  if (b) return b

  // Deutsche Schreibweisen, mindestens sieben Ziffern insgesamt.
  const m = text.match(/(\+49[\s\/-]?|0)\d{2,5}[\s\/-]?\d{3,}[\s\/-]?\d{0,}/)
  if (m) {
    const ziffern = m[0].replace(/\D/g, '')
    if (ziffern.length >= 8) return m[0].trim()
  }
  return null
}

/**
 * Die Rufnummer in internationaler Form, nur Ziffern: 491608896350.
 *
 * **Der Grund ist kein Schoenheitsgrund.** WhatsApp macht eine Nummer im
 * Nachrichtentext nur dann antippbar, wenn es sie einem Konto zuordnen kann,
 * und das gelingt zuverlaessig erst international. "01608896350" bleibt bei
 * einem Teil der Geraete toter Text; "+491608896350" oeffnet das Menue mit
 * Anrufen und Nachricht schreiben. Genau das ist die Funktion, nach der der
 * Betrieb gefragt hat.
 *
 * Dieselbe Zeichenkette traegt spaeter den Knopf der Vorlage
 * (https://wa.me/<ziffern>), deshalb steht sie hier ohne Plus und ohne
 * Leerzeichen: wa.me nimmt nur Ziffern.
 *
 * Eine auslaendische Nummer wird nicht umgeschrieben. Wer eine Vorwahl
 * errraet, die er nicht kennt, schickt den Wirt zu einem fremden Anschluss.
 */
export function telefonInternational(roh) {
  const t = String(roh || '').trim()
  if (!t) return null
  const hatPlus = t.startsWith('+')
  const z = t.replace(/\D/g, '')
  if (z.length < 8) return null

  if (t.startsWith('00')) return z.slice(2)          // 0049… -> 49…
  if (hatPlus) return z                               // +49…  -> 49…
  if (t.startsWith('0')) return '49' + z.slice(1)     // 0160… -> 49160…
  if (z.startsWith('49')) return z                    // schon international
  return null                                         // unbekannte Form: nicht raten
}

/**
 * Die E-Mail des Gastes.
 *
 * Sie steht beim Formular dieses Hauses nicht in einem eigenen Feld, sondern
 * im Rumpf: "From: [your-name] <manfred.neskudla@sap.com>". Gesucht wird
 * deshalb im Text und nicht ueber eine Beschriftung.
 *
 * **Ausgeschlossen wird die eigene Technik.** Die Adresse des Formulars
 * (no-reply@…) und die des Betriebs stehen in derselben Mail; wer sie als
 * Gastadresse nimmt, laesst den Wirt sich selbst antworten.
 */
export function gastMailFinden(text, eigeneDomains) {
  const alle = String(text || '').match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g) || []
  const eigen = (eigeneDomains || []).map((d) => String(d).toLowerCase())
  for (const a of alle) {
    const k = a.toLowerCase()
    if (k.startsWith('no-reply') || k.startsWith('noreply')) continue
    if (eigen.some((d) => k.endsWith('@' + d) || k.endsWith('.' + d))) continue
    return a
  }
  return null
}

function nameFinden(text, absenderName, absenderAdresse) {
  const b = beschriftet(text, FELDNAMEN.name)
  if (b && b.length <= 60 && !b.includes('@')) return b
  if (absenderName && absenderName.trim() && !absenderName.includes('@')) return absenderName.trim()
  if (absenderAdresse) return absenderAdresse.split('@')[0]
  return null
}

/**
 * Der Kopf einer Weiterleitung.
 *
 * Gmail setzt vor die weitergeleitete Mail einen Block aus Markerzeile und
 * Kopfzeilen: "Von:", "Date:", "Subject:", "To:". **Diese Zeilen sind
 * Angaben ueber die Weiterleitung und nicht ueber die Anfrage**, und genau
 * eine davon ist gefaehrlich: `Date:` traegt eine Beschriftung aus
 * FELDNAMEN.datum und gewinnt damit gegen den Wunschtermin im Freitext.
 *
 * Gemessen am echten Postfach des Betriebs, Anfrage vom 23. September: Der
 * Gast schrieb "fuer Morgen 24.09.2026 um 19:00", auf dem Handy stand
 * "Wann: Mi., 23. Sept. 2026 um 16:02 Uhr · 19:00 Uhr". Das ist der
 * Zeitpunkt der Weiterleitung, gesetzt an die Stelle des Wunschtermins,
 * und es sieht aus wie eine gute Angabe. **Ein Wirt traegt den Tisch damit
 * auf den falschen Tag ein.**
 *
 * Geschnitten werden nur Zeilen, die wirklich wie Kopfzeilen aussehen, und
 * nur unmittelbar hinter der Markerzeile. Der Schnitt bis zur naechsten
 * Leerzeile waere die kuerzere Fassung und die riskantere: Ein Absender
 * ohne Leerzeile hinter dem Kopf verloere seine ganze Anfrage.
 */
const WEITERLEITUNGSKOPF =
  /^[-\s]*(?:Forwarded message|Weitergeleitete Nachricht)[-\s]*$\n(?:^[A-Za-z-]{2,12}:[^\n]*$\n)*/gim

/** Signaturen, Zitate und Fusszeilen abschneiden, damit der Auszug traegt. */
export function textAufraeumen(roh) {
  let t = String(roh || '').replace(/\r\n/g, '\n')
  t = t.replace(WEITERLEITUNGSKOPF, '')
  t = t.split(/^--\s*$/m)[0]
  t = t.split(/^-{5,}\s*Urspr(ü|ue)ngliche Nachricht/im)[0]
  t = t.replace(/^>.*$/gm, '')
  t = t.replace(/\n{3,}/g, '\n\n')
  return t.trim()
}

export function extrahieren({ betreff, text, absenderName, absenderAdresse, eigeneDomains }) {
  const sauber = textAufraeumen(text)
  const alles = `${betreff || ''}\n${sauber}`

  const datum = datumFinden(alles)
  const telefon = telefonFinden(alles)
  const felder = {
    datum,
    uhrzeit: uhrzeitFinden(alles, datum),
    personen: personenFinden(alles),
    name: nameFinden(sauber, absenderName, absenderAdresse),
    telefon,
    telefonWa: telefonInternational(telefon),
    gastMail: gastMailFinden(sauber, eigeneDomains),
  }

  const getroffen = ['datum', 'uhrzeit', 'personen'].filter((k) => felder[k]).length

  // Auszug als Rueckfallweg -- aber ohne das, was oben schon steht.
  //
  // Der erste Entwurf hat den ganzen Text angehaengt, und bei einem sauberen
  // Formular stand dann jede Angabe zweimal in derselben Nachricht: einmal
  // als Feld, einmal im Auszug. Was an einer Stelle steht, wird nicht an
  // einer zweiten wiederholt; die Nachricht hat vier Zeilen Platz, und die
  // gehoeren dem, was noch nicht dasteht -- dem Sonderwunsch, der oft ueber
  // den Tisch entscheidet.
  const auszug = auszugBauen(sauber, getroffen > 0, felder.gastMail)

  return { ...felder, getroffen, auszug, betreff: (betreff || '').trim() }
}


/** Beschriftete Zeilen entfernen, wenn ihre Werte bereits als Feld stehen. */
function auszugBauen(text, felderStehenSchon, gastMail) {
  let t = text

  // Die Adresse des Gastes steht seit dem 26. September als eigene Zeile in
  // der Nachricht. Die Zeile, aus der sie stammt -- beim Formular dieses
  // Hauses "From: [your-name] <gast@…>" --, faellt deshalb aus dem Auszug.
  // Sonst stuende dieselbe Adresse zweimal in einer Nachricht, die vier
  // Zeilen Platz hat.
  if (gastMail) {
    const sicher = gastMail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    t = t.replace(new RegExp(`^.*${sicher}.*$`, 'gim'), '')
  }
  if (felderStehenSchon) {
    // Dieselbe Quelle wie die Finder, und dieselben Regeln fuer Praefix und
    // Endung. Eine eigene Liste hier hat genau einmal gereicht, um "Telefon-
    // nummer:" als Feld zu ziehen und trotzdem im Auszug stehenzulassen.
    const beschriftungen = Object.values(FELDNAMEN).flat().map(musterFuer)
    const re = new RegExp(`^[\\s>*-]*(?:${beschriftungen.join('|')})\\s*[:\\-].*$`, 'gim')
    t = t.replace(re, '')
    // "Nachricht:" ist die Ausnahme -- das ist genau der Teil, den wir wollen.
    t = t.replace(/^[\s>*-]*(?:nachricht|anmerkung|bemerkung|wunsch|kommentar|message body|message)\s*[:\-]\s*/gim, '')
  }
  return t.replace(/\s+/g, ' ').slice(0, 220).trim()
}
