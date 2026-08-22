# Farbe als Rolle: Kontext statt Übersteuerung

Das [visuelle System](../02_BRANDING/02-visuelles-system.md) entscheidet, welche Farben eine Marke trägt und warum. Dieses Kapitel beantwortet die andere Hälfte: wie diese Farben so in ein Interface kommen, dass sie einen Abschnitt überleben, den es heute noch nicht gibt.

## Zwei Ebenen, und nur eine davon steht im Regelwerk

Farben werden auf zwei Ebenen geführt, und die Trennung ist streng.

**Grundfarben nennen die Farbe.** `--creme-100`, `--oliv-900`, `--gold-600`. Sie bilden die Palette der Marke ab und werden nirgends direkt verwendet.

**Rollen nennen die Aufgabe.** Fläche, Text, leiser Text, Linie, Handlung, Erfolg, Fehler. Nur diese stehen im Regelwerk. Eine Deklaration, die eine Grundfarbe oder einen Literalwert direkt einsetzt, ist ein Fehler, auch wenn sie zufällig dasselbe Ergebnis liefert wie die Rolle. Sie liefert es nämlich nur so lange, bis der Kontext wechselt.

Die Benennung ist dabei kein Formalismus. Ein Token, das nach seinem Aussehen heißt, ist eine Grundfarbe mit einem Rollennamen davor und hilft niemandem: `--farbe-gruen-hell` sagt nicht, wofür es zuständig ist, und wird deshalb an drei unvereinbaren Stellen verwendet.

## Der Kontext dreht die Rolle, nicht eine Liste

Ein dunkler Abschnitt trägt eine Kontextklasse und definiert die Rollen für seinen Teilbaum neu. Damit ist jedes Kind automatisch richtig eingefärbt, auch eines, das später dazukommt.

Der Gegenentwurf ist eine Übersteuerungsliste: eine Sammlung von Selektoren, die für jede Komponente noch einmal sagt, wie sie auf dunklem Grund aussieht. **Eine Übersteuerungsliste muss vollständig sein, und sie ist es nie lange.** In dem Projekt, aus dem diese Regel stammt, kam ein zweiter dunkler Abschnitt dazu, der die Klassenliste nicht trug. Jedes Element darin erbte die Farben der hellen Fläche, und die Kontrastprüfung fand dort einen Verstoß, den die Regeln nicht verhindern konnten, weil sie an der falschen Sache hingen.

## Auch die Handlungsfarbe dreht

Der verbreitetste Sonderfall ist die Ausnahme für die primäre Handlung: Der Hauptknopf soll überall gleich aussehen, damit man ihn wiedererkennt. Diese Ausnahme trägt genau so lange, bis die Handlungsfarbe und die Abschnittsfläche dieselbe Farbe sind. Gemessen 1,0 zu 1 heißt: Der Knopf ist unsichtbar.

Die Handlung dreht deshalb mit. Auf dunklem Grund trägt sie die helle Fläche mit dunkler Schrift, und das Verhältnis bleibt in beide Richtungen über der Schwelle. **Wiedererkennung braucht keine identische Farbe, sie braucht eine identische Gestalt**: dieselbe Form, dieselbe Größe, derselbe Ort in der Komposition.

Damit entfällt auch die zweite verbreitete Sonderklasse, der eigene helle Knopf für dunkle Flächen. Sonderklassen für Kontexte sind Übersteuerungslisten mit einem anderen Namen.

## Kanten sind Bedienelemente

Eine Feldkante, eine Knopfkante und ein Fokusring sind Grenzen bedienbarer Elemente und müssen drei zu eins gegen ihre Fläche halten. Das ist keine Verschärfung der Textkontrastregel, sondern eine eigene Anforderung, und sie wird am gemischten Pixel gemessen und nicht am Farbwert im Stylesheet. Eine Linie mit Deckkraft ist nicht die Farbe, die im Code steht.

Der Fokusring braucht eine eigene Rolle, weil das, worauf er liegt, nicht immer die Abschnittsfläche ist. Über einem Hero liegt eine durchsichtige Kopfleiste auf einem Foto.

## Wenn eine neue Farbe gebraucht wird

Erst prüfen, ob eine bestehende Rolle passt. Wenn nicht: Grundfarbe anlegen, Rolle benennen, im Entscheidungsprotokoll begründen. Nicht: einen Wert in die Regel schreiben, mit dem Vorsatz, ihn später zu ersetzen.

## Keine Rolle ohne Verbraucher

Eine Rolle, die definiert und nirgends benutzt wird, ist kein Vorrat. Sie ist eine Behauptung über eine Komponente, die es nicht gibt, und sie ist gefährlicher als toter Code: Die nächste Person benutzt sie und hält ihre Begründung für aktuell.

Der Fall, aus dem diese Regel stammt, war gut gebaut. Eine Rolle für die Fläche eines Adressschildes drehte mit dem Kontext, weil ein Schild nicht weiß, auf welcher Fläche es liegt, und die Begründung stand mit einer Messung daneben. Als das Schild bei einem Umbau entfiel, blieb die Rolle stehen: zweimal definiert, nirgends verwendet, beide Definitionen mit ausführlichen Kommentaren über eine Komponente, die es nicht mehr gab.

Dasselbe gilt für typografische Stufen und Raumstufen. Eine Skala mit einer Stufe, die niemand verwendet, ist keine Skala, sondern eine Wunschliste.

## Nachweis

Der Prüfstand fährt für dieses Kapitel vier Behauptungen (siehe [`12_PRUEFSTAND`](../12_PRUEFSTAND/README.md), Prüfung `farben.mjs`):

1. Außerhalb der Tokenblöcke nennt keine Deklaration einen Farbwert.
2. Kein Token heißt nach seinem Aussehen statt nach seiner Aufgabe.
3. Zwischen einem Komma in Selektorposition und dem nächsten Selektor steht kein Kommentar.
4. Jede definierte Rolle hat mindestens einen Verbraucher.

Kontrast, Kantenkontrast und Fokus werden zusätzlich am gerenderten Pixel gemessen, weil eine Rolle richtig gesetzt und ihr Ergebnis trotzdem unlesbar sein kann. Die [Prüfdoktrin](../00_SYSTEM/06-pruefdoktrin.md) erklärt, warum die Messung am Verhalten und nicht am Quelltext stattfindet.
