# Der Bildvertrag: was eine Datei verspricht und was ein Rahmen fordert

Ein Bild auf einer Website ist ein Vertrag zwischen drei Zahlen: der Breite der Datei, der Größe des Rahmens auf dem Schirm und der Pixeldichte des Geräts. Wird eine davon geschätzt, ist das Ergebnis entweder unscharf oder unnötig schwer. Beides sieht man einer Bewertungszahl nicht an, und beides bemerkt ein Team meist erst, wenn ein Kunde fragt, warum das Foto so weich aussieht.

## Gerechnet wird in Gerätepixeln, nicht in CSS-Pixeln

Ein Rahmen von 384 CSS-Pixeln fordert auf einem Schirm mit doppelter Pixeldichte 768 echte Pixel. Diese Umrechnung wird regelmäßig vergessen, und zwar besonders zuverlässig dann, wenn jemand die Deckelung mit genau der richtigen Begründung gesetzt hat.

Ein Beispiel aus der Praxis: Ein Bild trug die Deckelung 24 Rem mit dem ausdrücklichen Kommentar, breiter würde die 410 Pixel breite Quelle hochgerechnet und weich. Die Begründung war richtig und die Zahl falsch. Bei doppelter Dichte war der Fall, den der Kommentar verhindern wollte, auf jedem modernen Telefon und Notebook längst eingetreten.

Die Faustregel dazu: Jede Deckelung, die mit Bildschärfe begründet wird, nennt beide Zahlen. Einmal für einfache und einmal für doppelte Dichte.

## Beschnitt verschiebt die Rechnung

Ein Rahmen mit `object-fit: cover` skaliert nach der Achse, die knapper ist. Ein hoher Rahmen über einer flachen Quelle skaliert nach der Höhe und fordert deshalb eine breitere Datei als seine eigene Spalte. Ein flacher Rahmen über einer flachen Quelle skaliert nach der Breite, und dann ist die Spaltenbreite die Wahrheit.

Daraus folgt der wichtigste Satz dieses Kapitels: **Der Zuschlag in `sizes` ist keine Marotte und keine Schlamperei. Er ist eine Aussage über das Verhältnis von Rahmen und Quelle.** Wer ihn entfernt, weil er unnötig aussieht, entfernt eine Rechnung. Wer ihn stehen lässt, ohne sie zu kennen, ebenfalls.

Gerechnet wird so: benötigte Quellbreite gleich Rahmenhöhe mal Seitenverhältnis der Quelle, oder Rahmenbreite, je nachdem welcher Wert größer ist. Ein Rahmen von 544 mal 522 Pixeln über einer Quelle im Verhältnis 16 zu 9 fordert 522 mal 1,79, also 935 Pixel Quellbreite, und nicht 544. Wird stattdessen die Kastenbreite in `sizes` genannt, wählt der Browser die kleinere Datei und rechnet sie um Faktor 1,17 hoch.

Der Fall tritt in beide Richtungen auf. Derselbe Zuschlag war in demselben Projekt einmal zu Recht entfernt worden, weil der Rahmen flach geworden war, und kehrte zwei Tage später mit demselben Grund zurück, weil er wieder hoch wurde. Die Regel ist nicht „Zuschlag ja“ oder „Zuschlag nein“, sondern: Rechne ihn aus, schreibe die Rechnung daneben, und prüfe sie.

## Der Dateiname ist Teil des Vertrags

Trägt ein Dateiname eine Zahl, ist das ihre tatsächliche Breite. Der Zusatz `-800` stand in einem Projekt gleichzeitig für 800, 765, 720 und 832 Pixel. Das ist genau in dem Moment gefährlich, in dem jemand `w`-Deskriptoren ergänzt: Wer eine 765 Pixel breite Datei als `800w` auszeichnet, liegt um 4,4 Prozent daneben, und der Browser wählt nach einer falschen Zahl.

Dieselbe Sorgfalt gilt für den Deskriptor selbst. Er nennt die echte Breite der Datei, die er auszeichnet, nicht die gewünschte.

## Eine Auswahl ohne Wahl ist keine Auswahl

