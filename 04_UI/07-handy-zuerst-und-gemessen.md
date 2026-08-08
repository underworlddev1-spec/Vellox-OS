# Das Handy ist nicht die kleine Fassung

## Der Fehler, aus dem dieses Kapitel entstand

Eine fertig geglaubte Seite wurde am Telefon aufgerufen und fiel an drei
Stellen gleichzeitig auf: Das Menü öffnete einen halb abgeschnittenen weißen
Kasten, der Hero war so hoch, dass der stärkste Beweis der Seite unterhalb der
Falz lag, und der mittlere Abschnitt war eine Wand aus Text.

Alle drei waren am Schreibtisch unsichtbar. Der Menüfehler existierte
ausschließlich unterhalb der Bruchstelle, die Höhe des Heros fällt bei 1440
Pixeln nicht auf, weil dort neben dem Text noch Bildmaterial steht, und die
Textwand hatte am großen Bildschirm vier statt neun Zeilen.

Daraus folgt die Regel dieses Kapitels: **Was nur unterhalb einer Bruchstelle
existiert, wird am großen Bildschirm nicht gesehen, und zwar von niemandem.**
Nicht vom Entwickler, nicht im Review, nicht in der Freigabe. Der einzige Weg
dorthin ist Messen.

## Die Fehlerklasse hinter dem Menüfehler

Der Fehler war eine fehlende Klasse. Auf dem Telefon sind Navigation und
Schaltflächengruppe ausgeblendet, also war das Menü das letzte Kind des
Flex-Containers, und ohne `ml-auto` sammelte niemand den freien Platz ein. Der
sichtbare Schaden kam danach: Die Klappe war an der rechten Kante ihres Ankers
ausgerichtet, und ein Anker links im Kopf schiebt eine 20rem breite Fläche aus
dem Bild.

Die verallgemeinerbare Aussage ist nicht „ml-auto nicht vergessen". Sie lautet:
**Wenn eine Bruchstelle Geschwister entfernt, ändert sich die Aufgabe der
übrigen.** Ein Element, das am Schreibtisch das dritte von vier ist und auf dem
Telefon das erste von zwei, hat zwei verschiedene Aufgaben und braucht deshalb
beide beschrieben. Wer nur die Desktop-Reihenfolge im Kopf hat, baut die
mobile aus Versehen.

Prüfung dafür: Für jedes `hidden`-Geschwister die Frage stellen, wer nach
seinem Verschwinden erstes und letztes Kind ist. Absolut positionierte
Elemente unterhalb dieser Grenze einmal an ihrem Anker prüfen.

## Der Hero am Telefon

Gemessen an einem Projekt bei 390 Pixeln Breite: Der Hero war 1039 Pixel hoch,
also 1,2 Bildschirme, und die drei echten Kundenauftritte begannen bei 1270
Pixeln. Der stärkste Beweis der ganzen Seite war beim ersten Blick nicht da.
Allein der Vorspann belegte in der Desktop-Größe 250 Pixel über vier Zeilen.

**Der Vorspann bekommt am Telefon eine Stufe weniger, und das ist keine
Sparsamkeit.** Am Schreibtisch steht neben ihm Bildmaterial, die Zeile bricht
bei sechzig Zeichen. Am Telefon trägt er die volle Breite; dieselbe Größe
ergibt dort eine andere Sache.

Die Zielgröße ist nicht „kürzer", sondern überprüfbar: **Der erste Beweis der
Seite beginnt oberhalb der Falz.** Im genannten Projekt wanderte er von 1270
auf 606 Pixel, ohne dass Inhalt entfiel.

## Textwände entstehen im Vorspann

Der längste Abschnitt jener Seite hatte 174 Wörter und 1478 Pixel, und der
Vorspann allein lief über neun Zeilen. Darin stand in der Mitte der Satz, um
den es ging.

**Ein Vorspann mit mehr als zwei Sätzen ist am Telefon keine Einleitung,
sondern eine Hürde.** Wenn er drei Aussagen trägt, gehört die wichtigste heraus
und bekommt eigene Größe und eine Kante. Nicht als Gestaltung, sondern weil sie
die Aussage des Abschnitts ist und der Rest ihre Begründung.

Die Prüfung ist mechanisch: Vorspann am Telefon rendern und Zeilen zählen. Mehr
als vier heißt aufteilen.

## Die Handlung muss erreichbar bleiben

Eine Seite von vierzehn Bildschirmen hat ein Problem, das am Schreibtisch nicht
existiert: Die Kopfleiste steht dort fest und trägt beide Wege, am Telefon
trägt sie nur das Menü. Wer im zehnten Bildschirm überzeugt ist, hat die
Schaltflächen des Heros neun Bildschirme hinter sich.

Eine Handlungsleiste am unteren Rand löst das, aber nur mit drei Bedingungen.
Ohne sie wird sie zur Belästigung.

**Sie erscheint erst, wenn der Hero durch ist.** Solange dessen eigene
Schaltflächen sichtbar sind, ist sie eine Verdopplung.

