# Technisches SEO: Auffindbarkeit als Systemqualität

Technisches SEO sorgt dafür, dass Suchmaschinen und Menschen eine Seite zuverlässig erreichen, verstehen und nutzen können. Es ist nicht die technische Abteilung der Redaktion. Es ist die Prüfung, ob Struktur, Inhalt, Performance und Indexierung dieselbe Absicht tragen.

## Crawling und Indexierung

Jede wichtige Seite braucht eine klare, erreichbare URL, interne Verlinkung und einen sinnvollen Indexierungsstatus. Vermeide verwaiste Inhalte, unkontrollierte Parameter, doppelte Versionen und Seiten, die nur über Formulare erreichbar sind. `robots.txt`, Canonical-Referenzen, Sitemaps und Statuscodes müssen die tatsächliche Inhaltsarchitektur abbilden, nicht eine alte Projektstruktur.

Nicht jede Meldung über eine nicht indexierte Adresse ist ein Defekt. „Gefunden – zurzeit nicht indexiert" ist eine Warteschlange und eine Frage des Abrufbudgets, „gecrawlt – zurzeit nicht indexiert" ein inhaltlicher Befund, und „alternative Seite mit korrektem kanonischem Tag" die Bestätigung, dass die Einrichtung funktioniert. Die Unterscheidung entscheidet darüber, ob an der Seite oder außerhalb gearbeitet wird; sie steht in [Verweise von außen](06-verweise-von-aussen.md).

Indexierung ist kein Selbstzweck. Nicht jede Seite muss sichtbar sein. Interne Suchergebnisse, leere Filterkombinationen, technische Varianten oder vertrauliche Bereiche können bewusst ausgeschlossen werden. Wichtig ist, dass Ausschluss, Linkstruktur und Nutzererwartung übereinstimmen.

## Semantik und Dokumentstruktur

Semantisches HTML hilft Browsern, assistiven Technologien und Suchmaschinen, die Rolle eines Inhalts zu verstehen. Überschriften, Listen, Tabellen, Navigation, Main, Footer, Formulare und Buttons werden nach ihrer Bedeutung verwendet, nicht nach ihrer Standardoptik. Ein `div` kann visuell alles darstellen, erklärt aber keine Struktur.

Jede Seite braucht einen eindeutigen inhaltlichen Schwerpunkt. Titel, Hauptüberschrift, Meta Description, strukturierte Daten und sichtbarer Inhalt dürfen variieren, aber nicht widersprechen. Der [Engineering-Bereich zu Accessibility](../07_ENGINEERING/04-accessibility-und-animation.md) beschreibt, warum Semantik mehr ist als SEO.

## URLs und Weiterleitungen

URLs sollten lesbar, stabil und nach dem Inhalt benannt sein. Eine Änderung kann sinnvoll sein, aber sie braucht eine Weiterleitung, eine aktualisierte interne Verlinkung und eine Prüfung auf alte Kampagnen oder externe Verweise. Die technische Sauberkeit eines Relaunches wird oft an den unsichtbaren Übergängen entschieden.

## Datenqualität und Prüfungen

Automatisierte Checks können Statuscodes, Canonicals, Broken Links, fehlende Titel, Überschriften, Sitemap und strukturierte Daten prüfen. Sie ersetzen keine manuelle Sichtung. Ein Tool kann melden, dass ein Titel vorhanden ist; es kann nicht zuverlässig beurteilen, ob der Titel die richtige Erwartung erzeugt.

Definiere einen SEO-Gate für Projektstart, Content-Freigabe und Launch. Die [SEO-Checklisten](../10_CHECKLISTS/05-seo-review.md) verbinden diese Gates mit Nachweisen. So wird technisches SEO zu einer wiederholbaren Qualitätssicherung statt zu einer letzten Reparaturrunde.
## Rendering und Client-Verhalten

Prüfe, welche Inhalte bereits im ausgelieferten Dokument vorhanden sind und welche erst durch JavaScript erscheinen. Die Kerninformation, Navigation und wichtige Links sollten nicht von einer einzelnen Laufzeitbedingung abhängen. Interaktionen dürfen reichhaltig sein, aber der wesentliche Inhalt braucht eine robuste Grundlage.

