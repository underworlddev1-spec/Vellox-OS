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
