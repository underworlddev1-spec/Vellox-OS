# Coding Standards: Code als Träger von Entscheidungen

VELLOX-Code soll nicht nur funktionieren, sondern die Absicht der Gestaltung sichtbar und veränderbar halten. Lesbarer Code schützt die Marke vor späteren Zufallsänderungen. Er zeigt, welche Regeln systemisch sind, welche Inhalte dynamisch sind und wo eine bewusste Ausnahme beginnt.

## Lesbarkeit vor Cleverness

Bevorzuge klare Namen, kleine Verantwortlichkeiten und eine vorhersehbare Struktur. Ein kurzer Trick, den niemand sicher ändern kann, ist teurer als einige zusätzliche Zeilen. Komponenten, Funktionen und Datenmodelle sollten die Sprache des Projekts sprechen, nicht nur die Sprache des Frameworks.

Kommentare erklären das Warum, nicht das Offensichtliche. Wenn ein ungewöhnlicher Wert nötig ist, dokumentiere die inhaltliche oder technische Bedingung. Wenn sich eine Struktur nicht ohne Kommentar erklären lässt, prüfe zuerst, ob sie vereinfacht werden kann.

## Semantik und Zustände

Verwende HTML-Elemente nach Bedeutung und nicht nach Standardstil. Buttons lösen Aktionen aus, Links führen zu Zielen, Überschriften ordnen Inhalte, Formulare erklären Datenaustausch. Zustände werden explizit modelliert, damit Loading, Error, Empty, Success, Disabled und Focus nicht als nachträgliche CSS-Fälle entstehen.

Die UI-Dokumentation in [`04_UI`](../04_UI) beschreibt die erwartete Erfahrung. Engineering stellt sicher, dass diese Zustände auch mit Tastatur, langsamer Verbindung, langen Inhalten und Fehlern existieren.

## Daten und Inhalt trennen

Copy, Medien und strukturierte Inhalte sollten nicht unnötig in Komponenten dupliziert werden. Eine Quelle der Wahrheit erleichtert Pflege, Übersetzung, SEO und Tests. Gleichzeitig darf die Datenabstraktion nicht so generisch werden, dass redaktionelle Entscheidungen unverständlich sind.

## Fehler und Abhängigkeiten

Fehler werden sichtbar behandelt, nicht still verschluckt. Externe Abhängigkeiten werden begrenzt, versioniert und auf ihren Nutzen geprüft. Ein Drittanbieter-Skript darf nicht ohne Fallback die Kernhandlung blockieren. Security, Datenschutz und Performance werden als Teil der Abhängigkeit bewertet.

## Review und Tests

Code-Reviews prüfen nicht nur Stil. Sie fragen: Bleibt die UX-Absicht erkennbar? Sind Zustände vollständig? Ist die Lösung auf den vorgesehenen Geräten stabil? Können spätere Änderungen ohne Sonderfallkaskade erfolgen? Automatisierte Tests sichern wiederkehrende Logik; manuelle Checks prüfen Bedeutung, Visuelles und reale Nutzung.

Für die gestalterischen und rechtlichen Regeln gilt zusätzlich die [Prüfdoktrin](../00_SYSTEM/06-pruefdoktrin.md): Jede Regel des Projekts nennt ihren Nachweis, jeder Nachweis ist ein Programm, das mit einem Rückgabewert ungleich null endet, und jede neue Prüfung weist mit einer Gegenprobe nach, dass sie den Fehler wirklich findet. Das Werkzeug dafür kommt als Kit aus [`12_PRUEFSTAND`](../12_PRUEFSTAND/README.md) und wird nicht je Projekt neu erfunden.
## Änderbarkeit als Qualitätskriterium

Bewerte eine Lösung danach, wie sicher die nächste sinnvolle Änderung sein wird. Wenn eine Headline länger wird, ein Buttontext übersetzt wird, eine Karte fehlt oder ein Dienstleister ausfällt, sollte der Code die Änderung aufnehmen, ohne die Kernlogik zu beschädigen. Diese Art von Robustheit ist gerade für Agenturprojekte wichtig, weil Pflege oft von Menschen übernommen wird, die nicht am ersten Entwurf beteiligt waren.

