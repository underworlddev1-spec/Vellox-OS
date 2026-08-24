# Eine Vorgabe ist keine Messung

## Der Fehler, aus dem dieses Kapitel entstand

Ein Projektbrief legte die Akzentfarbe fest: „warmes Amber", und dazu den Wert
`#E4A03C`. Der Wert wurde übernommen und die Seite darauf gebaut. Der Kunde sah
sie an und sagte einen Satz, der die ganze Arbeit an dieser Stelle zurückwarf:
Das sieht altmodisch aus, unsere Farbe ist Gold, nicht Gelb.

Nachgemessen liegt `#E4A03C` bei Farbton 36 Grad und Sättigung 76 Prozent. Gold
liegt bei 46 bis 52 Grad und 47 bis 65 Prozent. Der Wert war also Orange, und
seine Sättigung war die des flachen Designs der frühen Zehnerjahre. Als Amber
war er völlig korrekt. Als Marke war er die falsche Farbe.

Das Entscheidende daran ist nicht, dass jemand sich vertan hat. Das passiert.
Entscheidend ist, **warum es niemandem auffiel**: Der Wert kam als Hexzahl.
Eine Hexzahl sieht aus wie ein Messwert. Sie hat sechs Stellen, sie ist
eindeutig, sie lässt sich nicht diskutieren. Also wurde sie behandelt wie
Evidenz und nie gegen ihren eigenen Namen gehalten.

## Die Regel

**Eine Zahl in einem Auftrag ist die Vermutung eines Menschen darüber, wie ein
Wort aussieht. Sie wird nicht dadurch zur Messung, dass sie eine Zahl ist.**

Das [Entscheidungsframework](02-entscheidungsframework.md) verlangt, Evidenz,
Interpretation und Entscheidung zu trennen. Dieses Kapitel benennt den einen
Fall, in dem diese Trennung besonders leicht zusammenbricht: wenn eine
Interpretation in der Form einer Zahl ankommt. Eine Zahl trägt keine Herkunft
mit sich. Man sieht ihr nicht an, ob sie gemessen, gerechnet oder geschätzt
wurde.

## Woran man den Fall erkennt

Der Verdacht besteht immer dann, wenn eine Vorgabe **einen Namen und einen Wert
gleichzeitig** enthält. Der Name sagt, was gemeint ist. Der Wert sagt, was
gebaut wird. Solange beide nicht gegeneinander geprüft sind, ist unbekannt, ob
sie dasselbe meinen.

Typische Paare aus der Praxis:

| Vorgabe | Name | Wert | Was geprüft werden muss |
|---|---|---|---|
| „warmes Amber, `#E4A03C`" | Amber | Farbton 36 Grad | Misst der Wert die Farbe, die sein Name behauptet? |
| „mobile Navigation ab 768 Pixeln" | mobil | 768 | Passt der Inhalt bei 769 Pixeln überhaupt in eine Zeile? |
| „ein Aquafacial dauert 60 Minuten" | eine Behandlung | 60 | Stammt die Zahl vom Betrieb oder aus einem Beitrag? |
| „eine ruhige Ladesequenz, 300 ms" | ruhig | 300 | Wirkt das gemessen ruhig oder hastig? |
| „Fließtext in Grau, `#6E7A75`" | lesbar | 3,94:1 | Erreicht der Wert die Schwelle, die „lesbar" bedeutet? |

Die letzten beiden Zeilen stammen aus demselben Projekt wie die erste. Alle drei
Vorgaben waren plausibel, keine war böswillig, und zwei von dreien waren falsch.

## Der Test

Er dauert eine Minute und besteht aus einer einzigen Frage:

> **Woher stammt diese Zahl, und was hätte sie widerlegt?**

Drei Antworten sind zulässig:

**Gemessen.** Jemand hat den Wert erhoben, und es ist nachvollziehbar, woran.
Dann ist er Evidenz und wird übernommen.

**Gerechnet.** Der Wert folgt aus einer anderen Größe, und die Rechnung steht
daneben. Dann ist er ableitbar und wird mit seiner Rechnung übernommen, damit
er sich mitändert, wenn sich die Grundlage ändert.

**Angenommen.** Niemand weiß es genau. Dann ist der Wert eine Hypothese, wird
als solche markiert und bekommt eine Beobachtung, die ihn bestätigen oder
widerlegen würde. Das ist ausdrücklich erlaubt. Nicht erlaubt ist, ihn später
als Tatsache zu behandeln.

Wer keine dieser drei Antworten geben kann, hat keine Zahl, sondern eine
Gewohnheit mit Nachkommastellen.

## Warum das nicht in eine Checkliste gehört

Weil es der Fall ist, den man beim Abhaken übersieht. Eine Checkliste fragt „ist
die Farbe gesetzt?" und die Antwort ist ja. Sie fragt nicht „heißt die Farbe,
wie sie aussieht?", weil diese Frage albern klingt, solange man sie nicht einmal
falsch beantwortet hat.

Deshalb gehört der prüfbare Teil in den Bau. Zwei Gates setzen ihn bisher um,
beide entstanden aus einem echten Fehler:

**Der Farbwortwächter.** Ein Token, dessen Name ein Farbwort trägt, wird gegen
den Bereich dieses Wortes gemessen. `--color-gold` bei 36 Grad bricht den Bau
ab. Ausgearbeitet in [Farbe und Material](../02_BRANDING/05-farbe-und-material.md),
umgesetzt in [`werkzeuge/farbwort-pruefen.mjs`](../werkzeuge/farbwort-pruefen.mjs).

**Die gemessene Bruchstelle.** Eine Bruchstelle ist die gemessene Mindestbreite
ihres Inhalts und keine Gerätezahl. Ausgearbeitet in
[Das Handy ist nicht die kleine Fassung](../04_UI/07-handy-zuerst-und-gemessen.md).

Was sich nicht mechanisieren lässt, bleibt die Frage nach der Herkunft. Ob eine
Zahl gemessen oder geraten wurde, kann kein Skript beantworten. Es kann nur
prüfen, ob sie mit ihrem eigenen Namen verträglich ist, und das ist bereits die
Hälfte der Fälle.

## Was der Projektbrief davon trägt

Der [Projektbrief](../09_TEMPLATES/01-projektbrief.md) führt jede Zahl mit ihrer
Herkunft. Eine Spalte genügt: gemessen, gerechnet oder angenommen. Bei
„angenommen" steht daneben, welche Beobachtung sie widerlegen würde.

Das kostet beim Schreiben eine Minute und erspart die Runde, in der ein Kunde
eine Farbe altmodisch nennt und niemand sagen kann, wo sie herkam.

## Verhältnis zu den anderen Kapiteln

Das [Entscheidungsframework](02-entscheidungsframework.md) trennt Evidenz,
Interpretation und Entscheidung. Dieses Kapitel benennt den Fall, in dem eine
Interpretation als Evidenz durchgeht, weil sie eine Zahl ist.
[Erzwungene Qualität](06-erzwungene-qualitaet.md) sagt, wo die prüfbaren Teile
davon wohnen. [Erstauslieferung](07-erstauslieferung.md) verlangt für jede Zahl
auf der Seite eine Herkunft; dieses Kapitel verlangt sie schon für jede Zahl,
die in das Projekt hineingeht.
