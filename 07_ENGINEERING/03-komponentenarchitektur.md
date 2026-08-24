# Komponentenarchitektur: Wiederverwendung mit Urteil

Komponenten sind Bausteine mit Verhalten, nicht bemalte Kästen. Eine gute Komponentenarchitektur macht wiederkehrende Regeln zuverlässig und lässt einmalige Inhaltsmomente bewusst einmalig. Zu wenig Abstraktion führt zu Drift; zu viel Abstraktion löst die Bedeutung aus dem Code.

## Drei Ebenen

**Primitive** tragen grundlegende Werte und Zustände wie Textrollen, Buttons, Links, Input, Stack, Grid oder Surface. **Muster** verbinden Primitive zu wiederkehrenden Aufgaben wie Card-Listen, Formulare, Proof-Module oder Navigation. **Kompositionen** ordnen Muster zu einer konkreten Seite und dürfen die Geschichte des Projekts sichtbar machen.

Die Ebenen verhindern, dass jede Seite ein eigenes Button-System oder jede Card eine eigene Abstandslogik entwickelt. Sie verhindern aber auch, dass eine komplexe Seite in eine undurchschaubare Universal-Komponente gezwungen wird.

## API nach Absicht

Props und Schnittstellen sollen eine fachliche Absicht ausdrücken. `intent="primary"` ist verständlicher als eine Mischung aus beliebigen Farbklassen; `status="error"` macht den Zustand explizit. Vermeide Booleans, deren Kombinationen ungültige oder unverständliche Zustände erlauben.

Varianten brauchen Grenzen. Wenn jede Komponente durch zahlreiche Flags in jede Form gebracht werden kann, ist das System nicht flexibel, sondern unentschieden. Ein neuer Bedarf ist ein Anlass, das Modell zu prüfen, nicht automatisch ein weiterer Parameter.

## Was eine Komponente von außen zulassen muss

Eine Komponente, die einen Wert als Inline-Stil schreibt, entscheidet ihn endgültig. Inline schlägt jede Klasse, und wer den Wert von außen ändern will, kommt nur noch mit einer Ausnahmeregel durch. Das ist selten beabsichtigt: Meistens war der Wert als **Standard** gemeint und nicht als Beschluss.

Der Fall, an dem das auffiel: Ein Markenzeichen bekam seine Kantenlänge als Zahl übergeben und schrieb sie inline. Als die Wortmarke daneben auf großen Bildschirmen mitwuchs, blieb das Zeichen stehen und war plötzlich zu klein für den Schriftzug. Der erste Versuch, die Zahl über eine Variable von außen zu überschreiben, änderte nichts — beide hingen am selben Element, und der Inline-Stil gewann weiterhin.

**Standard und Vorrang gehören getrennt.** Inline steht nur der Standard; der Vorrang ist eine zweite Variable, die eine gewöhnliche Klasse setzen kann, und der Wert wird als Rückfallkette gelesen. Ohne Klasse greift der Standard, mit Klasse der Vorrang, und niemand braucht eine Ausnahmeregel. Der übergebene Parameter behält dabei seine Bedeutung für alle Aufrufe, die nichts anderes wollen.

**Und eine Komponente entscheidet nur, was sie allein wissen kann.** Dieselbe Bildkomponente darf begrenzen, wie breit ein Bild höchstens dargestellt wird, denn sie kennt dessen Auflösung; wohin ein begrenztes Bild in seiner Spalte rückt, weiß sie nicht. Als sie es trotzdem entschied und mittig setzte, zerbrach das eine andere Seite, auf der ein zweites Bild absolut an der Kante des umgebenden Kastens hing. Die Grenze zwischen beidem ist die Frage, ob die Information im Gegenstand steckt oder in seiner Umgebung.

## Inhaltsrealität

Komponenten werden mit echten Überschriften, langen Namen, fehlenden Bildern, Fehlern und Übersetzungen getestet. Die visuelle Vorstellung eines idealen Inhalts ist kein ausreichend gutes API-Design. Content-Modelle müssen die erforderlichen, optionalen und abhängigen Felder klar machen.

## Dokumentation und Ownership

Jede wiederverwendbare Komponente dokumentiert Zweck, Zustände, zulässige Varianten, Accessibility-Anforderungen und Beispiele. Ownership bedeutet, dass eine Person oder ein Team die Regel pflegt und Änderungen mit betroffenen Fachrollen abstimmt. So bleibt das System ein lebendiges Werkzeug statt eines Museumskatalogs.
## Varianten mit Lebenszyklus

