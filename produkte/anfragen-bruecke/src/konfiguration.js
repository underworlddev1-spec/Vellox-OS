/**
 * Wer bekommt was, und wohin.
 *
 * Ein Kunde ist eine Empfaengeradresse auf der Brueckendomain. Damit bedient
 * ein einziger Worker beliebig viele Betriebe: Jeder bekommt seine eigene
 * Adresse, seine eigene Filterliste und sein eigenes Ziel. Ein neuer Kunde
 * ist ein Eintrag hier und eine Weiterleitungsregel in seinem Postfach.
 *
 * Geheimnisse stehen NICHT hier. Sie kommen ueber `wrangler secret put` in
 * die Umgebung und werden ueber `schluessel` nur benannt.
 */

export const KUNDEN = {
  // Die Adresse, auf die Kosta seine Anfragen weiterleitet.
  // Beim Anlegen der Route in Cloudflare exakt so eintragen.
  'kosta@BRUECKENDOMAIN': {
    name: 'Gasthaus Pfälzer Hof',
    sprache: 'de',

    // Ziel. Zum Testen "telegram", im Betrieb "whatsapp".
    // Der globale Wert aus wrangler.toml gilt, wenn hier nichts steht.
    kanal: null,

    // Empfaengerkennung je Kanal.
    // WhatsApp: Nummer in internationaler Form ohne Plus und ohne Leerzeichen.
    ziel: {
      whatsapp: 'WHATSAPP_NUMMER_KOSTA',
      telegram: null, // null = globaler TELEGRAM_CHAT
    },

    filter: {
      // Zweite Schicht hinter dem Gmail-Filter.
      // "durchlass" = alles ausser Blockliste. "streng" = nur was trifft.
      modus: 'durchlass',

      // Absender, die immer durchgehen, auch im strengen Modus.
      absenderJa: [
        // 'kontakt@pfaelzer-hof-walldorf.de',
      ],

      // Woerter im Betreff oder Text, die eine Anfrage erkennen.
      woerterJa: [
        'reservier', 'tisch', 'anfrage', 'buchung', 'platz',
        'personen', 'catering', 'feier',
      ],

      // Was nie durchgeht. Das hier haelt das Handy sauber.
      absenderNein: [
        'noreply', 'no-reply', 'newsletter', 'mailer-daemon',
        'postmaster', 'notifications@',
      ],
      woerterNein: [
        'rechnung', 'invoice', 'mahnung', 'newsletter', 'abmelden',
        'unsubscribe', 'werbung', 'angebot des monats', 'gewinnspiel',
      ],
    },

    // Datensparsamkeit: 'voll' schickt Name und Telefon mit,
    // 'knapp' nur Termin und Personenzahl. Siehe README, Abschnitt Recht.
    umfang: 'voll',
  },

  // Zweiter Betrieb, Vorlage zum Kopieren.
  // 'cafe@BRUECKENDOMAIN': { ... },
}

/** Google schickt die Bestaetigung der Weiterleitung von dieser Adresse. */
export const GOOGLE_BESTAETIGUNG = 'forwarding-noreply@google.com'

export function kundeFinden(empfaengerAdresse) {
  const a = String(empfaengerAdresse || '').trim().toLowerCase()
  return KUNDEN[a] ? { adresse: a, ...KUNDEN[a] } : null
}
