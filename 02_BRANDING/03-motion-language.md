# Motion Language: Bewegung, die Orientierung trägt

Bewegung ist ein Teil der Markenstimme, weil sie beeinflusst, wie eine Oberfläche sich anfühlt: ruhig, präzise, energetisch, spielerisch oder direkt. Sie darf jedoch nie nur beweisen, dass ein Browser animieren kann. Gute Motion macht eine Veränderung verständlich, lenkt Aufmerksamkeit zum richtigen Zeitpunkt oder gibt einer Handlung eine erkennbare Rückmeldung.

## Drei Aufgaben von Bewegung

**Orientieren:** Wenn ein Element erscheint, verschiebt oder seinen Zustand ändert, kann Bewegung die Beziehung zwischen vorher und nachher erklären. Ein Menü gleitet aus einer klaren Quelle, ein Accordion zeigt, welcher Inhalt geöffnet wurde, ein Formular markiert die nächste Stelle.

**Gewichten:** Eine kurze, kontrollierte Bewegung kann einen relevanten Moment markieren. Sie sollte die vorhandene Hierarchie verstärken, nicht eine neue Konkurrenz um Aufmerksamkeit eröffnen. Wenn jedes Element eintritt, verliert die Seite ihren Schwerpunkt.

**Bestätigen:** Klick, Auswahl, Speichern und Fehler brauchen eine wahrnehmbare Rückmeldung. Bewegungslose Zustandsänderungen können übersehen werden; übertriebene Effekte lassen eine einfache Handlung langsam wirken.

## Rhythmus statt Spektakel

Motion wird durch Dauer, Verzögerung, Easing, Distanz und Wiederholung beschrieben. Ein System sollte wenige Rhythmusfamilien besitzen: eine direkte Bewegung für Zustandswechsel, eine weichere für räumliche Übergänge und möglicherweise eine charaktervolle Bewegung für seltene Markenmomente. Zu viele Kurven oder individuelle Dauern machen die Oberfläche unvorhersehbar.

Die Dauer muss zur Aufgabe passen. Kleine Interaktionen dürfen direkt sein; größere räumliche Veränderungen brauchen genug Zeit, um die Beziehung zu erklären, aber nicht so viel, dass Menschen warten. Teste Motion mit realen Textlängen und auf schwächeren Geräten. Eine Bewegung, die im Prototyp elegant ist, kann in der Implementierung zur Verzögerung werden.

## Dramaturgie der Seite

Nicht jede Seite braucht denselben Bewegungsgrad. Ein erster Auftritt darf eine ruhige Einordnung erhalten, während ein langer Prozess fast unbewegt bleibt, damit Inhalte zuverlässig lesbar sind. Eine Marke mit hoher Energie kann Rhythmus über Bildwechsel, Scrolltempo oder Mikroreaktionen ausdrücken, ohne den Hauptinhalt zu zerlegen.

Motion folgt der Informationsarchitektur. Wenn ein Nutzer zwischen zwei Zuständen navigiert, muss die Bewegung den Wechsel erklären. Wenn ein Abschnitt nur dekorativ einfliegt, sollte der Nutzen kritisch geprüft werden. Das [UX-Kapitel zur Aufmerksamkeit](../03_UX/03-storytelling-und-aufmerksamkeit.md) ist dafür der fachliche Bezugspunkt.

## Zugänglichkeit und Fallback

Jede bedeutsame Information muss ohne Bewegung verständlich sein. Berücksichtige reduzierte Bewegungspräferenzen, Fokusführung, Tastaturbedienung und das Verhalten bei deaktiviertem JavaScript. Bewegung darf nicht der einzige Hinweis auf Erfolg, Fehler, Fortschritt oder Reihenfolge sein.

Ein Fallback ist nicht automatisch eine schlechtere Version. Oft wird die Seite ruhiger und schneller, wenn die Funktion durch einen statischen Zustand oder eine einfache Überblendung erhalten bleibt. Engineering und Design definieren zusammen, welche Bewegung optional ist und welche Rückmeldung zwingend bleibt. Verweise dazu auf [`07_ENGINEERING/04-accessibility-und-animation.md`](../07_ENGINEERING/04-accessibility-und-animation.md).

## Motion prüfen

Im Review werden vier Fragen gestellt: Welchen Zustand oder Zusammenhang erklärt die Bewegung? Unterstützt sie die primäre Aufmerksamkeit? Wie verhält sie sich bei wiederholter Nutzung? Funktioniert die Aufgabe ohne sie und unter reduzierter Bewegung? Wenn die Antwort nur lautet, dass die Seite dadurch „lebendiger“ wirkt, ist die Begründung noch nicht ausreichend.
## Bewegung als Markenversprechen

Die Bewegungsart sollte eine Eigenschaft der Marke verstärken. Direkte, kurze Übergänge können Präzision und Entschlossenheit tragen. Ein etwas weicherer Rhythmus kann Fürsorge, Materialität oder Offenheit unterstützen. Diese Zuordnung ist keine psychologische Garantie; sie wird durch Inhalt, Farbe und Interaktion bestätigt oder widerlegt.

Definiere auch, wann die Marke bewusst still bleibt. Ein ernster Hinweis, ein sensibles Formular oder ein langer Lesetext braucht oft weniger Bewegung als ein Einstieg oder eine erfolgreiche Abschlussbestätigung. Stille wird dadurch zu einer aktiven Entscheidung und nicht zu einem fehlenden Effekt.

## Technische Belastbarkeit

Motion wird mit Produktionsinhalten, reduzierter Bewegung, langsamer Hardware und Unterbrechungen getestet. Animationen dürfen nicht auf einen bestimmten Scrollweg oder eine perfekte Framerate angewiesen sein. Wenn eine Bewegung ausfällt, bleibt die Information bestehen und die Interaktion behält ihren Zustand. Diese Robustheit macht die Marke auch dann souverän, wenn die ideale Präsentation nicht verfügbar ist.
## Übergabe an Content und Engineering

Motion Language wird nicht nur im Prototyp erklärt. Benenne, welche Bewegungen redaktionelle Zustände begleiten, welche durch Komponenten getragen werden und welche nur in besonderen Markenmomenten vorkommen. Content muss wissen, ob ein neuer Abschnitt Bewegung braucht; Engineering muss wissen, welche Rückmeldung auch ohne Bewegung bestehen muss.

## Alterung vermeiden

Ein Effekt, der beim ersten Besuch auffällt, kann bei täglicher Nutzung stören. Prüfe Wiederholung, Wartegefühl und reduzierte Bewegung. Premium entsteht durch eine Form, die auch nach vielen Besuchen ruhig und bedeutungsvoll bleibt.
## Motion ohne Markenverlust

Wenn eine Marke auf Bewegung angewiesen ist, um lebendig zu wirken, besitzt ihre visuelle Sprache wahrscheinlich noch zu wenig Substanz in Typografie, Bild, Rhythmus oder Interaktion. Motion darf den Charakter verfeinern. Sie sollte ihn nicht allein tragen. Eine gute reduzierte Fassung bleibt deshalb als eigenständige Marke erkennbar.