Eine Variante wird aufgenommen, wenn sie eine wiederkehrende fachliche Aufgabe trägt, nicht weil ein einzelner Screen eine Sonderfarbe braucht. Markiere experimentelle Varianten als solche und lege einen Prüfpunkt fest. Bleibt eine Variante nach mehreren Projekten oder Seiten bestehen, wird sie entweder systemisch dokumentiert oder entfernt. So wächst die Bibliothek langsam und verständlich.

## Testbarkeit

Komponenten werden semantisch, visuell und interaktiv getestet. Prüfe Standard, langen Inhalt, fehlende optionale Teile, Fehler, Tastatur, reduzierte Bewegung und kleine Breiten. Ein Storybook oder ähnliches Werkzeug kann Varianten sichtbar machen; es ersetzt nicht die Prüfung in der echten Seitenkomposition.

## Komposition statt Monolith

Wenn eine Komponente alle möglichen Seitenlogiken selbst kennen muss, gehört die Entscheidung wahrscheinlich in die Komposition. Eine klarere Grenze macht Inhalte verständlicher und verhindert, dass ein kleiner UI-Wunsch die API des gesamten Systems destabilisiert.
## Accessibility als API-Anforderung

Eine Komponente ist nicht wiederverwendbar, wenn sie nur visuell eingebaut werden kann. Ihre Schnittstelle muss zugängliche Labels, Fokus, Status und Fehlermeldungen erlauben. Ein Dialog ohne Rückgabe-Fokus oder ein Icon-Button ohne zugänglichen Namen ist kein vollständiges Pattern, auch wenn sein Screenshot überzeugt.

## Inhaltliche Verantwortlichkeit

Komponenten sollten nicht stillschweigend redaktionelle Entscheidungen treffen. Eine Card darf nicht selbst wichtige Texte abschneiden, ein CTA nicht automatisch aggressive Sprache einfügen und ein Formular nicht beliebige Felder als Pflicht markieren. Die Komposition oder das Content-Modell muss diese Entscheidung sichtbar besitzen.

## Migration und Abbau

Wenn ein Systemmuster ersetzt wird, dokumentiere die Migration und entferne alte Varianten in planbaren Schritten. Zwei konkurrierende Button-Systeme erzeugen nicht mehr Freiheit, sondern Unsicherheit. Ein Designsystem bleibt gesund, wenn es auch abbauen kann.
## Komponentengrenzen aus Änderungskosten

Eine gute Grenze liegt dort, wo eine Änderung eine klare Verantwortung besitzt. Wenn die Farbe eines Buttons, die Sprache eines CTA und die Datenquelle einer Card nur gemeinsam geändert werden können, ist die Grenze wahrscheinlich zu eng. Wenn jede Seite dieselbe Interaktion unabhängig neu baut, ist sie wahrscheinlich zu weit. Beurteile Grenzen anhand realer Änderungswege, nicht nur anhand visueller Ähnlichkeit.

## States und Content-Modelle

Zustände müssen mit Content-Varianten zusammen funktionieren: kein Bild, langer Titel, fehlender Preis, private Information, Fehler, Ladezustand und lokalisierter Text. Ein Pattern, das nur im vollständigen Zustand funktioniert, wird im Projektbetrieb unzuverlässig. Modell und UI sollten klar anzeigen, welche Felder erforderlich, optional oder abhängig sind.

## Versionsdisziplin

Wenn eine Komponente ihr Verhalten verändert, dokumentiere die Auswirkung auf bestehende Seiten und Tests. Eine visuelle Verbesserung kann den Fokus, die Tracking-Logik oder die Copy-Hierarchie beschädigen. Versionierung ist nicht Bürokratie; sie macht Systemänderungen überprüfbar.
## Komponente als Vertrag

Eine Komponente definiert nicht nur Props, sondern eine Erwartung: Welche Aufgabe löst sie, welche Zustände sind erlaubt, welche Inhalte passen und welche Grenzen existieren? Diese Beschreibung macht Code für Design, Content und spätere Pflege lesbar. Ohne Vertrag wird Wiederverwendung zur optischen Nachahmung.

## Systemgesundheit

Beobachte, welche Varianten tatsächlich verwendet werden, welche regelmäßig Sonderlogik benötigen und welche zu Missverständnissen führen. Ein System wird besser, wenn es alte Muster aktiv abbaut und nicht nur neue hinzufügt. Ownership und Entscheidungseinträge machen diese Entwicklung nachvollziehbar.
