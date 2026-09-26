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
    warum: 'Ein Automat auf FREMDER Domain. Der Unterschied zur Probe '
      + '"formular_eigene_domain" ist die Domain und nicht das Wort no-reply.',
    mail: {
      absenderAdresse: 'no-reply@irgendein-dienst.de',
      absenderName: 'Dienst',
      betreff: 'Ihre Reservierung wurde bestätigt',
      text: 'Tisch für 2 Personen am 04.10.2026',
    },
    erwartet: { durch: false },
  },
  {
    name: 'formular_eigene_domain',
    warum: 'Das echte Kontaktformular des Gasthauses. Fuenf Felder -- Name, E-Mail, '
      + 'Telefonnummer, Betreff, Nachricht -- und KEIN Feld fuer Datum, Uhrzeit oder '
      + 'Personenzahl. Die drei stehen als Fliesstext in der Nachricht.\n\n'
      + 'Diese Probe ist der Pruefling, der dem Pruefstand gefehlt hat: Bis zum '
      + '20. September 2026 war jede Probe entweder ein Freitext-Anschreiben oder ein '
      + 'Automat auf FREMDER Domain. Der haeufigste Fall des Betriebs -- ein Formular '
      + 'der eigenen Domain, das von noreply@ sendet -- kam nicht vor. Deshalb konnte '
      + 'kein Lauf zeigen, dass die Bruecke ihn still verwarf.',
    mail: {
      absenderAdresse: 'noreply@pfaelzerhofwalldorf.de',
      absenderName: 'Kontaktformular',
      betreff: 'Neue Nachricht ueber das Kontaktformular',
      text: [
        'Name: Markus Weber',
        'E-Mail: markus.weber@example.de',
        'Telefonnummer: 0176 12345678',
        'Betreff: Tischreservierung',
        'Nachricht: Hallo, ich haette gerne am 04.10.2026 um 19:30 Uhr einen Tisch '
          + 'fuer 4 Personen. Viele Gruesse, Markus Weber',
      ].join('\n'),
    },
    erwartet: {
      durch: true,
      datum: '04.10.2026',
      uhrzeit: '19:30 Uhr',
      personen: '4',
      name: 'Markus Weber',
      telefon: '0176 12345678',
      // Die Nummer steht schon als Feld. Stuende sie nochmal im Auszug, waere
      // die Beschriftung "Telefonnummer:" nicht erkannt worden und die Nummer
      // nur ueber den Freitext-Rueckfall hereingekommen.
      auszugOhne: ['0176 12345678'],
    },
  },
  {
    name: 'formular_hoeflich',
    warum: 'Dasselbe Formular mit den hoeflichen Beschriftungen, die viele Baukaesten '
      + 'setzen. "Ihr Name" ist dasselbe Feld wie "Name", "Anzahl Personen" dasselbe '
      + 'wie "Personen".',
    mail: {
      absenderAdresse: 'wordpress@pfaelzer-hof-walldorf.de',
      absenderName: 'Pfaelzer Hof Website',
      betreff: 'Kontaktanfrage',
      text: [
        'Ihr Name: Familie Schneider',
        'Ihre Telefonnummer: 06227 4191',
        'Anzahl Personen: 8',
        'Terminwunsch: 12.12.2026',
        'Uhrzeit: 18 Uhr',
        'Ihre Nachricht: Wir moechten den Geburtstag meiner Mutter feiern.',
      ].join('\n'),
    },
    erwartet: {
      durch: true, datum: '12.12.2026', uhrzeit: '18:00 Uhr',
      personen: '8', name: 'Familie Schneider', telefon: '06227 4191',
    },
  },
  {
    name: 'bounce_eigene_domain',
    warum: 'Die Gegenrichtung zur Ausnahme fuer die eigene Domain. Ein '
      + 'Unzustellbarkeitsbericht kommt von der eigenen Domain und ist trotzdem '
      + 'keine Reservierung.\n\n'
      + 'Die erste Fassung der Ausnahme hob die GANZE Sperrliste auf der eigenen '
      + 'Domain auf und liess diesen Fall durch. Deshalb hebt sie heute nur die '
      + 'noreply-Muster auf und ausdruecklich nicht mailer-daemon und postmaster.',
    mail: {
      absenderAdresse: 'mailer-daemon@pfaelzerhofwalldorf.de',
      absenderName: 'Mail Delivery Subsystem',
      betreff: 'Undelivered Mail Returned to Sender',
      text: 'Ihre Nachricht an den Tisch fuer 4 Personen konnte nicht zugestellt werden.',
    },
    erwartet: { durch: false },
  },
  {
    name: 'formular_weicher_raum',
    warum: 'Doppelter Leerraum in der Beschriftung. Der Pruefling, der gefehlt hat: '
      + 'Die Regel fuer weichen Leerraum in musterFuer() war da, aber keine Probe '
      + 'hat sie je beruehrt, und ihre Gegenprobe blieb deshalb gruen. Eine gruene '
      + 'Gegenprobe kann heissen "die Regel ist tot" oder "das Gate ist blind"; hier '
      + 'war es das zweite, und entschieden hat das eine zweite Messung.\n\n'
      + 'So entsteht der Fall im Betrieb: Wer eine HTML-Tabelle in Text wandelt, '
      + 'bekommt Leerraum, den niemand getippt hat.',
    mail: {
      absenderAdresse: 'noreply@pfaelzerhofwalldorf.de',
      absenderName: 'Kontaktformular',
      betreff: 'Kontaktanfrage',
      text: [
        'Ihr  Name:  Herr Özdemir',
        'Anzahl  Personen:  12',
        'Wunschtermin:  24.12.2026',
        'Uhrzeit:  17:00',
        'Nachricht:  Wir kommen mit der ganzen Familie.',
      ].join('\n'),
    },
    erwartet: {
      durch: true, datum: '24.12.2026', uhrzeit: '17:00 Uhr',
      personen: '12', name: 'Herr Özdemir',
    },
  },
  {
    name: 'weiterleitung_gmail',
    warum:
      'Der echte Weg vom 23. September, Wort fuer Wort aus dem Postfach des '
      + 'Betriebs. Gmail setzt vor die weitergeleitete Mail einen Kopf mit '
      + '"Date:", und das ist eine Beschriftung aus FELDNAMEN.datum. Sie '
      + 'gewinnt gegen den Wunschtermin im Freitext: Auf dem Handy stand der '
      + 'Zeitpunkt der Weiterleitung an der Stelle des Termins. Der Gast '
      + 'wollte den 24., die Nachricht sagte den 23.',
    mail: {
      absenderAdresse: 'kostaxhafaj@gmail.com',
      absenderName: 'Kosta Xhafaj',
      betreff: 'Fwd: Kontaktformular von Neskudla',
      text: [
        '---------- Forwarded message ---------',
        'Von: WordPress <no-reply@pfaelzer-hof-walldorf.de>',
        'Date: Mi., 23. Sept. 2026 um 16:02 Uhr',
        'Subject: Kontaktformular von Neskudla',
        'To: <post@pfaelzerhofwalldorf.de>',
        '',
        'From: [your-name] <manfred.neskudla@sap.com>',
        '',
        'Message Body:',
        '',
        'Customer : Neskudla',
        '',
        'Phone number : 01608896350',
        '',
        'Website : Reservierung',
        '',
        'Message: Hallo Pfälzer Hof, ich möchte für Morgen 24.09.2026 um 19:00 einen',
        'Tisch für 3 Personen reservieren.',
      ].join('\n'),
    },
    erwartet: {
      durch: true, datum: '24.09.2026', uhrzeit: '19:00 Uhr',
      personen: '3', name: 'Neskudla', telefon: '01608896350',
      auszugOhne: ['manfred.neskudla@sap.com', '01608896350', '16:02'],
    },
  },
  {
    name: 'wochentag_ohne_datum',
    warum:
      'Die haeufigste Form einer echten Anfrage und die, an der die Bruecke '
      + 'bisher schwieg: Ein Gast nennt einen Wochentag und kein Datum. Das '
      + 'Wort wird uebernommen und ausdruecklich nicht in ein Datum gerechnet '
      + '-- welcher Samstag gemeint ist, weiss nur der Gast.',
    mail: {
      absenderAdresse: 'lena.brandt@example.de',
      absenderName: 'Lena Brandt',
      betreff: 'Tischreservierung',
      text: 'Guten Tag, wir würden am Samstag um 19 Uhr gerne mit 6 Personen kommen.',
    },
    erwartet: { durch: true, datum: 'Samstag', uhrzeit: '19:00 Uhr', personen: '6' },
  },
  {
    name: 'gruss_ist_kein_termin',
    warum:
      '"Guten Morgen" ist eine Begruessung und keine Angabe. Ohne diese Probe '
      + 'stuende sie als Wunschtermin auf dem Handy, und der Wirt haette '
      + 'keine Moeglichkeit, den Irrtum zu bemerken. Ein falscher Termin ist '
      + 'schlimmer als ein fehlender.',
    mail: {
      absenderAdresse: 'p.arnold@example.de',
      absenderName: 'Peter Arnold',
      betreff: 'Anfrage',
      text: 'Guten Morgen, wir möchten gerne einen Tisch reservieren. Rufen Sie mich bitte unter 06227 4191 zurück.',
    },
    erwartet: { durch: true, datum: null, uhrzeit: null },
  },
]
