# Komposition: geteilte Kanten, eine Deckelung, begründete Ränder

Zwei Blöcke, die nebeneinander stehen, sind noch keine Komposition. Sie sind zwei Blöcke, die nebeneinander stehen. Dieses Kapitel beschreibt, woran der Unterschied hängt, und drei Fehler, die kein bestehendes Gate sieht, weil in allen dreien jeder einzelne Wert für sich richtig ist.

## Nebeneinander ist erst gebaut, wenn Kanten geteilt werden

Der häufigste Fall sieht im Code unauffällig aus: ein Raster mit zwei Spalten, Text links, Bild rechts, beide senkrecht zentriert. Jede Spalte richtet sich in ihrer eigenen Zelle aus, unabhängig von der anderen.

Gemessen bei 1440 Pixeln in einem realen Abschnitt: Die Textspalte lief über die volle Abschnittshöhe, das Bild stand in seiner Spalte und zentrierte sich darin selbst, darüber lagen 233 Pixel leere Fläche und darunter 222. Keine Kante des einen Blocks traf eine Kante des anderen. Rund die Hälfte der Abschnittsfläche war Farbe, die niemand entschieden hatte, und alles, was Inhalt war, drängte sich in der linken Spalte. Der Auftraggeber beschrieb das als „gleichzeitig leer und überladen“, und beides stammte aus derselben Ursache.

**Zwei Spalten bilden eine Komposition, wenn sie mindestens zwei Kanten teilen, und zwar nicht durch Ausrichtung, sondern durch Abhängigkeit.** Ausrichtung sagt jedem Block, wo er in seiner eigenen Zelle sitzen soll; die Zellen bleiben unabhängig. Abhängigkeit heißt: Ein Block setzt die Höhe, der andere nimmt sie an.

In der Fassung, die daraus entstand, setzt die Textspalte die Höhe des Abschnitts, und das Foto bringt kein eigenes Seitenverhältnis mehr mit, sondern spannt über diese Höhe. Die Überschrift beginnt dadurch auf der Oberkante des Bildes und die letzte Zeile des Belegs endet auf seiner Unterkante, gemessen zwei bis vier Pixel Abweichung an neun Breiten von 992 bis 2560. Dieselbe Anordnung mit einem festen Seitenverhältnis daneben ergibt 75 bis 110 Pixel Abstand, je nach Fenster.

Der Preis ist ein Beschnitt, und er wird bewusst bezahlt: Ein Rahmen, der höher ist, als die Quelle flach ist, zeigt weniger von ihrer Breite. Was das für die Bilddatei bedeutet, steht im [Bildvertrag](../07_ENGINEERING/07-bildvertrag.md).

## Genau eine Deckelung je Textspalte

Eine Textspalte wird an genau einer Stelle in ihrer Breite begrenzt. Zwei Deckelungen für dieselbe Strecke bedeuten, dass eine von beiden nicht wirkt, und welche das ist, sieht man dem Regelwerk nicht an.

Auf Rechtstextseiten lag eine Lesebreite innerhalb einer bereits gedeckelten Bahn. Gemessen bei 1440 Pixeln lief die Lesespalte von 336 bis 919, die Bahn aber bis 1136. Zweihundertsiebzehn Pixel blieben rechts leer, und die Seite stand sichtbar links, obwohl die Bahn genau mittig saß. Kein Gate konnte das finden, weil beide Werte für sich richtig waren.

Welche Deckelung bleibt, entscheidet dieselbe Frage wie überall: **die, die eine Entscheidung ausdrückt.** Wenn die Bahn das Lesemaß der Seite ist, deckelt die Bahn. Wenn Prosa in einer vollen Bahn steht und keine zweite Begrenzung existiert, deckelt die Lesebreite.

## Ein schmaler Block steht in seiner Bahn, nicht an deren linker Kante

Das ist die zweite Hälfte derselben Regel und die unauffälligere. Eine Formularspalte misst 44 Rem, ihre Bahn 72, und die Differenz von 384 Pixeln steht vollständig rechts. Jeder Abschnitt der Seite sitzt dadurch im linken Drittel des Fensters.

Es ist ausdrücklich **kein Problem großer Schirme**, und das ist die wichtigste Beobachtung daran: Der Versatz ist absolut konstant und fällt prozentual sogar, je breiter das Fenster wird. Gemessen 12,5 Prozent der Fensterbreite bei 1024 Pixeln, 15,0 bei 1280, 10,4 bei 1853. Er war auf jedem Desktop da, seit es die Spalte gibt, und wurde erst bemerkt, als jemand ihn benannte.

Welches Mittel greift, hängt davon ab, was über dem Block steht. Trägt der Abschnitt eine linksbündige Überschrift, wird der Block mit ihr auf eine Achse gebracht. Trägt er eine zentrierte Überschrift, wird auch der Block zentriert. **Was nicht geht, ist eines von beidem allein**: Eine mittige Überschrift über einem linksbündigen Block ist auffälliger als der ursprüngliche Fehler.

Und es gibt einen Unterschied zwischen zentrieren und in die Mitte schieben. Ein linksbündiger Kasten mit Inhaltsbreite, der mittig gestellt wird, bleibt ein linksbündiger Kasten; das ist bei einer Tabelle richtig, weil das Auge die Zeilenanfänge sucht. Drei kurze Zeilen zentriert man wirklich.

## Farbe darf randlos laufen, ein Foto nicht

