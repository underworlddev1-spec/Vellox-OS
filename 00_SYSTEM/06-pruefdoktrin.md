# Prüfdoktrin: Wie aus einer Regel ein Nachweis wird

VELLOX beschreibt Qualität als Eigenschaft von Entscheidungen, die über ein ganzes Projekt konsistent bleiben. Dieses Kapitel beantwortet die Frage, die dabei offen bleibt: Woran erkennt ein Team, dass eine Entscheidung noch gilt, nachdem dreißig weitere getroffen wurden?

Die Antwort ist unbequem. Sie lautet nicht „durch Sorgfalt“ und nicht „durch Review“. Sorgfalt und Review finden, was jemand gerade ansieht. Eine Regel bricht aber selten dort, wo jemand hinsieht. Sie bricht an der Stelle, die drei Wochen später jemand anderes anfasst, unter Termindruck, mit einem Argument, das im Moment richtig klingt.

## Eine Regel ohne Test ist eine Absichtserklärung

Absichtserklärungen halten genau bis zum nächsten Termindruck. Das ist keine Behauptung über die Disziplin von Teams, sondern eine Beobachtung, die sich in diesem Repository selbst nachweisen lässt.

Der [Anti-Template-Standard](05-anti-template-standard.md) verbietet Gedankenstriche als Stilmittel in Copy, Dokumentation und Interface-Texten. Die Regel ist begründet, sie ist verbindlich, und sie steht seit der ersten Fassung im System. Zum Zeitpunkt der Aufnahme dieses Kapitels standen vier davon im Repository, drei davon im jüngsten Fachkapitel. Die neueste Prosa brach die älteste Regel, und niemandem fiel es auf, weil nichts es messen konnte.

Daraus folgt die Grundregel dieses Kapitels: **Jede Regel in VELLOX OS und in jedem Projekt nennt ihren Nachweis.** Wenn sich kein Nachweis formulieren lässt, ist der Satz keine Regel, sondern eine Entscheidung. Entscheidungen gehören in das Entscheidungsprotokoll des Projekts, wo sie mit Datum und Begründung stehen und jederzeit revidierbar sind. Regeln gehören in das Regelwerk, und dort trägt jede von ihnen den Namen der Prüfung, die sie schützt.

## Was ein Gate ist

Ein Gate ist ein Programm, das gegen das ausgelieferte Verhalten läuft und mit einem Rückgabewert ungleich null endet, sobald es einen Befund hat. Drei Eigenschaften machen es zu einem Gate, und alle drei sind notwendig.

**Es misst das Verhalten, nicht die Absicht.** Ein Gate startet den Browser und zählt, was tatsächlich passiert ist. Es liest nicht den Quelltext und schließt daraus auf das Ergebnis. Der Unterschied ist nicht akademisch: Ein Wert, der im Stylesheet richtig steht, kann durch eine Kaskade, eine Medienabfrage oder eine Verschachtelung an der Seite nie ankommen. Für Regeln über den Quelltext selbst, etwa das Verbot von Farbliteralen, gilt die Ausnahme, dass der Quelltext der Gegenstand ist.

**Es scheitert, statt zu melden.** Eine Prüfung, die ihren Befund ausgibt und mit null endet, läuft im Zweifel jahrelang mit, ohne etwas zu verhindern. In dem Projekt, aus dem dieses Kapitel stammt, war das bei sieben von achtzehn Skripten der Fall. Sie waren nicht falsch geschrieben. Sie waren wirkungslos.

**Es steht in einer Liste.** Ein Skript, das in keiner Tabelle und in keinem Läufer steht, fährt niemand mit. In demselben Projekt stürzte eine Prüfung bei jedem Lauf ab, weil sie eine Zeile las, die es im Markup nicht mehr gab. Aufgefallen ist das erst, als jemand die Skripte zählte.

## Die vier Fassungen einer Prüfung, die nicht prüft

Die dritte Fassung ist die gefährlichste, weil sie sich wie Erfolg anfühlt.

**Sie meldet nur.** Rückgabewert null trotz Befund. Erkennbar am Code, behebbar in einer Zeile.

