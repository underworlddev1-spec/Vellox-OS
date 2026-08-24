# Farbe und Material: warum Gold keine Farbe ist

Das [visuelle System](02-visuelles-system.md) beschreibt, welche Aufgabe eine
Farbe im Gefüge übernimmt: Grundfläche, Text, Akzent, Status. Dieses Kapitel
beantwortet die Frage davor, die dabei regelmäßig übersprungen wird: **Ist der
gesetzte Wert überhaupt die Farbe, die er zu sein behauptet?**

## Der Fehler, aus dem dieses Kapitel entstand

Ein Kosmetikstudio bekam eine Seite mit der Akzentfarbe `#E4A03C`, im Brief als
„warmes Amber" geführt. Der Kunde sah sie an und sagte: Das sieht altmodisch
aus, unsere Farbe ist Gold, nicht Gelb.

Beide Beobachtungen waren messbar richtig, und zwar an zwei Zahlen.

| | Farbton | Sättigung |
|---|---|---|
| gesetzt `#E4A03C` | 36 Grad | 76 Prozent |
| was als Gold liest | 46 bis 52 Grad | 47 bis 65 Prozent |

Der Wert lag **zehn bis sechzehn Grad zu weit im Orange** und war **elf bis
neunundzwanzig Punkte zu gesättigt**. Das zweite erklärt das Wort
„altmodisch": Hohe Sättigung bei mittlerer Helligkeit ist die Signatur des
flachen Designs der frühen Zehnerjahre. Es ist kein Geschmacksurteil, es ist
ein Jahrgang.

Warum der Wert dennoch durchging, steht in
[Eine Vorgabe ist keine Messung](../00_SYSTEM/08-vorgabe-ist-keine-messung.md).
Dieses Kapitel behandelt, was daraus für Farbe folgt.

## Farbwörter haben Bereiche

Ein Farbwort ist keine Poesie. Es beschreibt einen Bereich im Farbraum, und
außerhalb dieses Bereichs sieht ein Mensch etwas anderes, als das Wort sagt.
Die folgenden Werte sind an gebräuchlichen Referenzen gemessen und tragen im
Bau eine kleine Toleranz nach beiden Seiten.

| Wort | Farbton | Sättigung | Woran man das Danebenliegen merkt |
|---|---|---|---|
| Gold | 42 bis 52 | 45 bis 65 | Darunter Orange, darüber Gelb, zu gesättigt wirkt es billig |
| Messing | 42 bis 56 | 35 bis 60 | Grüner und matter als Gold |
| Bronze | 20 bis 40 | 35 bis 65 | Röter und dunkler als Gold |
| Kupfer | 10 bis 30 | 45 bis 80 | Im Rotorange, nicht im Gelb |
| Amber | 30 bis 45 | 60 bis 95 | Bewusst gesättigt. Wer Gold meint, meint nicht Amber |
| Rosé | 335 bis 20 | 15 bis 60 | Im Rot, nicht im Orange |
| Teal | 165 bis 195 | 20 bis 90 | Zwischen Grün und Blau |
| Sand | 30 bis 55 | 8 bis 30 | Fast neutral. Mehr Sättigung ist Ocker |

Die Tabelle ist bewusst kurz. Sie führt die Wörter, die in Projektbriefen
tatsächlich auftauchen, und keine Farbenlehre. Ein Wort, das nicht darin steht,
wird nicht geprüft; das ist eine Grenze und keine Lücke.

## Ein Material ist keine Farbe

Der zweite Teil des Fehlers lässt sich durch keinen Wert beheben.

**Gold, Messing, Kupfer, Chrom und Perlmutt sind Materialien.** Ihr Eindruck
entsteht nicht aus einem Farbton, sondern daraus, dass eine gewölbte Oberfläche
Licht ungleich zurückwirft. Eine flache Fläche kann das nicht. Sie liest sich
deshalb immer als der nächstgelegene matte Farbstoff: Gold wird zu Senf, Chrom
zu Grau, Kupfer zu Lachs.

Daraus folgt: **Wer ein Material meint, braucht einen Tonwertverlauf, nicht nur
einen Wert.** Drei Stufen genügen, eine hellere, die Grundfarbe, eine dunklere.

Und sofort die Grenze dazu, weil dieser Satz sonst als Freibrief für
Verlaufsdekoration gelesen wird:

**Die Spanne bleibt schmal.** Gemessen an einem Knopf: Bei etwa dreißig Prozent
Helligkeitsspanne liest sich die Fläche als Metall. Bei siebzig Prozent liest
sie sich als Farbverlauf, und ein Farbverlauf ist genau das Muster, das der
[Anti-Template-Standard](../00_SYSTEM/05-anti-template-standard.md) als
generisches KI-Muster ausschließt. Der Unterschied zwischen Material und
Dekoration ist die Spanne.

