# Das obere Ende: Was passiert, wenn niemand mehr eine Regel schreibt

## Der Fehler, aus dem dieses Kapitel entstand

Eine fertige, mehrfach geprüfte Seite wurde auf einem 27-Zoll-Bildschirm
geöffnet und wirkte klein. Nicht falsch, nicht kaputt — klein. Ein schmaler
Streifen Inhalt in der Mitte, viel Weiß daneben, eine Überschrift, die auf
einem Laptop groß gewirkt hatte und hier verloren aussah.

Gemessen wurde daraufhin dieselbe Seite bei sieben Breiten. Das Ergebnis:

| Breite | Hülle | Anteil am Fenster | Überschrift | Kopfleiste |
| --- | --- | --- | --- | --- |
| 1280 | 1216 | 95 % | 54 px | 73 px |
| 1920 | 1216 | 63 % | 54 px | 73 px |
| 2560 | 1216 | 48 % | 54 px | 73 px |
| 3440 | 1216 | 35 % | 54 px | 73 px |

Von 1280 bis 3440 Pixeln ändert sich **kein einziger Wert**. Die Seite hört bei
1280 auf, sich anzupassen, und alles darüber bekommt dasselbe Bild in einem
größeren Rahmen.

Die Ursache war weder Nachlässigkeit noch Zeitmangel. Sie war eine
Voreinstellung: Das verwendete Framework definiert seine Bruchstellen bis 1536
Pixel, und die Seite nutzte die oberen zwei davon praktisch nicht. Eine
Stichprobe im Quelltext ergab, dass die Stufe für große Bildschirme im ganzen
Projekt zweimal vorkam, beide Male an derselben Komponente.

Daraus folgt die Regel dieses Kapitels: **Ein Entwurf hört nicht bei der
größten Bruchstelle des Frameworks auf. Er hört dort auf, wo eine bewusste
Obergrenze steht.** Ohne diese Grenze entscheidet nicht das Projekt, wie die
Seite auf einem großen Bildschirm aussieht, sondern der Hersteller eines
Werkzeugs.

## Warum das Gegenstück zum Handy-Kapitel ist

[`07-handy-zuerst-und-gemessen.md`](07-handy-zuerst-und-gemessen.md) beschreibt
den unteren Rand: Was nur unterhalb einer Bruchstelle existiert, sieht am
großen Bildschirm niemand. Hier steht derselbe Satz für die andere Richtung.

Der Unterschied liegt darin, wie sich der Fehler zeigt. Am Telefon bricht
etwas: Ein Kasten läuft aus dem Bild, eine Schaltfläche ist nicht mehr
erreichbar, ein Wort wird umgebrochen. Auf einem großen Bildschirm bricht
nichts. Alles funktioniert, alles ist erreichbar, jeder Test läuft durch — die
Seite wirkt nur billiger, als sie ist. Deshalb fällt dieser Fehler in Reviews
nicht auf und wird typischerweise vom Kunden gemeldet, nicht vom Team.

Die praktische Folge: **Der obere Rand braucht Zahlen, weil er kein Symptom
hat.** Am Telefon reicht Hinsehen, hier nicht.

## Die vier Zahlen für das obere Ende

Je Projekt einmal notiert, gemessen bei 1280, 1920 und 2560 Pixeln. Nicht
geschätzt und nicht aus dem verkleinerten Fenster abgelesen.

1. **Anteil der Hülle am Fenster.** Wie viel Prozent der Fensterbreite trägt
   Inhalt? Fällt der Wert bei 2560 unter etwa die Hälfte, sitzt die Seite in
   einem Streifen.
2. **Größe der Hauptüberschrift.** Bleibt sie über alle drei Breiten gleich,
   gibt es oberhalb der letzten Bruchstelle keine Regel mehr.
3. **Höhe der Kopfleiste.** Sie ist das erste, was ein Besucher sieht, und das
   erste, was auf einem großen Bildschirm dünn wirkt.
4. **Höhe und Schriftgrad der Hauptschaltfläche.** Der wichtigste Ausgang der
   Seite darf nicht das leichteste Element im ersten Bild sein.

Ein Wert, der über alle drei Breiten identisch ist, ist kein Beweis für einen
Fehler, aber immer eine Frage: Ist das entschieden oder übrig geblieben?

## Zwei Grenzen, die verwechselt werden

Bevor eine Hülle wächst, muss geklärt sein, welche Grenze sie überhaupt setzt.
Es sind zwei verschiedene, und sie werden regelmäßig in dieselbe Regel gepackt.

**Die Lesbarkeitsgrenze** schützt die Zeilenlänge. Lesbar sind 45 bis 75
Zeichen; darüber verliert das Auge beim Zeilenwechsel den Anschluss und muss
den nächsten Zeilenanfang suchen. Diese Grenze gehört an den Fließtext selbst.

**Die Kompositionsgrenze** schützt das Verhältnis von Inhalt zu Rand. Sie
gehört an die Hülle und beantwortet die Frage, ab wann eine Navigation, die
sich über den ganzen Bildschirm zieht, kein Gewinn mehr ist.

Im Ausgangsfall trug die Hülle einen Kommentar, der sie mit der Lesbarkeit
begründete. Die Messung widersprach: Der Fließtext hatte längst seine eigene
Grenze, und vier Absätze **ohne** diese Grenze liefen schon vor jeder Änderung
über die volle Breite — der längste mit 150 Zeichen in der ersten Zeile.

Die Regel daraus: **Wer eine Hülle mit Lesbarkeit begründet, muss zeigen, dass
der Fließtext ohne sie tatsächlich zu breit wird.** Meistens stimmt das nicht,
und die Begründung verdeckt dann, dass einzelne Absätze ungeschützt sind.

