/**
 * Echte Muster, keine Wunschbeispiele.
 *
 * Jede Probe steht fuer eine Quelle, die es im Betrieb wirklich gibt, und
 * jede hat einen Grund, hier zu stehen. Die Proben "unbrauchbar" und
 * "nur_text" sind die wichtigsten: Sie pruefen, ob die Bruecke scheitert,
 * ohne zu schweigen.
 */

export const PROBEN = [
  {
    name: 'formular_beschriftet',
    warum: 'Ein Kontaktformular mit sauberen Feldern. Der einfache Fall.',
    mail: {
      absenderAdresse: 'kontakt@pfaelzer-hof-walldorf.de',
      absenderName: 'Kontaktformular',
      betreff: 'Neue Reservierungsanfrage',
      text: [
        'Name: Familie Müller',
        'Telefon: 0176 1234567',
        'E-Mail: mueller@example.de',
        'Datum: 04.10.2026',
        'Uhrzeit: 19:30',
        'Personen: 4',
        'Nachricht: Gerne am Fenster, wir feiern einen Geburtstag.',
      ].join('\n'),
    },
    erwartet: { datum: '04.10.2026', uhrzeit: '19:30 Uhr', personen: '4', name: 'Familie Müller', durch: true },
  },
  {
    name: 'freitext_gast',
    warum: 'Ein Gast schreibt frei. Hier war der erste Fehler: Das Datum wurde als Uhrzeit gelesen.',
    mail: {
      absenderAdresse: 'anna.schmitt@example.de',
      absenderName: 'Anna Schmitt',
      betreff: 'Tisch für Samstag?',
      text: 'Hallo, hätten Sie am 04.10.2026 um 19:30 Uhr noch einen Tisch für 4 Personen frei?\nViele Grüße\nAnna Schmitt\n\n--\nGesendet von meinem iPhone',
    },
    erwartet: { datum: '04.10.2026', uhrzeit: '19:30 Uhr', personen: '4', durch: true },
  },
  {
    name: 'monatswort',
    warum: 'Datum als Wort, Uhrzeit nur als Stunde. Beides kommt in echten Mails vor.',
    mail: {
      absenderAdresse: 'b.krause@example.com',
      absenderName: 'Bernd Krause',
      betreff: 'Reservierung',
      text: 'Guten Tag, wir würden gerne am 12. Dezember ab 18 Uhr mit 8 Personen kommen. Tel 06227 123456',
    },
    erwartet: { uhrzeit: '18:00 Uhr', personen: '8', durch: true },
  },
  {
    name: 'nur_text',
    warum: 'Keine erkennbaren Felder. Die Bruecke muss trotzdem etwas Lesbares liefern.',
    mail: {
      absenderAdresse: 'gast@example.de',
      absenderName: 'Peter Wagner',
      betreff: 'Anfrage',
      text: 'Guten Tag, meine Frau und ich würden Sie gerne nächste Woche besuchen. Rufen Sie mich bitte zurück.',
    },
    erwartet: { durch: true, auszugNichtLeer: true },
  },
  {
    name: 'newsletter',
    warum: 'Muss geblockt werden, sonst wird das Handy ein zweites Postfach.',
    mail: {
      absenderAdresse: 'newsletter@getraenke-grosshandel.de',
      absenderName: 'Getränke Großhandel',
      betreff: 'Unser Angebot des Monats für Gastronomen',
      text: 'Jetzt sparen! Hier abmelden: ...',
    },
    erwartet: { durch: false },
  },
  {
    name: 'rechnung',
    warum: 'Enthaelt das Wort "Tisch" im Text und wuerde sonst durchrutschen.',
    mail: {
      absenderAdresse: 'buchhaltung@moebel-haus.de',
      absenderName: 'Möbelhaus',
      betreff: 'Rechnung 2026-0912',
      text: 'Anbei die Rechnung für 4 Tische und 16 Stühle.',
    },
    erwartet: { durch: false },
  },
  {
    name: 'automat',
    warum: 'Absender ist ein Automat. Automaten reservieren nicht.',
    mail: {
      absenderAdresse: 'no-reply@irgendein-dienst.de',
      absenderName: 'Dienst',
      betreff: 'Ihre Reservierung wurde bestätigt',
      text: 'Tisch für 2 Personen am 04.10.2026',
    },
    erwartet: { durch: false },
  },
]
