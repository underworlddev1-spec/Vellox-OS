# SAPHIRWEB-Workflow und Reviewprozess

SAPHIRWEB organisiert Projekte nicht nach der Reihenfolge von Dateien, sondern nach der Reife von Entscheidungen. Der Workflow schützt zwei Dinge gleichzeitig: die Zeit des Teams und die Qualität des Ergebnisses. Frühe Arbeit soll Unsicherheit reduzieren. Spätere Arbeit soll Entscheidungen präzise ausführen. Wenn beides vermischt wird, entstehen teure Schleifen: Design kaschiert ungeklärte Strategie, Copy wird in Komponenten gezwängt, und Engineering entdeckt zu spät, dass die gewünschte Erfahrung nicht belastbar ist.

## Phase 1: Ausrichten

Das Projekt beginnt mit einem gemeinsamen Bild der Ausgangslage. Das Team sammelt Geschäftsziel, Angebot, Zielgruppen, bestehende Beweise, technische Rahmenbedingungen, Entscheidungswege und Erfolgssignale. Die wichtigste Leistung dieser Phase ist nicht ein schönes Briefing, sondern die Benennung dessen, was noch nicht verstanden ist.

Am Ende stehen ein freigegebener [Projektbrief](../09_TEMPLATES/01-projektbrief.md), ein [Discovery-Brief](../09_TEMPLATES/02-discovery-brief.md) und eine erste Risikoliste. Niemand sollte in die Gestaltung gehen, wenn die zentrale Geschäftsabsicht nur als Adjektiv wie „moderner“ oder „hochwertiger“ vorliegt.

## Phase 2: Verstehen

Research verdichtet Beobachtungen zu einer arbeitsfähigen Positionierung. Interviews, Angebotsanalyse, Suchsprache, Konkurrenzbeobachtung und Einwände werden nicht als Materialsammlung abgelegt, sondern in Entscheidungen übersetzt: Für wen ist das Angebot besonders relevant? Was muss diese Person glauben? Was hält sie zurück? Welche Beweise sind vorhanden?

Diese Phase endet nicht mit einem Bericht, sondern mit einer klaren Priorität. Das Team kann noch Hypothesen führen, aber es weiß, welche Hypothese die größte Konsequenz für Struktur und Copy besitzt. Weiterführende Methoden stehen unter [`01_RESEARCH`](../01_RESEARCH).

## Phase 3: Ordnen

UX übersetzt die Positionierung in eine User Journey, Informationsarchitektur und Seitenlogik. Jeder Abschnitt erhält eine Aufgabe: Orientierung, Relevanz, Beweis, Vertiefung, Entscheidung oder Entlastung. Die Reihenfolge wird als Argument geprüft. Ein Abschnitt darf nicht allein deshalb bleiben, weil er im Briefing erwähnt wurde.

In dieser Phase entstehen Low-Fidelity-Strukturen und ein Content-Modell. Visualität bleibt bewusst kontrolliert, damit die Diskussion über Priorität, Sprache und Handlung nicht von Oberflächenwirkung überlagert wird. Die [UX-Review-Checkliste](../10_CHECKLISTS/04-ux-review.md) ist bereits hier relevant.

## Phase 4: Ausdrücken

Branding und UI geben der Ordnung eine erkennbare Form. Das Designsystem beantwortet nicht nur Farb- und Abstandsfragen. Es definiert, wie eine Marke Sicherheit, Nähe, Präzision oder Energie sichtbar macht. Typografie und Bildsprache werden aus dem Inhalt entwickelt. Komponenten erhalten Zustände und Grenzen, bevor sie in viele Seiten kopiert werden.

Gute Gestaltung in dieser Phase reduziert die Zahl der Interpretationen. Ein Teammitglied muss nicht erraten, ob eine Fläche eine Karte, ein Abschnitt oder ein interaktives Element ist. Eine Handlung muss sich in Priorität, Zustand und Sprache gleich verhalten. Querverweise führen in [`02_BRANDING`](../02_BRANDING) und [`04_UI`](../04_UI).

## Phase 5: Bauen und integrieren

Engineering überträgt die Entscheidungen in semantische, wartbare und performante Strukturen. Copy bleibt editierbar, Inhalte erhalten eine klare Quelle, und visuelle Varianten werden als kontrollierte Kompositionen statt als Sonderfälle umgesetzt. Accessibility, Responsive-Verhalten und Performance werden während des Baus geprüft, nicht erst vor dem Launch.

Die technische Umsetzung ist eine Interpretationsleistung. Wenn ein Design nur unter idealen Textlängen funktioniert, ist es noch nicht fertig. Wenn eine Animation ohne JavaScript unverständlich wird, ist sie nicht ausreichend progressive. [`07_ENGINEERING`](../07_ENGINEERING) beschreibt die Grundsätze.

## Phase 6: Validieren

Review findet in kurzen, fachlich getrennten Runden statt. Erst wird die Absicht geprüft, dann die Erfahrung, dann die visuelle Ausführung und zuletzt die technische Belastbarkeit. In jeder Runde wird nach dem Qualitätsstandard kommentiert: betroffenes Prinzip, beobachtete Konsequenz, konkrete Änderung, Priorität.

Eine Review-Anmerkung ist abgeschlossen, wenn die Ursache behoben oder eine bewusste Ausnahme dokumentiert ist. Ein Team darf nicht fünf Meinungen sammeln und sie als Fortschritt verbuchen. Die verantwortliche Rolle entscheidet bei Zielkonflikten; die Entscheidung wird im Projektprotokoll festgehalten.

## Phase 7: Übergeben und lernen

Vor dem Launch werden nicht nur Dateien übergeben. Das Team übergibt die Logik: zentrale Inhalte, Design Tokens, Komponentenregeln, Tracking-Definitionen, redaktionelle Zuständigkeiten, bekannte Risiken und den Plan für die erste Nachbeobachtung. Der Kunde soll den Auftritt weiterführen können, ohne die ursprüngliche Hierarchie zu zerstören.

Nach dem Launch wird ein begrenztes Lernfenster vereinbart. Beobachtet werden nicht nur Klickzahlen, sondern Suchanfragen, Formularabbrüche, qualitative Rückmeldungen, Supportfragen und technische Signale. Erkenntnisse werden zurück in die passenden Kapitel oder das Projektarchiv geschrieben.

## Rhythmus und Verantwortlichkeiten

Jede Phase besitzt eine verantwortliche Person, einen Freigabepunkt und ein sichtbares Artefakt. Die verantwortliche Person muss nicht alles selbst erstellen; sie sorgt dafür, dass die Entscheidung eine Quelle der Wahrheit besitzt. Stakeholder werden zu den Fragen eingeladen, bei denen sie Kontext oder Autorität haben, nicht zu jeder Mikroentscheidung.

Der Rhythmus soll Ruhe erzeugen: klare Übergaben, begrenzte Review-Fenster, wenige offene Grundsatzfragen und sichtbare nächste Entscheidungen. Geschwindigkeit entsteht bei SAPHIRWEB nicht durch Auslassen, sondern durch das Verhindern unnötiger Wiederholung.
## Was ein guter Übergang schützt

Ein Übergang ist gelungen, wenn die nächste Rolle nicht die gesamte vorherige Phase rekonstruieren muss. Sie erhält die relevante Entscheidung, ihre Begründung, den offenen Zweifel und das erwartete Artefakt. So bleibt Iteration möglich, ohne Verantwortung zu verwischen. Das schützt sowohl Geschwindigkeit als auch die Qualität der späteren Review.