**Sie verschwindet, bevor der Fußbereich sie erreicht.** Eine feste Leiste über
dem Fußbereich verdeckt die Zeile mit Impressum und Datenschutz. Das ist keine
Kosmetik: Diese Verweise müssen nach § 5 DDG erreichbar sein, und erreichbar
heißt nicht unter einer Leiste. Der übliche Gegenvorschlag, unten Freiraum zu
lassen, braucht zwei Zahlen, die zusammenpassen müssen; das Verschwinden
braucht keine.

**Sie ist eine Abkürzung und keine Voraussetzung.** Ohne JavaScript erscheint
sie nie, und die Seite bleibt vollständig benutzbar, weil Hero, Abschluss und
Fußbereich dieselben Wege tragen. Wer sie zur einzigen Handlungsmöglichkeit
macht, hat eine Abhängigkeit gebaut, die niemand bemerkt, bis sie ausfällt.

Technisch: zwei IntersectionObserver statt eines Scroll-Listeners. Sie melden
die zwei Übergänge, die zählen, statt bei jeder Bewegung zu rechnen. Der
verborgene Zustand setzt `pointer-events` aus, sonst fängt eine unsichtbare
Leiste weiter Berührungen ab.

## Fremde Arbeit wird neutral hervorgehoben

Zeigt ein Abschnitt Arbeiten für Kunden, gehört die Hervorhebung nicht in die
eigene Markenfarbe. Die Farben in diesen Aufnahmen gehören den Kunden; ein
Schein in der Akzentfarbe legt die eigene darüber.

Gemessen und gerendert an einem Fall mit drei Kundenaufnahmen auf dunklem
Grund: Die Fassung in der Akzentfarbe las sich als ausgewähltes
Bedienelement, die weiße als Licht, das auf den Gegenstand fällt. Bei einem
Kunden mit warmem Gold-Braun stand das Blau zusätzlich gegenüber.

Das ist die Kehrseite der Regel aus
[Wiedererkennbare Muster vermeiden](06-wiedererkennbare-muster-vermeiden.md),
dass die Geometrie der Marke auf der Seite wiederkehren muss: **Die Marke
liefert die Formen der Seite, nicht die Farben fremder Arbeit.**

## Kontrast gilt auch für Bildinhalte

Derselbe Fall lieferte einen Befund, der leicht zu übersehen ist. Die mittlere
Helligkeit der drei Aufnahmen ergab gegen den dunklen Grund 1,22:1, 2,62:1 und
10,92:1. Die erste Kundenseite war selbst dunkel gestaltet und löste sich
praktisch auf. Der Rahmen half nicht, sondern war Teil des Problems: Er stand
auf derselben Farbe wie der Grund.

**Eine Fläche, die fremdes Bildmaterial zeigt, braucht eine Kante, die vom
Inhalt des Bildes unabhängig ist.** Wer den Rahmen an den Grund angleicht, hat
ihn abgeschafft. Die Messung dafür ist einfach: mittlere Helligkeit des Bildes
gegen den Grund rechnen. Unter 3:1 braucht es eine Kante.

## Und eine Beobachtung über unregelmäßiges Licht

Gebaut und gemessen wurden vier Fassungen einer Hervorhebung: gleichmäßiger
Schein, gerichtetes Streiflicht, unregelmäßiger Rahmenschein und eine
Lichtpfütze dahinter. Gemessen wurde die Lesbarkeit der Kante an achtzehn
Punkten rundum.

Jede Fassung, die das Licht unregelmäßig machte, verlor die Kante irgendwo.
Beim gerichteten Streiflicht lagen siebzehn von achtzehn Punkten unter der
Schwelle. Der Grund ist trivial und wird trotzdem übersehen: **Eine Grenze, die
auf einer Seite verblasst, ist an dieser Seite keine Grenze.**

Die Lösung war kein Kompromiss, sondern eine Trennung: ein gleichmäßiger
Schatten als Grenze, mehrere versetzte als Licht. Die verallgemeinerbare
Regel: **Wenn ein Element zwei Aufgaben hat, bekommt es zwei Umsetzungen.** Eine
Eigenschaft, die Grenze und Atmosphäre gleichzeitig leisten soll, leistet
keines von beidem zuverlässig.

## Wie am Telefon geprüft wird

Nicht durch Verkleinern des Fensters, sondern mit einem Browser bei 390 mal 844
und doppelter Pixeldichte. Vier Zahlen je Seite, notiert und nicht geschätzt:

1. Gesamthöhe in Bildschirmen. Über zwölf ist ein Befund.
2. Position des ersten Beweises. Über 844 ist ein Befund.
3. Höhe und Wortzahl des längsten Abschnitts.
4. Zeilen des längsten Vorspanns. Über vier ist ein Befund.

Dazu drei Zustände, die sich nur am Gerät zeigen: Menü offen, Handlungsleiste
in der Seitenmitte, Seitenende mit den Rechtstext-Verweisen.

Diese Messung gehört in die [Qualitätskontrolle](../10_CHECKLISTS/07-qualitaetskontrolle.md)
und nicht in ein Gate: Die Zahlen sind Befunde, die ein Urteil brauchen. Was
sich mechanisieren lässt, etwa die Prüfung auf absolut positionierte Elemente
unterhalb einer Bruchstelle, gehört nach
[Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md).
