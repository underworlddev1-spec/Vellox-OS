# Der große Bildschirm ist nicht die feste Fassung

## Der Fehler, aus dem dieses Kapitel entstand

Eine Seite war bis zum Laptop richtig und fiel auf dem großen Monitor auf: Der Inhalt saß in einer schmalen Spalte in der Mitte, links und rechts stand leere Fläche. Gemessen bei 1920 Pixeln Breite trug der Container die im ganzen Projekt verwendete Obergrenze von 1152 Pixeln, also sechzig Prozent des Fensters; je Seite blieben 384 Pixel leer. Schrift, Abstände und Bilder waren für den Laptop bemessen und wirkten gegen diese Leere klein.

Der Befund ist der genaue Gegenpol zu [Das Handy ist nicht die kleine Fassung](07-handy-zuerst-und-gemessen.md). Dort war das Telefon nicht die verkleinerte Desktop-Fassung. Hier ist der große Bildschirm nicht die auf feste Breite gedeckelte Laptop-Fassung. **Eine Seite, die nur bei einer Breite richtig aussieht, ist für eine Bildschirmklasse gebaut und nicht für den Inhalt.**

## Warum es unsichtbar bleibt

Entwickelt und geprüft wird zwischen 1280 und 1440 Pixeln. Das ist genau der Bereich, in dem ein Container mit dieser Obergrenze das Fenster fast füllt. Oberhalb davon sieht im Bau niemand hin, so wie unterhalb der Bruchstelle niemand hinsieht. Der letzte Breakpoint ist der Horizont des Entwurfs: Was dahinter passiert, ist kein Zustand, den jemand einmal gesehen und für gut befunden hätte.

Das erklärt, warum der Fehler kein Flüchtigkeitsfehler ist. Er ist die Voreinstellung. Ein mobil-zuerst gebautes, an einer Maximalbreite gedeckeltes Layout hört an dieser Breite auf zu wachsen, und niemand hat entschieden, dass es das soll.

## Die Ursache ist ein gedeckeltes rem-System

Der Fehler ist nicht, dass ein bestimmtes Element zu klein ist. Er ist, dass das ganze System bei der letzten Maximalbreite stehen bleibt. Typografie, Abstände und die Container-Breiten sind alle in rem definiert und damit an eine einzige Zahl gebunden: die Wurzel-Schriftgröße. Solange die 16 Pixel beträgt, bleibt auch die 72-rem-Spalte bei 1152 Pixeln, gleich wie breit das Fenster ist.

Daraus folgt aber auch der Hebel. Weil alles proportional an derselben Zahl hängt, genügt es, diese eine Zahl mit der Fensterbreite wachsen zu lassen, damit das gesamte System mitwächst.

## Die Entscheidung: das rem-System mitwachsen lassen

Die Wurzel-Schriftgröße wächst oberhalb des letzten Breakpoints fließend mit der Viewport-Breite, umgesetzt mit einer `clamp()`-Funktion. Weil Schrift, Abstände und Maximalbreiten in rem hängen, wachsen sie gemeinsam und im selben Verhältnis. Das ist der entscheidende Punkt: **Es ist eine Vergrößerung der gleichen Proportionen, keine Streckung.** Die Zeilenlänge in Zeichen bleibt konstant, weil Container und Schrift um denselben Faktor wachsen. Der häufigste Einwand gegen breitere Layouts, zu lange Textzeilen, entsteht deshalb gar nicht.

Gemessen am Projekt: Bis 1280 Pixel bleibt die Wurzel bei 16 Pixeln, dort ändert sich nichts. Zwischen 1280 und rund 2240 Pixeln wächst sie auf 22. Bei 1920 sind es 20 Pixel, und die Hauptspalte wächst von 1152 auf 1440 Pixel, also von sechzig auf fünfundsiebzig Prozent der Fensterbreite. Der Deckel ist bewusst gesetzt: Auf sehr breiten Schirmen soll Text nicht randlos laufen, deshalb hält die Spalte bei 2560 Pixeln bei rund 1580 Pixeln an.

## Zwei Bedingungen, ohne die es kippt

