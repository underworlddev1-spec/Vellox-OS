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
 * Sperrmuster, die auf der eigenen Domain des Betriebs nichts bedeuten.
 *
 * Diese Liste steht hier und nicht in der Kundenkonfiguration, weil sie eine
 * Tatsache ueber E-Mail ist und keine ueber einen Betrieb: `noreply` heisst
 * bei jedem Kunden dasselbe.
 *
 * **Was ausdruecklich NICHT darin steht, ist der wichtigere Teil der Regel:**
 * `mailer-daemon` und `postmaster` melden eine gescheiterte Zustellung. Das
 * ist auf der eigenen Domain kein Formular, sondern ein Ruecklaeufer, und
 * ein Ruecklaeufer ist unter keinen Umstaenden eine Reservierung. Die erste
 * Fassung dieser Ausnahme hob die ganze Sperrliste auf und liess einen
 * Bounce der eigenen Domain durch; gefunden hat das die Gegenprobe und nicht
 * das Nachdenken.
 */
const NUR_AUF_FREMDER_DOMAIN = [
  'noreply', 'no-reply', 'no_reply', 'notifications@', 'notification@',
]

/** Der Teil hinter dem letzten @, ohne spitze Klammer und Leerraum. */
function domainVon(adresse) {
  const s = kleinschreiben(adresse).replace(/[>\s]+$/, '')
  const i = s.lastIndexOf('@')
  return i >= 0 ? s.slice(i + 1) : null
}

/** Gehoert der Absender zu einer Domain des Betriebs selbst? */
function eigeneDomain(adresse, domains) {
  const d = domainVon(adresse)
  if (!d) return null
  return (domains || [])
    .map(kleinschreiben)
    .find((x) => x && (d === x || d.endsWith('.' + x))) || null
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

  // 2. Nein-Absender -- aber nicht auf einer Domain des Betriebs selbst.
  //
  //    Hier stand bis zum 20. September 2026 "Automaten schicken keine
  //    Reservierungen", und der Satz war genau falsch herum: Das
  //    Kontaktformular des Betriebs IST ein Automat, und es schickt fast
  //    nichts anderes als Reservierungen. Gemessen wurde das an einem
  //    Gasthaus, dessen Anfragen ueberwiegend ueber das Formular der alten
  //    Website kommen -- und dessen Formular, wie die meisten, von einer
  //    noreply-Adresse sendet. Jede einzelne echte Anfrage waere geblockt
  //    worden, und zwar still: Eine geblockte Mail wird angenommen und
  //    verworfen, nie abgelehnt. Der Betrieb haette geglaubt, es kaemen
  //    keine Anfragen.
  //
  //    **Die Trennung laeuft deshalb ueber die Domain und nicht ueber das
  //    Wort.** `noreply@eigene-domain` ist die eigene Technik,
  //    `noreply@fremde-domain` ist Werbung. Das Wort allein kann beides sein
  //    und taugt darum nicht als Unterscheidung.
  //
  //    Durchgelassen wird hier nur diese eine Pruefung. Die Sperrwoerter aus
  //    Schritt 3 gelten weiter, damit ein Newsletter von der eigenen Domain
  //    trotzdem haengenbleibt.
  const neinAbsender = trifft(absenderKlein, f.absenderNein)
  let eigeneTechnik = null
  if (neinAbsender) {
    const aufhebbar = NUR_AUF_FREMDER_DOMAIN.includes(kleinschreiben(neinAbsender))
    eigeneTechnik = aufhebbar ? eigeneDomain(absender, f.eigeneDomains) : null
    if (!eigeneTechnik) return { durch: false, grund: `Absender gesperrt (${neinAbsender})` }
  }

  // Damit im Protokoll steht, dass hier eine Sperre uebergangen wurde. Ein
  // stiller Filter ist dasselbe wie ein kaputter -- das gilt auch fuer eine
  // stille Ausnahme.
  const zusatz = eigeneTechnik
    ? ` [${neinAbsender} erlaubt: eigene Domain ${eigeneTechnik}]`
    : ''

  // 3. Nein-Woerter. Rechnungen und Werbung gehoeren ins Postfach.
  const neinWort = trifft(heuhaufen, f.woerterNein)
  if (neinWort) return { durch: false, grund: `Sperrwort (${neinWort})` }

  // 4. Ja-Woerter.
  const jaWort = trifft(heuhaufen, f.woerterJa)
  if (jaWort) return { durch: true, grund: `Stichwort (${jaWort})${zusatz}` }

  // 5. Nichts hat getroffen. Jetzt entscheidet der Modus.
  if (f.modus === 'streng') {
    return { durch: false, grund: 'streng: kein Stichwort getroffen' }
  }
  return { durch: true, grund: `durchlass: nicht gesperrt${zusatz}` }
}
