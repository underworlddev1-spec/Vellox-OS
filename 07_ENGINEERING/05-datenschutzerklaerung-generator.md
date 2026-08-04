# Datenschutzerklärung erzeugen: Codebase-Audit vor Fragebogen

Ein Generator wie der von e-recht24 stellt Fragen, die er selbst nicht beantworten kann. Er kennt weder den Code noch die tatsächlichen Integrationen eines Projekts. Er verlässt sich vollständig auf die Antworten der Person, die den Fragebogen ausfüllt. Wenn ein Sprachmodell diesen Fragebogen ausfüllt, ohne den echten Stand des Projekts zu prüfen, entsteht eine Datenschutzerklärung, die zur Vorstellung vom Projekt passt, nicht zu seiner Realität. Das ist kein kosmetischer Fehler. Eine Datenschutzerklärung, die eine Datenverarbeitung verschweigt, die tatsächlich stattfindet, oder eine nennt, die es gar nicht gibt, verfehlt ihren einzigen Zweck und untergräbt das Vertrauen, das sie eigentlich herstellen soll.

Die Regel für dieses Kapitel ist deshalb einfach zu benennen und leicht zu vergessen: Jede Antwort im Fragebogen ist eine Tatsachenbehauptung über den Code, keine Einschätzung. Sie wird durch eine Prüfung des Repositories belegt, nicht durch Wahrscheinlichkeit oder Erinnerung an ein ähnliches Projekt.

## Vor jeder Antwort: den Code fragen, nicht das Gedächtnis

Bevor ein einziges Kästchen angekreuzt wird, wird das Projekt auf die Kategorien durchsucht, nach denen Generatoren typischerweise fragen. Bei einer statischen oder serverarm gebauten Website wie einem VELLOX-Projekt lässt sich das fast vollständig über eine Suche im Quelltext klären:

```
# Externe Schriftarten
grep -rniE "fonts\.(google|gstatic)|@font-face" --include="*.html" --include="*.css" .

# Video- und Medien-Einbettungen
grep -rniE "youtube|vimeo|<iframe|<video|<embed" --include="*.html" --include="*.js" .

# Karten
grep -rniE "maps\.google|google\.com/maps|openstreetmap|mapbox" --include="*.html" --include="*.js" .

# Sicherheitstools (Captcha, Bot-Schutz)
grep -rniE "recaptcha|hcaptcha|turnstile|cloudflare" --include="*.html" --include="*.js" .

# CDNs und externe Skripte allgemein
grep -rniE "cdn\.|jsdelivr|unpkg|googleapis" --include="*.html" --include="*.js" --include="*.css" .

# Cookies und Consent
grep -rniE "document\.cookie|cookie-consent|localStorage" --include="*.js" .
```

Ein leeres Ergebnis ist eine positive Aussage, kein Ausweichen. Es bedeutet: Diese Kategorie trifft nicht zu, und die Antwort im Fragebogen lautet „Nein“, belegt durch die Abwesenheit von Treffern im tatsächlichen Code. Ein Treffer wird gelesen, nicht nur gezählt. `cdn.jsdelivr.net` in einer archivierten Notion-Exportdatei unter einem `Material`-Ordner ist etwas anderes als derselbe Treffer in `index.html`. Nur Code, der tatsächlich ausgeliefert wird, zählt für den Fragebogen.

## Die wiederkehrenden Kategorien eines Generators

Generatoren wie e-recht24 gliedern sich erfahrungsgemäß in einen wiederkehrenden Satz von Themenblöcken. Die genaue Formulierung einzelner Fragen ändert sich gelegentlich, die Kategorien dahinter kaum:

**Verantwortlicher und Hosting.** Name, Adresse, Kontaktdaten der verantwortlichen Stelle sowie der tatsächlich genutzte Hosting-Anbieter mit vollständiger Anschrift. Diese Angaben stehen üblicherweise bereits im Impressum des Projekts und werden von dort übernommen, nicht neu erfunden.

**Kontaktformular und Direktanfragen.** Hier fragt der Generator meist nur, *ob* ein Kontaktformular existiert, nicht *wie* es technisch zugestellt wird. Ein cleveres Formular ohne eigenen Server nutzt fast immer einen externen Formular-Dienst (etwa Web3Forms, Formspree oder einen vergleichbaren Anbieter), der als eigener Auftragsverarbeiter genannt werden muss. Dieser Dienst taucht im Fragebogen oft an keiner Stelle ausdrücklich auf und muss deshalb aus dem Code selbst identifiziert werden, siehe nächster Abschnitt.

**Cookies, Consent, Registrierung, Kommentarfunktion, Newsletter, Zahlungsdienste.** Bei den meisten VELLOX-Projekten (schlanke, statische Websites ohne Login, Warenkorb oder Tracking) treffen diese Kategorien nicht zu. Das wird nicht angenommen, sondern durch die Suche im Code bestätigt.

**Plugins und Tools.** Vier Unterfragen wiederholen sich fast wortgleich: externe Medien-/Video-Dienste, externe Schriftarten, externe Karten, Sicherheitstools, sonstige Plugins. Für ein selbst gehostetes System aus reinem HTML, CSS und Vanilla-JavaScript ohne CDN-Abhängigkeiten sind das fünf saubere „Nein“, siehe die Suchbefehle oben.

**Analyse-Tools und Online-Marketing.** Google Analytics, Matomo, Meta-Pixel, Retargeting. Ein Projekt ohne Tracking-Skript beantwortet das ehrlich mit „Nein“; das ist häufig sogar eine bewusste, dokumentierte Designentscheidung (siehe `06_SEO`) und kein Zufall.