## Branches und Commits

Arbeite in kleinen, nachvollziehbaren Einheiten. Ein Commit sollte eine fachliche Absicht besitzen und Tests oder relevante Checks im gleichen Zustand hinterlassen. Vermeide gemischte Änderungen, bei denen ein visueller Fix, ein Refactor und ein unverbundener Contentwechsel nicht mehr getrennt beurteilt werden können.

## Reviewfragen

Ein Review prüft Namen, Semantik, Zustände, Fehlerbehandlung, Performance, Accessibility und Rückwärtskompatibilität. Es fragt außerdem, ob die neue Abstraktion wirklich mehrfach gebraucht wird. Wiederverwendung ist kein Selbstzweck; sie ist dann wertvoll, wenn sie dieselbe Regel zuverlässig schützt.
## Performance im Code

Performance wird nicht durch eine einzelne Optimierung hergestellt. Vermeide unnötige Arbeit im Hauptthread, lade nicht benötigte Funktionen erst bei Bedarf und halte Medien sowie Drittanbieter unter bewusster Kontrolle. Ein visueller Wunsch muss seine Kosten kennen: zusätzliche Berechnung, Netzwerk, Layout, Speicher und Pflege.

## Datenvalidierung und Vertrauen

Eingaben werden sowohl im Interface als auch auf der vertrauenswürdigen Serverseite validiert. Clientseitige Hinweise verbessern die Erfahrung, sind aber kein Sicherheitsmechanismus. Fehlermeldungen geben genug Information für die Korrektur, ohne interne Details oder sensible Daten zu verraten.

## Code und Designsystem

Die Namen im Code sollen die Begriffe des Designsystems und der Inhaltsarchitektur wiedererkennen lassen. Wenn Designer, Redakteur und Entwickler dieselbe Komponente mit verschiedenen Namen meinen, entstehen Übersetzungsverluste. Ein kleines Glossar oder eine klare Token-Dokumentation kann diese Reibung deutlich reduzieren.
## Abstraktion mit Ablaufdatum

Eine Abstraktion wird nicht dadurch gut, dass sie früh existiert. Prüfe, ob sie mindestens zwei echte Verwendungen vereinheitlicht, ob ihre Ausnahmefälle verständlich bleiben und ob sie ohne versteckte Kopplung getestet werden kann. Wenn nicht, ist lokale Klarheit zunächst die bessere Entscheidung. Später kann aus wiederholter Praxis ein stärkeres Muster entstehen.

## Sicherheit als Teil der Qualität

Behandle Nutzereingaben, externe Inhalte und Integrationen als nicht vertrauenswürdig. Escaping, Berechtigungen, sichere Defaults, Schutz sensibler Daten und kontrollierte Fehlerausgaben gehören in die normale Implementierung. Eine Premium-Marke kann keine souveräne Erfahrung liefern, wenn das System fahrlässig mit Vertrauen umgeht.

## Dokumentierte Abweichung

Wenn ein Standard nicht passt, dokumentiere die Abweichung direkt bei der Entscheidung: welche Regel wird verlassen, warum, mit welchem Risiko und mit welchem Prüfdatum. So bleibt die Ausnahme sichtbar und kann später bestätigt oder zurückgeführt werden. Stille Sonderlogik ist die häufigste Ursache für spätere Inkonsistenz.
## Wartbarkeit als Markenerhalt

Wenn Code schwer zu ändern ist, wird auch die Marke mit der Zeit ungenauer. Redakteure vermeiden dann Updates, Entwickler kopieren Sonderfälle und Designer rechnen mit Einschränkungen, die niemand mehr erklären kann. Klare Standards halten die ursprüngliche Hierarchie und Sprache auch in der dritten, vierten und fünften Änderung lebendig.
