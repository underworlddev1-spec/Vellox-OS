# Checkliste: Projektstart

Diese Checkliste prüft, ob ein Projekt entscheidungsfähig beginnt. Ein Haken bedeutet nicht, dass ein Dokument existiert, sondern dass die Information belastbar genug ist, um die nächste Arbeit auszulösen. Wo ein Punkt offen bleibt, wird das Risiko und der Klärungstermin festgehalten.

| Prüfung | Warum sie zählt | Nachweis |
|---|---|---|
| Geschäftliche Ausgangslage ist beschrieben | Ohne Ausgangslage wird Gestaltung zum Selbstzweck und Erfolg bleibt undefiniert. | Freigegebener Projektbrief mit Problem und Anlass. |
| Ergebnis-, Arbeits- und Signalziele sind getrennt | So werden Geschäftswirkung, Agenturleistung und Messwert nicht verwechselt. | Zielabschnitt mit Verantwortlichkeit. |
| Angebot ist in Leistung, Mechanik, Ergebnis und Beweis erklärt | Besucher brauchen mehr als einen Leistungsnamen; auch das Team muss wissen, was es glaubwürdig verspricht. | Angebotsanalyse im Projektbrief. |
| Bevorzugte Zielgruppen und Situationen sind benannt | Eine Website kann Prioritäten nur setzen, wenn sie weiß, wem sie zuerst helfen soll. | Discovery-Synthese mit Ausschlüssen. |
| Entscheidungsweg des Kunden ist bekannt | Der Prozess bestimmt Seitenfolge, CTA, Beweise und Formulare. | Journey-Skizze oder Discovery-Brief. |
| Stakeholder und Freigaberechte sind geklärt | Unklare Entscheidungswege erzeugen späte Richtungswechsel. | Rollenliste mit finaler Entscheidungsrolle. |
| Technische und redaktionelle Grenzen sind sichtbar | Früh bekannte Grenzen sind günstig; späte Überraschungen zerstören Qualität. | Risiko- und Abhängigkeitsliste. |
| Erfolgsmessung besitzt Kontext | Ein Klick ist nicht automatisch eine qualifizierte Anfrage oder ein gutes Ergebnis. | Messdefinition mit Quelle und Zeitpunkt. |
| Freigaberhythmus ist vereinbart | Review funktioniert nur, wenn Fragen, Zeit und Entscheidungskompetenz zusammenpassen. | Kalender oder Projektplan. |
| Offene Fragen haben einen Besitzer | Ungewissheit wird dadurch handhabbar, statt still in das Design zu wandern. | Offene-Fragen-Register. |
| Der Prüfstand läuft, bevor die erste Seite steht | Ein Prüfstand, der erst vor dem Launch eingebaut wird, findet Befunde in Arbeit, die schon bezahlt ist. Er gehört zum Gerüst und nicht zur Abnahme. | Protokoll eines Laufs gegen das leere Gerüst, mit Datum, Zahl der Prüfungen und Zahl der Routen. |
| Die Projektregeldatei existiert und nennt zu jeder Regel ihre Prüfung | Eine Regel ohne Test ist eine Absichtserklärung, und die hält bis zum nächsten Termindruck. | `CLAUDE.md` des Projekts mit einer Prüfungstabelle am Ende. |
| Vellox-OS ist an die Session angebunden | Eine Dateikopie neben dem Projekt lädt keine Skills und keine Kontextregeln. Ohne Anbindung improvisiert das Werkzeug die fehlende Regel still. | Repository-Liste der Session. |

Der Projektstart ist abgeschlossen, wenn Team und Kunde dieselbe erste Entscheidung sehen: Was muss zuerst verstanden werden, damit die Website für die richtigen Menschen relevant werden kann? Die [Projektbrief-Vorlage](../09_TEMPLATES/01-projektbrief.md) ist die ausführliche Arbeitsgrundlage; diese Checkliste ist der Freigabepunkt.

## Warum der Prüfstand hier steht und nicht beim Launch

Die drei technischen Zeilen wirken an dieser Stelle verfrüht. Sie stehen hier, weil ihre Abwesenheit am ersten Tag nichts kostet und am letzten alles.

Ein Prüfstand, der vor dem Launch eingebaut wird, meldet seine ersten Befunde gegen Seiten, die fertig, abgestimmt und bezahlt sind. Dann ist jede Korrektur eine Rückabwicklung, und die Erfahrung sagt, was in dieser Lage passiert: Die Regel wird gelockert, nicht die Seite korrigiert. Am ersten Tag dagegen läuft er gegen ein leeres Gerüst, ist in zehn Minuten eingebaut und findet jeden Befund am Tag seiner Entstehung.

Der Einbau steht in [`12_PRUEFSTAND`](../12_PRUEFSTAND/README.md). Die Routenliste wird dabei vollständig gepflegt und nicht beispielhaft: Was dort fehlt, wird nie gemessen.