**Sie läuft gar nicht.** Ein Absturz ist kein Ergebnis. Wer eine Prüfung ergänzt, trägt sie in die Liste ein und prüft, dass der Läufer sie wirklich startet.

**Sie läuft, meldet grün und prüft nichts.** Ein Skript stieg durch ein Stylesheet und behandelte jede Regel mit einer nicht leeren `cssRules`-Liste als Gruppe. Seit CSS Verschachtelung kennt, hat auch eine gewöhnliche Stilregel eine solche Liste, nur eben eine leere, und eine leere Liste ist wahrheitswertig. Das Skript sammelte null Regeln, fand null Verstöße und meldete grün. Nur die Gegenprobe hat das gefunden.

**Sie misst den Messstand statt die Seite.** Ein Prüffenster von 3200 Pixeln Höhe ändert `svh` und damit genau die Geometrie, die gemessen werden soll. Ein lokaler Server, der jede Antwort synchron neu komprimiert, erzeugt Wartezeiten, die aussehen wie ein Fehler der Seite. Ein Werkzeug, das eine Übersteuerung anhängt und danach aufräumt, lässt sie stehen, wenn eine Pipe es vorher beendet. In allen drei Fällen war die Zahl echt und ihre Ursache lag im Werkzeug.

## Die Gegenprobe ist Teil der Prüfung

Wer eine Prüfung ergänzt, baut den Fehler ein, den sie finden soll, und weist nach, dass sie rot wird. **Eine Prüfung, die nie rot war, ist keine Prüfung, sondern eine Behauptung über sich selbst.** Der Nachweis wird zusammen mit der Prüfung dokumentiert: welche Übersteuerung, welcher gemessene Wert, wie viele Befunde.

Bleibt die Gegenprobe grün, sagt das eines von drei Dingen, und alle drei sehen im Protokoll identisch aus.

Im ersten Fall ist das Gate zu schwach. Eine Behauptung über gemeinsame Unterkanten las die Kanten der Kästen statt der Schrift. Ein gestrecktes Rasterkind reicht pflichtschuldig bis zur Unterkante seiner Zeile, während sein Text oben klebt; die Gegenprobe blieb deshalb grün, obwohl die Komposition zerfallen war. Die Gegenprobe hatte nicht das Stylesheet geprüft, sondern das Gate.

Im zweiten Fall ist die Regel überflüssig. Zwei Regeln in einem Abschnitt waren richtig gerechnet und für einen Fall geschrieben, den es dort nicht gab. Gemessen waren die Kästen mit und ohne sie auf das Pixel identisch. Auch hier blieb die Gegenprobe grün.

Im dritten Fall ist die Gegenprobe selbst kaputt, und dieser Fall ist der gefährlichste, weil er wie eine Entwarnung aussieht. Zweimal in einem Lauf hat der eingebaute Fehler den Fehler nicht eingebaut: Einmal setzte die Übersteuerung einen Wert, den eine stärkere Regel weiter oben ohnehin überstimmte, sodass sich am gerenderten Ergebnis nichts änderte. Einmal war das Prüfwort so gewählt, dass es die sabotierte Stelle gar nicht berührte. In beiden Fällen war die geprüfte Regel in Ordnung und die Aussage der Gegenprobe wertlos.

Die Unterscheidung kostet einen Handgriff: Eine Gegenprobe ist erst dann eine, wenn nachgewiesen ist, dass sie an der ausgelieferten Seite etwas verändert hat. Wer sabotiert, misst deshalb zuerst die Wirkung der Sabotage und dann das Gate.

Der zweite Fall hat außerdem eine Spielart, die im Code besonders plausibel aussieht: Die Regel ist nicht für einen nicht existierenden Fall geschrieben, sondern deckt einen Fall ab, den eine allgemeinere Regel desselben Stylesheets längst abdeckt. Eine Ausblenderegel für zwei Komponenten war überflüssig, weil hundert Zeilen weiter oben dieselbe Ausblendung für alle Elemente mit `!important` stand. Beide Regeln waren einzeln richtig begründet, und genau deshalb fiel die Doppelung niemandem auf.

