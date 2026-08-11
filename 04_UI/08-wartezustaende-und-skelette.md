# Wartezustände: Was zwischen Klick und Inhalt zu sehen ist

Zwischen dem Moment, in dem jemand etwas auslöst, und dem Moment, in dem der Inhalt dasteht, liegt eine Zeitspanne. Sie wird selten gestaltet, weil sie beim Entwickeln fast nicht existiert: auf einem schnellen Rechner im lokalen Netz ist sie vierzig Millisekunden lang und damit unsichtbar. Beim Besucher im Zug ist sie zwei Sekunden lang, und in diesen zwei Sekunden entscheidet sich, ob er die Seite für kaputt hält.

Dieses Kapitel legt fest, was in dieser Zeitspanne zu sehen ist, wann ein Skelett die richtige Antwort darauf ist und wann es eine Lüge über das System erzählt.

## Das Problem

Ohne Entscheidung entsteht einer von drei Zuständen, und alle drei sind schlecht.

**Nichts.** Die Fläche bleibt leer, bis der Inhalt kommt. Der Besucher kann nicht unterscheiden, ob geladen wird, ob nichts da ist oder ob etwas kaputtgegangen ist. Er wartet nicht, weil er nicht weiß, dass er wartet. Er klickt noch einmal oder geht zurück.

**Ein Kreisel.** Ein rotierendes Symbol sagt „warte", aber nicht worauf und nicht wie lange. Es ist inhaltlich leer und ersetzt die Fläche durch ein Symbol, das sich an einer anderen Stelle befindet als der spätere Inhalt. Wenn der Inhalt kommt, springt das Layout.

**Der Sprung.** Der Inhalt erscheint ohne Vorbereitung und schiebt weg, was schon dagestanden hat. Wer in diesem Moment auf einen Link zielt, trifft einen anderen. Das ist nicht nur unangenehm, es ist die Ursache für einen messbaren Wert: Layoutverschiebung ist Teil der [Core Web Vitals](../06_SEO/04-performance-und-core-web-vitals.md), und sie entsteht fast immer genau hier.

Alle drei entstehen nicht aus Nachlässigkeit, sondern daraus, dass die Zeitspanne beim Bauen unsichtbar ist. Sie ist der Zwilling des Problems aus [Das Handy ist nicht die kleine Fassung](07-handy-zuerst-und-gemessen.md): Was am Entwicklerrechner nicht vorkommt, wird nicht gestaltet.

## Vier Zustände, nicht zwei

Jede Fläche, deren Inhalt nach dem ersten Bild eintrifft, hat vier mögliche Zustände, und alle vier werden gebaut, bevor der erste davon aussieht wie fertig.

**Es lädt.** Etwas ist unterwegs und wird ankommen. Hier steht das Skelett.

**Es ist da.** Der Inhalt, in der Geometrie, die das Skelett versprochen hat.

**Es ist leer.** Die Anfrage war erfolgreich, und die Antwort enthält nichts. Keine freien Termine, keine Bewertungen, keine Treffer für diesen Filter. Das ist ein Ergebnis und kein Fehler, und es braucht einen Satz, der sagt, was jetzt möglich ist.

**Es ist schiefgegangen.** Die Anfrage kam nicht durch. Der Besucher braucht die Information, dass es an der Verbindung und nicht an ihm lag, und einen Weg weiter: erneut versuchen, oder die Rufnummer, die ohne diesen Dienst funktioniert.

Der dritte und der vierte Zustand werden am häufigsten vergessen, und ihr Fehlen hat dieselbe Folge: Das Skelett bleibt stehen. Ein Besucher, dem ein Ladezustand ohne Ausgang angezeigt wird, wartet auf etwas, das nie kommt. Ein Skelett ohne gebauten Fehlerausgang ist deshalb kein halbfertiger Zustand, sondern ein defekter.

## Wann ein Skelett richtig ist und wann es lügt

Ein Skelett gehört an eine Fläche, deren Inhalt tatsächlich später eintrifft. Das sind in einem VELLOX-Projekt wenige, klar benennbare Stellen: ein eingebundener Terminkalender, eine Karte, eine gefilterte Liste, die Antwort nach dem Absenden eines Formulars, ein Bewertungsmodul eines Drittanbieters.

Es gehört nicht an eine Fläche, deren Inhalt schon im ausgelieferten Dokument steht. Der VELLOX-Standard baut statisch, und statischer Inhalt lädt nicht. Ein Skelett davor zeigt einen Ladevorgang, den es nicht gibt, kostet Zeit, um sich selbst wieder zu entfernen, und ist genau das, wovor der [Anti-Template-Standard](../00_SYSTEM/05-anti-template-standard.md) warnt: eine Komponente, die beschäftigt aussieht, ohne eine Aufgabe zu haben.

