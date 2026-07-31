# Vorlage: Design- und Engineering-Handoff

Ein Handoff ist keine Übergabe von Screenshots. Es ist die Übergabe der Entscheidungen, die aus Strategie, UX, Copy und visueller Gestaltung eine wartbare Implementierung machen. Das Dokument hilft einem Team, die Absicht zu erhalten, ohne die ursprüngliche Autorin oder den ursprünglichen Autor fragen zu müssen.

## Systemquelle

Verlinke Design Tokens, Komponenten, Seitenmodelle, Content-Quelle, Asset-Verzeichnis, Entscheidungseinträge und offene Risiken. Benenne, welche Datei oder welches System die jeweils verbindliche Quelle besitzt. Doppelte Werte werden entfernt oder ausdrücklich als abgeleitete Darstellung markiert.

## Verhalten und Zustände

Dokumentiere Standard, Hover, Fokus, aktiv, loading, Erfolg, Fehler, leer, deaktiviert und responsive Varianten. Beschreibe, welche Rückmeldung die Person erwartet und wie Fokus oder Scroll nach einer Aktion behandelt werden. Ein Screenshot kann Zustände zeigen, aber nicht ihre Reihenfolge oder ihre Zugänglichkeit.

## Inhalte und Medien

Übergib echte Texte, Alternativtexte, Bildquellen, Rechte, Zuschnittregeln und Varianten. Markiere, welche Inhalte redaktionell gepflegt werden und welche aus Daten oder Integrationen kommen. Ein Platzhalterbild oder Lorem Ipsum darf nicht als Beweis dienen, dass das Layout belastbar ist.

## Technische Grenzen

Notiere Performance-Budgets, Drittanbieter, Browser- und Geräteannahmen, progressive Fallbacks, Datenschutz, SEO-Anforderungen und bekannte Kompromisse. Wenn ein Effekt nur optional ist, muss die statische Version benannt sein. Verlinke [Accessibility und Animation](../07_ENGINEERING/04-accessibility-und-animation.md) und [Performance](../06_SEO/04-performance-und-core-web-vitals.md).

## Tests und Freigabe

Definiere pro kritischem Weg den Test: visuell, semantisch, interaktiv, responsiv, performant, SEO oder redaktionell. Nenne Testumgebung, erwartetes Ergebnis und verantwortliche Rolle. Handoff gilt als abgeschlossen, wenn Build, Inhalt und Betrieb dieselbe Logik verstehen und bekannte Abweichungen dokumentiert sind.
## Gemeinsame Lesung

Das Handoff wird in einem kurzen gemeinsamen Durchgang gelesen. Design erklärt Absicht und Priorität. Copy erklärt Bedeutungen, Varianten und Grenzen. Engineering erklärt Zustände, Performance und Integrationen. Redaktion oder Kunde bestätigen Quellen und Pflege. Missverständnisse werden dabei als Systemfehler behandelt, nicht als spätere Überraschung.

## Unterschied zwischen Referenz und Vorgabe

Ein Screenshot zeigt eine Referenz, aber nicht automatisch eine Pflicht. Markiere, welche Aspekte verbindlich sind: Hierarchie, Typografie, CTA-Rolle, Abstand, Zustand oder Bewegung. Alles andere bleibt eine mögliche Ausdrucksform. Diese Unterscheidung schützt Engineering vor Pixelkopie und Design vor unerwarteten Interpretationen.

## Abnahme nach Verhalten

Die finale Freigabe erfolgt am funktionierenden Weg. Prüfe nicht nur, ob der Screenshot ähnlich aussieht, sondern ob Menschen die richtige Information finden, handeln, einen Fehler korrigieren und den Zustand verstehen können. Wenn die Implementierung eine visuelle Abweichung braucht, wird bewertet, ob die Absicht erhalten bleibt. Das ist eine fachliche Entscheidung und kein reiner Vergleich von Bildern.
## Inhaltsvarianten

Dokumentiere neben dem Idealzustand auch lange Überschriften, fehlende Medien, leere Listen, Fehler, mehrere Sprachen und ungewöhnliche Namen. Diese Varianten zeigen, ob das System eine echte redaktionelle Zukunft trägt. Wenn eine Variante bewusst nicht unterstützt wird, wird der Grund benannt und ein sicherer Umgang definiert.

## Performance als Designparameter

Notiere, welche Medien priorisiert, verzögert, komprimiert oder statisch ersetzt werden. Ein Handoff, das nur visuelle Größe beschreibt, überlässt Performance dem Zufall. Für jede große Fläche wird entschieden, ob sie Bedeutung trägt und welches Gewicht sie unter realen Bedingungen rechtfertigt. Drittanbieter werden als eigene Assets mit Kosten und Fallback behandelt.

## Pflege und Ownership

Für Tokens, Komponenten, Content, Assets, SEO und Integrationen werden Besitzer genannt. Ownership bedeutet nicht, dass eine Person jede Änderung selbst macht. Sie sorgt dafür, dass die Regel gepflegt, geprüft und bei Konflikten entschieden wird. Dadurch kann das System weiterleben, ohne dass jede Änderung die ursprüngliche Agentur benötigt.
## Handoff als Vertrag

Ein gutes Handoff beschreibt nicht nur, was gebaut wird, sondern auch, was nicht gebaut werden soll. Benenne bewusste Grenzen bei Varianten, Bewegung, Content und Drittanbietern. Diese Negativdefinitionen verhindern, dass spätere Wünsche aus Unklarheit in das System gelangen und dessen Priorität zerstören.

## Änderungsprozess

Nach dem Handoff werden Änderungen an Komponenten, Content-Modellen oder Token über ein kleines Review geführt. Ein einzelner Fix darf die Grundregel nicht still verändern. Wenn die Änderung wiederkehrt, wird sie als systemische Regel dokumentiert; wenn sie einmalig bleibt, wird ihre Ausnahme begründet.
## Fragen für den Empfänger

Der Empfänger sollte erklären können, welches Problem jede wichtige Komponente löst, welche Variante die Standardvariante ist und wo die Grenzen liegen. Wenn eine Übergabe nur durch ihren Urheber verständlich wird, fehlt ihr eine Ebene. Ergänze Beispiele für eine Änderung, einen Fehlerfall und eine redaktionelle Aktualisierung.
## Übergabe an Pflege

Zeige an einem realen Beispiel, wie eine Überschrift, ein Bild, eine Öffnungszeit und ein FAQ geändert werden. Dokumentiere, wann Design oder Engineering eingebunden werden müssen. Ein Handoff ist erst vollständig, wenn die sichere kleine Änderung ebenso verständlich ist wie der ursprüngliche Build.
## Kleiner Praxistest

Lass eine Person aus dem Umsetzungsteam eine kleine Textänderung, eine neue Card und einen Formularfehler anhand des Handoffs durchführen. Beobachte, wo sie raten muss. Jede Rückfrage zeigt eine fehlende Regel, Quelle oder Grenze und wird vor der finalen Übergabe ergänzt.
