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
  //
  // Benannt nach dem Betrieb und nicht nach der Person: Bei zwanzig Kunden
  // liest sich eine Liste aus pfaelzerhof@, cafe@, metzgerei@ von selbst,
  // eine aus kosta@, murat@, sabine@ nicht.
  'pfaelzerhof@saphirweb.de': {
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

      // Die Domains des Betriebs selbst.
      //
      // Auf ihnen wird die Sperre fuer noreply-artige Absender aufgehoben:
      // Die Anfragen dieses Hauses kommen ueberwiegend ueber das
      // Kontaktformular der alten Website, und ein Kontaktformular sendet
      // von einer technischen Adresse. Ohne diesen Eintrag waere jede echte
      // Anfrage geblockt worden, und zwar still.
      //
      // Der Eintrag steht INNERHALB von `filter`, weil index.js genau dieses
      // Objekt an pruefen() uebergibt. Eine Ebene hoeher waere er im Betrieb
      // `undefined` gewesen, ohne dass ein handgebauter Test das je bemerkt
      // haette.
      //
      // Beide Schreibweisen, weil sie sich hier wirklich unterscheiden: Die
      // Website laeuft auf pfaelzer-hof-walldorf.de, die Mailadresse lautet
      // post@pfaelzerhofwalldorf.de -- ohne Bindestriche. Zwei Domains, ein
      // Betrieb.
      eigeneDomains: [
        'pfaelzerhofwalldorf.de',
        'pfaelzer-hof-walldorf.de',
      ],

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
  // 'cafe@saphirweb.de': { ... },
}

/** Google schickt die Bestaetigung der Weiterleitung von dieser Adresse. */
export const GOOGLE_BESTAETIGUNG = 'forwarding-noreply@google.com'

export function kundeFinden(empfaengerAdresse) {
  const a = String(empfaengerAdresse || '').trim().toLowerCase()
  return KUNDEN[a] ? { adresse: a, ...KUNDEN[a] } : null
}
