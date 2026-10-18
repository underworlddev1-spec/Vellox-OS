# Erfahrungen aus Saphirweb und den Kundenseiten

Dieses Kapitel sammelt, was in der Arbeit an Saphirweb, Lima Lounge, Rosalinde, Jilan, Kara und der VGG-Media-Seite von der Person, die die Seiten verkauft, ausdrücklich verlangt, abgelehnt oder gelobt wurde. Es ersetzt keine Fachkapitel. Es ist die Kurzfassung der Vorlieben, die sonst in jedem Projekt neu ausgesprochen werden müssten, und gilt ab dem ersten Entwurf. Wer eine Seite baut, liest es vor der ersten Zeile und prüft die Liste am Ende noch einmal.

Wo dieses Kapitel älteren Regeln widerspricht, gilt dieses Kapitel. Es ist das jüngere und das aus echter Abnahme entstandene.

## Was die Seite nie zeigen darf

**Pill Buttons.** Sie wurden zweimal ausprobiert (Saphirweb, Branch `buttons-neu`, und früher) und beide Male verworfen: "pill buttons sind zu KI, wir behalten unsere". Schaltflächen bekommen eine Form aus der Marke, bei Saphirweb die Fase, bei VGG Media Sucher-Ecken, nie die Standardkapsel mit Pfeilkreis. Eine Abwandlung der Pille, also Kapsel mit Icon, Kapsel mit Verlauf oder Kapsel mit Pfeil, bleibt eine Pille.

**Kleine Überschriften über der Überschrift.** Eyebrows mit Punkt, mit Linie oder in Großbuchstaben mit Sperrung gelten als das sicherste Zeichen für maschinelle Herkunft. Die Linie unter dem Seitenkopf (`.rubrik`) und der Hero-Vorspann "Webdesign aus Walldorf" wurden deshalb entfernt. Wenn ein Abschnitt eine Einordnung braucht, steht sie in der Überschrift selbst.

**Punkt-Aufzählungen, Gedankenstriche, Dreiklang-Slogans.** Aufzählungen bekommen eine eigene Form (Zahlen, Linien, Zeilen mit Inhalt). Gedankenstriche und Halbgeviertstriche werden im Bau von einem Gate abgelehnt, nicht nur im Review. Überschriften mit drei Schlagwörtern in Folge werden zu einem Satz.

**Glas und Weichzeichner auf Leisten.** `backdrop-filter` auf der Kopf- oder Handyleiste flackert beim Scrollen. Leisten bekommen eine deckende oder halbdeckende Fläche ohne Filter.

**Bilder von Kundenwebsites als Inhaltsbild.** Bei einer Agentur für Film und Foto sind Browser-Screenshots von Kundenseiten verboten, auch als Vorschaubild einer Leistung. Nur Standbilder aus Filmen und Fotos. Bei einer Agentur für Webdesign sind Vorschauen der gebauten Seiten dagegen der Beleg selbst, dann aber frisch und aus der laufenden Seite erzeugt, nie aus einem alten Stand.

**Erfundene Inhalte.** Keine erfundenen Zahlen, Preise, Zitate, Teilzeilen oder Leistungsversprechen. Das gilt besonders für Teilzeilen unter Angebotszeilen und für Kundentexte. Fehlt ein Beleg, steht an der Stelle ein Platzhalter mit Hinweis, wo die Datei oder der Text hinkommt.

**Aussagen über die Herkunft der Seite.** Nirgends steht, die Seite sei ohne KI entstanden. Wer das dem Kunden gesagt hat, hat sich festgelegt, und die Seite darf es nicht beweisen oder widerlegen müssen.

## Was die Seite zeigen muss

**Bewegung, die Tempo hat.** Der Maßstab ist das gelobte Rework von Lima Lounge: Laufband mit Umriss-Versalien, Zahlen, die hochzählen, Funken im Hero, eine Fortschrittslinie, gestaffelte Einblendungen, ein Lichtfleck auf Karten, ein Glanzlauf über dem Logo. Gewünscht ist "reizüberflutender, dopaminreicher", nicht "ruhig". Bei Reworks bleiben Palette, Schriften und Inhalt unverändert, nur die Bewegung wird dichter.

**Übergänge statt Sprüngen.** Jede Zustandsänderung läuft, sie springt nicht. Ein Farbwechsel im Text dauert 700 ms und läuft aus (`ease-out`), nicht sofort. Ein Umschalter, der zwischen Inhalten wechselt, braucht zwei Dinge: eine gleitende Markierung hinter der Auswahl (Breite, Höhe und Position laufen mit `cubic-bezier(0.22, 1, 0.36, 1)` in rund 420 ms) und einen Wechsel des Inhalts mit Ausblenden (rund 220 ms, leicht seitlich versetzt, mit Weichzeichner) und Einblenden (rund 520 ms). Ein Wechsel der Ansicht, etwa Handy zu Desktop, zoomt das neue Gerät von 0,965 auf 1 und blendet es ein. Das neue Bild wird vorgeladen, bevor die Einblendung beginnt, sonst blitzt das alte auf. Bei `prefers-reduced-motion` entfällt die Animation vollständig, die Funktion bleibt. Elemente, die das Skript erzeugt (der Gleiter), bekommen in Astro keine Scoped-Attribute, ihr CSS steht deshalb in `:global()`, sonst fließt der Gleiter ins Layout und schiebt die Auswahl. Jede neue Animation wird per Screenshot nach dem Klick geprüft, nicht nur gebaut.

