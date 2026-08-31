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
3. Nutze [`00_SYSTEM/02-entscheidungsframework.md`](00_SYSTEM/02-entscheidungsframework.md), sobald mehrere plausible Lösungen existieren.
4. Beginne ein Kundenprojekt mit [`09_TEMPLATES/01-projektbrief.md`](09_TEMPLATES/01-projektbrief.md) und [`09_TEMPLATES/02-discovery-brief.md`](09_TEMPLATES/02-discovery-brief.md).
5. Prüfe jede relevante Entscheidung mit den passenden Dokumenten aus [`10_CHECKLISTS`](10_CHECKLISTS).

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

Die Grundhaltung steht in [`00_SYSTEM`](00_SYSTEM), von [Philosophie](00_SYSTEM/00-philosophie.md) und [Qualitätsstandard](00_SYSTEM/01-qualitaetsstandard.md) bis zum [Workflow](00_SYSTEM/03-workflow-und-review.md). Die Erkenntnisarbeit liegt in [`01_RESEARCH`](01_RESEARCH), während [`02_BRANDING`](02_BRANDING), [`03_UX`](03_UX) und [`04_UI`](04_UI) sie in Marke, Journey und Oberfläche übersetzen. Bei einem Kunden mit bestehendem Auftritt beginnt die Markenarbeit mit der [Markeninventur](02_BRANDING/04-markeninventur.md), weil eine vorhandene Kundenentscheidung jeder Herleitung der Agentur vorgeht. [`05_COPYWRITING`](05_COPYWRITING) und [`06_SEO`](06_SEO) schützen Sprache, Auffindbarkeit und Aktualität; [`07_ENGINEERING`](07_ENGINEERING) macht das Ergebnis semantisch, performant, zugänglich und wartbar.

Der [Anti-Template-Standard](00_SYSTEM/05-anti-template-standard.md) ist dabei verbindlich. Er schützt vor austauschbaren KI Mustern, Pill Buttons, automatischem Lila, künstlicher Gedankenstrich Sprache und Vibe Coding. Eigenständigkeit entsteht aus echter Recherche und begründeten Entscheidungen, nicht aus dekorativer Unruhe.

Zwei Kapitel entscheiden darüber, ob dieser Standard im Ergebnis ankommt. [Erzwungene Qualität](00_SYSTEM/06-erzwungene-qualitaet.md) ordnet jeder prüfbaren Regel einen Ort zu, vom Typ, der den Fehler unmöglich macht, bis zur Prosa, und hält fest: Eine Regel, die einmal gebrochen wurde, zieht eine Stufe nach oben. [Erstauslieferung](00_SYSTEM/07-erstauslieferung.md) beschreibt, welche Entscheidungen vor der ersten Zeile Code getroffen sein müssen, damit die erste Fassung die fertige ist. Die zugehörigen Gates als übernehmbarer Code stehen in [`09_TEMPLATES/05-qualitaetsgates.md`](09_TEMPLATES/05-qualitaetsgates.md).

Die konkreten Formen, an denen eine gebaute Seite auffliegt, stehen in [Wiedererkennbare Muster vermeiden](04_UI/06-wiedererkennbare-muster-vermeiden.md): warum der Hero immer gleich aussieht und welche fünf Varianten die Beleglage stattdessen vorgibt, warum oben links nie nur ein Schriftzug steht, und der Test dahinter. Eine Seite sieht nach Maschine aus, wenn sie fertig aussieht, obwohl sie nichts weiß.

[Das Handy ist nicht die kleine Fassung](04_UI/07-handy-zuerst-und-gemessen.md) trägt die Messung dazu. Der Kern: Was nur unterhalb einer Bruchstelle existiert, wird am großen Bildschirm von niemandem gesehen, weder vom Entwickler noch im Review noch in der Freigabe. Deshalb vier notierte Zahlen je Seite bei 390 mal 844 statt eines verkleinerten Fensters.

Sein Gegenstück ist [Das obere Ende](04_UI/08-grosse-bildschirme-und-obergrenzen.md). Am Telefon bricht etwas und man sieht es; auf einem großen Bildschirm bricht nichts, alles funktioniert, und die Seite wirkt trotzdem billiger, als sie ist. Deshalb braucht der obere Rand Zahlen: Hört ein Entwurf bei der größten Bruchstelle des Frameworks auf, hat nicht das Projekt entschieden, wie die Seite auf einem 27-Zoll-Schirm aussieht, sondern der Hersteller eines Werkzeugs.

Bei einem Kunden, der schon im Netz steht, kommt vor jeder Gestaltungsfrage eine Bestandsfrage: [Der Altauftritt, den niemand abgeschaltet hat](06_SEO/07-der-altauftritt-den-niemand-abgeschaltet-hat.md). Ein zweiter, vergessener Auftritt unter derselben Domain stört niemanden, der ihn abschalten könnte, und nur den Kunden, der Öffnungszeiten sucht. Deshalb gehört die Prüfung in die Discovery und das Abschalten vor den Neubau, auch dann, wenn kein Auftrag zustande kommt.

Für die Anwendung im Alltag stehen die Branchenpfade in [`08_PLAYBOOKS`](08_PLAYBOOKS), die Arbeitsanfänge in [`09_TEMPLATES`](09_TEMPLATES), die Freigaben in [`10_CHECKLISTS`](10_CHECKLISTS) und konkrete Demonstrationen in [`11_EXAMPLES`](11_EXAMPLES). In [`werkzeuge`](werkzeuge) liegen ausführbare Skripte, die eine Regel messbar machen statt sie nur zu beschreiben; jedes gehört zu einem Kapitel und setzt eine Stufe aus [Erzwungene Qualität](00_SYSTEM/06-erzwungene-qualitaet.md) um. Lies diese Ordner nicht als Abkürzung um die Grundlagen herum. Ein Playbook wird erst gut, wenn seine branchenspezifische Entscheidung auf der allgemeinen VELLOX-Logik beruht.
