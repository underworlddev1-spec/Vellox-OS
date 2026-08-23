# Bildbedarf

Der Fotoauftrag dieses Projekts. Er wird aus der Komposition gerechnet und nicht
geschätzt, und er nennt für jede Datei zwei Zahlen: die Mindestbreite bei
einfacher und bei doppelter Pixeldichte.

Die Rechenregeln stehen im
Bildvertrag in VELLOX OS (`07_ENGINEERING/07-bildvertrag.md`). Zusammengefasst:

**Gerechnet wird in Gerätepixeln.** Ein Rahmen von 384 CSS-Pixeln fordert auf
einem Schirm mit doppelter Dichte 768 echte Pixel. Diese Umrechnung wird
besonders zuverlässig dann vergessen, wenn jemand die Deckelung mit genau der
richtigen Begründung gesetzt hat.

**Beschnitt verschiebt die Rechnung.** Ein Rahmen mit `object-fit: cover`
skaliert nach der knapperen Achse. Ein hoher Rahmen über einer flachen Quelle
skaliert nach der Höhe und fordert deshalb eine breitere Datei als seine eigene
Spalte: benötigte Quellbreite gleich Rahmenhöhe mal Seitenverhältnis der Quelle,
oder Rahmenbreite, je nachdem welcher Wert größer ist.

**Die maßgebliche Stelle ist selten die breiteste.** Häufig kommt die Zahl nicht
vom Desktop, sondern aus dem Bereich zwischen Tablet und Desktop, wo ein Foto
noch randlos läuft.

**Der Auftrag nennt auch die Form des Beschnitts.** Ein Motiv, das seine Aussage
über die volle Breite verteilt, verliert sie in einem fast quadratischen Rahmen.
Die Aussage gehört in die Bildmitte, mit Luft an den Achsen, die der Rahmen
beschneidet.

## Format je Datei

| Feld | Inhalt |
|---|---|
| Stelle | Route und Abschnitt, aus dem die Zahl stammt |
| Rahmen | Breite mal Höhe in CSS-Pixeln, an der maßgeblichen Fensterbreite |
| Mindestbreite 1x | gerechnet, mit Beschnitt |
| Mindestbreite 2x | das Doppelte |
| Motiv | was zu sehen sein muss, und was im Beschnitt verloren gehen darf |
| Herkunft | Foto oder erzeugt |

Die letzte Zeile ist keine Formalie. Ein erzeugtes Bild trägt beim Einbau das
Attribut `data-erzeugt` und eine sichtbare Kennzeichnung beim Inhalt; die
Pflicht steht in VELLOX OS, `07_ENGINEERING/08-ki-kennzeichnung.md`,
und `konform.mjs` prüft sie über das Attribut. Wer das Attribut vergisst, hat
kein rotes Gate, sondern eine unmarkierte Pflichtangabe. Deshalb hält diese
Liste fest, welche Dateien erzeugt sind.

## Dateien

Noch keine.