Die Prüffrage ist deshalb nicht „hätte diese Fläche gern ein Skelett", sondern: **Gibt es einen Moment, in dem diese Fläche im Dokument existiert und ihr Inhalt noch nicht?** Wenn nein, ist jedes Skelett dort Dekoration.

Es lügt außerdem, wenn die Wartezeit lang ist. Ein Skelett verspricht, dass gleich etwas kommt. Bei einem Vorgang, der zehn Sekunden oder länger dauert, ist dieses Versprechen falsch, und der Besucher hat nach der dritten Sekunde keinen Grund mehr, es zu glauben. Dann braucht die Stelle einen Fortschritt, eine Angabe zur Dauer oder eine Erklärung, was gerade passiert. Ein Skelett ist die richtige Form für kurze Wartezeiten, nicht für alle.

## Ein Skelett ist ein Versprechen über die Geometrie

Ein Skelett hat genau eine Aufgabe, die ein Kreisel nicht erfüllen kann: Es reserviert den Platz des späteren Inhalts, damit nichts springt.

Daraus folgt die Regel, an der die meisten Skelette scheitern. **Die Maße des Skeletts werden nicht gezeichnet, sondern abgeleitet.** Wer drei graue Balken von Hand baut, weil die Liste heute drei Einträge hat, hat eine zweite Wahrheit über die Höhe angelegt. Sie stimmt bis zum ersten Mal, an dem die Liste vier Einträge hat oder die Karte eine Zeile mehr trägt, und danach springt es wieder, nur unbemerkt, weil die Regel als erfüllt gilt.

Belastbar ist das Skelett, das aus derselben Quelle kommt wie der Inhalt: dieselbe Komponente, dieselben Abstands- und Typografie-Rollen, dieselbe Zeilenhöhe, dieselbe Anzahl erwarteter Einträge. Ein Skelett, das nur Text durch Fläche ersetzt und alles andere behält, kann nicht auseinanderlaufen, weil es dieselbe Berechnung durchläuft.

Wenn die Höhe des Inhalts unbekannt ist, weil die Anzahl der Einträge erst mit der Antwort feststeht, wird das Problem eine Ebene höher gelöst: eine feste Anzahl Plätze, ein Bereich mit eigener Scrollfläche oder ein Nachladen unterhalb des sichtbaren Bereichs. Ein Skelett kann eine unbekannte Höhe nicht retten. Es kann nur eine bekannte reservieren.

## Die Zeitgrenzen

Die Grenzen menschlicher Wahrnehmung bei Antwortzeiten sind seit Miller 1968 stabil und werden üblicherweise als drei Werte zusammengefasst: etwa 0,1 Sekunden fühlen sich unmittelbar an, etwa 1 Sekunde hält den Gedankengang zusammen, etwa 10 Sekunden sind die Grenze der Aufmerksamkeit. Für Wartezustände folgen daraus zwei Entscheidungen.

**Unterhalb einer Sekunde ist ein Skelett schädlich.** Es erscheint und verschwindet, bevor es gelesen ist, und hinterlässt ein Flackern, das unruhiger wirkt als die Wartezeit selbst. Deshalb wird das Skelett nicht sofort gezeigt, sondern nach einer kurzen Verzögerung, und wenn es einmal sichtbar ist, bleibt es lange genug stehen, um als Zustand und nicht als Störung wahrgenommen zu werden. VELLOX setzt dafür 200 Millisekunden Verzögerung und 400 Millisekunden Mindeststandzeit an. Beide Zahlen sind Konvention und keine Naturkonstante; sie sind der Punkt, an dem das Flackern in unserer Messung verschwindet, und sie dürfen mit einer Messung geändert werden.

**Oberhalb von zehn Sekunden ist ein Skelett falsch**, aus dem im vorigen Abschnitt genannten Grund. Dazwischen liegt sein Anwendungsbereich.

## Ein Skelett ist kein leerer Zustand

Diese beiden werden regelmäßig verwechselt, und die Verwechslung kostet den Besucher die meiste Zeit.

Ein Skelett sagt: *hier kommt etwas.* Ein leerer Zustand sagt: *hier ist nichts, und das ist die Antwort.* Wer den leeren Zustand als dauerhaftes Skelett darstellt, lässt jemanden auf einen Inhalt warten, den es nicht gibt.

