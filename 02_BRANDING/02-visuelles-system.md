# Das visuelle System: Bedeutung durch Beziehungen

Ein visuelles System ist keine Sammlung einzelner Stilelemente. Es ist ein Netz von Beziehungen, das einem Besucher hilft, Wichtiges zu erkennen, Zusammengehöriges zu gruppieren und der Marke eine eigene Haltung zu geben. Farbe, Typografie, Bild, Iconografie und Raum werden deshalb gemeinsam geplant.

## Farbe als Priorität und Atmosphäre

Farbe beeinflusst Orientierung, Stimmung und wahrgenommene Wichtigkeit. Ihre Bedeutung entsteht jedoch aus Kontext und Gebrauch. Eine Akzentfarbe wirkt nur als Akzent, wenn sie begrenzt eingesetzt wird. Wenn dieselbe Farbe für primäre Buttons, Links, Illustrationen und Warnungen verwendet wird, verliert sie ihre semantische Klarheit.

Definiere eine funktionale Farbarchitektur: Grundflächen schaffen Ruhe und Kontrast, Textfarben sichern Lesbarkeit, Akzente markieren Handlung oder Identität, Statusfarben kommunizieren Zustände. Jede Farbe braucht zugängliche Kombinationen und einen definierten Zustand für Hover, Fokus, Fehler und deaktivierte Elemente. Psychologische Wirkung darf nie gegen die Wahrnehmungsrealität ausgespielt werden.

## Farbe wird nach ihrer Aufgabe benannt, nicht nach ihrem Aussehen

Diese Regel ist bei VELLOX verbindlich, und sie ist strenger als die verbreitete Empfehlung, Tokens zu verwenden. Ein Token namens `blau-600` ist kein Fortschritt gegenüber einem Farbwert. Es beantwortet weiterhin die Frage „welche Farbe" und nicht die Frage „wofür". Der Unterschied wird an dem Tag sichtbar, an dem der Wert sich ändert: `handlung` überlebt einen Wechsel von Blau nach Grün, `blau-600` wird in diesem Moment zu einer Unwahrheit im Code. Danach passiert regelmäßig das Schlimmere: Statt den Namen zu korrigieren, legt jemand `gruen-600` daneben, und das System führt zwei Wahrheiten.

Das System hat deshalb zwei Ebenen, und nur die zweite wird verwendet.

**Die Grundwerte** sind die Palette. Hier stehen die tatsächlichen Farbwerte, und hier steht nach der [Markeninventur](04-markeninventur.md) ihre Herkunft: übernommen, abgeleitet oder neu entschieden. Diese Ebene wird von keiner Komponente direkt benutzt.

**Die semantischen Rollen** sind die Schicht, mit der gearbeitet wird. Jede Rolle benennt eine Aufgabe: Grundfläche, erhöhte Fläche, Text, ruhiger Text, Kante, primäre Handlung und ihre Zustände, Fokus, Fehler, Erfolg, Warnung. Eine Rolle zeigt auf einen Grundwert, und eine Komponente kennt ausschließlich Rollen.

Der Gewinn ist nicht nur Umbenennbarkeit. Eine Rolle zwingt zu einer Entscheidung, die sonst nie getroffen wird. Wer eine Fläche einfärben will und dafür `handlung` nehmen muss, merkt beim Schreiben, dass er die Farbe der primären Handlung für Dekoration verbraucht. Bei einem Farbwert wäre ihm das nicht aufgefallen, und die Handlung hätte still ihre Auszeichnung verloren. Genau dieser Vorgang ist gemeint, wenn oben steht, dass eine Akzentfarbe ihre semantische Klarheit verliert.

Ein semantischer Name kann selbst falsch werden. Eine Rolle `fehler`, die für eine Preishervorhebung eingesetzt wird, ist dieselbe Art von Unwahrheit wie `blau-600` nach dem Rebranding. Der Name verpflichtet; wer ihn zweckentfremdet, ändert entweder den Einsatz oder legt eine ehrliche neue Rolle an.

