# Performance und Core Web Vitals: Qualität unter echten Bedingungen

Performance ist ein Bestandteil der Marke. Eine ruhige, präzise Oberfläche, die spät erscheint oder bei Interaktion stockt, widerspricht ihrem eigenen Versprechen. Geschwindigkeit wird daher nicht erst gemessen, wenn das Design fertig ist. Sie wird als Rahmen für Bilder, Fonts, Animationen, JavaScript und Architektur festgelegt.

## Der reale Kontext

Prüfe nicht nur auf einem schnellen Entwicklungsgerät. Menschen nutzen unterschiedliche Netzwerke, Prozessoren, Bildschirme, Browser und Energiesituationen. Mobile Geräte können große Bilder und aufwendige Effekte besonders teuer machen. Ein Performance-Ziel braucht deshalb eine definierte Testumgebung, repräsentative Seiten und reale Inhalte.

## Wahrnehmung und Messung

Messwerte sind wichtig, aber sie beschreiben unterschiedliche Erfahrungen: Wann erscheint der zentrale Inhalt? Wann reagiert die Seite zuverlässig? Bleibt das Layout stabil? Verfolge die aktuellen offiziellen Definitionen und Schwellenwerte der Web-Vitals, weil sich Standards weiterentwickeln können. Dokumentiere im Projekt, welche Messung mit welcher Quelle und welchem Gerät durchgeführt wurde.

Die Nutzerwahrnehmung bleibt der Kontext. Ein schneller technischer Start hilft wenig, wenn der erste sichtbare Text keine Relevanz besitzt. Umgekehrt kann eine bewusst geladene, aber relevante Darstellung besser wirken als eine leere Seite, die nur früh etwas Beliebiges zeigt.

## Budgetieren

Lege Budgets für Bildgewicht, Schriftvarianten, JavaScript, Drittanbieter und Animation fest. Jedes zusätzliche Asset braucht einen Nutzen. Responsive Bilder, moderne Formate, korrekte Größen, Lazy Loading für nachgelagerte Inhalte und frühe Priorisierung des Hauptinhalts gehören zur Umsetzung, nicht zur letzten Politur.

Zwei Auslieferungsfallen treten erst beim Gast auf und bleiben im Build unsichtbar: ein AVIF, das ein Browser meldet, aber nicht dekodiert und ohne Rückfall leer zeigt, und ein Schriftwechsel, der ohne metrisch angepasste Fallback-Schrift das Layout springen lässt und den CLS verdirbt. Beide und ihre Lösung stehen in [Der Build ist nicht der Browser des Gastes](../07_ENGINEERING/06-der-build-ist-nicht-der-browser-des-gastes.md).

Fonts werden auf Rollen begrenzt und mit Fallbacks getestet. Drittanbieter-Skripte werden nur eingesetzt, wenn ihr geschäftlicher oder funktionaler Wert nachgewiesen ist. Tracking, Chat, Video und externe Widgets sind Teil des Performance-Budgets und dürfen nicht als kostenlos betrachtet werden.

## Layout-Stabilität und Bewegung

Reserviere Raum für Bilder, Medien und dynamische Inhalte, damit das Layout nicht springt. Animationen dürfen nicht die Interaktionsbereitschaft verzögern. Schwere Hero-Videos brauchen eine statische, aussagekräftige Alternative und müssen auf kleinen Geräten oder bei reduzierter Verbindung anders behandelt werden.

## Performance als Review-Gate

Vor dem Launch werden wichtige Templates mit Produktionsbuild, realen Medien und den vorgesehenen Drittanbietern gemessen. Nach dem Launch werden technische Signale beobachtet und mit qualitativen Rückmeldungen verbunden. Der [Launch-Check](../10_CHECKLISTS/06-launch.md) dokumentiert, welche Budgets, Geräte und Ergebnisse freigegeben wurden.
## Performance und Designentscheidungen

Besprich Performance bereits bei der Konzeption von Hero, Bildgalerie, Video, Schriften und Drittanbieterfunktionen. Ein Effekt, der nur bei voller Auflösung wirkt, kann in einer kleineren, komprimierten oder statischen Variante anders geplant werden. Frühe Entscheidungen sind günstiger als spätes Wegschneiden.

## Labordaten und Felddaten

Labormessungen helfen beim Debugging unter kontrollierten Bedingungen. Felddaten zeigen, wie reale Geräte und Verbindungen die Erfahrung wahrnehmen. Beide Quellen werden getrennt benannt und nicht miteinander vermischt. Ein guter Score unter idealen Bedingungen ist kein Beweis für Alltagstauglichkeit.

## Nachhaltigkeit und Betrieb

Weniger Daten, weniger CPU-Zeit und weniger unnötige Drittanbieter sind nicht nur Performance-Maßnahmen. Sie reduzieren Last für Menschen, Geräte und Infrastruktur. Nach dem Launch wird geprüft, ob neue Inhalte, Tags oder Medien das Budget schleichend verbrauchen.
## Medienstrategie

Bildauswahl, Zuschnitt, Kompression, responsive Quellen und Alt-Texte werden gemeinsam entschieden. Ein großes Bild kann in einem Hero sinnvoll sein, wenn es den Kern beweist; ein dekoratives Detail darf nicht dasselbe Budget verbrauchen. Video wird nur eingesetzt, wenn die Bewegung oder das echte Material einen relevanten Gedanken besser trägt als ein statisches Bild.

## Drittanbieter und Datenschutz

Analytics, Consent, Chat, Maps, Fonts und Videos können Ladezeit, Datenschutz und Stabilität beeinflussen. Liste ihre Abhängigkeiten, prüfe ihre Ladebedingungen und definiere, was ohne Zustimmung oder bei Ausfall passiert. Eine Website, die ihre Kernaufgabe nur mit fünf externen Diensten erfüllt, besitzt ein unnötig fragiles System.

## Regressionen vermeiden

Performance wird nach Änderungen an Templates, Bildern, Schriften, Tracking und Navigation erneut geprüft. Speichere Vergleichswerte und die Testumgebung. So lässt sich erkennen, ob eine Verschlechterung aus Code, Content oder Infrastruktur stammt, statt nur einen diffusen „Performanceverlust“ zu melden.
## Kritischer Pfad

Definiere den kleinsten Pfad, der den ersten sinnvollen Besuch ermöglicht: Dokument, Hauptstil, Hauptschrift falls wirklich nötig, Kernbild oder -text und primäre Handlung. Alles, was erst nach dieser Erfahrung gebraucht wird, sollte den kritischen Pfad nicht blockieren. Diese Entscheidung wird gemeinsam mit UX getroffen, weil ein leeres schnelles Dokument keine gute Antwort ist.

## Cache und Aktualität

Caching kann Performance verbessern, darf aber nicht dazu führen, dass Öffnungszeiten, Preise, Verfügbarkeit oder wichtige Inhalte veraltet erscheinen. Definiere, welche Assets lange stabil sind und welche Inhalte schnell aktualisiert werden müssen. Ein Release-Prozess muss Cache-Invalidierung und Rücknahme berücksichtigen.

## Budget als Teamvertrag

Performance-Budgets funktionieren nur, wenn Design, Redaktion, Engineering und Marketing sie gemeinsam kennen. Jede neue externe Funktion oder Medienidee nennt ihren erwarteten Nutzen und ihren technischen Preis. So wird Performance nicht zum Verbot, sondern zu einem sichtbaren Teil der Produktentscheidung.