## Die erste Falle: Zwei Regeln um dieselbe Eigenschaft

Beim Verbreitern entstand ein Fehler, der teurer war als das Problem, das er
lösen sollte.

Die Hülle bekam für große Bildschirme zusätzliche Regeln mit einer größeren
Höchstbreite. Mehrere Seiten trugen jedoch die Hülle und eine engere Grenze am
**selben Element**. Beide setzen dieselbe Eigenschaft mit gleicher
Spezifität — es entscheidet also die Reihenfolge in der Datei, und die neue
Regel stand weiter unten. Ab der Bruchstelle gewann sie, die engere Grenze war
ausgehebelt, und der Vorspann sprang von 768 auf 1408 Pixel. Betroffen waren 17
Stellen. Bei 1280 Pixeln war davon nichts zu sehen.

Die verallgemeinerbare Aussage: **Eine Eigenschaft, die an einem Element aus
zwei Quellen kommen kann, ist ein Fehler, der auf eine Gelegenheit wartet.**
Der Ausweg ist nicht mehr Spezifität, sondern eine Quelle: Die Hülle hält ihre
Breite in einer Variablen, die Bruchstellen ändern nur die Variable, und es
bleibt bei genau einer Deklaration an derselben Stelle der Kaskade wie vorher.

Der Nebeneffekt ist ein Werkzeug. Eine Vorlage, die anders sein soll — ein
langer Lesetext etwa —, setzt dieselbe Variable auf einen engeren Wert und
rückt damit als ein Block, statt ihre Blöcke einzeln mittig zu setzen. Das ist
wichtig, weil Blöcke mit verschiedenen Höchstbreiten sich eine linke Kante
teilen: Wer jeden einzeln zentriert, zerreißt genau diese Kante.

## Die zweite Falle: Bilder haben eine Obergrenze, die niemand aufschreibt

Eine breitere Hülle vergrößert jedes Bild darin. Ein Bild, das über seine
tatsächliche Auflösung hinaus dargestellt wird, wird weich. Bei Fotos fällt das
spät auf, bei **Bildschirmfotos sofort**, weil sie kleine Schrift enthalten —
und Bildschirmfotos sind auf Agentur- und Referenzseiten das häufigste
Bildmaterial überhaupt.

Im Ausgangsfall wurden drei Kundenaufnahmen mit 1408 Pixeln dargestellt, obwohl
sie 1200 haben. 17 Prozent Vergrößerung.

Die Regel: **Kein Bild wird breiter dargestellt, als es ist.** Und sie gehört
nicht in eine Checkliste, sondern in die Bildkomponente. Wer die echten Maße
ohnehin kennt — und das muss er, weil ohne Breite und Höhe das Layout beim
Laden springt —, kann daraus eine Höchstbreite setzen. Damit ist
Hochskalierung nicht mehr eine Frage der Aufmerksamkeit, sondern unmöglich.
Siehe [`00_SYSTEM/06-erzwungene-qualitaet.md`](../00_SYSTEM/06-erzwungene-qualitaet.md).

**Was diese Regel nicht mitentscheiden darf, ist die Ausrichtung.** Der erste
Versuch zentrierte begrenzte Bilder gleich mit und zerbrach damit eine andere
Seite: Dort hing ein zweites, kleineres Bild absolut an der rechten Kante des
umgebenden Kastens, und sobald das große Bild schmaler wurde als der Kasten,
stand es daneben in der Luft. Wohin ein begrenztes Bild rückt, weiß nur die
aufrufende Stelle. Die Komponente begrenzt, das Layout ordnet an.

## Die Obergrenze ist eine Entscheidung, keine Zahl

Es gibt keinen richtigen Wert. Es gibt eine Begründung, die für das Projekt
trägt, und Stufen statt unbegrenztem Wachstum. Im Ausgangsfall wurden es zwei
Stufen mit dem Argument, dass eine Navigation über 3440 Pixel kein Gewinn ist.

Unterhalb der Stufen wurde nichts angefasst. Das ist die zweite Hälfte der
Entscheidung und wird gern vergessen: **Wer eine Beschwerde über große
Bildschirme hört, ändert große Bildschirme.** Ein Entwurf, über den niemand
geklagt hat, ist kein Anlass.

## Das Werkzeug dazu

Die Zeilenlängen-Prüfung ist der Teil dieses Kapitels, der sich mechanisieren
lässt, und sie hat den zweiten Fehler oben gefangen — nicht das Auge.
[`werkzeuge/zeilen.mjs`](../werkzeuge/zeilen.mjs) misst über mehrere Breiten
und gibt einen Rückgabewert zurück, taugt also als Abbruchbedingung im Bau.

Die übrigen Zahlen dieses Kapitels bleiben Prosa und Urteil. Ob ein Anteil von
57 Prozent richtig ist oder eine Kopfleiste dünn wirkt, kann kein Skript
entscheiden. Die Einordnung dieser Stufen steht in
[Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md).

## Reviewfrage

Öffne die fertige Seite bei 2560 Pixeln und notiere die vier Zahlen. Wenn
Überschrift, Kopfleiste und Hauptschaltfläche dieselben Werte tragen wie bei
1280, dann hat nicht das Projekt entschieden, wie die Seite auf diesem
Bildschirm aussieht, sondern die Voreinstellung eines Frameworks. Und wenn die
Hülle danach wächst: Ist danach geprüft worden, ob eine engere Grenze am selben
Element noch gilt, und ob ein Bild jetzt größer dargestellt wird, als es ist?