**Externe Verweise, die kein Plugin sind.** Ein WhatsApp-Link, ein Link zu einem Partner-Shop oder ein Link zu einem Buchungssystem eines Drittanbieters wird von den meisten Generatoren nicht separat abgefragt, weil er kein eingebettetes Element ist, sondern ein reiner Verweis. Rechtlich bleibt trotzdem relevant, wohin ein Klick führt und ob dabei bereits vor dem Klick Daten übertragen werden. Diese Fälle werden manuell ergänzt, siehe unten.

## Wenn eine Frage nicht sicher zu beantworten ist

Nicht jede Frage lässt sich per Grep klären. Ob ein berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) oder eine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) die richtige Rechtsgrundlage für eine bestimmte Verarbeitung ist, ist eine rechtliche Einschätzung, keine technische Tatsache. Für diese Fälle gilt derselbe Grundsatz wie im Rest von VELLOX OS: Wenn eine belastbare Antwort fehlt, wird sie nicht erfunden, sondern als offene Frage an die verantwortliche Person zurückgegeben, mit der konkreten Unsicherheit benannt. Ein sauber dokumentiertes „das muss die Auftraggeberin oder eine Rechtsberatung entscheiden“ ist einer geratenen Antwort in jedem Fall vorzuziehen.

## Das Generator-Ergebnis ist ein Rohstoff, keine fertige Seite

Der vom Generator gelieferte Text ist in der Regel deutlich vollständiger und juristisch sauberer formuliert als eine selbst geschriebene Kurzfassung: Er nennt für jede Verarbeitung die passende Rechtsgrundlage, führt Speicherdauer, Widerspruchsrecht, Recht auf Datenübertragbarkeit und die SSL/TLS-Erläuterung eigenständig aus. Er wird deshalb als Grundgerüst übernommen, nicht verworfen. Zwei Schritte folgen trotzdem immer:

**Projektspezifische Lücken schließen.** Alles, was der Generator nicht kennen konnte, weil es keine eigene Frage dafür gab, wird nach demselben Muster ergänzt, das der Generator selbst für ähnliche Fälle verwendet. Ein Formular-Dienst wie Web3Forms bekommt einen eigenen Absatz „Auftragsverarbeitung durch [Dienst]“ nach dem Vorbild des Hosting-Abschnitts, mit Zweck, verarbeiteten Daten und dem Hinweis auf einen bestehenden AV-Vertrag. Ein externer Verweis wie ein WhatsApp-Link oder ein Partner-Shop bekommt einen kurzen eigenen Absatz, der den Anbieter nennt, klarstellt, dass die Website selbst keine Daten überträgt, bevor der Link aktiv angeklickt wird, und auf die Datenschutzbestimmungen des Ziels verweist.

**In die Struktur des Projekts übertragen.** Der HTML-Code, den ein Generator ausliefert, ist selten identisch mit der Semantik und Formatierung eines gewachsenen Projekts. Die Übertragung folgt festen Regeln: Die nummerierten Abschnitte des Generators (üblicherweise „1. Datenschutz auf einen Blick“ bis „4. Datenerfassung auf dieser Website“) werden zu `h2`, ihre Unterfragen zu `h3` oder, wenn eine vierte Ebene droht, zu einem fett hervorgehobenen Leitsatz innerhalb eines Absatzes, wenn das Projekt keine `h4`-Stile definiert. HTML-Entities (`&uuml;`, `&szlig;`, `&bdquo;` und Ähnliches) werden in echte UTF-8-Zeichen aufgelöst, nicht roh übernommen. Die Anrede wird an den Rest der Seite angeglichen, „Sie“ oder „du“, nicht gemischt. Ein Pflichthinweis, den die DSGVO in hervorgehobener Form verlangt, etwa das Widerspruchsrecht nach Art. 21 DSGVO, bleibt in Großbuchstaben stehen, auch wenn das dem sonstigen ruhigen Ton der Seite widerspricht; hier sticht die gesetzliche Formvorschrift die Markensprache. Nach der Übertragung wird die Datei auf ausgeglichene HTML-Tags geprüft, bevor sie committet wird.

## Dokumentation und Freigabe

Die Änderung wird wie jede andere Entscheidung im Projekt-Changelog mit Evidenz, Interpretation und Entscheidung festgehalten: Was hat der Generator geliefert, welche Lücke wurde erkannt und warum, was wurde konkret ergänzt oder nicht übernommen. Eine reine Textänderung an einer bestehenden HTML-Datei ohne CSS- oder JavaScript-Änderung braucht keine Erhöhung eines Cache-Busters.

Ein generierter und ergänzter Text ersetzt keine juristische Prüfung durch eine qualifizierte Person. Er ist eine solide, evidenzbasierte Grundlage, die eine Anwältin oder ein Anwalt in deutlich kürzerer Zeit freigeben kann als einen Text ohne klare Herkunft jeder einzelnen Aussage. Diese Grenze wird gegenüber dem Auftraggeber offen benannt, siehe [`10_CHECKLISTS/06-launch.md`](../10_CHECKLISTS/06-launch.md).

## Verwandte Kapitel

Die Trennung von Evidenz, Interpretation und Entscheidung folgt [`00_SYSTEM/02-entscheidungsframework.md`](../00_SYSTEM/02-entscheidungsframework.md). Die Bewertung von Drittanbietern als Abhängigkeit ist Teil von [`07_ENGINEERING/01-coding-standards.md`](01-coding-standards.md). Der Datenschutz-Punkt der Launch-Checkliste in [`10_CHECKLISTS/06-launch.md`](../10_CHECKLISTS/06-launch.md) verweist auf dieses Kapitel, sobald eine Datenschutzerklärung erzeugt oder aktualisiert wird.
