# Die Laborzahl ist nicht die Leitung des Gastes

## Der Fall, aus dem dieses Kapitel entstand

Eine Seite hatte in Lighthouse eine LCP von 2,2 Sekunden, und der Auftrag lautete,
sie unter 2,0 Sekunden zu bringen. Die naheliegende Vermutung war, das große
Hero-Foto sei zu schwer und müsse kleiner oder unschärfer werden. Diese Vermutung
war falsch, und der Weg, das herauszufinden, ist die Regel dieses Kapitels.

Der Reflex, für eine Werkzeugzahl das auffälligste Element zu verschlechtern,
kostet fast immer Substanz und bringt oft nichts. Denn die Zahl, die ein
Labor-Werkzeug zeigt, ist nicht die Zeit, die der Gast erlebt.

## Zwei Zahlen, die man nicht verwechseln darf

Lighthouse misst im Standardlauf nicht die echte Ladezeit, sondern rechnet sie mit
einem Modell hoch (bei Lighthouse heißt es Lantern). Das Modell drosselt die
Leitung nicht wirklich, es schätzt aus dem beobachteten Netzwerk- und
Rechenaufwand, wie lange es auf einer gedachten 4G-Leitung dauern würde. Diese
Schätzung ist bewusst konservativ und kann deutlich über dem liegen, was ein
echter Browser zeigt.

Die zweite Zahl ist die gemessene: ein echter Browser, dessen Leitung und CPU
tatsächlich gedrosselt werden, und der die LCP über die Performance-API meldet. Im
Fall oben zeigte das Modell 2,2 Sekunden, der echte gedrosselte Browser aber rund
1,1 Sekunden. Die Seite war also längst unter dem Ziel; nur die Modellzahl war es
nicht. **Bevor eine Kennzahl eine Änderung rechtfertigt, wird die echte Zahl
gemessen, nicht die geschätzte.** Ein gelieferter Laborwert ist kein Defekt,
bevor er gegen eine echte Messung gehalten wurde.

## Erst den Engpass beweisen, dann handeln

Der entscheidende Schritt war ein Gegentest, nicht eine Meinung. Das Hero-Foto
wurde von 60 auf 21 Kilobyte verkleinert. Die Modellzahl blieb exakt bei 2,2
Sekunden; die echte LCP fiel auf 0,86 Sekunden. Damit war bewiesen: Die Modellzahl
hing hier am gerechneten Kritikpfad (Größe des HTML-Dokuments und Rechenzeit),
nicht an den Bild-Bytes. Das Bild zu verschlechtern hätte die Zielzahl um null
Millisekunden bewegt und nur das Schlüsselbild der Seite geschwächt.

Daraus die zweite Hälfte der Regel: **Welches Element die LCP trägt und woran seine
Zeit hängt, wird gemessen, bevor etwas dafür geopfert wird.** Das echte LCP-Element
lässt sich im Browser eindeutig auslesen (die `largest-contentful-paint`-Einträge
nennen das Element und die Renderzeit). Was den Engpass nicht bildet, bringt auch
nichts, wenn man es verkleinert.

## Was wirklich hilft: das LCP-Bild vorladen

Der verlustfreie Schritt, der die echte LCP senkte, war kein Eingriff am Bild sondern
an seiner Reihenfolge. Ein Hero-Foto steht tief im Dokument; der Browser findet es
erst, wenn er den Kopf und den Anfang des Körpers gelesen hat. Ein
`<link rel="preload" as="image">` im `<head>` mit genau demselben `srcset`,
`sizes` und Bildtyp wie das spätere Bild lässt ihn das LCP-Bild sofort anfordern,
parallel zum restlichen Dokument. Zwei Bedingungen machen den Unterschied zwischen
Gewinn und doppeltem Download: Der Preload muss das identische `srcset` und `sizes`
tragen, sonst lädt der Browser ein zweites, anderes Bild; und er gehört vor die
übrigen Preloads (etwa Schriften), damit das sichtbare Bild und nicht der Text die
Leitung zuerst bekommt. Schriften helfen dem Text, der ohnehin sofort in der
metrisch angepassten Ersatzschrift erscheint (siehe [Der Build ist nicht der
Browser des Gastes](06-der-build-ist-nicht-der-browser-des-gastes.md)); das
LCP-Bild ist das knappere Gut.

## Wo die Regel wohnt

Das ist kein Bau-Gate, sondern ein Reflex in der Abnahme. Wer eine Web-Vitals-Zahl
verbessern soll, misst sie zuerst im echten gedrosselten Browser, liest das
LCP-Element aus und beweist den Engpass mit einem billigen Gegentest, bevor er
Substanz opfert. Der Bezug zur Erstauslieferung steht in
[Erstauslieferung](../00_SYSTEM/07-erstauslieferung.md): Eine gemessene Zahl mit
ihrer Quelle ist Teil des fertigen Belegs, und „im Labor" und „beim Gast" sind
zwei verschiedene Quellen. Der QA-Beleg nennt beide und verwechselt sie nicht.
