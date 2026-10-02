# Das Band dazwischen: Wo Bruchstellen existieren und keine Regeln

## Der Fehler, aus dem dieses Kapitel entstand

Zwei Meldungen an einem Tag, beide von einem Menschen mit einem iPad, keine von
einem Werkzeug. Die erste war konkret: In der Navigationsleiste bricht ein Punkt
auf eine zweite Zeile um. Die zweite war ein Eindruck: „Auf dem iPad war
außerdem alles relativ kleiner, so alle Elemente und Texte."

Die zweite Meldung ist die wertvollere, und sie ist die, die fast nie
ausgesprochen wird. Ein Umbruch ist ein Defekt — man sieht ihn, man meldet ihn.
„Wirkt eine Spur zu klein" ist kein Defekt, sondern ein Gefühl, und wer es hat,
kann meistens nicht sagen, woran es liegt. Deshalb bleibt es unausgesprochen,
und deshalb bleibt die Ursache stehen.

Die Messung dazu, dieselbe Seite über zwölf Breiten:

| Breite | Überschrift | Vorspann | Kopfleiste | Schaltfläche |
| --- | --- | --- | --- | --- |
| 390 | 36 | 19 | 73 | 62 |
| 640 | 48 | 22 | 73 | 62 |
| 768 | 48 | 22 | 73 | 62 |
| 820 | 48 | 22 | 73 | 62 |
| 1023 | 48 | 22 | 73 | 62 |
| 1024 | 54 | 22 | 73 | 52 |
| 1440 | 54 | 22 | 73 | 52 |
| 1536 | 66 | 24 | 85 | 58 |

Zwischen 640 und 1023 Pixeln ändert sich **kein einziger Wert**. Das Fenster
wächst in diesem Band um sechzig Prozent. Zwischen 1024 und 1535 wiederholt sich
dasselbe über fünfzig Prozent Zuwachs.

Jedes Tablet im Hochformat sitzt im ersten Band — 768, 820 und 834 Pixel sind
die verbreiteten Werte. Jedes Tablet im Querformat sitzt im zweiten. Sie
bekommen die Telefonfassung auf der doppelten Fläche.

## Warum dieses Kapitel nötig ist, obwohl es zwei Nachbarn hat

[`07-handy-zuerst-und-gemessen.md`](07-handy-zuerst-und-gemessen.md) beschreibt
den unteren Rand, [`08-grosse-bildschirme-und-obergrenzen.md`](08-grosse-bildschirme-und-obergrenzen.md)
den oberen. Beide Kapitel entstanden aus einem Fehler an ihrem jeweiligen Ende,
und beide schärfen den Blick genau dorthin.

Genau das ist die Falle. Wer am Telefon prüft und am großen Bildschirm prüft,
prüft an zwei Punkten und hält die Strecke dazwischen für abgedeckt. Sie ist es
nicht: In der Mitte liegen die meisten Bruchstellen des Frameworks, und dort
entstehen die Übergänge, in denen das Layout von einer Anordnung in die andere
kippt.

**Der untere Rand bricht, der obere nicht, und die Mitte ist uneindeutig.** Am
Telefon läuft Text über und ein Menü verdeckt den Inhalt — das meldet jemand. Am
großen Bildschirm bricht gar nichts, die Seite wirkt nur klein. In der Mitte
passiert beides nebeneinander: An einer Breite bricht etwas, an der Breite
daneben wirkt alles nur eine Spur zu klein.

## Die Breiten, an denen gemessen wird

Nicht die Breiten der Geräte, sondern die Ränder der Bruchstellen. Ein Gerät ist
nur ein Beispiel für seine Breite; eine Bruchstelle ist die Stelle, an der sich
die Regeln ändern, und dort kippt ein Layout.

Geprüft wird je Bruchstelle **einen Pixel davor und genau darauf**. Bei den
üblichen Werten sind das 639/640, 767/768, 1023/1024, 1279/1280 und 1535/1536.
Dazu die zwei, drei verbreiteten Gerätebreiten, die nicht auf einer Bruchstelle
liegen — bei Tablets 820 und 834.

Ein vollständiger Durchlauf in Achtpixelschritten über das ganze Band findet
nichts, was diese Liste nicht auch findet, und kostet das Dreißigfache. Das ist
nachgemessen worden: 280 Breiten gegen 21, gleicher Befund.

## Ein leeres Band ist ein Befund, kein Ergebnis

Die Prüfung ist mechanisch und braucht kein Urteil: Notiere je Bruchstelle
dieselben Zahlen und sieh nach, ob sich zwischen zwei benachbarten etwas ändert.