**Eine Form, die aus der Marke kommt.** Das Logo, der Seitenkopf, die Schaltfläche und die Leitlinien nutzen dieselbe Geometrie. Wird das Logo geändert, wird es sofort überall geändert: Kopfzeile, Fußzeile, jeder Seitenkopf, die Favicons, das Open-Graph-Bild. Das Muster dafür ist eine Suche nach dem alten Zeichen im ganzen Projekt am selben Tag, nicht nach dem Hinweis des Auftraggebers.

**Elemente an der Stelle, an der sie wirken.** Ein Leitsatz, der den Besucher abholt, steht unmittelbar nach dem Hero und nicht unter der Vorführung, wo er nichts mehr einleitet. Wer eine Folge von Abschnitten festlegt, liest sie als Erzählung von oben nach unten und fragt bei jedem Abschnitt, was der Besucher vor ihm schon wissen muss.

**Angebote nach Bedarf, nicht nach Produkt.** Bietet ein Betrieb mehr als eine Sorte Leistung an (Website, App, Werkzeug, System), passen drei Website-Pakete nicht mehr auf die Startseite. Dort steht die Frage "Was brauchst du?" mit einer Zeile je Angebot und einem Weg zum Gespräch. Die Pakete mit Stufen bleiben auf der Seite der Leistung, zu der sie gehören, mit einer Überschrift, die das benennt ("Drei Website-Pakete").

**Eine Fortschrittsanzeige nur, wenn sie am richtigen Ort steht.** Ein Balken ganz oben funktioniert nicht, wenn sich die Kopfleiste bewegt. Dann wird er entfernt, nicht verschoben. Fortschritt kann auch in der Seite selbst liegen, etwa als Linie im Inhalt.

**Eine ehrliche Zahl.** Wird ein Relaunch mit der alten Seite verglichen, nennt der Vergleich die Punkte, an denen die neue Seite wirklich besser ist, mit Zahlen. Ist es nur ein Punkt, steht dort ein Punkt. Auffüllen ist schlimmer als Weglassen.

**Zahl und Einheit bleiben zusammen.** "100 %", "10 Werktage" und "15 Minuten" brechen nie zwischen Zahl und Einheit um (geschütztes Leerzeichen).

## Wie mit dem Auftraggeber gearbeitet wird

**Kundentexte werden nie ohne Rückfrage geändert.** Sie sind mit dem Endkunden abgestimmt. Alles, was optisch nach KI aussieht, darf dagegen ohne Rückfrage geändert werden, solange der sichtbare Text danach unverändert ist. Ein Textvergleich vor und nach der Änderung belegt das.

**Verkaufte Seiten laufen über Branch und Vorschau.** Bei einer verkauften Seite (Kunde hat bezahlt oder zugesagt) wird auf einem Branch gearbeitet, eine Vorschau erzeugt und der Link gegeben, und erst auf das ausdrückliche "merge" hin in den Produktionszweig übernommen. Das gilt für Jilan (Zweig `master`), Rosalinde und Kara. Die eigene Seite (Saphirweb) wird dagegen ohne Rückfrage in `main` übernommen, nachdem der Bau grün war.

**Links sofort, mit dem Hinweis auf den Schutz.** Wer nach einem Link fragt, bekommt die Vorschau-Adresse des jüngsten fertigen Deployments des Branches, mit dem Zusatz, dass sie hinter dem Team-Login liegt. Die Adresse wird aus der Vercel-Liste der Deployments gelesen, nicht erraten, und sie wird in jeder Antwort wiederholt, in der nach ihr gefragt wurde, auch wenn sie schon einmal genannt wurde.

**Die Palette bleibt.** Farben und Schriften des Kunden werden bei einem Rework nicht angetastet. Schriftvarianten werden als A, B und C vorgeschlagen, und der Auftraggeber wählt.

**Fehlende Fotos sind ein Platzhalter.** Fehlt ein Bild, baut die Seite einen Platz mit einem festen Dateinamen (zum Beispiel `public/img/hero.webp`) und der Auftraggeber legt die Datei ab. Die Seite sieht ohne Datei vollständig aus.

**Antworten sind kurz und deutsch.** Zuerst das Ergebnis, dann höchstens vier Zeilen. Keine Wiederholung dessen, was im Diff steht, und höchstens eine Rückfrage, nur wenn die Arbeit blockiert ist.

## Messwerte, die vor jeder Übergabe stehen

