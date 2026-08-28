# Der Build ist nicht der Browser des Gastes

## Der Fehler, aus dem dieses Kapitel entstand

Ein Hero-Bild wurde beim Kunden als kaputtes Bild angezeigt, nur der Alt-Text stand da. Auf demselben Bildschirm lud das Logo. Serverseitig war alles in Ordnung: Die Bilddatei war gültig (die Bildbibliothek dekodierte sie fehlerfrei), sie kam mit HTTP 200 vom CDN, der Build war grün und Lighthouse mobil bei 99. Der Unterschied lag allein im Format: Das Logo wurde als WebP ausgeliefert, das Hero-Bild AVIF-zuerst, und der Browser des Gastes konnte dieses AVIF nicht darstellen.

Die Regel dahinter ist unbequem, weil sie eine Sicherheit entwertet: **Ein grüner Build im Headless-Browser beweist, dass die Seite in einem Browser funktioniert, nicht in jedem.** Der Build läuft im bequemsten Browser, den es gibt, und der ist kein Beleg für den unbequemsten, in dem ein Gast sitzt.

## Warum das Bild nicht zurückfiel

Ein `<picture>` mit mehreren `<source type="...">` wählt die erste Quelle, deren Format der Browser zu unterstützen angibt. Diese Wahl fällt anhand der Formatunterstützung, nicht anhand des Dekodier-Erfolgs. Sagt ein Browser „ich kann image/avif", nimmt er die AVIF-Quelle und bleibt dabei. Kann er die konkrete Datei dann doch nicht rendern, etwa weil sein Decoder fehlerhaft, abgeschaltet oder für diese Kodierung ungeeignet ist, zeigt er ein kaputtes Bild. Er fällt nicht auf die WebP- oder JPG-Quelle zurück, denn der Rückfall ist für den Fall gebaut, dass ein Format nicht unterstützt wird, nicht für den Fall, dass eine unterstützte Datei nicht aufgeht.

Das ist der Unterschied zwischen zwei Fehlern, die gleich aussehen: „Format nicht unterstützt" hat einen Rückfall, „Format unterstützt, Datei geht nicht auf" hat keinen. Der zweite ist die stille Lücke.

## Warum der Build es nicht sah

Der Build lief im Headless-Chromium, das AVIF sauber dekodiert. Die Dateien waren gültig, die Antwort war 200, die Kennzahlen waren grün. Jede Prüfung, die am Build hängt, war bestanden. Der Fehler existierte ausschließlich im Browser eines Gastes, und dorthin reicht keine Build-Prüfung.

Das ist dieselbe Fehlerklasse wie in [Das Handy ist nicht die kleine Fassung](../04_UI/07-handy-zuerst-und-gemessen.md) und [Der große Bildschirm ist nicht die feste Fassung](../04_UI/08-grosser-bildschirm-und-skalierung.md): Der Schaden lebt genau dort, wo im Bau niemand hinsieht. Dort war es eine Breite, hier ist es ein Browser.

## Die Entscheidung: das Format nach seinem schlechtesten Fall wählen

Ein Auslieferungsformat ist nur so gut wie sein schlechtester Ausgang. AVIF spart gegenüber WebP einige Prozent Dateigröße; dafür trägt es in einem Teil der Browser das Risiko eines stillen, nicht rückfallbaren Ausfalls. Für Inhaltsbilder ist dieser Tausch schlecht: Die Ersparnis ist marginal, der Ausfall ist total und unsichtbar. **Inhaltsbilder werden als WebP mit JPG-Rückfall ausgeliefert.** WebP wird überall unterstützt und hat diese Dekodier-Eigenheit nicht; der JPG-Rückfall deckt die letzten alten Browser. AVIF bleibt möglich, aber nur dort, wo die Browsermatrix erklärt und geprüft ist, nicht als Voreinstellung.

Die allgemeine Fassung gilt über Bilder hinaus: **Ein Weg, der leise und ohne Rückfall bricht, ist schlechter als ein etwas teurerer, der es nie tut.** Bei einer verkaufenden Seite, deren stärkstes Bild oben steht, ist ein leeres Rechteck an dieser Stelle kein kleiner Schönheitsfehler, sondern der erste Eindruck.

## Und die Schrift, die erst beim Gast springt

Denselben blinden Fleck hat der Schriftwechsel. Im Build ist die eigene Schrift sofort da, aus dem Cache oder vom lokalen Host, und nichts verschiebt sich. Beim Gast lädt zuerst die Fallback-Schrift, und wenn die eigene ankommt, springt das Layout, weil beide Schriften unterschiedlich breit und hoch laufen. Der Sprung zählt als Layout-Shift und trifft genau den ersten Eindruck, während der Gast schon liest.

Die Lösung ist kein Verstecken der Schrift, sondern eine Fallback-Schrift, die exakt die Box der echten belegt. Über `@font-face` wird einer lokalen Systemschrift per `size-adjust`, `ascent-override` und `descent-override` die Metrik der Zielschrift aufgezwungen, aus deren echten Fontmetriken gerechnet und nicht geschätzt. Dann besetzt der Fallback dieselbe Fläche, und der Wechsel auf die eigene Schrift verschiebt nichts. Gemessen am Projekt blieb der kumulative Layout-Shift bei null, obwohl die Schriften erst nach dem ersten Bild ankamen. Wird eine Schrift getauscht, werden diese Werte neu gerechnet.

## Wie geprüft wird

Ein gültiger Build und eine 200-Antwort sind notwendig, aber sie beweisen nicht, dass beim Gast Pixel erscheinen. Der Beweis ist die Darstellung in einem echten Zielbrowser, nicht nur in dem, in dem der Build läuft. Wo ein zweiter Browser im Bau nicht verfügbar ist, tritt an seine Stelle die Matrixregel: Für Inhaltsbilder wird ein Format gewählt, dessen Rückfallkette keine stille Lücke hat, statt sich auf die Unterstützungsanzeige eines einzelnen Browsers zu verlassen.

## Wo die Regel wohnt

Der prüfbare Teil gehört als Gate nach [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md): Inhaltsbilder liefern WebP mit einem echten JPG-Rückfall aus, AVIF nur mit erklärter Browsermatrix; und zu jeder eigenen Schrift existiert eine metrisch angepasste Fallback-Schrift. Das Urteil, wann eine Ausnahme trägt, etwa eine Fläche, die AVIF nachweislich verkraftet, bleibt beim Menschen. Die Voreinstellung ist der sichere Weg, weil der teure Fall unsichtbar ist und deshalb niemand ihn rechtzeitig sieht.

Der Bezug zu den Core Web Vitals steht in [Performance und Core Web Vitals](../06_SEO/04-performance-und-core-web-vitals.md): Der Schriftsprung ist die häufigste Quelle eines schlechten CLS, und die metrisch angepasste Fallback-Schrift ist seine sauberste Lösung, weil sie den Sprung verhindert, statt ihn zu kaschieren.
