# Das VELLOX-Gerüst

Dieser Ordner ist kein Kapitel, sondern ein Startpunkt. Er enthält ein
lauffähiges Projekt, das am ersten Tag das mitbringt, was in einem
Kundenprojekt sonst in der dritten Woche entsteht: Farben als Rollen, eine
typografische Staffel, drei Bahnen, die Zustände eines Formulars, eine
Ladefläche für Bilder, die Trennung von Quelle und Auslieferung und einen
eingebauten Prüfstand.

Der Grund ist eine Beobachtung und keine Vorliebe. Am Gasthaus Pfälzer Hof sind
die tragenden Entscheidungen dieses Systems nicht am Anfang entstanden, sondern
an Fehlern: eine Farbübersteuerungsliste, die unvollständig wurde; eine
Lesespalte, die an der linken Kante ihrer Bahn klebte; ein Bild, das auf jedem
HiDPI-Schirm hochgerechnet wurde, obwohl im Kommentar genau das verhindert
werden sollte. Jede dieser Korrekturen hat Zeit gekostet, und keine davon war
projektspezifisch. Wer sie in ein Gerüst legt, zahlt sie einmal.

## Was das Gerüst ausdrücklich nicht mitbringt

Eine Gestaltung. Keine Palette, kein Schriftpaar, kein Satz Abschnittsmuster,
keine Heldenbereiche, keine Kartenraster.

Das ist die wichtigste Entscheidung an diesem Ordner, und sie ist unbequem: Ein
Gerüst mit einer mitgelieferten Gestaltung macht aus jedem Projekt dieselbe
Website, und genau das verbietet der
Anti-Template-Standard in VELLOX OS (`00_SYSTEM/05-anti-template-standard.md`). Was hier
liegt, ist Mechanik. Wie die Seite aussieht, entscheidet die Positionierung des
Kunden, und nicht dieser Ordner.

Alle Werte, die trotzdem gesetzt sein müssen, damit etwas läuft, sind im
Stylesheet markiert. Zwölf Marker stehen dort, und sie sind der Grund, warum
dieser Ordner kein Template ist.

Die offensichtlichen sind Farben und Schriften. Die gefährlichen sind die
anderen: eine Rundung von zwei Pixeln, ein Akzentbalken an der Meldung, die
sieben Zahlen der Raumskala, der obere Rand der typografischen Staffel, der
Abschnittsrhythmus, die Haarlinie unter der Kopfzeile. Das sind Entscheidungen,
die niemand bemerkt, weil sie funktionieren, und die deshalb unverändert in das
fünfte Projekt wandern.

**Der Marker verlangt nicht, dass sich eine Zahl ändert. Er verlangt, dass
jemand sie entscheidet.** Wer nach dem Messen zu dem Schluss kommt, dass zwei
Pixel richtig sind, streicht den Marker und hat die Entscheidung übernommen.
Wer ihn stehen lässt, hat sie geerbt.

## Der erste Lauf ist rot

Der Prüfstand fährt dreizehn Prüfungen. Zwölf sind am ersten Tag grün, die
dreizehnte ist rot, und das ist ihre Aufgabe.

`geruest.mjs` meldet, solange eine Route das Attribut `data-geruest` trägt, der
Marker im sichtbaren Text steht oder ein Marker im Stylesheet offen ist. Der
Zustand, den sie fängt, ist gefährlicher als er aussieht: Das Gerüst liefert vollständige Seiten mit
Überschriften, einem Formular und zwei Rechtstexten aus. Alles daran ist echt
gebaut und nichts davon ist wahr. Ein Impressum, das die Pflichtabschnitte in
der richtigen Reihenfolge zeigt und keine einzige Angabe enthält, ist
schlechter als eine leere Datei, denn es sieht aus wie erledigt.

Wer die Attribute entfernt, ohne die Texte zu ersetzen, hat die Prüfung umgangen
und nicht bestanden. Das lässt sich nicht messen, sondern nur schreiben. Aber
niemand entfernt sie versehentlich, und das ist der Unterschied zu einem Haken
in einer Übergabeliste.

## Die vier Routen sind ein Messgerüst und keine Seitenvorlage

Das ist die Stelle, an der dieser Ordner am ehesten zum Template werden kann,
und kein Gate hält sie.

Die Seiten liefern Kopfzeile, Abschnitte und Fußbereich aus, damit die zwölf
Prüfungen am ersten Tag etwas zu messen haben. Ihre Formen sind die
verbreitetsten des Webs: Wortmarke links, Navigation daneben, Abschnitt gleich
Überschrift plus Prosa, Fußzeile mit Rechtsverweisen. Sie stehen dort, weil ein
Prüfstand eine Landmarke, eine Überschriftenrangfolge und ein Formular braucht,
und nicht, weil sie für irgendein Projekt die richtigen wären.

**Die erste echte Seite entsteht aus der Journey und nicht durch Bearbeiten von
`index.html`.** Wer die Gerüstseite umtextet, bekommt eine Seite, die alle
Prüfungen besteht und trotzdem genau die Schablone ist, die der
Anti-Template-Standard verbietet.

Dagegen hilft kein Gate, sondern ein Review. Er liegt als
[`docs/04-anti-template-review.md`](docs/04-anti-template-review.md) im Projekt
und wird vor der Freigabe schriftlich beantwortet.

## Ein Projekt starten

```
cp -r 13_GERUEST <projekt>
cd <projekt>
cd pruefstand && npm install && npx playwright install chromium && cd ..
npx http-server . -p 8099 -s -c-1
```

Danach in einem zweiten Fenster:

```
cd pruefstand && npm run pruefen
```

Erwartet wird: zwölf grün, `geruest` rot. Meldet etwas anderes rot, stimmt die
Umgebung nicht, und das ist vor der ersten Zeile Projektarbeit zu klären.

