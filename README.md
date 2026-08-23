# VELLOX OS

VELLOX OS ist das interne Betriebssystem für hochwertige digitale Auftritte. Es beschreibt nicht, wie man möglichst schnell eine Website produziert, sondern wie man aus unklaren Geschäftszielen eine klare, glaubwürdige und technisch belastbare digitale Erfahrung entwickelt.

Das Repository dient drei Rollen gleichzeitig: Menschen nutzen es als gemeinsame Sprache, Claude Code und Codex nutzen es als Entscheidungsgrundlage, und Entwickler nutzen es als Qualitätsrahmen. Damit diese drei Verwendungen nicht auseinanderlaufen, sind die Dokumente als zusammenhängende Wissensbasis geschrieben. Eine Regel ohne Begründung gilt bei VELLOX nicht als Regel, sondern als Geschmack.

## Die zentrale Idee

Eine Premium-Website ist kein dekorierter Informationsbehälter. Sie ist eine Folge von Entscheidungen, die einem Menschen dabei hilft, eine Situation zu verstehen, Vertrauen zu fassen und den nächsten sinnvollen Schritt zu wählen. Gestaltung, Text, Struktur und Code sind deshalb keine getrennten Disziplinen. Sie lösen gemeinsam dasselbe Problem: Unsicherheit soll sinken, ohne dass die Marke an Eigenständigkeit verliert.

VELLOX arbeitet vom Verständnis zur Form. Zuerst wird geklärt, welches Geschäft, welches Angebot und welcher Mensch vor uns liegen. Dann wird eine Positionierung formuliert, daraus eine Informationsarchitektur und ein narratives Gerüst entwickelt, anschließend ein visuelles System und erst danach die konkrete Oberfläche. Der Code konserviert diese Entscheidungen, statt sie im Nachhinein zu ersetzen.

## So wird das Repository gelesen

Die Ordner sind in der Reihenfolge angelegt, in der Erkenntnisse typischerweise reifen. `00_SYSTEM` beschreibt die Haltung und die Arbeitsweise. `01_RESEARCH` erklärt, wie Unsicherheit in belastbare Einsichten übersetzt wird. `02_BRANDING` bis `07_ENGINEERING` behandeln die Fachdisziplinen. `08_PLAYBOOKS` überträgt die Prinzipien auf wiederkehrende Branchen. `09_TEMPLATES` macht die Arbeit wiederholbar, während `10_CHECKLISTS` die letzten Qualitätslücken sichtbar macht. `11_EXAMPLES` zeigt, wie gute Entscheidungen in einem konkreten Fall aussehen.

Die Ordner sind kein linearer Kurs. Während eines Projekts wird zwischen ihnen iteriert. Eine neue Einwandanalyse kann die Headline verändern; eine technische Einschränkung kann die Bildsprache beeinflussen; ein Accessibility-Befund kann ein UI-Muster zurück in die UX-Arbeit schicken. Querverweise sind deshalb ein Teil der Architektur und keine redaktionelle Verzierung.

## Verbindliche Einstiegsreihenfolge

1. Lies [`CLAUDE.md`](CLAUDE.md), bevor du im Repository arbeitest. Die Datei definiert die Rolle des Systems, den Umgang mit Unsicherheit und die Form von Entscheidungen.
2. Lies [`00_SYSTEM/01-qualitaetsstandard.md`](00_SYSTEM/01-qualitaetsstandard.md), um zu verstehen, was VELLOX unter Qualität versteht.
3. Lies [`00_SYSTEM/06-pruefdoktrin.md`](00_SYSTEM/06-pruefdoktrin.md). Sie beantwortet die Frage, die der Qualitätsstandard offen lässt: woran ein Team erkennt, dass eine Entscheidung noch gilt.
4. Nutze [`00_SYSTEM/02-entscheidungsframework.md`](00_SYSTEM/02-entscheidungsframework.md), sobald mehrere plausible Lösungen existieren.
5. Beginne ein Kundenprojekt mit [`09_TEMPLATES/01-projektbrief.md`](09_TEMPLATES/01-projektbrief.md) und [`09_TEMPLATES/02-discovery-brief.md`](09_TEMPLATES/02-discovery-brief.md), und baue den [Prüfstand](12_PRUEFSTAND/README.md) am ersten Tag ein und nicht vor dem Launch.
6. Prüfe jede relevante Entscheidung mit den passenden Dokumenten aus [`10_CHECKLISTS`](10_CHECKLISTS).

## Was VELLOX unter Premium versteht

Premium bedeutet nicht teuer aussehende Oberflächen, viele Animationen oder eine möglichst große Typografie. Premium bedeutet, dass jede sichtbare und unsichtbare Entscheidung eine Aufgabe erfüllt: Die Seite ist ruhig, weil sie Prioritäten kennt; präzise, weil sie die Sprache des Kunden versteht; charaktervoll, weil sie nicht auf beliebige Konventionen ausweicht; und belastbar, weil der Eindruck nicht durch langsame Ladezeiten, Barrieren oder unklare Interaktionen zerfällt.

Ein hochwertiges Ergebnis darf einfach aussehen. Einfachheit ist dann kein Mangel an Arbeit, sondern das Ergebnis einer Arbeit, die Widersprüche gelöst hat. Genau deshalb fragt VELLOX bei jeder Regel nach dem Grund, dem erwarteten Verhalten und dem Nachweis, an dem sich die Entscheidung später prüfen lässt.

## Pflege und Weiterentwicklung

