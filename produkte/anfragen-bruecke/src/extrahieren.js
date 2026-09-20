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
  telefon: ['rufnummer', 'telefon', 'handy', 'mobil', 'phone', 'tel'],
  name: ['nachname', 'vorname', 'name', 'gast', 'von'],
  // Kein eigener Finder, aber im Auszug ebenso ueberfluessig wie der Rest.
  sonstige: ['e-?mail', 'mail', 'adresse', 'anlass', 'betreff'],
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
  return null
}

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

function nameFinden(text, absenderName, absenderAdresse) {
  const b = beschriftet(text, FELDNAMEN.name)
  if (b && b.length <= 60 && !b.includes('@')) return b
  if (absenderName && absenderName.trim() && !absenderName.includes('@')) return absenderName.trim()
  if (absenderAdresse) return absenderAdresse.split('@')[0]
  return null
}

/** Signaturen, Zitate und Fusszeilen abschneiden, damit der Auszug traegt. */
export function textAufraeumen(roh) {
  let t = String(roh || '').replace(/\r\n/g, '\n')
  t = t.split(/^--\s*$/m)[0]
  t = t.split(/^-{5,}\s*Urspr(ü|ue)ngliche Nachricht/im)[0]
  t = t.replace(/^>.*$/gm, '')
  t = t.replace(/\n{3,}/g, '\n\n')
  return t.trim()
}

export function extrahieren({ betreff, text, absenderName, absenderAdresse }) {
  const sauber = textAufraeumen(text)
  const alles = `${betreff || ''}\n${sauber}`

  const datum = datumFinden(alles)
  const felder = {
    datum,
    uhrzeit: uhrzeitFinden(alles, datum),
    personen: personenFinden(alles),
    name: nameFinden(sauber, absenderName, absenderAdresse),
    telefon: telefonFinden(alles),
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
  const auszug = auszugBauen(sauber, getroffen > 0)

  return { ...felder, getroffen, auszug, betreff: (betreff || '').trim() }
}


/** Beschriftete Zeilen entfernen, wenn ihre Werte bereits als Feld stehen. */
function auszugBauen(text, felderStehenSchon) {
  let t = text
  if (felderStehenSchon) {
    // Dieselbe Quelle wie die Finder, und dieselben Regeln fuer Praefix und
    // Endung. Eine eigene Liste hier hat genau einmal gereicht, um "Telefon-
    // nummer:" als Feld zu ziehen und trotzdem im Auszug stehenzulassen.
    const beschriftungen = Object.values(FELDNAMEN).flat().map(musterFuer)
    const re = new RegExp(`^[\\s>*-]*(?:${beschriftungen.join('|')})\\s*[:\\-].*$`, 'gim')
    t = t.replace(re, '')
    // "Nachricht:" ist die Ausnahme -- das ist genau der Teil, den wir wollen.
    t = t.replace(/^[\s>*-]*(?:nachricht|anmerkung|bemerkung|wunsch|kommentar)\s*[:\-]\s*/gim, '')
  }
  return t.replace(/\s+/g, ' ').slice(0, 220).trim()
}
