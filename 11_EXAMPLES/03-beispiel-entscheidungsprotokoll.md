# Beispiel: Entscheidungsprotokoll

Dieses Beispiel zeigt, wie eine kontroverse Designentscheidung im SAPHIRWEB-Format dokumentiert wird. Die Frage betrifft eine lokale Handwerkswebsite, könnte aber in jeder Branche auftreten: Soll der Hero ein vollflächiges Video zeigen oder ein statisches Projektbild?

## Frage

Welche Einstiegsdarstellung lässt Menschen schneller erkennen, dass Werkraum Süd individuelle Innenausbauten plant und umsetzt, ohne die handwerkliche Atmosphäre zu verlieren?

## Evidenz

Die Discovery-Gespräche zeigen, dass Kunden die ruhige Abstimmung und die Detailqualität erinnern. Die bisherige Website wird als „schön, aber unklar“ beschrieben. Mobile Aufrufe sind häufig, und viele Besucher suchen während einer konkreten Projektplanung. Es gibt Videomaterial aus der Werkstatt, aber keine systematische Produktion für alle Geräte.

## Annahmen

Wir vermuten, dass Bewegung Atmosphäre erzeugen kann, aber die konkrete Leistungsbotschaft verzögert. Wir vermuten außerdem, dass ein Video auf schwächeren Geräten Gewicht und Aufmerksamkeit kostet. Diese Annahmen sind nicht beweisen, solange keine Tests vorliegen.

## Optionen

**Video zuerst** zeigt Werkstatt, Material und Hände in Bewegung. Es könnte Nähe und Handwerk vermitteln, birgt aber das Risiko einer langsamen, stimmungsvollen und inhaltlich offenen Eröffnung.

**Statisches Projektbild** zeigt einen realen Raum mit einer klaren Headline und kurzer Einordnung. Es ist schneller, leichter kontrollierbar und kann als Beweis dienen, wirkt aber weniger unmittelbar atmosphärisch.

**Split-Einstieg** verbindet ein stilles Bild mit einem kleinen, optionalen Bewegungsmoment darunter. Er bewahrt die klare Botschaft, braucht aber ein gutes Zusammenspiel von Layout und Fallback.

## Kriterien und Entscheidung

Relevanz und Verständlichkeit werden höher gewichtet als atmosphärische Intensität, weil der aktuelle Hauptschaden in unklarer Einordnung liegt. Vertrauen und Performance sind gleichrangig mit Charakter. Wir wählen den statischen Projektbild-Einstieg und erlauben eine kleine, progressive Bewegung erst nach der ersten Orientierung.

## Risiko und Test

Das Risiko ist, dass die Seite weniger lebendig wirkt. Wir prüfen dies mit fünf kurzen Verständnisgesprächen, einem mobilen Prototyp und einer Produktionsmessung mit echten Bildern. Das Team fragt nicht nur, welche Variante gefällt, sondern welche Leistung, Situation und Qualität erinnert werden.

## Umsetzung

Die Headline benennt Situation und Ergebnis. Das Bild zeigt einen echten Einbau im Raum, nicht nur ein Detail. Unterhalb des ersten CTA folgt ein kurzer Werkstattmoment mit reduzierter Bewegung und statischem Fallback. Der Performance-Check prüft Bildgewicht, LCP, Layoutstabilität und reduzierte Bewegung. Das Asset-Register dokumentiert Quelle und Rechte.

## Revisionstrigger

Die Entscheidung wird überprüft, wenn neue echte Videoinhalte eine relevante Prozessinformation tragen, wenn Besucher weiterhin fehlende Atmosphäre nennen oder wenn das statische Bild die Positionierung nicht ausreichend unterscheidet. Ein Trend zu Video allein ist kein Revisionstrigger. Neue Evidenz muss die Entscheidung berühren.
## Warum dieses Protokoll nützlich ist

Das Team kann später nachvollziehen, dass Video nicht grundsätzlich abgelehnt wurde. Es wurde für den Einstieg zurückgestellt, weil Klarheit, Performance und reale Nutzung in diesem Moment höher gewichtet wurden. Eine andere Seite oder ein anderer Kunde könnte mit derselben Option zu einer anderen Entscheidung kommen, wenn die Situation, die Zielgruppe oder die Evidenz anders ist.

Das Protokoll schützt auch vor einer häufigen Rückwärtsbewegung: Wenn später jemand ein Video fordert, muss die alte Diskussion nicht neu geführt werden. Die Frage lautet, ob neue Evidenz eines der damaligen Kriterien verändert. Dadurch wird Revision möglich, ohne dass das System beliebig wird.

## Übertragung in Code und Review

Engineering erhält aus der Entscheidung konkrete Anforderungen: statischer Fallback, begrenztes Gewicht, reduzierte Bewegung, keine Abhängigkeit der Kernbotschaft von JavaScript und dokumentierte Asset-Quelle. Design erhält die Aufgabe, Atmosphäre nach der Einordnung anzubieten. Copy erhält die Aufgabe, die Leistung im ersten Blick zu benennen. Ein gutes Protokoll verbindet diese Rollen, statt nur das Ergebnis zu archivieren.
## Alternative bei verändertem Kontext

Wenn Werkraum Süd künftig sehr häufig über bewegte Werkstattinhalte gefunden wird und die Videoproduktion zuverlässig verfügbar ist, könnte die Entscheidung neu bewertet werden. Dann wäre zu prüfen, ob der Film eine relevante Arbeitsweise zeigt oder nur Stimmung. Auch in der neuen Situation blieben statischer Fallback, Klarheit, Performance und reduzierte Bewegung verbindlich.

## Lernwert

Das Protokoll zeigt, dass ein Nein zu einer beliebten Form kein Nein zu Charakter ist. Charakter kann auch durch Auswahl, Detail, Rhythmus und bewusste Begrenzung entstehen. Ein System wird stärker, wenn es erklären kann, warum ein Effekt an einer Stelle sinnvoll und an einer anderen Stelle unnötig ist.
## Review des Ergebnisses

Nach der Umsetzung wird die Entscheidung nicht nur über ein Video- oder Bildgefühl bewertet. Das Team prüft Verständlichkeit, erinnerte Leistung, Atmosphäre, mobile Ladezeit, Bewegungspräferenz und Qualität der Anfragen. So bleibt die ursprüngliche Begründung mit dem späteren Ergebnis verbunden und kann entweder bestätigt oder sinnvoll revidiert werden.
## Kommunikation an den Kunden

Die Entscheidung wird nicht als „Video war zu teuer“ präsentiert, sondern als Priorisierung für Klarheit, Geschwindigkeit und echte Nutzung. Der Kunde sieht, dass Atmosphäre weiterhin möglich ist, aber an einer Stelle erscheint, an der sie die Aussage unterstützt. Diese Erklärung schafft Vertrauen, weil sie weder den Wunsch abwertet noch die technische Konsequenz verschweigt.
