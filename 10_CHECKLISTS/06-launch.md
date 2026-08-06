# Checkliste: Launch

Ein Launch ist die kontrollierte Übergabe von Gestaltung, Technik, Inhalt und Betrieb. Die Checkliste prüft den realen Zustand der Produktion, nicht nur die Vorschau. Ein Punkt gilt erst als abgeschlossen, wenn ein Nachweis vorhanden ist und eine verantwortliche Person die Konsequenz kennt.

| Prüfung | Warum sie zählt | Nachweis |
|---|---|---|
| Produktionsbuild wurde geprüft | Entwicklung kann sich von Produktion bei Assets, Environment und Routing unterscheiden. | Build- und Preview-Log. |
| Domains, TLS und Redirects funktionieren | Der Einstieg darf keine technische Unsicherheit erzeugen. | URL- und Statuscodeprüfung. |
| Kernjourneys funktionieren | Besucher müssen Orientierung, Auswahl, Kontakt und Bestätigung sicher durchlaufen können. | Szenario-Test. |
| Formulare und Benachrichtigungen sind echt getestet | Ein hübscher Abschluss ohne interne Zustellung ist ein Geschäftsfehler. | Testanfrage mit Folgeantwort. |
| Content und Metadaten sind aktuell | Alte Preise, Zeiten oder Claims beschädigen Vertrauen und SEO. | Inhaltsfreigabe. |
| Accessibility-Stichprobe ist bestanden | Launch darf keine zentrale Gruppe vom Weg ausschließen. | Tastatur, Zoom, Fokus, Screenreader-Stichprobe. |
| Performance-Budget ist eingehalten oder Risiko dokumentiert | Last wirkt unmittelbar auf Nutzung und Markenwahrnehmung. | Messbericht mit Testumgebung. |
| Analytics und Consent sind geprüft | Messung darf nicht die Privatsphäre oder Kernfunktion beschädigen. | Ereignis- und Datenschutzcheck. |
| Datenschutzerklärung stimmt mit echten Integrationen überein | Ein generierter Text ist nur so vollständig wie sein Fragebogen; Formular-Dienste und externe Verweise fehlen dort oft. | Codebase-Audit nach [`07_ENGINEERING/05-datenschutzerklaerung-generator.md`](../07_ENGINEERING/05-datenschutzerklaerung-generator.md). |
| Backup und Rücknahmeweg existieren | Ein kontrollierter Rückweg begrenzt Schaden bei kritischem Fehler. | Rollback-Anweisung. |
| Zuständigkeiten nach Launch sind übergeben | Qualität endet nicht mit Veröffentlichung. | Betriebs- und Pflegebrief. |
| Monitoring und erste Nachbeobachtung sind terminiert | Echte Nutzung liefert neue Evidenz, die das System verbessern kann. | Termin und Messplan. |

Der Launch wird freigegeben, wenn Kernwege stabil sind und jedes verbleibende Risiko eine bewusste Entscheidung besitzt. „Später prüfen“ ohne Termin oder Besitzer ist kein akzeptierter Zustand, sondern ein offener Fehler.
## Launch-Kommunikation

Vor dem Umschalten erhalten alle Beteiligten eine klare Information über Zeitpunkt, Verantwortliche, erwartetes Verhalten und Eskalationsweg. Redaktion weiß, wann Inhalte gesperrt oder aktualisiert werden dürfen. Support und Kunde kennen die häufigsten neuen Wege und die Stelle, an der Fehler gemeldet werden. Kommunikation ist ein Teil der technischen Stabilität.

## Erste 24 Stunden

Prüfe nach dem Launch echte URLs, Formulare, Logs, Tracking, Suchzugriff, mobile Darstellung und wichtige externe Profile. Vergleiche nicht nur Screenshots, sondern die Kernaufgaben. Kleine Abweichungen werden nach Ursache sortiert: Inhalt, Deployment, Integration, Browser, Performance oder Prozess.

## Abschluss

Ein Launch ist erst abgeschlossen, wenn Produktion stabil ist, die Rücknahme möglich bleibt und die erste Lernschleife terminiert wurde. „Online“ ist ein Zustand; Betrieb und Nachbeobachtung sind die Verantwortung dahinter.
## Fallbacks

Prüfe, was bei Ausfall von JavaScript, Drittanbieter, E-Mail, Video, Consent oder externer API passiert. Die Kerninformation und eine realistische Kontaktmöglichkeit dürfen nicht vollständig an einer einzelnen Abhängigkeit hängen. Fallbacks werden nicht erst erfunden, wenn der Ausfall eintritt.

## Kundenübergabe

Übergebe Zugang, Pflegeanleitung, Content-Quellen, Designsystem, bekannte Grenzen, Monitoring und Ansprechpartner. Erkläre außerdem, welche Änderungen ohne Risiko sind und welche eine fachliche Prüfung brauchen. Ein Kunde sollte wissen, wie er eine Öffnungszeit aktualisiert, ohne Layout oder SEO-Struktur zu beschädigen.

## Lerntermin

Setze einen konkreten Termin für die erste Nachbeobachtung. Prüfe technische Signale, Suchzugriffe, Anfragen, Rückfragen und redaktionelle Probleme. Die Erkenntnisse werden nach Fachbereich sortiert und entweder im Projekt oder in SAPHIRWEB OS dokumentiert.
## Go/No-Go

Definiere vor dem Launch, welche Fehler einen Stopp auslösen: nicht erreichbare Kernseite, verlorene Formulardaten, falsche rechtliche oder lokale Information, fehlender Fokus, kritische Performance oder unkontrollierte Drittanbieter. Kleinere visuelle Abweichungen können akzeptiert werden, wenn Absicht und Kernweg erhalten bleiben.

## Nachweisarchiv

Speichere Screenshots, Testdaten, Messumgebung, Redirect-Liste, Formularbestätigung, Rollback-Weg und offene Risiken. Ein späterer Fehler lässt sich schneller untersuchen, wenn der Launchzustand bekannt ist. Dokumentation ist hier kein Zusatz, sondern Teil der Wiederherstellbarkeit.
## Verantwortungsübergabe

Der Launch-Check wird mit einer Person abgeschlossen, die im Betrieb Entscheidungen treffen kann. Sie bestätigt nicht nur, dass die Seite sichtbar ist, sondern dass Kontaktwege, Öffnungszeiten, Daten, Inhalte und Rückfragen im Alltag getragen werden. Ein Launch ohne operative Eigentümerschaft ist technisch möglich und organisatorisch fragil.

## Kommunikationsqualität

Die erste Bestätigung, E-Mail oder menschliche Antwort wird wie ein UI-Zustand geprüft. Tonalität, Frist, Datenschutz und nächster Schritt müssen zum CTA passen. Die Marke endet nicht an der Grenze des Browsers.
## Rückfallplan

Ein Rückfallplan nennt Auslöser, Entscheidungsperson, technische Schritte und Kommunikationsweg. Er wird einmal vor dem Launch ausprobiert oder zumindest durchgesprochen. Der Plan muss nicht jede Kleinigkeit abdecken. Er muss kritische Auswirkungen schnell begrenzen können.
## Launch als Lernbeginn

Die erste Woche wird nicht mit spontanen Optimierungen überladen. Zuerst werden Fehler, tatsächliche Rückmeldungen und erwartete Signale gesammelt. Danach trennt das Team technische Defekte von neuen Fragen und strategischen Chancen. Diese Ruhe verhindert, dass einzelne frühe Zahlen den gesamten Auftritt wieder in eine andere Richtung ziehen.