Lighthouse (mobil und Desktop) und axe laufen gegen den gebauten Stand, nicht gegen den Entwicklungsserver. Das Ziel ist 100 bei Barrierefreiheit, Best Practices und SEO und mindestens 99 bei Performance. Zwei Fallen aus Saphirweb: Eine Farbe, die erst durch Scrollen oder Einblenden ihren Endwert erreicht (Leitsatz, der Wort für Wort dunkel wird), wird vom Prüfer im Ausgangszustand gemessen, der Ausgangszustand muss deshalb 4,5 zu 1 erreichen. Und eine Kopfleiste mit dem Ton "dunkel" auf einer Seite, deren Anfang hell ist, macht das Logo unleserlich. axe wird mit `prefers-reduced-motion: reduce` und nach einem Durchlauf durch die ganze Seite gefahren, sonst meldet es Zwischenzustände der Einblendungen.

## Effizienz: wenig Token, volle Leistung

Die Arbeit an einer Seite ist teuer, wenn jede Sitzung wieder erkundet, was schon bekannt ist. Diese Regeln halten Kontext und Ausgabe klein, ohne die Qualität zu senken. Richtigkeit, Sicherheit und Schutz vor zerstörenden Aktionen gehen immer vor Kürze.

**Zuerst suchen, dann gezielt lesen.** Mit Grep oder Glob die Stelle finden und die Datei nur im betroffenen Bereich lesen (Zeilenbereich statt ganze Datei). Nennt der Auftraggeber Pfad oder Funktion, wird direkt dorthin gegangen. Sperrdateien, Build-Ausgaben, minimierte Dateien und erzeugter Code werden nicht gelesen.

**Einmal lesen, einmal prüfen.** Eine Datei wird je Aufgabe einmal gelesen und nach dem eigenen Edit nicht erneut. Gebaut und gemessen wird einmal am Ende, nicht nach jeder Änderung, und nur der betroffene Teil (eine Seite, ein Test), nicht die ganze Suite.

**Ausgabe an der Quelle begrenzen.** Befehle laufen mit `head`, `tail`, `grep` oder `--quiet`. Lange Berichte (Lighthouse, axe) werden auf Kennzahlen und durchgefallene Prüfungen gefiltert, nie ganz ausgegeben.

**Unabhängiges parallel.** Lesen, Suchen und Messungen ohne Abhängigkeit laufen in einem Schritt. Hohe Datenmengen (Testläufe, Logs, breite Suchen) gehen an einen Hilfsagenten, der nur das Ergebnis zurückgibt, aber nichts, was in drei Aufrufen erledigt ist.

**Kleinste Änderung.** Kein Umbau nebenbei, keine Umbenennung, keine neuen Kommentare. Mehrere Änderungen an einer Datei gehören in einen Aufruf.

**Antworten.** Ergebnis zuerst, höchstens fünf Zeilen, keine Wiederholung des Diffs, höchstens eine Rückfrage. Eine lange Sitzung wird mit `/compact` gekürzt, ein Themenwechsel mit `/clear` begonnen.

**Leistung der Seite selbst.** Der gleiche Gedanke gilt für das Ergebnis: Bilder als WebP oder AVIF in der angezeigten Größe, nur eine Schrift mit wenigen Schnitten, kein Skript ohne Wirkung, CSS-Animation statt Bibliothek, `prefers-reduced-motion` respektieren. Das Ziel bleibt Lighthouse 99 oder mehr bei Performance.

## Prüfung vor der Übergabe

Ein Entwurf geht erst raus, wenn diese Fragen mit Ja beantwortet sind:

1. Gibt es irgendwo eine Kapsel, einen Eyebrow, einen Punkt-Aufzähler, einen Gedankenstrich oder einen Dreiklang? Wenn ja, ist das ein Fehler, kein Stilmittel.
2. Läuft jeder Wechsel (Farbe, Tab, Ansicht, Menü) mit einem Übergang, und fällt er bei reduzierter Bewegung weg?
3. Stimmen Logo und Seitenköpfe auf allen Seiten mit dem aktuellen Zeichen überein?
4. Steht jeder Abschnitt dort, wo er den Besucher abholt, und ist keine Angebotsstruktur falsch für das, was angeboten wird?
5. Ist jeder sichtbare Text belegt, und wurde kein Kundentext ohne Rückfrage geändert?
6. Sind Vorschaubilder frisch aus der laufenden Seite erzeugt?
7. Stehen Lighthouse und axe auf den Zielwerten?
8. Wurde auf Branch und Vorschau gearbeitet, wo die Seite verkauft ist, und liegt der Link in der Antwort?

Die Fragen 1 und 3 sind mechanisierbar und gehören nach [`00_SYSTEM/06-erzwungene-qualitaet.md`](../00_SYSTEM/06-erzwungene-qualitaet.md) in ein Gate im Bau. Eine Regel aus diesem Kapitel, die einmal gebrochen wurde, zieht eine Stufe nach oben.

Weiterführend: [Wiedererkennbare Muster vermeiden](06-wiedererkennbare-muster-vermeiden.md), [Wenn die Arbeit das Produkt ist](10-wenn-die-arbeit-das-produkt-ist.md) und der [Anti-Template-Standard](../00_SYSTEM/05-anti-template-standard.md).