**Die Fläche darunter bleibt einfarbig gesetzt.** Ein Browser, der den Verlauf
nicht zeichnet, und ein Betriebssystem mit erzwungenen Farben zeigen dann immer
noch die richtige Farbe und nicht Weiß.

**Der Rest der Seite bleibt flach.** Ein Material ist eine Ausnahme für ein
Element, das physisch wirken soll. Zwei Materialien auf einer Seite sind keine
Materialien mehr, sondern ein Stil.

## Auf einem Verlauf zählt die schlechteste Stufe

Das ist der Fehler, den ein Verlauf zusätzlich mitbringt, und er ist leicht zu
übersehen, weil die Fläche auf den ersten Blick stimmt.

Gemessen an demselben Knopf: Der Text hielt auf der Grundfarbe 5,49:1, auf der
dunkelsten Stufe des Verlaufs aber nur 3,89:1. Wer die Grundfarbe prüft, misst
die Stelle, an der nichts passiert. Das Label liegt über die ganze Fläche.

**Auf einer Fläche mit Verlauf gilt die schlechteste Stufe, nicht die
Grundfarbe.** Reißt sie die Schwelle, wird die Stufe aufgehellt oder die Spanne
verkleinert. Beides ist billig, solange es jemand misst.

## Ein Akzent, und zwar genau einer

Der dritte Befund aus demselben Projekt betraf eine Farbe, über die niemand
geklagt hatte.

Neben dem Gold führte die Seite ein Türkis als zweiten Akzent. Auf der dunklen
Fläche zogen zwei Pixel starke Linien in diesem Türkis mehr Aufmerksamkeit auf
sich als die Überschrift darüber. Die Hierarchie stand auf dem Kopf, und zwar
seit dem ersten Tag.

**Wenn eine zweite Farbe auffälliger ist als die Akzentfarbe, ist sie der
Akzent, unabhängig davon, wie das Token heißt.**

Auffälligkeit ist dabei nicht dasselbe wie Sättigung. Die dunkle Grundfarbe
eines Projekts kann rechnerisch hoch gesättigt sein und trotzdem nichts an sich
ziehen, weil sie fast schwarz ist. Das Auge nimmt Buntheit dort am stärksten
wahr, wo die Helligkeit in der Mitte liegt. Die Prüfung gewichtet die Sättigung
deshalb mit dem Abstand zur mittleren Helligkeit.

Gerechnet an den vier Werten des Projekts, aus dem diese Regel stammt:

| Token | Sättigung | Helligkeit | Auffälligkeit | |
|---|---|---|---|---|
| Gold `#BE9A52` | 45 | 53 | 42 | der Akzent |
| Deep `#0F2E2A` | 51 | 12 | 12 | Grundfläche, trotz hoher Sättigung ruhig |
| Water `#2FA08C` | 54 | 41 | 44 | lauter als der Akzent, ein Befund |
| Water `#4E8F80` | 29 | 44 | 26 | nach der Korrektur ruhig |

Die Lösung war nicht, das Türkis zu entfernen, sondern es in die Familie der
Grundfarbe zu ziehen: von einem eigenständigen Ton zu einer helleren Stufe des
Dunkelgrüns. Damit trägt es weiterhin seine Aufgabe und tritt nicht mehr als
Marke auf.

## Die Prüfung vor der Freigabe

Vier Fragen, die ein Mensch beantworten muss, weil kein Skript sie kann:

1. **Welches Wort beschreibt diese Farbe?** Wenn die Antwort schwerfällt, ist
   die Farbe unentschieden und nicht subtil.
2. **Meint der Kunde dieses Wort?** Amber und Gold sind beide warm und beide
   richtig, und nur eines davon ist die Marke.
3. **Ist ein Material gemeint?** Dann braucht es drei Stufen und eine schmale
   Spanne, sonst ist es der nächstgelegene matte Farbstoff.
4. **Welche Farbe ist auf dieser Seite die auffälligste?** Wenn es nicht die
   Akzentfarbe ist, gibt es zwei Akzente.

Was sich messen lässt, ist bereits gemessen, bevor diese Fragen gestellt werden.
Das Werkzeug dafür ist
[`werkzeuge/farbwort-pruefen.mjs`](../werkzeuge/farbwort-pruefen.mjs), das Gate
für ein Kundenprojekt steht in
[Qualitätsgates](../09_TEMPLATES/05-qualitaetsgates.md).

## Verhältnis zu den anderen Kapiteln

Das [visuelle System](02-visuelles-system.md) ordnet Farben Aufgaben zu, dieses
Kapitel prüft die Werte selbst. Die [Markeninventur](04-markeninventur.md)
erhebt, welche Farbe ein Kunde bereits führt; wenn sie einen Wert liefert, gilt
er als gemessen und dieses Kapitel prüft nur noch, ob sein Name dazu passt.
[Eine Vorgabe ist keine Messung](../00_SYSTEM/08-vorgabe-ist-keine-messung.md)
nennt das allgemeine Muster, von dem dieser Fall der häufigste ist.
