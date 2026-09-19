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
  const termin = terminZeile(f) || parameterSaeubern(f.betreff) || 'siehe Postfach'
  const personen = f.personen ? `${f.personen} Personen` : 'Anzahl unbekannt'

  let gast
  if (knapp) {
    gast = 'Kontaktdaten im Postfach'
  } else {
    gast = [f.name, f.telefon].filter(Boolean).join(' · ') || 'siehe Postfach'
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
    const gast = [f.name, f.telefon].filter(Boolean).join(' · ')
    if (gast) zeilen.push(gast)
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