Die Untergrenze der `clamp()` ist ein rem, keine feste Pixelzahl. Das hat zwei Gründe. Erstens respektiert es eine größere Browser-Grundschrift, die ein Nutzer aus Gründen der Zugänglichkeit gesetzt hat; eine feste Pixel-Wurzel würde diese Einstellung überschreiben. Zweitens ist die Wurzel unterhalb des Skalierungsbereichs damit exakt der bisherige Wert, und das bestehende Layout bleibt dort unverändert. **Eine Skalierung für große Schirme darf die kleinen nicht anfassen.** Der Nachweis dafür ist, dass die berechneten Werte unterhalb des Breakpoints Byte für Byte die alten sind.

Die Breakpoints müssen in Pixeln festgelegt sein, nicht in rem. Das ist die Falle, die die Lösung sonst umkehrt: Ein rem-Breakpoint wird in der Schrift gemessen, die gerade wächst, also verschiebt er sich mit ihr. Bei größerer Wurzel löst er erst bei einer größeren Pixelbreite aus, und die Regeln, die dort greifen sollten, greifen zu spät. Eine fließende Wurzel und rem-Breakpoints zusammen ergeben Breakpoints, die auf großen Schirmen an der falschen Stelle stehen. In Pixeln sind sie absolut und wandern nicht.

Damit hängt eine dritte, kleinere Bedingung zusammen: Was in festen Pixeln bemessen ist, wächst nicht mit. Im Projekt betraf das drei Höhen, darunter das Hero-Band. Sie standen still, während alles um sie herum größer wurde, und wirkten dadurch relativ zu klein. Übertragen auf rem lösten sie sich. **Ein festes Pixelmaß an einer layouttragenden Fläche ist in einem rem-System ein Fremdkörper.**

## Wie es geprüft wird

Gemessen wird an einer Leiter von Breiten, mindestens 1280, 1440, 1920 und 2560 Pixel. Zwei Bedingungen müssen zugleich gelten. Unterhalb des Skalierungsbeginns sind die berechnete Wurzel-Schriftgröße und die Breite der Hauptspalte identisch mit dem Zustand vor der Änderung; oberhalb wachsen beide monoton. Und über die ganze Leiter, von der kleinsten Telefonbreite bis zum breitesten Schirm, tritt kein horizontales Scrollen auf. Im Projekt reichte die geprüfte Leiter von 320 bis 3440 Pixeln.

Der Layout-Shift bleibt bei null. Die `clamp()` ist reines CSS, pro Breite stabil und nicht an Scrollen oder JavaScript gebunden; sie ändert nichts nach dem ersten Bild.

## Wo die Regel wohnt

Der prüfbare Teil gehört in ein Gate, denn er wurde bereits einmal gebrochen: Eine fließende Wurzel verlangt Breakpoints in Pixeln, und layouttragende Maße gehören in rem. Beides ist mechanisch prüfbar und steht in [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md). Das Urteil bleibt beim Menschen: ob die vergrößerte Seite noch ausgewogen wirkt und ob die Wachstumskurve zur Marke passt, kann kein Skript entscheiden.

Die Regel gilt für rem-basierte, an einer Maximalbreite gedeckelte Landing- und Marketingseiten, also den Normalfall in VELLOX. Sie gilt nicht ungeprüft dort, wo eine Fläche bewusst randlos läuft, wo Kunst-Richtung feste Pixelverhältnisse braucht oder wo dichter Inhalt wie eine Datentabelle gerade nicht mitwachsen soll. In diesen Fällen wird die Ausnahme benannt, nicht die Skalierung stillschweigend weggelassen.

Der Bezug zum [Anti-Template-Standard](../00_SYSTEM/05-anti-template-standard.md) ist derselbe wie beim Nullzustand: Eine Vorlage ist fertig, bevor der Inhalt existiert, und eine für eine Bildschirmklasse gebaute Seite ist fertig, bevor der Bildschirm bekannt ist. Beides sieht richtig aus, solange man an der Stelle steht, für die es gemacht wurde, und verrät sich, sobald man einen Schritt zur Seite tritt.