**Wo die Regel nicht gilt.** Logos, Illustrationen, Fotos und eingebundene Fremdinhalte tragen eigene Werte. Ein Markenzeichen hat genau einen richtigen Farbwert, und der ist keine Rolle. Diese Dateien sind vom Verbot fester Farbwerte ausgenommen, und die Ausnahme wird ausdrücklich benannt, weil eine Regel ohne saubere Grenze innerhalb weniger Tage umgangen wird.

**Jede Rolle trägt ihre Partner.** Eine Textrolle ohne die Flächen, auf denen sie zugelassen ist, ist unvollständig, weil sich Lesbarkeit nicht an einer einzelnen Farbe entscheidet, sondern an einem Paar. Erst wenn die zulässigen Paare benannt sind, lässt sich ihr Kontrast rechnen statt schätzen, und zwar ohne die Seite zu öffnen. Wie daraus ein Gate wird, das den Bau abbricht, steht in [Accessibility und Animation](../07_ENGINEERING/04-accessibility-und-animation.md).

## Typografie als Stimme und Navigation

Typografie trägt nicht nur Tonalität. Sie steuert Lesegeschwindigkeit, Hierarchie und Raum. Eine prägnante Display-Schrift kann den Einstieg charakterisieren; eine ruhige Textschrift muss lange Erklärungen tragen. Die Kombination sollte nicht durch Kontrast um des Kontrasts willen gewählt werden, sondern durch unterschiedliche Aufgaben.

Definiere Rollen statt einzelner Größen: Display, Überschrift, Zwischenüberschrift, Fließtext, Label, Meta und numerischer Wert. Jede Rolle braucht eine sinnvolle Breite, Zeilenhöhe, Gewichtung und responsive Anpassung. Entscheidend ist, ob die Hierarchie beim Scannen erkennbar bleibt. Ein kleiner Text darf nicht als unwichtiger Hinweis dienen, wenn er eine Voraussetzung für die Handlung enthält.

## Bildsprache als Beweis

Bilder erzeugen Atmosphäre, aber sie können auch Erwartungen erzeugen, die das Angebot nicht erfüllt. VELLOX entscheidet für jedes Bild, ob es Kontext, Ergebnis, Prozess, Material, Person oder Stimmung zeigt. Ein Stimmungsbild darf nicht so eingesetzt werden, als sei es ein Beweis für echte Räumlichkeiten oder Ergebnisse.

Eine starke Bildsprache besitzt wiederkehrende Entscheidungen: Nähe oder Distanz, kontrolliertes oder spontanes Licht, menschliche Präsenz, Materialität, Perspektive und Grad der Inszenierung. Diese Entscheidungen werden mit dem [Research zur Positionierung](../01_RESEARCH/02-zielgruppen-und-positionierung.md) abgeglichen. Ein Bild wird nicht gut, weil es schön ist, sondern weil es einen relevanten Gedanken schneller glaubwürdig macht.

## Iconografie ohne Dekoration

Icons sind Orientierungshilfen. Sie können eine Funktion erklären, Kategorien trennen oder den Blick durch eine kurze Information führen. Ein Icon sollte nicht allein die Bedeutung tragen, wenn das Symbol nicht universell verständlich ist. Für wichtige Handlungen und Statusmeldungen bleibt Text die verlässlichere Quelle.

Ein Icon-System braucht gemeinsame Strichstärke, optisches Gewicht, Raster, Eckenlogik und Größen. Es muss bei kleinen Flächen erkennbar bleiben und darf nicht mit dem Logo verwechselt werden. Wenn ein Icon keine zusätzliche Orientierung schafft, ist es wahrscheinlich dekorativ und sollte nicht automatisch in jede Karte gelangen.

## Visuelle Hierarchie als Leseführung