Die weitere Reihenfolge steht in
VELLOX OS, `10_CHECKLISTS/01-projektstart.md`.
Kurz gefasst: erst Positionierung, dann Struktur, dann Farbwelt und Schrift,
dann Inhalte, und der Prüfstand läuft nach jedem Schritt und nicht am Ende.

## Was wo liegt

| Ort | Inhalt |
|---|---|
| `assets/style.css` | Die Quelle des Regelwerks. Nur hier wird gearbeitet. |
| `assets/script.js` | Die Quelle des Skripts. Es darf die Seite verbessern und nicht tragen. |
| `assets/style.css` in den Seiten | Erzeugt, zwischen `<!--stil:anfang-->` und `<!--stil:ende-->`. Handarbeit dort geht verloren. |
| `assets/script.schlank.js` | Erzeugt. Wird nie von Hand angefasst. |
| `werkzeug/schlank.mjs` | Erzeugt die Auslieferung. `--pruefen` vergleicht nur und ist selbst ein Gate. |
| `werkzeug/ableiten.mjs` | Erzeugt Bildableitungen mit dem Chromium des Prüfstands. |
| `pruefstand/` | Das Kit aus VELLOX OS, `12_PRUEFSTAND`, auf dieses Projekt gestellt. |
| `docs/01-entscheidungen.md` | Das Entscheidungsprotokoll. Leer, mit Format. |
| `docs/02-offene-punkte.md` | Was noch fehlt, mit Auswirkung. |
| `docs/03-bildbedarf.md` | Der Fotoauftrag, gerechnet statt geschätzt. |
| `docs/04-anti-template-review.md` | Die fünf Fragen, die kein Gate stellen kann. Vor der Freigabe. |
| `CLAUDE.md.vorlage` | Das Regelwerk des Projekts. Wird zu `CLAUDE.md`, sobald die ersten Regeln stehen. |

## Die vier Routen

`index`, `kontakt`, `impressum`, `datenschutz`. Sie sind kein Vorschlag für die
Informationsarchitektur, sondern das Minimum, das die Prüfungen brauchen:

- **index** trägt drei Ranghöhen, eine dunkle Fläche und eine Knopfgruppe. Ohne
  eine gesetzte dritte Ranghöhe kann `staffel.mjs` über sie nur schweigen.
- **kontakt** trägt das Formular mit Beschriftungen, Hilfetext und dem
  Fehlerzustand. Es hat absichtlich noch keine Gegenstelle.
- **impressum** und **datenschutz** sind Pflicht: `konform.mjs` prüft, dass
  beide von jeder Route aus erreichbar sind.

## Was am ersten Tag gemessen ist

Diese Zahlen stammen aus einem Lauf gegen das ausgelieferte Gerüst und nicht aus
einer Schätzung.

| Größe | Wert | Woher |
|---|---|---|
| Lesemaß | höchstens 65 Zeichen je Zeile | vier Routen, zwölf Breiten, mit Leerzeichen gezählt |
| Verhältnis `ch` zu Zeichen | rund 1 zu 1,8 | 36ch ergeben 65 Zeichen in der Systemschrift |
| Ausgeliefertes Stylesheet | 7,5 KB | `werkzeug/schlank.mjs` |
| Ausgeliefertes Skript | 1,2 KB aus 4,1 KB Quelle | 70 Prozent Kommentar |
| Kantenkontrast der Feldgrenze | 3,3 zu 1 hell, 4,5 zu 1 dunkel | gerechnet, `kontrast.mjs` misst nach |
| Offene Entscheidungen | 12 Marker | `geruest.mjs`, Behauptung 3 |

Das Verhältnis von `ch` zu gesetzten Zeichen gilt nur für diese Schrift. Wer die
Schrift wechselt, misst es neu, statt die 36 mitzunehmen: `ch` ist die
Vorschubbreite der Ziffer Null und nicht die Breite eines mittleren Zeichens.

## Zwei Prüfungen messen hier noch nichts

`bilder.mjs` meldet null Dateien, und `ausfall.mjs` findet kein Bild, dessen
Sichtbarkeit ohne JavaScript zu prüfen wäre. Beide sind grün, weil es nichts zu
prüfen gibt, und beide nennen ihre Zahl im Erfolgstext.

Das ist die dritte und gefährlichste Form einer Prüfung: Sie läuft, meldet grün
und prüft nichts. Sie steht hier trotzdem in der Liste, weil sie ab dem ersten
Bild greift und weil eine Prüfung, die in keiner Liste steht, niemand mitfährt.
Wer sie liest, liest die Zahl mit.

## Wenn eine Regel des Gerüsts nicht passt

Sie wird geändert, nicht umgangen. Jede Regel hier trägt ihre Begründung im
Kommentar; wenn die Begründung im Projekt nicht zutrifft, ist die Änderung
richtig und gehört mit Datum in `docs/01-entscheidungen.md`. Was nicht geht, ist
eine Übersteuerung, die die Regel stehen lässt und ihr an einer Stelle
widerspricht. Genau daraus entstehen die zwei Wahrheiten, gegen die die halbe
Mechanik dieses Ordners gebaut ist.

## Rechtliches

Die beiden Rechtstexte sind Strukturen und keine Rechtsberatung. Sie nennen die
Abschnitte, die üblicherweise gebraucht werden, und keine Formulierung, die man
übernehmen dürfte. Die Angaben stammen vom Betreiber, die Prüfung der
Verarbeitung stammt aus dem gemessenen Verhalten der Seite, und die rechtliche
Bewertung stammt von jemandem mit der entsprechenden Qualifikation. Der Skill
zur DSGVO- und KI-VO-Prüfung liefert den Befund, nicht die Freigabe.
