# Erzwungene Qualität: Wo eine Regel wohnt

## Das Problem, aus dem dieses Kapitel entstanden ist

VELLOX OS beschreibt seit dem ersten Kapitel, was gute Arbeit ausmacht. Trotzdem entstanden Seiten, die nachgebessert werden mussten, und zwar an Stellen, für die längst eine Regel existierte. Der Fokusring war dokumentiert und fehlte. Die Zeichengrenze für Titel stand im Text und wurde um vierundzwanzig Zeichen gerissen. Das Verbot erfundener Belege war unmissverständlich formuliert, und eine Vorlage rendere trotzdem einen leeren Bewertungsblock.

Daraus lässt sich nicht schließen, dass die Regeln schlecht waren. Sie standen an der schwächsten möglichen Stelle: in Prosa, die einmal gelesen und danach vorausgesetzt wird. Eine Regel in Prosa wirkt nur so lange, wie sich jemand an sie erinnert. Eine Regel im Bau wirkt, bis sie jemand bewusst entfernt.

Der Unterschied zwischen einer guten Seite und einer Seite, die beim ersten Mal fertig ist, liegt deshalb selten in besseren Regeln. Er liegt darin, an welcher Stelle die Regeln wohnen.

## Die Leiter der Durchsetzung

Jede Qualitätsregel hat einen Ort. Von oben nach unten sinkt die Verlässlichkeit, und mit ihr die Berechtigung, dort zu wohnen.

**Stufe 1: Der Fehler ist unmöglich.** Das Datenmodell erlaubt ihn nicht. Ein Feld, das nur einen von drei Werten annehmen darf, kann keinen vierten enthalten. Ein Preis, der nur an einer Stelle steht und überall abgeleitet wird, kann nirgends veralten. Ein Bild, dessen Maße aus der Datei gelesen werden, kann keine falschen Maße im Markup tragen.

**Stufe 2: Der Bau bricht ab.** Der Fehler ist möglich, aber er verhindert die Auslieferung. Ein Titel über sechzig Zeichen, eine fehlende Bilddatei, zwei Seiten mit derselben Überschriftenschablone. Der Bau nennt die Stelle und die Zahl, nicht nur die Regel.

**Stufe 3: Eine Prüfung wird rot.** Ein Test, ein Skript, ein Linter. Der Fehler verhindert die Auslieferung nicht von selbst, aber niemand kann behaupten, ihn nicht gesehen zu haben.

**Stufe 4: Eine Checkliste vor der Freigabe.** Ein Mensch prüft und trägt ein. Verlässlich genug für Urteile, die kein Skript fällen kann, und nur dafür.

**Stufe 5: Prosa im Wissen.** Der Ort für Begründungen, Zusammenhänge und Ermessensfragen. Nicht der Ort für prüfbare Grenzen.

## Die Verschiebungsregel

**Eine Regel, die einmal gebrochen wurde, zieht eine Stufe nach oben.** Nicht als Strafe, sondern weil der Bruch der Beweis ist, dass die bisherige Stufe für diese Regel nicht trägt.

Das ist die wichtigste Aussage dieses Kapitels, und sie ist unbequem: Sie verlangt, nach jedem Fehler nicht nur den Fehler zu beheben, sondern seinen Ort zu verlegen. Wer nur den Fehler behebt, hat die Ursache bestätigt. Der Aufwand ist dabei fast immer kleiner als erwartet. Eine Zeichengrenze in den Bau zu heben ist eine Zeile mit einer Bedingung und einer Fehlermeldung.

Umgekehrt gilt: Prosa ist erlaubt und richtig für alles, was sich nicht mechanisieren lässt. Ob eine Überschrift die Situation des Lesers trifft, kann kein Skript beurteilen. Ob sie länger als sechzig Zeichen ist, muss kein Mensch zählen.

## Was ein guter Abbruch leistet

Ein Bau, der abbricht, ist eine Nachricht. Sie taugt nur, wenn sie drei Dinge enthält.

**Den gemessenen Wert und die Grenze.** „Titel zu lang" hilft nicht. „Titel zu lang: 67 von 60 Zeichen auf /ratgeber/braucht-mein-betrieb-eine-website" nennt die Stelle und die Differenz.