Hierarchie entsteht aus Größe, Kontrast, Position, Abstand, Dichte und Wiederholung. Sie beantwortet die Frage, was zuerst, als Nächstes und nur bei Bedarf gelesen werden soll. Ein Layout mit vielen starken Kontrasten kann technisch sauber und trotzdem flach wirken, weil keine Entscheidung priorisiert wird.

Prüfe Hierarchie in drei Distanzen: im schnellen Blick auf die gesamte Seite, beim Scannen der Abschnittsanfänge und beim Lesen einzelner Inhalte. Was in der Nahansicht schön aussieht, muss nicht in der Fernansicht führen. Diese Prüfung verbindet das visuelle System mit den [Hero- und Layout-Regeln](../04_UI/01-layout-grid-und-spacing.md).

## Materialität und Zurückhaltung

Flächen, Schatten, Linien und Radien geben einer Oberfläche körperliche Beziehungen. Sie zeigen, was zusammengehört, was darüberliegt und was aktiv ist. Ein Schatten ist kein Qualitätszeichen; er ist eine Tiefeninformation. Ein Radius ist keine Persönlichkeit; er ist eine Aussage über Härte, Nähe und Systematik.

Verwende diese Mittel sparsam und konsistent. Wenn jede Fläche eine eigene Materialität erhält, entsteht kein Reichtum, sondern ein unruhiges Koordinatensystem. VELLOX bevorzugt wenige, gut begründete Ebenen, die über alle Zustände hinweg lesbar bleiben.
## Kontrast als Beziehung

Kontrast ist nicht nur hell gegen dunkel oder groß gegen klein. Auch dicht gegen offen, fest gegen weich, sachlich gegen bildhaft und statisch gegen bewegt können Beziehungen tragen. Eine Oberfläche wird lesbar, wenn Kontraste gezielt eingesetzt werden. Zu viele gleich starke Kontraste machen jede Ebene wichtig und dadurch keine wirklich wichtig.

Prüfe das System in Graustufen, bei reduzierter Sättigung und ohne Bilder. Wenn die Hierarchie dann vollständig zusammenfällt, wurde zu viel Bedeutung an Farbe oder Stimmung ausgelagert. Prüfe danach die Marke in ihrer tatsächlichen Farb- und Bildwelt. Das Ziel ist nicht, alle Gestaltung zu neutralisieren, sondern sicherzustellen, dass die tragende Ordnung auch ohne dekorative Hilfe vorhanden ist.

## Systemische Konsistenz

Dokumentiere für jedes zentrale visuelle Token seinen Zweck, mögliche Kombinationen und problematische Kombinationen. Eine Akzentfarbe sollte wissen, ob sie für Handlungen, Hervorhebungen oder nur Identität steht. Eine Textrolle sollte wissen, auf welchen Flächen sie zugelassen ist. Diese Angaben verhindern, dass ein gutes Einzelmuster in anderen Kontexten unbrauchbar eingesetzt wird.

## Anti-Template-Farbprüfung

Beginne kein Projekt mit Lila, violetten Verläufen oder einer vorgefertigten SaaS Palette. Prüfe zuerst Material, Umgebung, Zielgruppe, Angebot und vorhandene Markenrealität. Wie die vorhandene Markenrealität festgestellt wird, steht in der [Markeninventur](04-markeninventur.md). Der Befund „es gibt keine Markenfarbe“ ist erst zulässig, wenn der bestehende Auftritt gerendert und nicht nur im Quelltext gelesen wurde. Wenn keine belastbare Farbentscheidung vorliegt, ist eine ruhige neutrale Grundlage ehrlicher als ein künstlicher Akzent. Farbe wird erst dann markant, wenn sie eine Aufgabe übernimmt und in Kontrast, Bildsprache und Ton bestätigt wird.

Dasselbe gilt für Formen. Pillen, überweiche Cards, Glow Effekte und zufällige Farbverläufe sind keine neutrale Premium Sprache. Sie müssen aus dem Kunden stammen oder entfallen. Das [Anti-Template-System](../00_SYSTEM/05-anti-template-standard.md) liefert die verbindliche Grenze.
