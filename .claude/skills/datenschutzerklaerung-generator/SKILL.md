---
name: datenschutzerklaerung-generator
description: Hilft dabei, den Fragebogen eines Datenschutzerklärung-Generators (z. B. e-recht24.de) korrekt auszufüllen und dessen generiertes Ergebnis (PDF, Text oder HTML) sauber in ein Projekt als datenschutz.html zu integrieren. Immer verwenden, wenn der Nutzer Fragen aus einem DSGVO-/Datenschutz-Fragebogen beantwortet haben möchte (auch als Screenshot oder Bildschirmfoto einzelner Fragen wie "Plugins und Tools", "Cookies", "Hosting"), wenn ein Generator-Ergebnis (PDF/HTML-Quellcode) als neue Datenschutzerklärung übernommen werden soll, oder wenn allgemein von "e-recht24", "Datenschutzerklärung generieren", "Datenschutz-Fragebogen" oder "DSGVO-Text für die Website" die Rede ist. Auch dann verwenden, wenn der Nutzer nur eine einzelne Frage aus so einem Fragebogen zeigt und fragt, was zutrifft.
---

# Datenschutzerklärung-Generator: Fragebogen und Integration

Dieser Skill trägt den vollständigen Workflow in [`07_ENGINEERING/05-datenschutzerklaerung-generator.md`](../../07_ENGINEERING/05-datenschutzerklaerung-generator.md). Lies diese Datei, sobald der Skill auslöst; sie enthält die Begründung, die Grep-Muster und die Übertragungsregeln im Detail. Dieser Skill fasst nur die operativen Schritte zusammen.

## Wenn eine Fragebogen-Frage beantwortet werden soll

Rate nicht. Jede Antwort ist eine Tatsachenbehauptung über den tatsächlichen Code des Projekts, das gerade bearbeitet wird, nicht über ein typisches Projekt oder eine Erinnerung an ein ähnliches. Bevor eine Frage beantwortet wird:

1. Bestimme, welche Kategorie die Frage abdeckt (externe Schriftarten, Video-/Medien-Einbettungen, Karten, Sicherheitstools/Captcha, CDNs, Cookies/Tracking, Analyse-Tools, Zahlungsdienste, Kommentar- oder Registrierungsfunktion, Newsletter).
2. Durchsuche das Repository gezielt danach, zum Beispiel:
   ```
   grep -rniE "fonts\.(google|gstatic)|@font-face" --include="*.html" --include="*.css" .
   grep -rniE "youtube|vimeo|<iframe|<video|<embed" --include="*.html" --include="*.js" .
   grep -rniE "maps\.google|google\.com/maps|mapbox" --include="*.html" --include="*.js" .
   grep -rniE "recaptcha|hcaptcha|turnstile|cloudflare" --include="*.html" --include="*.js" .
   grep -rniE "cdn\.|jsdelivr|unpkg|googleapis" --include="*.html" --include="*.js" --include="*.css" .
   grep -rniE "document\.cookie|cookie-consent|localStorage" --include="*.js" .
   ```
3. Ein leeres Ergebnis ist eine belegte „Nein“-Antwort, kein Ausweichen. Ein Treffer wird gelesen: Zählt er nur in einer archivierten Material- oder Exportdatei, die nicht ausgeliefert wird, oder tatsächlich im produktiven Code?
4. Wenn die Frage eine rechtliche Einschätzung verlangt, die sich nicht aus dem Code ablesen lässt (etwa welche DSGVO-Rechtsgrundlage passt), wird sie nicht geraten. Benenne die Unsicherheit konkret und gib sie an die verantwortliche Person zurück.

## Wenn der Nutzer ein Generator-Ergebnis liefert

Ein generierter Text (PDF, Klartext oder HTML-Quellcode) ist ein Rohstoff, keine fertige Seite. Er wird nicht 1:1 eingefügt.

1. **Lücken schließen.** Alles, was der generische Fragebogen nicht kennen konnte, wird ergänzt: der technische Dienst hinter einem Kontaktformular (z. B. Web3Forms, Formspree), externe Verweise wie WhatsApp- oder Partner-Shop-Links. Jede Ergänzung folgt demselben Muster, das der Generator selbst für vergleichbare Fälle nutzt, zum Beispiel ein eigener Absatz „Auftragsverarbeitung durch [Dienst]“ nach dem Vorbild des Hosting-Abschnitts.
2. **In die Projektstruktur übertragen.** Die nummerierten Abschnitte des Generators werden zu `h2`, ihre Unterfragen zu `h3` (oder zu einem fett hervorgehobenen Leitsatz, wenn das Projekt keine vierte Überschriftenebene definiert). HTML-Entities wie `&uuml;` oder `&bdquo;` werden in echtes UTF-8 aufgelöst. Die Anrede (Sie/du) wird an den Rest der Seite angeglichen. Gesetzlich vorgeschriebene, hervorgehobene Hinweise, etwa das Widerspruchsrecht nach Art. 21 DSGVO, bleiben in Großbuchstaben, auch wenn das dem sonst ruhigen Ton widerspricht.
3. **Prüfen.** Nach der Integration wird die HTML-Datei auf ausgeglichene Tags geprüft (zum Beispiel mit einem kurzen `html.parser`-Skript), bevor sie committet wird.
4. **Dokumentieren.** Die Änderung wird im Projekt-Changelog nach dem Muster Evidenz/Interpretation/Entscheidung festgehalten: was der Generator geliefert hat, welche Lücke erkannt wurde und warum, was ergänzt oder bewusst nicht übernommen wurde. Reine Textänderungen an bestehendem HTML ohne CSS- oder JavaScript-Änderung brauchen keine Erhöhung eines Cache-Busters.
5. **Grenze benennen.** Stelle klar, dass ein generierter und ergänzter Text eine juristische Prüfung durch eine qualifizierte Person nicht ersetzt, sondern ihr eine belastbare, nachvollziehbare Grundlage liefert.
