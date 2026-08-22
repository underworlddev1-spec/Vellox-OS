# KI-Kennzeichnung: Pflichtangabe statt Arbeitsnotiz

Erzeugte Bilder sind in Kundenprojekten inzwischen Alltag, weil echtes Material oft fehlt und ein Fotoauftrag Wochen kostet. Damit entsteht eine Pflicht, die kein Gestaltungsspielraum ist. Dieses Kapitel beschreibt, wie VELLOX sie umsetzt, und drei Fehler, die dabei naheliegen.

Der Text ersetzt keine Rechtsberatung. Er hält fest, wie das System mit der Anforderung umgeht, und benennt die Stelle, an der eine juristische Prüfung nötig wird.

## Was verlangt ist

Artikel 50 Absatz 4 der KI-Verordnung verlangt von demjenigen, der ein KI-System einsetzt, um Bild-, Ton- oder Videoinhalte zu erzeugen oder zu manipulieren, dass er offenlegt, dass der Inhalt künstlich erzeugt oder manipuliert wurde. Absatz 5 bestimmt, wie: klar und unterscheidbar, spätestens zum Zeitpunkt der ersten Interaktion oder Exposition. Diese Transparenzpflichten gelten seit dem 2. August 2026.

Für eine Website heißt das in der Praxis dreierlei.

**Die Angabe steht beim Inhalt.** Ein Hinweis im Fußbereich erfüllt „bei der ersten Exposition“ nicht, wenn das Bild zweitausend Pixel weiter oben steht. Die Kennzeichnung gehört an das Bild.

**Sie bleibt, solange das Bild bleibt.** Sie ist keine Arbeitsnotiz, die vor dem Launch entfernt wird, und keine interne Markierung. Sie entfällt zusammen mit dem Bild, sobald ein echtes Foto vorliegt.

**Sie ist lesbar.** Kleiner Grad ist zulässig, unlesbarer nicht. Für die Kennzeichnung gelten dieselben Kontrastanforderungen wie für jeden anderen Text, und sie wird am gerenderten Pixel gemessen, weil sie oft auf oder neben einem Bild liegt.

## Das Verb entscheidet die Datei, nicht der Klang

Die Verordnung verlangt die Offenlegung von „erzeugt **oder** manipuliert“. Welches von beidem zutrifft, ist keine Geschmacksfrage.

In einem Projekt lautete die gewünschte Formulierung „Mit KI und Liebe bearbeitet“. Beide Bilder waren jedoch vollständig erzeugt; die eingebettete Herkunft wies das erzeugende Modell und den Quelltyp für algorithmisch erzeugte Medien aus. „Bearbeitet“ hätte ein echtes Foto behauptet, das nur aufgehübscht wurde. Bei einem fotorealistischen Nachbau eines realen, benannten Betriebs ist das keine Wortklauberei: Dasselbe Bild war im Projektverlauf bereits einmal als echtes Foto durchgegangen.

**Die Formulierung wird deshalb aus der Datei abgeleitet und nicht aus dem Ton der Marke.** Wenn die Herkunftsdaten fehlen, entscheidet die Entstehung, und sie wird im Entscheidungsprotokoll festgehalten.

## Die Pflicht bestimmt den Ort, nicht die Form

Ein häufiger Reflex ist ein gefüllter, umrandeter Chip im Bild, unten rechts. Der ist an genau einer Stelle richtig: dort, wo die Angabe auf dem Foto selbst liegt und ihr Untergrund wechselt. Dann trägt die eigene Fläche die Lesbarkeit.

Steht die Angabe dagegen unter dem Bild auf einer ruhigen Abschnittsfläche, fällt dieser Grund weg, und mit ihm der Kasten. Was bleibt, ist das, was sie lesbar und unverwechselbar macht: kleiner Grad, Versalien, leichte Sperrung, leise Textfarbe. Ein Kasten um eine Fußnote macht aus einer Bildunterschrift ein Abzeichen, und ein Abzeichen liest sich wie ein Werkzeughinweis statt wie eine Angabe des Hauses.

Wer die Kennzeichnung ganz entfernen will, braucht kein anderes Layout, sondern ein echtes Foto.

## Der Rest der Verordnung

Artikel 50 betrifft auch andere Fälle, die in Kundenprojekten vorkommen: ein Chatbot muss erkennbar machen, dass er ein KI-System ist, und synthetische Texte, die der Information der Öffentlichkeit über Angelegenheiten von öffentlichem Interesse dienen, tragen eigene Anforderungen. Artikel 5 verbietet bestimmte Praktiken vollständig, darunter Emotionserkennung am Arbeitsplatz und biometrische Kategorisierung nach sensiblen Merkmalen. Artikel 4 verlangt ein Mindestmaß an KI-Kompetenz bei denen, die solche Systeme betreiben.

Die Prüfung dieser Punkte gehört in den Rechts-Audit einer Seite und läuft über die Prüfung `konform.mjs` des Prüfstands sowie über den Skill zur DSGVO- und KI-VO-Prüfung. Das [Kapitel zur Datenschutzerklärung](05-datenschutzerklaerung-generator.md) beschreibt den angrenzenden Teil.

## Nachweis

Die Prüfung misst das ausgelieferte Verhalten und nicht den Quelltext. Jedes Bild, das als erzeugt markiert ist, trägt ein Datenattribut; die Prüfung sucht zu jedem solchen Bild eine sichtbare Kennzeichnung im selben Abschnitt, misst ihren Kontrast und stellt sicher, dass sie nichts überlagert.

Das Attribut ist dabei die Quelle der Wahrheit und nicht die Klasse an der Kennzeichnung. Wer ein erzeugtes Bild einbaut und das Attribut vergisst, hat kein rotes Gate, sondern eine unmarkierte Pflichtangabe. Deshalb steht im Projektregelwerk zusätzlich die Regel, dass jedes erzeugte Bild beim Einbau das Attribut bekommt, und die Bildliste im Fotoauftrag hält fest, welche Dateien erzeugt sind.

Gegen den Fall geprüft wird, indem die Kennzeichnung entfernt oder auf das Bild geschoben wird. Beides muss rot melden.