Dieses Repository ist ein lebendes Betriebssystem. Neue Regeln werden nicht aufgenommen, nur weil sie elegant klingen. Sie brauchen einen Anlass, eine beobachtete Konsequenz und einen Ort im bestehenden System. Jede Änderung sollte deshalb erklären, welches Problem sie löst, welche anderen Entscheidungen sie beeinflusst und wie sie in einem Projekt überprüft wird.

Wenn eine Regel nur für eine einzelne Marke gilt, gehört sie nicht in VELLOX OS, sondern in deren Projektdokumentation. Wenn eine Regel mehrfach in Projekten auftaucht, eine Entscheidung beschleunigt und die Qualität messbar erhöht, ist sie ein Kandidat für das Betriebssystem. Diese Trennung hält die Wissensbasis klar und verhindert, dass VELLOX zu einer Sammlung persönlicher Vorlieben wird.

## Die Frage hinter jeder Seite

Am Ende wird eine Website nicht daran gemessen, wie viele Komponenten sie enthält. Sie wird daran gemessen, ob ein richtiger Mensch in einer konkreten Situation schneller versteht, warum dieses Angebot relevant ist, warum er dem Anbieter trauen kann und was er als Nächstes tun kann. Alle Dokumente in VELLOX OS sind diesem Zusammenhang untergeordnet.
## Eine kleine Arbeitsregel

Wenn du im Repository eine neue Datei anlegen möchtest, frage zuerst, welche Entscheidung oder welches wiederkehrende Problem sie tragen soll. Wenn bereits ein Kapitel dieselbe Aufgabe erklärt, verbessere und verlinke es, statt eine zweite Insel zu schaffen. Wenn ein neues Dokument nötig ist, schreibe es so, dass sein Warum, seine Grenze, seine Anwendung und sein Review sichtbar sind.

VELLOX OS wächst damit langsam, aber mit Gedächtnis. Die Qualität des Systems zeigt sich nicht an der Zahl seiner Seiten, sondern daran, ob ein neues Projekt schneller zu besseren Entscheidungen kommt, ohne seine eigene Realität zu verlieren.

## Kapitelübersicht

Die Grundhaltung steht in [`00_SYSTEM`](00_SYSTEM), von [Philosophie](00_SYSTEM/00-philosophie.md) und [Qualitätsstandard](00_SYSTEM/01-qualitaetsstandard.md) bis zum [Workflow](00_SYSTEM/03-workflow-und-review.md). Die Erkenntnisarbeit liegt in [`01_RESEARCH`](01_RESEARCH), während [`02_BRANDING`](02_BRANDING), [`03_UX`](03_UX) und [`04_UI`](04_UI) sie in Marke, Journey und Oberfläche übersetzen. [`05_COPYWRITING`](05_COPYWRITING) und [`06_SEO`](06_SEO) schützen Sprache, Auffindbarkeit und Aktualität; [`07_ENGINEERING`](07_ENGINEERING) macht das Ergebnis semantisch, performant, zugänglich und wartbar.

Der [Anti-Template-Standard](00_SYSTEM/05-anti-template-standard.md) und die [Prüfdoktrin](00_SYSTEM/06-pruefdoktrin.md) sind dabei verbindlich, und sie hängen zusammen: Der erste sagt, was nicht entstehen darf, die zweite sagt, woran man erkennt, dass es nicht entstanden ist. Der Standard schützt vor austauschbaren KI Mustern, Pill Buttons, automatischem Lila, künstlicher Gedankenstrich Sprache und Vibe Coding. Eigenständigkeit entsteht aus echter Recherche und begründeten Entscheidungen, nicht aus dekorativer Unruhe.

Für die Anwendung im Alltag stehen die Branchenpfade in [`08_PLAYBOOKS`](08_PLAYBOOKS), die Arbeitsanfänge in [`09_TEMPLATES`](09_TEMPLATES), die Freigaben in [`10_CHECKLISTS`](10_CHECKLISTS) und konkrete Demonstrationen in [`11_EXAMPLES`](11_EXAMPLES). Lies diese Ordner nicht als Abkürzung um die Grundlagen herum. Ein Playbook wird erst gut, wenn seine branchenspezifische Entscheidung auf der allgemeinen VELLOX-Logik beruht.

[`12_PRUEFSTAND`](12_PRUEFSTAND/README.md) und [`13_GERUEST`](13_GERUEST/README.md) fallen aus dieser Reihe heraus: Es ist kein Kapitel, sondern ein Werkzeug. Der Ordner enthält lauffähige Prüfungen, die die verbindlichen Regeln gegen eine laufende Seite messen, und das Werkzeug, mit dem eine neue Prüfung ihren eigenen Nachweis bekommt. Er wird in ein Kundenprojekt hineinkopiert, über eine Konfigurationsdatei auf dessen Routen gestellt und um projektspezifische Behauptungen ergänzt. Ohne grünen Lauf gibt es keine Freigabe.

`13_GERUEST` ist der Startpunkt, der ihn schon eingebaut hat. Der Ordner enthält ein lauffähiges Projekt mit Farbrollen, typografischer Staffel, drei Bahnen, den Zuständen eines Formulars, der Trennung von Quelle und Auslieferung und einem leeren Entscheidungsprotokoll. Was er ausdrücklich nicht enthält, ist eine Gestaltung: Ein Gerüst mit mitgelieferter Palette und mitgelieferten Abschnittsmustern macht aus jedem Projekt dieselbe Website.

Beide Ordner sind Werkzeuge und keine Lektüre. Sie werden kopiert, konfiguriert und gefahren, und ihre Regeln stehen als Kommentar neben dem Code, den sie betreffen.