## Internationale und mehrsprachige Projekte

Bei mehreren Sprachen werden Sprachkennzeichnung, URL-Struktur, Übersetzungsqualität, interne Links und Metadaten gemeinsam geplant. Eine maschinelle Übersetzung ohne redaktionelle Prüfung kann sowohl Vertrauen als auch Suchintention beschädigen. Sprache ist eine eigene Inhaltsversion, keine austauschbare Textvariable.

## Technische Schulden sichtbar machen

Dokumentiere offene SEO-Risiken mit Auswirkung, Ursache und nächstem Prüfpunkt. So können spätere Verbesserungen priorisiert werden. Ein Audit, das nur eine Fehlerliste liefert, hilft weniger als ein kleiner Katalog begründeter Entscheidungen.
## Mobile und internationale Robustheit

Technische SEO-Prüfungen werden auf mobilen Ansichten und, wenn relevant, in mehreren Sprachen durchgeführt. Achte auf `lang`-Angaben, hreflang-Logik, korrekte Datums- und Adressdarstellung, interne Verlinkung und den Umstand, dass eine übersetzte Seite auch tatsächlich inhaltlich vollständig ist. Eine sprachlich erreichbare Seite, die auf der falschen Version landet, ist keine gute Erfahrung.

## URLs als langfristige Schnittstelle

Eine URL wird von Menschen, Suchmaschinen, Kampagnen, Bookmarks und externen Empfehlungen verwendet. Ändere sie daher nicht wegen einer kurzfristigen Stilpräferenz. Wenn eine Änderung notwendig ist, prüfe Weiterleitungsketten, Canonical, Sitemap, interne Links, Analytics und alte Marketingmaterialien. Stabilität ist oft wertvoller als eine minimal elegantere Struktur.

## Technischer Nachweis

Halte für den Launch einen kleinen Nachweis fest: gecrawlte URL-Liste, Statuscodeprüfung, Indexierungsentscheidung, Sitemap, Canonicals, semantische Stichprobe, mobile Prüfung und offene Risiken. Ein Nachweis macht spätere Diagnose schneller und zeigt, welche Annahmen tatsächlich geprüft wurden.
## Statuscodes als Sprache

Statuscodes kommunizieren, ob ein Inhalt existiert, verschoben wurde oder nicht erreichbar ist. Prüfe vor dem Launch nicht nur die Startseite, sondern alte URLs, Kampagnenlinks, Medienpfade, Formulare und mögliche Serverfehler. Ein scheinbar kleiner 404 kann ein wertvoller Einstieg sein, wenn er einen passenden Rückweg anbietet; ein stiller Redirect auf die Startseite kann dagegen Orientierung zerstören.

## Architektur und Crawlbudget

Vermeide unendliche technische Kombinationen aus Filtern, Parametern und Sortierungen, wenn sie keine eigenständige Suchintention bedienen. Die Website soll Suchmaschinen nicht mit Varianten beschäftigen, die Menschen nie als eigene Antwort brauchen. Bewusste Begrenzung verbessert Wartbarkeit und hält die Inhaltsarchitektur lesbar.

## Sicherer Betrieb

Technisches SEO wird auch durch TLS, sichere Abhängigkeiten, korrekte Header, stabile Deployments und respektvollen Umgang mit Bots getragen. Eine öffentliche Seite muss erreichbar sein, ohne interne Debug-Informationen preiszugeben. Dokumentiere Verantwortlichkeiten für Hosting, DNS, Redirects und Search-Console-Zugänge.
## Wartbare Indexierung

Eine indexierbare Seite braucht nicht nur korrekte Tags, sondern eine dauerhafte redaktionelle Rolle. Wenn ein Inhalt nicht gepflegt, nicht verlinkt oder nicht mehr relevant ist, wird über Aktualisierung, Zusammenführung oder Entfernung entschieden. Technische Ordnung und Inhaltsordnung müssen dieselbe Lebensdauer besitzen.
