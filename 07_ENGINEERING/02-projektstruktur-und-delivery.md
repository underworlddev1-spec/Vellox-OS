# Projektstruktur und Delivery: Ein verlässlicher Übergang von Idee zu Betrieb

Projektstruktur ist dann gut, wenn ein neues Teammitglied schnell erkennt, wo Inhalte, UI, Daten, Assets, Tests und Konfigurationen liegen. Sie soll nicht die interne Organisation der Agentur abbilden, sondern die Änderungswege des Projekts. Ein Bereich, der gemeinsam geändert wird, sollte nicht über unklare Grenzen verteilt sein.

## Die Quelle der Wahrheit

Definiere für jede Ebene eine verantwortliche Quelle: Strategie und Entscheidungen in Dokumentation, Content in einem geeigneten redaktionellen Modell, UI-Regeln in Tokens und Komponenten, technische Konfiguration in versioniertem Code, SEO-Daten in klaren Metadatenstrukturen. Duplizierte Wahrheiten erzeugen Drift.

## Umgebungen und Konfiguration

Lokale Entwicklung, Preview, Staging und Produktion müssen unterscheidbare Zustände besitzen. Geheimnisse gehören nicht in das Repository. API-Endpunkte, Analyse-IDs, Feature-Schalter und Build-Konfigurationen werden dokumentiert und kontrolliert. Eine Preview muss möglichst nah an der späteren Laufzeit sein, damit Review nicht auf einer Fiktion stattfindet.

## Delivery in kleinen, prüfbaren Schritten

Liefer kleine Einheiten, die eine Entscheidung oder einen Seitenweg abschließen. Ein riesiger Commit erschwert Review und Rücknahme. Jeder Commit beschreibt die fachliche Absicht. Vor Übergabe werden Build, Links, Responsive-Verhalten, Accessibility, SEO und Performance in der passenden Tiefe geprüft.

## Inhalte und Assets

Assets erhalten verständliche Namen, Quellen und Verwendungsrechte. Bilder werden in passenden Größen bereitgestellt und mit sinnvollen Alternativen versehen. Ein Assets-Ordner ist kein Archiv für unentschiedene Möglichkeiten. Nicht verwendete Dateien erhöhen Such- und Wartungskosten.

## Betrieb nach dem Launch

Documentiere Monitoring, Fehlerkanäle, Redaktionswege, Rollback-Möglichkeit und Verantwortlichkeiten. Ein Launch ist keine magische Grenze zwischen Design und Betrieb. Die erste Nachbeobachtung gehört zum Delivery-Plan, weil echte Nutzung neue Evidenz liefert.
## Definition of Done

Eine Seite ist technisch fertig, wenn Produktionsbuild und lokale Umgebung dieselbe Kernfunktion zeigen, alle relevanten Zustände überprüft sind, Inhalte editierbar und Quellen nachvollziehbar sind, Links funktionieren und bekannte Risiken dokumentiert wurden. Die Definition darf pro Projekt erweitert werden, aber sie darf nicht auf „sieht auf meinem Bildschirm gut aus“ schrumpfen.

## Übergaben ohne Gedächtnislücke

Übergaben enthalten nicht nur Startbefehle. Sie erklären Architekturentscheidungen, Content-Quellen, Token, Komponenten, Build- und Deploymentwege, Monitoring, bekannte Grenzen und Ansprechpersonen. Ein neuer Mensch sollte eine kleine Änderung sicher durchführen können, ohne private Chatverläufe durchsuchen zu müssen.

## Rollback und Lernschleife

Jeder Launch besitzt einen Rückweg für den Fall, dass eine kritische Funktion oder Darstellung beschädigt wird. Nach dem Launch wird festgehalten, welche Checks geholfen haben, welche Warnung zu spät kam und welche Regel in das System zurückfließen sollte. Delivery ist damit ein Lernkreislauf und nicht nur ein Übergabepunkt.
## Abhängigkeiten bewusst wählen

Jede Bibliothek vergrößert nicht nur den Bundle-Umfang, sondern auch Wartung, Sicherheitsprüfung, API-Risiko und Onboarding. Bevorzuge eine Abhängigkeit, wenn sie eine echte Komplexität zuverlässig löst und ihr Lebenszyklus kontrollierbar ist. Für kleine Aufgaben ist eine klare lokale Lösung oft belastbarer als ein weiteres Paket.

## Accessibility und SEO als Build-Signale

Integriere wiederkehrende Prüfungen in den Build oder die Review-Routine: fehlerhafte Links, fehlende Alternativtexte, ungültiges HTML, fehlende Titel, unzulässige Zustände und unerwartete Layoutverschiebungen. Automatisierung soll Aufmerksamkeit auf Risiken lenken. Sie darf den Menschen nicht vorgaukeln, dass eine grüne Pipeline die gesamte Erfahrung bewertet.

## Übergabe an Betrieb

Definiere nach dem Launch, wer Inhalte pflegt, wer technische Fehler bewertet, wer externe Dienste verwaltet und wer eine Rücknahme auslösen darf. Zuständigkeit ist eine technische Voraussetzung für Qualität. Ohne sie werden veraltete Preise, kaputte Links oder schleichende Performanceverluste erst sichtbar, wenn Vertrauen bereits beschädigt ist.
## Release-Check mit Nutzerweg

Vor einem Release wird mindestens ein kritischer Weg von außen nach innen durchgespielt: Einstieg über eine Such- oder Kampagnenseite, Navigation, Inhaltsvertiefung, primäre Handlung, Fehlerfall und Bestätigung. Dabei werden sichtbare, semantische und technische Zustände gemeinsam bewertet. Ein Build kann grün sein und dieser Weg trotzdem unverständlich oder unbedienbar.

## Migrationshygiene

Relaunches brauchen eine Liste alter und neuer Seiten, Inhalte, URLs, Assets, Trackingpunkte und Verantwortlichkeiten. Entferne nichts nur, weil es im neuen Layout nicht vorgesehen ist. Prüfe zuerst, ob Suchintention, Kundenfragen oder externe Links daran hängen. Eine bewusste Entfernung ist möglich, aber sie braucht einen Grund und einen Rückweg für Menschen, die noch ankommen.

## Entscheidungen rückverfolgen

Verlinke im Code oder in der Projektdokumentation auf die fachliche Entscheidung, wenn eine Implementierung ungewöhnlich ist. Ein späteres Team sollte erkennen, ob es mit einer technischen Einschränkung, einer Markenregel oder einem offenen Risiko zu tun hat. Rückverfolgbarkeit verkürzt Diagnose und schützt vor versehentlicher Rückkehr zu einem verworfenen Muster.
## Pflegekosten sichtbar machen

Jede Projektstruktur erzeugt spätere Kosten. Unklare Assets, doppelte Contentquellen, unversionierte Integrationen und manuelle Sonderwege werden deshalb als Betriebsschulden dokumentiert. Bei einer Entscheidung zwischen zwei Implementierungen wird nicht nur der Launchaufwand, sondern die erwartete Pflege über den Lebenszyklus betrachtet.
## Wartung als Übergabeversprechen

Ein Projekt ist technisch gut ausgeliefert, wenn die nächste Person nicht nur starten, sondern sicher ändern kann. Dokumentiere deshalb auch bekannte Stolperstellen und bewusst einfache Lösungen. Weniger spektakulärer Code ist oft wertvoller, wenn er die spätere Pflege und die ursprüngliche Markenlogik zuverlässig bewahrt.