Ein Abschnitt darf bis an den Fensterrand laufen, solange er Farbe trägt. Trägt er ein Foto, ist die Hauptachse seine Grenze, und zwar als Deckelung im Regelwerk und nicht als Empfehlung.

Der Grund ist gerechnet. Eine Fläche aus einer Volltonfarbe ist bei 2560 Pixeln dieselbe Farbe wie bei 1280; sie hat kein Detail, das sie beim Strecken verlieren könnte. Ein Foto hat nichts anderes als Detail. Ein randloses Bildband mit 1530 Pixeln Quellbreite wurde bei 1920 um Faktor 1,25 gestreckt, bei 2560 um 1,67 und bei doppelter Pixeldichte um 3,35. Auf der Hauptachse liegt der Faktor bei einfacher Dichte an jeder Breite unter eins.

Für die Farbbänder folgt daraus, dass sie randlos bleiben. In einer Komposition mit weitem Rand ist ein randloses Band der Gebrauch des Randes und nicht sein Rest; es in einen gerundeten Kasten zu fassen, macht aus einer Zäsur eine Karte.

Wer eine Regel schreibt und ihre lauteste Verletzung als Ausnahme in das Gate einträgt, hat keine Regel, sondern eine Beschreibung des Bestehenden.

## Zwei gleiche Formen übereinander sind eine Form zu viel

Der [Anti-Template-Standard](../00_SYSTEM/05-anti-template-standard.md) verbietet wiederholte Muster ohne inhaltlichen Grund. In der Praxis fällt der Fall meist an einer Naht auf, nicht innerhalb eines Abschnitts.

Ein Beispiel: Der Abschluss einer Startseite sollte vier Angaben als Band aus vier Spalten zeigen, Begriff oben, Wert darunter. Unmittelbar darunter steht der Fußbereich, und der ist genau das, ein mehrspaltiges Faktenraster in kleiner Schrift. Zwei Faktenraster übereinander, das obere hell und das untere dunkel, wiederholen dieselbe Form ohne Grund. Der Abschluss einer Seite ist der Schluss einer Erzählung und nicht der Anfang eines Nachschlagewerks.

Vor jeder Formentscheidung steht deshalb ein Blick auf den Nachbarn, und zwar über die Abschnittsgrenze hinaus.

## Kopf, Inhalt und Fuß, und warum das keine Regel wird

Ein Fall aus dem Bau des Projektgerüsts. Die Kopfzeile stand auf der Hauptachse, der Inhalt in einer Lesespalte, beide sauber mittig. Die Abstände zum Fensterrand stimmten, kein Gate meldete etwas, und der Screenshot zeigte trotzdem zwei linke Kanten mit 160 Pixeln Abstand. Die Seite zerfiel in ein Dokument und einen Rahmen um ein anderes.

Es ist derselbe Fehler wie ein schmaler Block an der linken Kante seiner Bahn, nur eine Ebene höher, und die Korrektur ist dieselbe: Kopf und Fuß bekommen die Bahn des Inhalts.

Der Versuch, daraus eine Behauptung zu machen, ist gescheitert, und das ist der lehrreiche Teil. Die naheliegende Formulierung lautet, die Bahn von Kopf und Fuß dürfe nicht breiter sein als die breiteste Bahn des Inhalts. Gegen das Referenzprojekt gefahren meldete sie sofort sechsunddreißig Befunde, und keiner davon war ein Fehler: Dessen Kopfzeile ist ein symmetrisches Band mit mittiger Wortmarke und geteilter Navigation, das die Achse ausfüllt. Ein solches Band hat keine linke Kante, die man verfehlen könnte.

**Eine Behauptung, die an einer korrekten Seite anschlägt, ist keine Regel, sondern die Beschreibung eines Layouts.** Sie würde Teams dazu erziehen, Ausnahmen einzutragen, und damit genau die Gewohnheit stärken, gegen die die Prüfdoktrin geschrieben ist. Der Fall bleibt deshalb eine Frage der Sichtprüfung, und sie lautet: Wo beginnt die erste Zeile des Kopfes, wo die erste Zeile des Inhalts, und ist der Unterschied gewollt?

## Nachweis

Der Prüfstand fährt für dieses Kapitel drei Behauptungen (siehe [`12_PRUEFSTAND`](../12_PRUEFSTAND/README.md), Prüfungen `achse.mjs` und `textfluss.mjs`):

1. Die Mitte der gesetzten Tinte eines Abschnitts liegt höchstens fünf Prozent der Fensterbreite neben der Fenstermitte, über sieben Breiten.
2. Ein Block mit eigener Fläche oder Kante, der Text trägt, nutzt auf dem Telefon mindestens neunzig Prozent seiner Spalte.
3. Ein solcher Kasten polstert auf allen vier Seiten oder auf keiner.

Behauptung zwei ist aus dem Fehler entstanden, bei dem zweiundzwanzig Prüfungen grün waren, weil alle dasselbe bestätigten. Die Begründung steht in der [Prüfdoktrin](../00_SYSTEM/06-pruefdoktrin.md).

Geteilte Kanten und die Höhe einer Komposition sind nicht allgemein prüfbar, weil beide von der Aussage des Abschnitts abhängen. Sie werden je Projekt als eigene Behauptung geschrieben, an der Tinte gemessen und gegen den Fall geprüft, in dem das Bild sein eigenes Format zurückbekommt.