**Wer eine grüne Gegenprobe sieht, misst ein zweites Mal**: den Zustand mit und ohne die Regel, an denselben Breiten. Bleibt er identisch, kommt die Regel weg. Aus dem Code lässt sich das nicht schließen, denn beide Fälle sind dort plausibel.

## Gemessen wird die Tinte, nicht der Kasten

Ein Element hat zwei Geometrien, und sie sind nicht dieselbe. Der Kasten ist das, was das Layout ihm zuweist. Die Tinte ist das, was ein Mensch sieht. Eine Behauptung über Ausrichtung, Achse, gemeinsame Kanten oder Zeilenlänge muss die Tinte messen, sonst prüft sie das Rastermodell und nicht die Seite.

Technisch heißt das: Textknoten und ersetzte Elemente liefern ihre echten Rechtecke, alles andere wird übersprungen. Ein anonymes Rasterkind hat überhaupt kein Element und ist damit für jede Element-Messung unsichtbar. Wer Zeilen zählt, zählt über Textknoten und nicht über Elemente, weil ein Blockkasten und der Zeilenkasten darin zwei Rechtecke liefern und ein dreizeiliger Satz dadurch als sechszeilig gemeldet wird.

## Eine Regel, die für eine Breite gemessen wurde, gilt nur für diese Breite

Eine Zentrierung stand einen Commit lang ohne Medienabfrage an einem Abschnitt. Auf dem Desktop war sie genau richtig und dort auch gemessen. Auf dem Telefon war derselbe Abschnitt ein einspaltiges Raster, und dieselbe Deklaration schrumpfte eine Spur ohne feste Breite auf ihren Inhalt. Ein Adressschild fiel von 350 auf 262 Pixel, sein Textfeld von 307 auf 219, und der Name des Hauses brauchte 221. Er brach mitten durch, wegen zwei Pixeln.

Wer eine Regel an einer Breite misst, schreibt die Abfrage dazu, auch wenn sie an der anderen Breite vermutlich nichts tut. „Vermutlich nichts“ ist keine Messung.

## Drei Gates, die dasselbe bestätigen, sind ein Gate

Bei diesem Fehler waren zweiundzwanzig Prüfungen grün, und zwar folgerichtig. Die Überlaufprüfung sah keinen Überlauf, denn der Kasten wurde ja schmaler. Die Textflussprüfung sah keine Zwangsspalte, denn 219 Pixel tragen mehr als sechs Zeichen. Die Achsprüfung sah keinen Versatz, denn zentriert stand das Schild. Alle drei bestätigten dieselbe Tatsache, nämlich dass es schön in der Mitte steht, und keine fragte, ob es dort auch breit genug ist.

Abdeckung ist nicht die Zahl der Prüfungen, sondern die Zahl der unabhängigen Fragen. Wer eine Prüfung ergänzt, prüft zuerst, ob sie eine neue Frage stellt.

## Eine Dokumentposition ist keine Bildposition

Sobald ein Projekt einen Zustand kennt, in dem Teile der Seite fehlen, wird eine ganze Klasse bisher richtiger Regeln falsch. Filter, Suchen, Tabs, aufklappbare Bereiche und bedingt eingeblendete Abschnitte gehören alle dazu.

Der Mechanismus ist immer derselbe: Eine Regel benennt eine Stelle im Dokument und meint eine Stelle im Bild. Solange nichts ausgeblendet ist, sind beide dasselbe, und der Unterschied fällt niemandem auf. `:last-child` meint das letzte Kind und nicht die letzte sichtbare Zeile. `:first-of-type` meint das erste Element seiner Art und nicht den ersten sichtbaren Block. Eine Sprungnavigation zeigt auf Abschnitte, die es gerade nicht gibt. Und eine redaktionelle Zäsur zwischen zwei Blöcken steht plötzlich mitten in einer Ergebnisliste, in der es nichts zu zäsurieren gibt.

