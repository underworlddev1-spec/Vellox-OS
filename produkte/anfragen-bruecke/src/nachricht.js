/**
 * Aus den erkannten Feldern die Nachricht bauen, die auf dem Handy ankommt.
 *
 * Die Regel dahinter: **Der Wirt liest das im Gehen, zwischen Kuehlhaus und
 * Gastraum.** Alles, was er dort nicht in drei Sekunden erfassen kann,
 * gehoert nicht hinein, sondern bleibt im Postfach. Deshalb steht unter
 * jeder Nachricht derselbe Satz: Details im Postfach.
 */

const MAXLAENGE = 320

/**
 * WhatsApp-Vorlagen erlauben in einem Parameter weder Zeilenumbruch noch
 * Tabulator noch mehr als vier Leerzeichen am Stueck. Ein Verstoss ist kein
 * Schoenheitsfehler: Die API lehnt die ganze Nachricht ab, und dann kommt
 * gar nichts an.
 */
export function parameterSaeubern(wert, maximal = 180) {
  return String(wert == null ? '' : wert)
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/ {4,}/g, '   ')
    .trim()
    .slice(0, maximal) || '–'
}

/** Termin als eine Zeile: "Sa 04.10.2026 · 19:30 Uhr" */
export function terminZeile(f) {
  const teile = [f.datum, f.uhrzeit].filter(Boolean)
  return teile.length ? teile.join(' · ') : null
}

/** Die drei Parameter fuer die WhatsApp-Vorlage. Immer gefuellt. */
export function vorlagenParameter(f, kunde) {
  const knapp = kunde && kunde.umfang === 'knapp'
  // Der Betreff stand hier bis zum 26. September 2026 als Rueckfall, und er
  // ist keiner: Die Vorlage beschriftet diesen Parameter mit "Wann:", und
  // darunter stand auf dem Handy des Betriebs "Wann: Kontaktformular von
  // Pierree". **Ein Rueckfall, der die Beschriftung seiner Zeile zur Luege
  // macht, ist schlechter als eine leere Zeile.** Der Betreff geht nicht
  // verloren; er steht in der Mail, auf die der letzte Satz verweist.
  const termin = terminZeile(f) || 'kein Termin erkannt'
  const personen = f.personen ? `${f.personen} Personen` : 'Anzahl unbekannt'

  let gast
  if (knapp) {
    gast = 'Kontaktdaten im Postfach'
  } else {
    // Die Nummer international, damit WhatsApp sie antippbar macht.
    //
    // **Das ist die Antwortfunktion, und sie kostet keinen Parameter.** Der
    // Betrieb hat gefragt, wie er dem Gast zurueckschreiben kann. Eine
    // Nummer als "01608896350" ist auf einem Teil der Geraete toter Text;
    // als "+491608896350" oeffnet ein Tippen das Menue mit Anrufen und
    // Nachricht schreiben. Die Vorlage bleibt dabei unveraendert, es
    // braucht also keine neue Genehmigung durch Meta.
    //
    // Die nationale Schreibweise entfaellt bewusst statt zusaetzlich zu
    // stehen: Zwei Fassungen derselben Nummer in einer Zeile, die in drei
    // Sekunden gelesen werden soll, sind eine zu viel.
    const nummer = f.telefonWa ? '+' + f.telefonWa : f.telefon
    gast = [f.name, nummer].filter(Boolean).join(' · ') || 'siehe Postfach'
  }

  return [termin, personen, gast].map((w) => parameterSaeubern(w))
}

/** Freitextfassung fuer Telegram und fuer das Protokoll. */
export function bauen(f, kunde) {
  const knapp = kunde && kunde.umfang === 'knapp'
  const zeilen = []

  zeilen.push('Neue Anfrage' + (kunde && kunde.name ? ` · ${kunde.name}` : ''))
  zeilen.push('')

  const termin = terminZeile(f)
  if (termin) zeilen.push(termin)
  if (f.personen) zeilen.push(`${f.personen} Personen`)

  if (!knapp) {
    const nummer = f.telefonWa ? '+' + f.telefonWa : f.telefon
    const gast = [f.name, nummer].filter(Boolean).join(' · ')
    if (gast) zeilen.push(gast)
    // Die Mailadresse steht in einer eigenen Zeile und nicht hinter der
    // Nummer: Sie ist der zweite Weg zum Gast, nicht ein Teil des ersten.
    if (f.gastMail) zeilen.push(f.gastMail)
  }

  // Wenn nichts erkannt wurde, traegt der Auszug die Nachricht allein.
  // Eine Meldung ohne Inhalt waere schlimmer als gar keine: Sie sagt, es
  // sei etwas angekommen, und verschweigt was.
  if (f.getroffen === 0) {
    if (f.betreff) zeilen.push(f.betreff)
    if (f.auszug) zeilen.push('', f.auszug)
  } else if (!knapp && f.auszug) {
    const kurz = f.auszug.slice(0, 120)
    if (kurz) zeilen.push('', kurz + (f.auszug.length > 120 ? ' …' : ''))
  }

  zeilen.push('', 'Details im Postfach.')

  let text = zeilen.join('\n').replace(/\n{3,}/g, '\n\n').trim()
  if (text.length > MAXLAENGE) text = text.slice(0, MAXLAENGE - 1).trim() + '…'
  return text
}
