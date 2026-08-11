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

## Warum dieses Kapitel eine Prüfung braucht und nicht nur einen Anspruch

Alles bisher Beschriebene stand in diesem Repository bereits, als der Fehler passierte, der [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md) ausgelöst hat: Der Fokusring war dokumentiert und fehlte. Das ist der Beleg dafür, dass Accessibility auf Stufe 5 nicht trägt, und nach der Verschiebungsregel zieht sie damit eine Stufe nach oben. Nicht das ganze Kapitel; nur die Teile, die sich messen lassen. Ob ein Alternativtext die Bedeutung eines Bildes trifft, bleibt eine Frage an einen Menschen. Ob ein Bild überhaupt einen hat, muss kein Mensch prüfen.

Jede Seite wird deshalb geprüft, und zwar auf drei Ebenen, die verschiedene Dinge finden und einander nicht ersetzen.

### Der gerechnete Kontrast, vor dem Rendern

Wenn Farben nach dem [visuellen System](../02_BRANDING/02-visuelles-system.md) semantische Rollen mit benannten Partnern sind, ist jedes zulässige Paar bekannt, bevor eine Seite existiert. Sein Kontrast lässt sich dann aus der Palette rechnen und muss nicht an der fertigen Oberfläche gemessen werden. Das Gate läuft ohne Browser, in Millisekunden, und es findet den Fehler an dem Tag, an dem jemand einen Farbwert ändert, statt Wochen später im Review.

Die Zielwerte stammen aus den Web Content Accessibility Guidelines 2.2, Stufe AA, dem seit Oktober 2023 gültigen Standard des W3C: 4,5:1 für Fließtext, 3:1 für große Schrift ab 24 Pixel oder ab 18,66 Pixel fett, 3:1 für Bedienelemente, ihre Grenzen und den Fokusring. Diese Werte sind versioniert und stehen an einer Stelle im Projekt, damit eine spätere Fassung der Richtlinie eine Änderung an einer Datei bleibt.

Was dieses Gate nicht kann: Text auf Bildern, Verläufen und halbtransparenten Flächen beurteilen. Dort ist der Hintergrund kein Wert, sondern ein Bereich. Diese Fälle bleiben eine Messung am gerenderten Zustand, und der Katalog in [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md) führt sie deshalb getrennt.

### Die automatische Prüfung jeder gebauten Seite

Ein Prüflauf über alle ausgelieferten Seiten, nicht über eine Auswahl. Die Auswahl ist der Grund, warum solche Prüfungen typischerweise nichts finden: Geprüft wird die Startseite, und der Fehler sitzt im Formular auf der Kontaktseite.

Er findet die Klassen von Fehlern, die eindeutig sind: fehlendes Alternativattribut, Formularfeld ohne Beschriftung, fehlende Sprachangabe, doppelte Kennungen, unterbrochene Überschriftenhierarchie, Bedienelement ohne zugänglichen Namen, falsch verwendete ARIA-Rollen, Kontrast auf einfarbigem Grund.

Er ist blind für alles, was ein Urteil verlangt. Ob der vorhandene Alternativtext stimmt. Ob die Fokusreihenfolge der sichtbaren Anordnung folgt. Ob die Fehlermeldung eines Formulars jemandem weiterhilft. Ob ein Dialog dorthin zurückführt, wo er geöffnet wurde. Eine bestandene automatische Prüfung ist deshalb kein Nachweis von Barrierefreiheit, sondern die Abwesenheit einer bestimmten Fehlerklasse. Wer sie als Nachweis behandelt, hat ein Gate überschätzt, und das ist nach dem Katalogprinzip gefährlicher als kein Gate.

### Der menschliche Durchgang durch die tragenden Wege

Für die Wege, die das Geschäft tragen, also Orientierung, Leistungswahl, Kontakt und Fehlerrückkehr: einmal vollständig mit der Tastatur, einmal mit einem Screenreader, einmal bei 200 Prozent Zoom, einmal mit reduzierter Bewegung. Was dabei geprüft wurde, wird nach dem Abschnitt [Manuelle Stichprobe dokumentieren](#manuelle-stichprobe-dokumentieren) festgehalten, weil sonst beim nächsten Review niemand weiß, ob eine Lücke neu ist oder immer bestand.

## Rechtliche Prüfung ist eine andere Prüfung

Zugänglichkeit und Rechtskonformität werden häufig in einen Satz gepackt und dann gemeinsam vergessen. Sie sind verschieden: Die eine fragt, ob jemand die Seite benutzen kann, die andere, ob die Seite haben darf, was sie hat. Eine perfekt zugängliche Seite kann ohne Impressum sein, und eine rechtlich vollständige Seite kann unbedienbar sein.

Vor der Freigabe wird deshalb zusätzlich geprüft, ob die Pflichtangaben vorhanden, erreichbar und wahr sind: die Anbieterkennzeichnung, die Datenschutzinformationen nach [Artikel 13 DSGVO](05-datenschutzerklaerung-generator.md), und die Frage, ob vor einer Einwilligung überhaupt etwas geladen wird, das eine Einwilligung braucht. Der letzte Punkt ist der, der in der Praxis am häufigsten scheitert, und er ist mechanisch prüfbar: Beim ersten Aufruf ohne Zustimmung wird die Liste der Netzwerkanfragen aufgenommen. Jede Anfrage an eine fremde Domain steht dann als Befund da und nicht als Vermutung. Eine eingebundene Schriftart oder eine Karte, die beim Seitenaufruf lädt, ist auf diesem Weg in einer Minute nachgewiesen.

**Was die Agentur hier nicht tut.** Sie beurteilt nicht, welche Vorschriften für einen Betrieb gelten. Ob das Barrierefreiheitsstärkungsgesetz, das seit dem 28. Juni 2025 die europäische Richtlinie 2019/882 in deutsches Recht umsetzt, einen bestimmten Kunden erfasst, hängt an seinem Angebot und an Schwellen zur Unternehmensgröße, und die Antwort ist eine Rechtsauskunft. VELLOX liefert den Befund, nicht die Bewertung: Wir sagen, was die Seite tut und wo sie den technischen Zielwert verfehlt, und der Kunde klärt mit seiner Rechtsberatung, was für ihn verbindlich ist. Diese Trennung schützt beide Seiten.

Die genannten Rechtsgrundlagen haben den Stand August 2026 und altern. Sie werden zu Projektbeginn geprüft, nicht aus diesem Kapitel abgeschrieben.

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