Der kürzeste Weg dorthin ist [`13_GERUEST`](../13_GERUEST/README.md). Der Ordner ist ein lauffähiges Projekt mit eingebautem Prüfstand, leerem Entscheidungsprotokoll und einer Regeldatei, die zu jeder Regel ihre Prüfung nennt. Damit sind drei Zeilen dieser Tabelle am ersten Tag erledigt, statt in der dritten Woche nachgeholt zu werden.

Sein erster Lauf ist absichtlich rot. Eine Prüfung meldet, solange die Gerüsttexte noch dastehen, denn ein Impressum mit den richtigen Abschnitten und ohne eine einzige Angabe sieht aus wie erledigt.

Und ein Prüfstand ersetzt weder den Blick noch das Urteil. Er hält die mechanischen Eigenschaften einer Seite fest, damit die Aufmerksamkeit des Teams für die Fragen frei bleibt, die er nicht beantworten kann. Welche Aussage ein Abschnitt trägt und welche Form dazu passt, steht in der [Prüfdoktrin](../00_SYSTEM/06-pruefdoktrin.md) ausdrücklich außerhalb seiner Reichweite.
## Häufige Fehlinterpretationen

Ein ausgefülltes Briefing beweist nicht, dass die Positionierung geklärt ist. Ein Kick-off mit vielen Beteiligten beweist nicht, dass eine Entscheidungsrolle existiert. Ein Zeitplan beweist nicht, dass die Entscheidung an einem Meilenstein reif werden kann. Prüfe deshalb die Qualität der Antworten. Sind sie konkret, beobachtbar und mit einer Konsequenz verbunden? Wenn nicht, wird der Punkt als offene Frage behandelt.

## Verantwortungsübergabe

Am Ende des Projektstarts nennt jede Rolle ihre nächste Arbeit und die Information, die sie dafür benötigt. Research erhält Zugang zu Quellen und Gesprächspartnern. UX erhält Zielgruppen- und Angebotskontext. Branding und Copy erhalten Positionierungs- und Beweisfragen. Engineering erhält Integrationen, Umgebungen und technische Risiken. Diese Übergabe verhindert, dass jede Disziplin den Auftrag neu interpretiert.

## Freigabefrage

Kann das Team in einem Satz sagen, welche Unsicherheit die Website zuerst reduzieren muss? Kann es außerdem sagen, welches Geschäftssignal sich dadurch verbessern soll und welche Annahme noch unsicher ist? Wenn diese drei Antworten fehlen, ist der Projektstart noch nicht abgeschlossen.
## Praktischer Starttest

Bitte drei Teammitglieder unabhängig voneinander die erste Projektfrage formulieren. Wenn drei unterschiedliche Probleme genannt werden, ist der Brief noch nicht gemeinsam verstanden. Bitte anschließend jede Rolle den nächsten sinnvollen Arbeitsschritt nennen. Wenn dieser Schritt bereits eine Lösung voraussetzt, obwohl die wichtigste Unsicherheit offen ist, wird die Reihenfolge korrigiert.

## Kundenperspektive

Der Kunde soll nicht nur Ziele bestätigen, sondern die Konsequenzen verstehen. Er muss wissen, welche Informationen benötigt werden, wann Entscheidungen verbindlich werden und was passiert, wenn eine wichtige Evidenz fehlt. Diese Transparenz verhindert, dass der Kunde später überrascht ist, wenn ein Wunsch gegen Zielgruppe, Betrieb oder technische Belastbarkeit abgewogen wird.

## Dokumentation

Speichere Freigabe, offene Fragen, Rollen, Zeitpunkte und den aktuellen Projektbrief an einem auffindbaren Ort. Ein Kick-off, das nur in einem Gespräch existiert, kann nicht als Systemgrundlage dienen. Die Checkliste ist abgeschlossen, wenn auch eine abwesende Person den nächsten Schritt und seine Begründung versteht.
## Entscheidungskarte

Lege für die erste Projektwoche eine Karte mit Frage, Evidenz, Verantwortlicher, Termin und erwarteter Entscheidung an. Damit wird sichtbar, ob das Team tatsächlich auf Erkenntnis hinarbeitet oder bereits ohne Grundlage Dateien produziert. Die Karte darf klein sein; sie muss nur den größten Unsicherheiten folgen.

## Stoppsignal

Wenn Zielgruppe, Angebot oder Freigabeweg grundlegend unklar sind, wird die Gestaltung nicht einfach gestartet, um Fortschritt zu simulieren. Das Team benennt den Engpass und wählt die kleinste Arbeit, die ihn auflösen kann. Ein kurzer, ehrlicher Halt ist günstiger als ein späterer kompletter Richtungswechsel.
## Reduzierte Startversion

Wenn Zeit knapp ist, schützt die Startprüfung mindestens Problem, Zielgruppe, Angebot, Entscheidungsrolle, technische Grenze und nächste Forschungsfrage. Alles Weitere kann iterativ ergänzt werden. Auch eine kleine, ehrliche Grundlage ist stärker als ein vollständiger Fragenkatalog, dessen Antworten niemand geprüft hat.