**Bleibt über einen Breitenzuwachs von mehr als etwa fünfzig Prozent jede Zahl
gleich, ist das eine Frage, die beantwortet werden muss.** Nicht automatisch ein
Fehler — eine Lesegröße soll ausdrücklich nicht mitwachsen, und eine
Trefferfläche hat eine Untergrenze und keine Obergrenze. Aber jede Zahl, die
über ein ganzes Band flach liegt, war entweder entschieden oder vergessen, und
der Unterschied muss aufschreibbar sein.

Im beschriebenen Projekt war genau eine der flachen Zahlen eine Entscheidung:
der Lesetext mit 19 Pixeln über alle Breiten, weil die Zeilenlänge über die
Hüllenbreite geregelt wird und nicht über den Schriftgrad. Alle übrigen waren
vergessen.

## Wenn es nicht passt, verschiebe die Umschaltstelle, nicht die Größen

Der Umbruch in der Navigationsleiste hatte eine Rechnung: Rand 64 + Marke 151 +
Navigation 460 + Kontaktgruppe 374 + Abstand 24 ergibt 1073 Pixel gegen 1024
verfügbare. Neunundvierzig zu viel.

Der naheliegende Griff ist, die neunundvierzig Pixel aus den Abständen zu holen.
Er wurde versucht und brachte achtundzwanzig — zu wenig, und vor allem in die
falsche Richtung: Dieselbe Leiste war gerade als „zu klein" gemeldet worden. Eine
Leiste, die genau dort enger wird, wo sie bereits gedrängt aussieht, löst das
Symptom und verschlimmert die Ursache.

**Die Umschaltstelle liegt dort, wo der Inhalt aufhört zu passen, und nicht dort,
wo das Framework eine Bruchstelle anbietet.** Dieselbe Navigation passte bei 1180
Pixeln mühelos und bei 1024 nicht. Also gehört die Umschaltung zwischen diese
beiden Werte, auf die nächste Bruchstelle darüber — nicht auf die darunter, nur
weil sie zufällig die übliche ist.

Der Preis dafür wird benannt und nicht versteckt: Auf den Geräten unterhalb der
neuen Umschaltstelle liegt die Navigation hinter einer Berührung. Das ist eine
Entscheidung gegen einen Umbruch und für gleichbleibende Größen, und sie ist
vertretbar, solange die wichtigste Handlung sichtbar bleibt.

## Warum kein bestehendes Werkzeug das fand

Im betroffenen Projekt liefen zu diesem Zeitpunkt sechs Prüfungen: Zeilenlängen,
Raster, Barrierefreiheit, Höhe am Telefon, Verhältnisse am großen Bildschirm,
tote Verweise. Keine fand den Umbruch.

Die Zeilenlängen-Prüfung sieht Absätze. Das Raster sieht Spalten. Die
Barrierefreiheitsprüfung sieht Regelverstöße, und ein umgebrochenes Menü ist
keiner — es ist bedienbar, beschriftet und kontrastreich, es sieht nur falsch
aus. Die beiden Messungen für Telefon und großen Bildschirm liefen bei 390 und
bei 1440, also links und rechts am Fehler vorbei.

**Eine Prüfung findet, wonach sie sucht, und eine Liste von Prüfungen deckt nur
die Fehlerklassen ab, die jemand schon einmal erlebt hat.** Das ist kein Mangel
an Sorgfalt, sondern die Natur der Sache — und der Grund, warum eine Meldung von
einem echten Gerät mehr wert ist als ein weiterer grüner Lauf. Was ein Mensch
gemeldet hat, wird danach mechanisiert, damit es nur einmal gemeldet werden muss.

## Reviewfrage

Öffne die Seite an den Rändern aller Bruchstellen und notiere je vier Zahlen.
Bleibt über ein ganzes Band jede davon gleich, benenne für jede einzeln, ob sie
entschieden oder vergessen war. Prüfe danach, ob die Navigationsleiste an jeder
dieser Breiten einzeilig bleibt — und wenn nicht, rechne nach, wie viele Pixel
fehlen, bevor du irgendetwas verkleinerst.

## Querverweise

- [Handy zuerst und gemessen](07-handy-zuerst-und-gemessen.md) — der untere
  Rand, die vier Zahlen bei 390 mal 844 und die zwei Regime für die Höhengrenze.
- [Große Bildschirme und Obergrenzen](08-grosse-bildschirme-und-obergrenzen.md)
  — der obere Rand, und warum die Stufe in den Wert gehört und nicht in die
  Fundstelle.
- [Navigation und Hero](02-navigation-und-hero.md) — die Aufgaben der Leiste,
  deren Umbruch hier den Anlass gab.
- [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md) — warum eine
  gemeldete Beobachtung danach zu einer Prüfung wird.
