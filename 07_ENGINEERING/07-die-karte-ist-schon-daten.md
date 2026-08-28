# Die Karte ist schon Daten

## Der Fall, aus dem dieses Kapitel entstand

Der Kunde hatte seine Speisekarte nur als PDF. Im Dossier stand das als
Schwäche: „Speisekarte nur als PDF-Download, auf dem Handy unlesbar, für Google
unsichtbar." Das stimmt für die ausgelieferte Seite. Für die Datenbeschaffung
war es das Gegenteil. Das PDF war kein Bild, sondern ein Vektor-Dokument mit
eingebetteten Schriften, und damit die vollständigste, verlässlichste Quelle,
die das Projekt hatte: zweiundsechzig Gerichte mit Nummer, Name, Beschreibung,
Preis und den Allergen- und Zusatzstoff-Codes, alle bereits geschrieben.

Daraus die Regel dieses Kapitels: **Ein Inhalt, der nur als PDF vorliegt, ist
für den Besucher eine Schwäche und für die Datenbeschaffung oft die beste
Quelle. Bevor jemand ihn abtippt, wird geprüft, ob er sich auslesen lässt.**

## Zwei Arten von PDF, und warum die Unterscheidung alles entscheidet

Ein PDF ist entweder ein Bild oder ein Text mit Positionen. Der Scan einer
Karte ist ein Bild; da hilft nur Abtippen oder Texterkennung, und beide bringen
Fehler ein. Ein aus einem Layoutprogramm exportiertes PDF trägt dagegen jeden
Buchstaben als Zeichen mit einer Koordinate. Diese zweite Art sieht wie ein Bild
aus und ist keines.

Die Probe ist billig: Text im Betrachter markieren. Lässt er sich markieren und
kopieren, liegt Text vor. Kopiert sich nichts oder nur ein Rechteck, ist es ein
Bild. Diese fünfzehn Sekunden entscheiden, ob die nächste Stunde Abtippen ist
oder ein Skriptlauf.

## Warum das reine Kopieren trotzdem scheitert

Wer den Text einfach herauskopiert, bekommt oft Unbrauchbares: eine Karte in
zwei Spalten liefert Zeilen, die quer durch beide Spalten laufen, weil die
Kopierfunktion nach vertikaler Lage sortiert und die Spalten nicht kennt. Genau
hier war beim Projekt die scheinbare Sackgasse.

Der Ausweg ist, nicht den fertigen Text zu nehmen, sondern die einzelnen
Textstücke mit ihren Koordinaten. Jedes Zeichen im PDF hat eine x- und eine
y-Position. Wer sie liest und selbst nach Zeile (y) und innerhalb der Zeile nach
Spalte (x) ordnet, rekonstruiert die zweispaltige Karte richtig. So ließen sich
im Projekt sogar die Preise der Pizzen wieder eindeutig ihren Gerichten
zuordnen, obwohl das reine Kopieren sie vermischt hatte.

## Die Herkunft bleibt eine Herkunft, kein Freibrief

Ausgelesene Daten sind Evidenz mit einem Datum, nicht die Wahrheit von heute.
Die Karte war von 2021, also blieb jeder Preis als unbestätigt markiert und das
Datum stand daneben. Das Auslesen ersetzt die Prüfung an der aktuellen
gedruckten Karte nicht; es liefert nur eine vollständige, saubere Grundlage,
statt einer aus dem Gedächtnis abgetippten. Der Unterschied zwischen beiden ist
die Fehlerquote: Das Skript liest, was dasteht, ein Mensch liest, was er
erwartet.

Ebenso bleibt die Auslieferungs-Schwäche bestehen. Dass die Karte als Datenquelle
taugt, macht das ausgelieferte PDF nicht lesbar. Die Daten wandern in ein
redaktionelles Modell und werden als echte, filterbare, für Suchmaschinen
sichtbare Seite ausgegeben. Die Quelle war ein PDF; das Ergebnis ist keines.

## Wo die Regel wohnt

Das ist kein Gate, sondern ein Reflex in der Beschaffung: Bevor Inhalt aus einer
PDF-Quelle abgetippt wird, wird die Markier-Probe gemacht, und bei markierbarem
Text wird über die Koordinaten ausgelesen statt kopiert. Der Bezug zur Discovery
steht in [Discovery](../01_RESEARCH/01-discovery.md): Vorhandenes Material des
Kunden ist die erste Evidenzquelle, und eine Quelle wird geprüft, bevor sie als
schwach abgeschrieben wird. Ein gelieferter Befund von außen, hier „die Karte
ist nur ein PDF", ist kein Defekt, bevor er im Projekt geprüft wurde.