**Die Rechnung hinter der Grenze.** Wenn das Suffix mit dem Markennamen zwölf Zeichen kostet, sagt die Meldung, dass für die Seite selbst achtundvierzig bleiben. Sonst rät der nächste Mensch.

**Den Hinweis, was zu tun ist, wenn die Grenze falsch ist.** Eine Grenze, die man nicht bewusst ändern kann, wird irgendwann umgangen. Die Meldung nennt die Datei, in der die Zahl steht.

Eine Fehlermeldung ohne diese drei Teile erzeugt Frust und führt zur ersten Umgehung. Mit ihnen erzeugt sie eine Entscheidung.

## Der Gatterkatalog

Die folgenden Gates haben sich in der Praxis bewährt. Sie sind kein Ersatz für Urteil, sondern die Freistellung des Urteils von Buchhaltung. Jedes Gate wird mit dem Problem dokumentiert, aus dem es entstand, damit ein späteres Team es beurteilen kann statt es zu erben.

### Inhalt und Wahrheit

| Gate | Stufe | Warum |
|---|---|---|
| Leere Belege rendern nichts | 1 | Kein leerer Rahmen, kein Platzhalter, keine Auszeichnung. Was nicht eingetragen ist, existiert nicht. Erfundene Referenzen sind geschäftsschädigend und rechtlich angreifbar; die Struktur darf sie nicht erzeugen können. |
| Fremde Zahl ohne Quelle ist unmöglich | 1 | Ein Pflichtfeld `quelle` neben jeder Marktzahl. Eine Zahl ohne Herkunft ist auf einer Seite, die mit Ehrlichkeit wirbt, schlechter als keine Zahl. |
| Alternde Zahl ohne Stand ist unmöglich | 1 | Ein Preisvergleich ohne Datum ist in zwei Jahren eine Falschaussage, und niemand kann unterscheiden, ob er noch gilt. |
| Strukturierte Daten werden erzeugt, nicht gepflegt | 3 | Ein FAQ-Schema, das neben dem sichtbaren Text von Hand gepflegt wird, driftet zwangsläufig auseinander: In einem realen Projekt waren nach einigen Runden sechs von neun Antworten Paraphrasen, und eine enthielt einen Satz, der auf der Seite nirgends stand. Google wertet das als Richtlinienverstoß, und zwar für die Auszeichnung der ganzen Seite. Auffällig war dabei, welche Sätze fehlten: ausgerechnet die rechtlichen Abgrenzungen. Ein Skript, das das Schema aus dem sichtbaren HTML erzeugt und im Prüfmodus jede Abweichung meldet, macht die Frage gegenstandslos. Die sichtbare Seite ist die Quelle der Wahrheit, nie umgekehrt. |
| Kein Bewertungsschema ohne Bewertungen | 2 | Eine erfundene Sternebewertung in strukturierten Daten ist gegenüber Suchmaschinen eine Falschangabe und kostet im Ernstfall die Auszeichnung der ganzen Domain. Das ist eine andere Kategorie als ein geschönter Satz im Fließtext. |
| Behauptung über Wirkung nur mit Beleg | 1 | Getrennte Felder für das, was an der gebauten Seite nachprüfbar ist, und das, was eine Wirkung behauptet. Beim zweiten ist die Quelle Pflicht. Prüffrage: Könnte ich diesen Satz belegen, indem ich die Seite aufmache? |

### Auffindbarkeit

| Gate | Stufe | Warum |
|---|---|---|
| Titellänge und Beschreibungslänge | 2 | Eine zu lange Zeile tut nirgends weh. Der Bau läuft, die Seite sieht richtig aus, abgeschnitten wird erst im Suchergebnis, also an der einzigen Stelle, die beim Entwickeln niemand sieht. |
| Ortsseite braucht einen Beleg | 1 | Eine Ortsseite entsteht nur, wenn dort ein Projekt liegt oder der eigene Sitz ist. Wer einen Ort ergänzen will, braucht zuerst ein Projekt dort, nicht nur einen Eintrag im Einzugsgebiet. |
| Keine zwei Seiten mit derselben Überschriftenschablone | 2 | Siehe unten. Das schärfste Gate gegen Doorway-Seiten. |
| Eine Seite, eine Adresse | 2 | Mit und ohne `www`, mit und ohne Schrägstrich sind für einen Besucher dieselbe Seite und für eine Suchmaschine vier Kopien. Ein Canonical ist ein Hinweis, eine Weiterleitung eine Anweisung. |
| Sichtbare Brotkrume und Auszeichnung stimmen überein | 3 | Zwei Darstellungen desselben Wegs, die voneinander abweichen, sind schlechter als eine. |