[Erstauslieferung](../00_SYSTEM/07-erstauslieferung.md) verlangt, jeden Abschnitt zuerst für den leeren Fall zu bauen, weil bei der ersten Auslieferung die meisten Inhalte fehlen. Diese Regel gilt hier unverändert und zusätzlich: Der leere Fall ist ein eigener Zustand mit eigenem Text, nicht das Skelett, das nie aufhört.

## Was ein Screenreader von einem grauen Rechteck hat

Nichts. Ein Skelett ist eine rein visuelle Auskunft, und ohne Ergänzung ist die Fläche für jemanden, der sie nicht sieht, schlicht leer.

Der Bereich wird deshalb während des Ladens als beschäftigt ausgezeichnet, und der Wechsel der Zustände wird in einer höflichen Live-Region angekündigt: dass geladen wird, dass Ergebnisse da sind und wie viele, dass nichts gefunden wurde, dass es fehlgeschlagen ist. Die Platzhalterflächen selbst tragen keinen Text und werden vor der Vorlesereihenfolge verborgen, weil eine Folge bedeutungsloser Elemente schlechter ist als keine.

Die Bewegung, mit der Skelette üblicherweise ein Schimmern zeigen, ist Dekoration und untersteht denselben Regeln wie jede andere Bewegung in [Accessibility und Animation](../07_ENGINEERING/04-accessibility-und-animation.md). Sie respektiert die Präferenz für reduzierte Bewegung, und sie ist nie das einzige Signal dafür, dass geladen wird.

## Wo diese Regeln wohnen

Nach [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md) gehört jede prüfbare Regel so weit oben wie möglich.

Auf **Stufe 1** gehört die Vollständigkeit der Zustände. Ein Zustandsmodell, das die vier Fälle als unterscheidbare Varianten führt statt als Kombination von Wahrheitswerten, macht den vergessenen Fehlerausgang unmöglich: Wer einen Fall nicht behandelt, bekommt keinen leeren Bereich, sondern einen Typfehler. Zwei Wahrheitswerte `laedt` und `fehler` erlauben dagegen vier Kombinationen, von denen zwei keinen Sinn ergeben, und genau in einer davon bleibt das Skelett stehen.

Auf **Stufe 2** gehört die Herkunft der Maße. Ein Skelett, das eigene Zahlen für Höhe, Abstand oder Zeilenhöhe trägt, statt sie aus derselben Quelle zu beziehen wie der Inhalt, bricht den Bau ab.

Auf **Stufe 4** bleibt das Urteil darüber, ob eine Stelle überhaupt eines braucht, und die Messung am gedrosselten Netz. Der Code als übernehmbare Vorlage steht in [`09_TEMPLATES/05-qualitaetsgates.md`](../09_TEMPLATES/05-qualitaetsgates.md), Abschnitt 13.

## Die Messung

Ein Wartezustand wird nicht am Entwicklerrechner beurteilt, weil er dort nicht vorkommt. Er wird mit gedrosselter Verbindung geprüft, mit der Drosselung, die den langsamsten realistischen Fall des Projekts abbildet, und mit abgeschaltetem Zwischenspeicher.

Je asynchroner Fläche werden vier Beobachtungen notiert:

| Beobachtung | Befund ab |
| --- | --- |
| Zeit bis zum ersten sichtbaren Zustand | über 1 Sekunde ohne Skelett |
| Layoutverschiebung beim Eintreffen des Inhalts | jede sichtbare Bewegung |
| Fehlerausgang erreichbar | fehlt |
| Leerer Fall unterscheidbar vom Ladezustand | nicht unterscheidbar |

Der zweite Punkt ist der wichtigste und der einzige, der sich ohne Werkzeug prüfen lässt: Netz drosseln, Seite laden, auf die Fläche schauen. Wenn sich beim Eintreffen des Inhalts etwas bewegt, hat das Skelett seine einzige Aufgabe nicht erfüllt.

## Verhältnis zu den anderen Kapiteln

Die [Komponentenarchitektur](../07_ENGINEERING/03-komponentenarchitektur.md) verlangt, dass Zustände Teil der Schnittstelle sind; dieses Kapitel sagt, welche vier es mindestens sind und wie sie aussehen. [Performance und Core Web Vitals](../06_SEO/04-performance-und-core-web-vitals.md) misst die Folge eines fehlenden Skeletts als Layoutverschiebung. [Erstauslieferung](../00_SYSTEM/07-erstauslieferung.md) trennt den leeren Fall vom Wartefall. Die [Motion Language](../02_BRANDING/03-motion-language.md) entscheidet, ob das Schimmern zur Marke gehört, und in den meisten Fällen lautet die Antwort, dass eine ruhige Fläche genügt.
