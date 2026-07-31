# Accessibility und Animation: Wahrnehmung als Qualitätsprüfung

Accessibility prüft, ob die beabsichtigte Erfahrung auch dann zugänglich bleibt, wenn Menschen andere Wahrnehmungs-, Bewegungs-, Sprach- oder Eingabesituationen mitbringen. Sie ist kein nachträgliches Compliance-Projekt. Sie macht sichtbar, ob die Struktur wirklich verstanden wurde.

## Semantik und Tastatur

Beginne mit korrektem HTML, sinnvollen Überschriften, Labels, Landmarken und Fokusreihenfolge. Tastaturbedienung ist nicht nur ein Tab-Test. Menschen müssen wissen, wo sie sind, wie sie eine Aktion auslösen, wie sie einen Dialog schließen und wie sie nach einem Fehler weiterkommen.

## Kontrast, Größe und Nicht-Farbe

Text, Fokus, Status und interaktive Grenzen müssen ausreichend wahrnehmbar sein. Verwende Farbe nicht als einzige Information für Fehler, Auswahl oder Erfolg. Teste Zoom und größere Textdarstellung, weil feste Höhen, abgeschnittene Inhalte und überlappende Buttons sonst schnell sichtbar werden.

## Formulare und dynamische Inhalte

Labels, Hilfetexte, Fehler und Erfolgsmeldungen müssen in einer sinnvollen Reihenfolge angekündigt und visuell verbunden sein. Dynamische Änderungen dürfen den Fokus nicht verlieren. Ein Dialog muss einen Namen, einen klaren Zweck und einen verlässlichen Rückweg besitzen.

## Bewegung respektieren

Bewegung muss eine zugängliche Alternative besitzen und die Präferenz für reduzierte Bewegung berücksichtigen. Parallax, Autoplay, blinkende Elemente und große Übergänge werden nicht eingesetzt, wenn sie Inhalte unlesbar oder Navigation unsicher machen. Die [Motion Language](../02_BRANDING/03-motion-language.md) legt die beabsichtigte Wirkung fest; Engineering schützt die Grenzen.

## Testen in mehreren Modi

Automatisierte Tools finden typische Fehler, aber keine vollständige Erfahrung. Kombiniere sie mit Tastatur, Screenreader-Stichproben, Zoom, reduzierter Bewegung, verschiedenen Kontrasten und echten Formularfehlern. Tests werden mit kritischen Journeys begonnen: Orientierung, Leistungswahl, Kontakt und Abschluss.

Accessibility ist abgeschlossen, wenn die Kernaufgaben ohne unnötige Sonderwege funktionieren. Eine alternative Version, die wichtige Informationen oder Würde verliert, ist keine gleichwertige Lösung.

## Accessibility im Prozess

Accessibility wird bereits beim Seitenmodell, bei der Copy, im visuellen System und in der Komponentenarchitektur besprochen. Das Team entscheidet früh, wie Fokus, Fehler, Dialoge, Medienalternativen und Bewegung funktionieren. Dadurch bleiben barrierearme Lösungen Teil der Grundstruktur und nicht eine sichtbare Reparaturschicht.

## Manuelle Stichprobe dokumentieren

Halte für zentrale Journeys fest, mit welchen Geräten, Eingaben und Hilfsmitteln geprüft wurde. Dokumentiere nicht nur Fehler, sondern auch die erwartete Erfahrung und die noch akzeptierten Grenzen. So kann das Team bei späteren Änderungen feststellen, ob eine vermeintlich kleine visuelle Anpassung einen zugänglichen Weg beschädigt.

## Gleichwertigkeit

Eine alternative Darstellung muss dieselbe Information, Handlung und Würde erhalten. Ein Untertitel statt eines Videos ist nur dann gleichwertig, wenn die relevante Aussage enthalten bleibt. Ein separater „Barrierefrei-Modus“ ist kein Ersatz für eine zugängliche Basisoberfläche.
## Medien und Alternativen

Bilder erhalten sinnvolle Alternativtexte, wenn sie Information tragen, und werden leer markiert, wenn sie rein dekorativ sind. Videos und Animationen brauchen eine verständliche statische Grundlage, Untertitel oder Transkript, wenn Sprache oder Information enthalten ist. Eine Beschreibung soll Bedeutung vermitteln, nicht jedes Pixel aufzählen.

## Fokus und Scroll

Dynamische Oberflächen dürfen den Fokus nicht in einen unsichtbaren Bereich verschieben. Nach dem Öffnen eines Dialogs wird der Fokus kontrolliert eingeschlossen; nach dem Schließen kehrt er zur auslösenden Handlung zurück. Bei Seitenwechseln und Fehlermeldungen wird der neue Kontext erkennbar gemacht.

## Reviewkultur

Accessibility-Befunde werden nach Auswirkung priorisiert, nicht als persönlicher Vorwurf behandelt. Ein kontrastschwacher Status, ein verlorener Fokus oder ein unbedienbares Formular blockiert den Kernweg stärker als eine kleinere semantische Unschärfe. Die Priorität wird begründet und nach dem Fix erneut geprüft.
## Prüfreihenfolge nach Risiko

Beginne mit den Wegen, die Geschäft oder Sicherheit tragen: Navigation, Leistungswahl, Kontakt, Buchung, Kauf und Fehlerrückkehr. Danach folgen sekundäre Interaktionen und dekorative Bereiche. So wird die begrenzte Prüfzeit zuerst dort eingesetzt, wo ein Ausschluss am schwersten wiegt.

## Motion-Implementierung

Bevorzuge transform- und opacity-basierte Übergänge, wenn Bewegung nötig ist, und vermeide Animationen, die Layout ständig neu berechnen. Das technische Mittel ist jedoch nachgeordnet: Auch eine performant implementierte Bewegung bleibt falsch, wenn sie Aufmerksamkeit stiehlt oder Fokus verliert. Teste Effekt und Kosten gemeinsam.

## Inhalte ohne Spezialversion

Eine zugängliche Oberfläche sollte möglichst die normale Oberfläche sein. Wenn Kontrast, Semantik, Fokus, Textalternative und reduzierte Bewegung von Anfang an eingebaut sind, braucht das Team weniger Sonderpfade und kann Qualität leichter erhalten. Accessibility ist damit ein Systemvorteil, nicht nur eine zusätzliche Prüfspur.
## Priorität der Kernaufgaben

Eine Oberfläche kann in einzelnen Nebenbereichen noch nicht vollständig geprüft sein und trotzdem einen kontrollierten Zwischenstand besitzen. Navigation, Orientierung, Formular, Kontakt und Fehlerweg dürfen jedoch nicht auf eine spätere Phase verschoben werden. Accessibility wird nach der Bedeutung des Weges priorisiert und danach erneut systemisch verbessert.
## Accessibility als Definition of Done

Ein Ticket oder eine Komponente ist nicht abgeschlossen, wenn nur der visuelle Zustand fertig ist. Die Definition of Done nennt Semantik, Tastatur, Fokus, Kontrast, Zoom, Bewegung, Fehlerrückmeldung und alternative Medien. Nicht jeder Punkt ist für jede Komponente gleich umfangreich, aber die Begründung für eine Ausnahme bleibt sichtbar.