### Oberfläche

| Gate | Stufe | Warum |
|---|---|---|
| Bildmaße kommen aus der Datei | 1 | Ohne `width` und `height` springt das Layout. Von Hand geschriebene Maße veralten beim ersten Bildtausch, und zwar unbemerkt. |
| Kein Bild breiter als seine Auflösung | 1 | Die Komponente kennt die echten Maße ohnehin und setzt daraus eine Höchstbreite. Bei Fotos fällt Hochskalierung spät auf, bei Bildschirmfotos sofort, weil sie kleine Schrift enthalten — und eine breitere Hülle für große Bildschirme vergrößert jedes Bild darin auf einmal. Beobachtet: drei Aufnahmen mit 1200 Pixeln, dargestellt mit 1408. |
| Fehlende Bilddatei bricht den Bau | 2 | Ein toter Bildverweis wird sonst erst im Produktionsbuild sichtbar, wo ihn niemand mehr sucht. |
| Tabellenzeile hat so viele Zellen wie die Kopfzeile | 1 | Eine verrutschte Tabelle ist auf einer Preisseite eine Falschaussage. |
| Kante um fremdes Bildmaterial ist unabhängig vom Bildinhalt | 4 | Die mittlere Helligkeit dreier Kundenaufnahmen ergab gegen einen dunklen Grund 1,22:1, 2,62:1 und 10,92:1. Die dunkelste löste sich auf, und der Rahmen war Teil des Problems: Er stand auf derselben Farbe wie der Grund. Unter 3:1 braucht es eine Kante. |
| Ein Element mit zwei Aufgaben bekommt zwei Umsetzungen | 4 | Vier Fassungen einer Hervorhebung gemessen: Jede, die das Licht unregelmäßig machte, verlor die Kante irgendwo. Eine Eigenschaft, die Grenze und Atmosphäre gleichzeitig leisten soll, leistet keines von beidem zuverlässig. |
| Genau ein Bild je Seite lädt bevorzugt | 4 | Ein Bild oberhalb der Falz mit `lazy` kostet Ladezeit, eines darunter mit `eager` ebenfalls, und beides passiert, wenn man raten darf. Deshalb ist die Angabe ein Pflichtwert ohne Vorgabe. |

### Was unterhalb einer Bruchstelle passiert

Eine eigene Fehlerklasse, die kein Gate vollständig fangen kann und trotzdem
hierher gehört, weil ihre Ursache mechanisch ist.

Wenn eine Bruchstelle Geschwister ausblendet, ändert sich die Aufgabe der
übrigen. Ein Element, das am Schreibtisch das dritte von vier ist und auf dem
Telefon das erste von zwei, hat zwei verschiedene Aufgaben. Beobachtet: Ein
Menü ohne `ml-auto` stand am Telefon neben dem Logo statt in der Ecke, und
seine an der rechten Ankerkante ausgerichtete Klappe wanderte aus dem Bild.

Mechanisierbar ist die Suche, nicht das Urteil: absolut positionierte Elemente
finden, deren Anker unterhalb einer Bruchstelle seine Position im Fluss
wechselt. Der Rest ist eine Messung am Gerät, siehe
[Das Handy ist nicht die kleine Fassung](../04_UI/07-handy-zuerst-und-gemessen.md).

### Der Schablonen-Wächter

Er verdient eine eigene Erklärung, weil er die Bauform prüft und nicht einen Wert.

Ortsseiten und Branchenseiten entstehen fast immer so: Die erste wird geschrieben, die zweite wird kopiert und der Name getauscht. Was dabei zuerst zur Schablone wird, sind die Überschriften, also genau die Stellen, an denen eine Suchmaschine den Aufbau einer Seite abliest. Der Fließtext bleibt oft eigenständig, während H1, Abschnittsüberschrift und Abschluss sich ausschließlich im eingesetzten Namen unterscheiden.

Der Wächter rechnet aus jeder Überschrift den Eigennamen der Seite heraus, also den Ortsnamen oder den Branchennamen. Was übrig bleibt, ist die Schablone. Sind zwei Schablonen an derselben Position identisch, bricht der Bau ab und nennt beide Seiten. Bleibt nach Abzug des Namens nichts übrig, bestand die Überschrift ausschließlich aus ihm; auch das ist eine Schablone.

