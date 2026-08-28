# Werkzeuge

Hier liegen ausführbare Skripte, nicht Wissen. Der Unterschied ist wichtig:
Ein Kapitel erklärt eine Entscheidung, ein Werkzeug nimmt einem Menschen die
Buchhaltung ab, damit sein Urteil für die Fragen frei bleibt, die nur er
beantworten kann.

Jedes Werkzeug hier gehört zu einem Kapitel und setzt eine Stufe aus
[Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md) um. Ein Skript
ohne Kapitel wäre ein Werkzeug ohne Begründung und damit genau das, was VELLOX
nicht sein will.

Diese Skripte laufen bei uns, nicht beim Kunden. Was in ein Kundenprojekt
übernommen wird, steht als Gate in
[`09_TEMPLATES/05-qualitaetsgates.md`](../09_TEMPLATES/05-qualitaetsgates.md).

---

## markeninventur.mjs

Erhebt den Markenbestand eines vorhandenen Auftritts am gerenderten Zustand.
Gehört zu [Markeninventur](../02_BRANDING/04-markeninventur.md) und setzt deren
Stufe 3 um.

```bash
node werkzeuge/markeninventur.mjs https://www.kunde.de --aus inventur.md
```

Wenn der Browser nicht durchkommt, der Rechner aber schon, hilft der Umweg
über eine lokale Kopie. Das Skript erledigt sie selbst:

```bash
node werkzeuge/markeninventur.mjs https://www.kunde.de --spiegeln
```

Weitere Seiten werden als Pfade angehängt, weil eine Startseite selten den
ganzen Bestand zeigt:

```bash
node werkzeuge/markeninventur.mjs https://www.kunde.de /leistungen /kontakt
```

**Was es liefert.** Einen Markdown-Bericht mit Kandidaten für die Markenfarbe,
getrennt nach Fläche und Vorkommen an Handlungselementen, mit den
Kontrastwerten auf hellem und dunklem Grund. Dazu die tatsächlich verwendeten
Schriften, die geladenen Schriftdateien, gesetzte Eigenschaftswerte mit Farbe,
Kandidaten für das Zeichen mit ihren Pixelmaßen und eine leere Tabelle für die
drei Zustände übernommen, abgeleitet und neu entschieden.

**Worauf es besonders achtet.** Auf Rahmenwerk-Dateien, die auf der eigenen
Domain des Kunden liegen. Eine Datei mit einem Rahmenwerk-Namen dort ist selten
der Standard des Rahmenwerks: Meist hat jemand wenige Werte überschrieben, und
genau diese wenigen Werte sind die Markenentscheidung. Dieser Fall hat den
Anlass für Kapitel und Werkzeug geliefert.

**Was es nicht kann.** Beurteilen, ob eine Farbe stimmt. Ob Ladenschild,
Fahrzeug und Arbeitskleidung denselben Ton führen, bleibt eine Frage an den
Kunden. Der Bericht sagt das am Ende ausdrücklich, damit niemand ihn für eine
vollständige Inventur hält.

**Ein leerer Befund ist kein Ergebnis.** Findet das Skript keine bunte Farbe,
schreibt es das nicht als Feststellung, sondern als noch nicht belastbaren
Zwischenstand mit der Liste der Orte, die es nicht sehen kann. Ein negativer
Befund braucht dieselbe Sorgfalt wie ein positiver.

**Voraussetzung.** Playwright, lokal oder global installiert. Das Skript findet
auch eine globale Installation.

```bash
npm install -g playwright && npx playwright install chromium
```

---

## zeilen.mjs

Findet Absätze, deren Zeilen zu lang sind, und zwar exakt in Zeichen. Gehört zu
[Das obere Ende](../04_UI/08-grosse-bildschirme-und-obergrenzen.md) und
[Layout, Grid und Spacing](../04_UI/01-layout-grid-und-spacing.md).

```bash
node werkzeuge/zeilen.mjs --adresse http://localhost:3000 --verzeichnis dist
node werkzeuge/zeilen.mjs --adresse https://www.kunde.de --seiten /,/leistungen/,/kontakt/
```

Standardmäßig geprüft wird bei 390, 1280, 1920 und 2560 Pixeln gegen eine
Grenze von 90 Zeichen; beides lässt sich über `--breiten` und `--grenze`
ändern. Der Rückgabewert ist 0 bei null Befunden und 1 sonst, das Skript eignet
sich also als Abbruchbedingung im Bau.

**Wie gemessen wird.** Ein Bereich über die ersten n Zeichen eines Textknotens
liefert so lange genau ein Rechteck, wie diese Zeichen in eine Zeile passen.
Das größte n mit einem Rechteck ist die Zeichenzahl der ersten Zeile. Die
naheliegende Schätzung — Breite geteilt durch halbe Schriftgröße — wäre falsch
genug, um Befunde zu erfinden oder zu übersehen.

**Warum bei mehreren Breiten.** Zeilenlänge ist unsichtbar, solange man in der
Breite arbeitet, in der entworfen wurde. Zwei Fälle machen sie sichtbar, und
beide sind eingetreten: Absätze ohne eigene Breitenbegrenzung, die nur zufällig
von der Hülle begrenzt wurden, und eine neue Regel für die Hülle, die in der
Datei weiter unten stand als eine engere Grenze am selben Element und diese ab
einer Bruchstelle aushebelte. Im zweiten Fall sprang ein Vorspann von 768 auf
1408 Pixel, 17 Stellen waren betroffen, und in der Entwurfsbreite war nichts
davon zu sehen.

**Was es nicht kann.** Beurteilen, ob ein kurzer Absatz gut gesetzt ist. Es
findet nur die obere Grenze; die untere — eine Spalte, die so schmal ist, dass
jede Zeile drei Wörter trägt — bleibt ein Urteil.

**Voraussetzung.** Playwright, im Projektordner oder global. Das Skript sucht
in dieser Reihenfolge: Arbeitsverzeichnis, eigener Ordner, globale
Installation. Ein abweichender Browserpfad geht über `CHROMIUM_PFAD`.
