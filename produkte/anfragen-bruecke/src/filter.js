/**
 * Die zweite Filterschicht.
 *
 * Die erste sitzt im Postfach des Kunden als Gmail-Regel und entscheidet,
 * was ueberhaupt weitergeleitet wird. Die brauchst du trotzdem hier noch
 * einmal, und zwar aus einem einfachen Grund: **Du kontrollierst die erste
 * nicht.** Wer heute eine Regel setzt, aendert sie morgen, und dann liegt
 * der Sonderangebotsnewsletter des Getraenkehaendlers auf dem Handy.
 *
 * Diese Schicht meldet ihre Entscheidung immer mit Begruendung, damit man
 * im Protokoll sieht, WARUM etwas nicht durchkam. Ein stiller Filter ist
 * dasselbe wie ein kaputter.
 */

const kleinschreiben = (s) => String(s || '').toLowerCase()

function trifft(text, liste) {
  const t = kleinschreiben(text)
  return (liste || []).find((wort) => t.includes(kleinschreiben(wort))) || null
}

/**
 * @returns {{durch: boolean, grund: string}}
 */
export function pruefen({ absender, betreff, text }, filter) {
  const f = filter || {}
  const absenderKlein = kleinschreiben(absender)
  const heuhaufen = `${betreff || ''}\n${text || ''}`

  // 1. Absender auf der Ja-Liste gewinnt gegen alles andere.
  //    Ein bekanntes Kontaktformular ist immer eine Anfrage.
  const jaAbsender = trifft(absenderKlein, f.absenderJa)
  if (jaAbsender) return { durch: true, grund: `Absender freigegeben (${jaAbsender})` }

  // 2. Nein-Absender. Automaten schicken keine Reservierungen.
  const neinAbsender = trifft(absenderKlein, f.absenderNein)
  if (neinAbsender) return { durch: false, grund: `Absender gesperrt (${neinAbsender})` }

  // 3. Nein-Woerter. Rechnungen und Werbung gehoeren ins Postfach.
  const neinWort = trifft(heuhaufen, f.woerterNein)
  if (neinWort) return { durch: false, grund: `Sperrwort (${neinWort})` }

  // 4. Ja-Woerter.
  const jaWort = trifft(heuhaufen, f.woerterJa)
  if (jaWort) return { durch: true, grund: `Stichwort (${jaWort})` }

  // 5. Nichts hat getroffen. Jetzt entscheidet der Modus.
  if (f.modus === 'streng') {
    return { durch: false, grund: 'streng: kein Stichwort getroffen' }
  }
  return { durch: true, grund: 'durchlass: nicht gesperrt' }
}