Was er nicht kann: Er misst Gliederung, nicht Substanz. Zwei Seiten mit verschiedenen Überschriften und austauschbarem Fließtext gehen durch. Er ersetzt den [Anti-Template-Review](05-anti-template-standard.md) nicht, er nimmt ihm den Fall ab, der sich mechanisch erkennen lässt.

Diese Ehrlichkeit über die Grenze gilt für jedes Gate. Ein Gate, dem mehr zugetraut wird als es leistet, ist gefährlicher als keines.

## Messen statt schätzen

Ein Gate braucht eine Zahl, und eine Zahl braucht eine Messung. Das klingt selbstverständlich und ist der Punkt, an dem Reviews üblicherweise scheitern.

„Die Ortsseiten wirken austauschbar" ist ein Gefühl und lässt sich bestreiten. „Auf den vier Ortsseiten stehen zwischen fünfundfünfzig und achtundfünfzig Prozent des Textes wortgleich, und drei der vier wiederkehrenden Zeilen stehen in Überschriften-Position" ist ein Befund und lässt sich abarbeiten. Der Unterschied ist nicht Genauigkeit, sondern Handlungsfähigkeit.

Deshalb gilt für jedes Review in VELLOX: **Wer eine Schwäche behauptet, nennt die Messung.** Zeichen zählen, Prozente rechnen, Dateigrößen ablesen, Kontraste berechnen, Klicktiefen nachbauen. Was sich nicht messen lässt, wird als Urteil gekennzeichnet und nicht als Befund verkauft.

Umgekehrt, und genauso wichtig: **Ein Befund ist kein Defekt, bevor er geprüft ist.** Eine externe Analyse behauptete für ein Projekt, es gebe keine Sitemap, keine `robots.txt` und keine strukturierten Daten. Alle drei existierten. Zwei ihrer Empfehlungen hätten aktiv geschadet: ein vorgeschlagener Titel riss die Zeichengrenze, die dieselbe Analyse zwei Absätze vorher aufstellte, und ein vorgeschlagenes Schlüsselwort hätte die Startseite gegen die eigene Ortsseite antreten lassen. Wer eine gelieferte Liste ausführt statt sie zu prüfen, baut fremde Fehler ein.

## Wie ein Gate entsteht

1. **Der Fehler passiert.** Einmal reicht.
2. **Die Ursache wird benannt, nicht das Symptom.** Nicht „Titel war zu lang", sondern „eine zu lange Zeile hat keine sichtbare Folge im Bau".
3. **Die Stufe wird gewählt.** So hoch wie möglich. Lässt sich der Fehler unmöglich machen, wird er unmöglich gemacht.
4. **Das Gate wird negativ getestet.** Ein Gate, das nie ausgelöst hat, ist eine Behauptung. Den Fehler absichtlich herstellen, den Abbruch sehen, zurücknehmen.
5. **Das Warum wird an das Gate geschrieben.** Am Code, nicht in ein Protokoll. Wer das Gate in zwei Jahren im Weg findet, muss lesen können, was es verhindert hat.
6. **Der Katalog oben wird ergänzt.**

Schritt 4 wird am häufigsten übersprungen und ist der wichtigste. Ein Gate mit einem Denkfehler in der Bedingung ist schlimmer als keines: Es erzeugt Vertrauen, das es nicht deckt.

## Verhältnis zu den anderen Kapiteln

Der [Qualitätsstandard](01-qualitaetsstandard.md) sagt, was gut ist. Dieses Kapitel sagt, wo die prüfbaren Teile davon wohnen. Der [Anti-Template-Standard](05-anti-template-standard.md) nennt Verbote; die mechanisierbaren darunter gehören in Gates, die restlichen bleiben Review. Die [Qualitätskontrolle](../10_CHECKLISTS/07-qualitaetskontrolle.md) prüft, was ein Mensch prüfen muss, und darf nicht prüfen, was ein Gate schon garantiert.

Diese Arbeitsteilung ist der eigentliche Gewinn. Eine Checkliste mit dreißig Punkten wird abgehakt statt gelesen. Eine Checkliste mit zwölf Punkten, hinter denen zwanzig Gates stehen, wird gelesen.