Ein `sizes` an einer einzigen URL verspricht dem Browser eine Wahl, die es nicht gibt. Gemessen lädt er mit und ohne die Angabe dieselbe Datei. Entweder es gibt mindestens zwei Kandidaten mit `w`-Deskriptor, oder `sizes` gehört nicht dorthin.

Umgekehrt lohnt sich eine zusätzliche Ableitung, sobald zwischen zwei vorhandenen Größen eine Lücke klafft. In dem Beispiel oben lag die nächste passende Datei über der 800er beim Original mit 1376 Pixeln und 100 Kilobyte; eine Ableitung mit 1024 Pixeln deckte den Bedarf mit Faktor 0,91 und wiegt 62 Kilobyte.

## Der Fotoauftrag kennt beide Zahlen

Wenn ein Foto noch fehlt, wird sein Bedarf aus der Komposition gerechnet und nicht geschätzt. Der Auftrag nennt die Mindestbreite für einfache und für doppelte Dichte und sagt, aus welcher Stelle des Layouts die Zahl stammt. Häufig ist das nicht die breiteste Stelle: In einem Projekt kam die maßgebliche Zahl nicht vom Desktop, sondern aus dem Bereich zwischen Tablet und Desktop, wo das Foto noch randlos lief.

Der Auftrag nennt außerdem die Form des Beschnitts. Ein Motiv, das seine Aussage über die volle Breite verteilt, verliert sie in einem fast quadratischen Rahmen. Die Aussage gehört in die Bildmitte, mit Luft an den Achsen, die der Rahmen beschneidet.

## Ladeflächen statt springender Layouts

Was später eintrifft, bekommt vorher seinen Platz und eine Fläche. Bei Bildern heißt das: Das Seitenverhältnis steht fest, die Fläche trägt einen Ton aus der Farbfamilie, und das Bild blendet sich auf, sobald es dekodiert ist.

Dabei ist `decode()` das richtige Signal und nicht das Ladeereignis. Das Ladeereignis feuert, wenn die Daten da sind, aber bevor der Browser sie zeichnen kann; dazwischen liegt bei großen Bildern ein sichtbarer Sprung.

**Die Ausfallrichtung ist verbindlich**: Ohne JavaScript ist jedes Bild sofort sichtbar. Ein Bild darf nie unsichtbar auf ein Skript warten, das nicht kommt. Dasselbe gilt für Inhalt: Ein Abschnitt, der ein Skript braucht, um seinen Inhalt zu zeigen, hat ohne dieses Skript keinen Inhalt.

Was hier bewusst nicht gebaut wird, ist ein wanderndes Glanzlicht. Ein Schimmer ist eine Animation, die Aufmerksamkeit fordert, ohne Information zu tragen. Und keine Skelettdarstellung für Inhalte, die gar nicht nachladen: Eine Skelettzeile für Text, der schon im HTML steht, täuscht ein Warten vor, das es nicht gibt.

## Nachweis

Der Prüfstand fährt für dieses Kapitel vier Behauptungen (siehe [`12_PRUEFSTAND`](../12_PRUEFSTAND/README.md), Prüfung `bilder.mjs`):

1. Jede Quelle mit `sizes` hat mindestens zwei Kandidaten mit `w`-Deskriptor.
2. Trägt ein Dateiname eine Zahl, ist das ihre tatsächliche Breite.
3. Jeder `w`-Deskriptor nennt die echte Breite der Datei, die er auszeichnet.
4. Kein Bild wird bei einfacher Pixeldichte hochgerechnet, gerechnet mit Beschnitt.

Behauptung vier misst die tatsächlich geladene Datei gegen den gerenderten Kasten und liest die echten Dateimaße selbst. Die natürliche Breite aus dem Browser taugt dafür nicht: Bei `w`-Deskriptoren rechnet er die Dichte heraus und meldet für eine 1376 mal 768 Pixel große Datei bei 2560 Pixeln glatte 1920 mal 1071.

Für jede Breite wird ein frischer Kontext geöffnet. Der Browser wählt aus einem `srcset` auch nach dem, was schon im Zwischenspeicher liegt; mit einer geteilten Sitzung war dieselbe Messung einmal grün und einmal rot. Ein leerer Zwischenspeicher ist außerdem der Zustand, in dem ein Gast die Seite zuerst sieht.