Besonders heimtückisch ist der Rückgabewert einer Geometriemessung an einem ausgeblendeten Element: Er ist überall null. Wer prüft, ob eine Oberkante über einer Lesegrenze liegt, bekommt für jedes unsichtbare Element ein Ja. In einem gemessenen Fall markierte eine Kategorienleiste dadurch bei aktivem Filter immer denselben, weit unten liegenden Abschnitt, unabhängig davon, wo der Gast gerade stand.

**Wer Sichtbarkeit einführt, macht aus jeder Dokumentposition eine Behauptung, die nachgewiesen werden muss.** Das gilt für die Regeln der Seite und für den Prüfstand gleichermaßen: Kein bestehendes Gate kann diese Fälle sehen, weil eine Seite ohne den neuen Zustand sie nie erreicht. Die Prüfung dazu zählt deshalb, was ein Layoutkasten hat, und nicht, was ein Attribut trägt. Wer das Attribut zählt, prüft seine eigene Umsetzung und nicht deren Wirkung.

## Kann die gemessene Zahl aus dem Ding stammen, das ich ändern will?

Diese Frage steht vor jeder Optimierung. In einem Ladezeitprotokoll war das Netzwerk nach 727 Millisekunden fertig, das erste Bild erschien nach 2301, und dazwischen lag nichts, was die Seite selbst tat. Diese Lücke war der Hinweis, und sie stand von Anfang an im Protokoll. Eine halbe Nacht Optimierung hätte dem Messstand gegolten und nicht der Seite.

## Kein Gate ersetzt den Blick, und kein Blick ersetzt ein Gate

Zweimal in demselben Projekt meldete ein Gate grün, während die Seite sichtbar kaputt war. Einmal, weil ein anonymes Rasterkind für jede Element-Messung unsichtbar ist. Einmal, weil das Prüfwerkzeug den Hintergrund nachbaute, statt ihn zu fotografieren, und am Ende sein eigenes Modell prüfte. Beide Fehler fand ein Screenshot.

Umgekehrt gilt dasselbe. Der Blick findet, was gerade auf dem Schirm ist, in der Breite, die gerade offen ist, an dem Tag, an dem jemand hinsieht. Die Sichtprüfung nach jeder größeren Änderung ist deshalb kein Ersatz für den Prüfstand und der Prüfstand keiner für sie. Beides steht in der [Qualitätskontrolle](../10_CHECKLISTS/07-qualitaetskontrolle.md) und im [Launch](../10_CHECKLISTS/06-launch.md).

## Was das für ein Projekt bedeutet

Jedes VELLOX-Projekt trägt eine eigene Regeldatei, in der die projektspezifischen Entscheidungen stehen. Jede Regel darin nennt ihre Prüfung, und die Prüfungen stehen vollständig in einer Tabelle am Ende. Der Prüfstand selbst wird nicht je Projekt erfunden: Er kommt als Kit aus [`12_PRUEFSTAND`](../12_PRUEFSTAND/README.md), wird über eine Konfigurationsdatei auf die Routen des Projekts gestellt und um projektspezifische Behauptungen ergänzt.

Der Lauf ist vollständig oder er hat nicht stattgefunden. Wer Markup verschiebt, fährt den ganzen Satz und nicht die Auswahl, die zum Thema zu passen scheint. Eine Prüfung, die eine Stelle im Markup fest verdrahtet, wandert nicht von selbst mit, wenn diese Stelle umzieht.

## Verbindlichkeit

Der Prüfstand ist so verbindlich wie der [Anti-Template-Standard](05-anti-template-standard.md). Eine Seite wird nicht freigegeben, solange eine Prüfung rot ist. Eine Abweichung ist möglich, aber sie ist eine Entscheidung mit Begründung, Umfang und Prüfdatum im Entscheidungsprotokoll, nicht ein übersprungener Lauf.

Diese Verbindlichkeit schützt nicht den Prozess, sondern die Gestaltung. Ein Team, das seine Regeln beweisen kann, muss sie nicht verteidigen und kann sich der eigentlichen Arbeit zuwenden: der Frage, welche Aussage ein Abschnitt trägt und welche Form dazu passt. Diese Frage beantwortet kein Gate. Sie steht im [Entscheidungsframework](02-entscheidungsframework.md), und sie bleibt die schwierigere von beiden.
