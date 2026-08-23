# Offene Punkte

Was noch fehlt, und was es kostet, wenn er offen bleibt. Ein offener Punkt ohne
Auswirkung ist eine Notiz und gehört nicht hierher.

Diese Liste ist ausdrücklich Teil der Übergabe. Ein sauber dokumentiertes „noch
nicht entschieden“ ist wertvoller als eine elegante Fiktion, die später die
gesamte Seite prägt.

## Aus dem Gerüst übernommen

Diese Punkte gelten in jedem Projekt, das mit dem Gerüst startet, und werden
gestrichen, sobald sie erledigt sind.

**Das Formular hat keine Gegenstelle.** `kontakt.html` sendet mit `method="post"`
an sich selbst. Solange das so ist, verliert jede Absendung ihren Inhalt.
Gebraucht werden: die Zieladresse, die verarbeitende Stelle, die Speicherdauer
und der Rechtsgrund. Ohne diese vier Angaben kann auch die
Datenschutzerklärung den Abschnitt zum Formular nicht füllen.

**Die Rechtstexte sind leer.** Impressum und Datenschutzerklärung zeigen ihre
Abschnitte und keine Angaben. Sie stammen vom Betreiber und werden nicht
geraten. Bis dahin darf die Seite nicht öffentlich erreichbar sein.

**Die Farbwelt ist ein Gerüstwert.** Papier, Tinte und ein zurückhaltender
Akzent sind gewählt, damit die Messungen etwas zu messen haben. Sie tragen keine
Markenaussage. Wer sie ersetzt, prüft danach die Kantenkontraste neu: Die
Deckkraft der Bedienelement-Grenze ist gegen den hellen Grund gerechnet und
gilt nur für ihn.

**Die Schriften sind Systemschriften.** Damit läuft die Seite ohne
Netzverbindung und ohne Einbindung. Mit der ersten echten Schrift ändert sich
das Verhältnis von `ch` zu gesetzten Zeichen, und das Lesemaß wird neu gemessen
statt übernommen.

**Es gibt kein Bild.** `bilder.mjs` und die erste Behauptung von `ausfall.mjs`
messen deshalb nichts. Mit dem ersten Bild greifen beide, und der Bildbedarf
wird nach `docs/03-bildbedarf.md` gerechnet.
