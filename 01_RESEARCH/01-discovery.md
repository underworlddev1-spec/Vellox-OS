# Discovery: Die richtige Frage vor der richtigen Lösung

Discovery ist bei VELLOX keine freundliche Vorbesprechung und kein Sammeln möglichst vieler Informationen. Discovery ist die erste Designleistung: Aus einem Auftrag, der meist in Ergebnissen wie „neue Website“ oder „mehr Anfragen“ formuliert ist, wird ein gemeinsames Verständnis des Problems. Ohne diese Arbeit kann eine Agentur sehr präzise an der falschen Aufgabe arbeiten.

## Womit Discovery beginnt

Der erste Schritt ist die Rekonstruktion des Geschäfts. Welche Leistung wird tatsächlich verkauft? Wer entscheidet, wer nutzt sie, wer beeinflusst sie und wer trägt das Risiko einer falschen Entscheidung? Wie entsteht Umsatz, welche Anfragen sind wertvoll, und welche Anfragen kosten Zeit ohne zu passen? Eine Website wird besser, wenn sie diese Realität abbildet, nicht wenn sie ein Idealbild des Unternehmens erfindet.

Danach wird die Ausgangslage betrachtet. Welche Seiten werden gefunden, welche werden besucht, wo entstehen Rückfragen, und welche Inhalte existieren bereits? Technische Daten, Suchanfragen, Supportfragen und Vertriebserfahrungen sind genauso relevant wie ästhetische Referenzen. Wenn ein Unternehmen behauptet, die Website sei „zu alt“, muss geklärt werden, welche Konsequenz dieses Alter hat: mangelndes Vertrauen, schlechte Wartbarkeit, falsche Zielgruppen oder schlicht fehlende mobile Lesbarkeit.

## Bestehendes Material ist Evidenz

Wenn ein Betrieb bereits einen Auftritt hat, ist dieser Auftritt eine Quelle und nicht nur ein Sanierungsfall. Er enthält Preise, Leistungen, Öffnungszeiten, ein Zeichen, Farben und eine Schrift, und all das sind Entscheidungen, die jemand einmal getroffen hat. Diese Bestandsaufnahme gehört in die Discovery, weil sie später nicht mehr nachgeholt wird: Sobald der erste Entwurf steht, wird niemand mehr fragen, ob eine Farbe hergeleitet oder übernommen wurde.

Der bestehende Auftritt wird dafür geöffnet und angesehen, nicht nur im Quelltext gelesen. Das Verfahren und die Fallstricke stehen in der [Markeninventur](../02_BRANDING/04-markeninventur.md). Ihr Ergebnis wird in der Discovery mitgeführt wie jede andere Evidenz, mit Quelle, Datum und Sicherheit.

## Das Briefing beschreibt eine Auffassung, nicht einen Bestand

Zu Projektbeginn liegt fast immer ein Text vor, der beschreibt, was der Betrieb tut und was seine Website können soll: eine Ausschreibung, eine Zusammenfassung aus dem Erstgespräch, ein Anforderungspapier. Dieser Text ist Evidenz, aber nur für eine Sache. Er belegt, wie der Betrieb sein Angebot versteht und was ihm daran wichtig ist. Er belegt nicht, was sein bestehender Auftritt tatsächlich tut.

Der Unterschied wird unterschätzt, weil beide Aussagen im selben Absatz stehen und gleich klingen. „Wir haben keinen Onlineshop und keine Preise für Räder“ ist zwei Aussagen in einem Satz. Die erste ist eine Selbstauskunft über das Geschäftsmodell und stimmt. Die zweite ist eine Tatsachenbehauptung über die bestehende Website und war in dem Projekt, aus dem dieses Kapitel stammt, falsch: Der Auftritt veröffentlichte 106 Räder mit Preisen, zwei Drittel davon reduziert mit Streichpreis. Der Betrieb meinte, dass man dort nicht bestellen kann. Wer den Satz als Bestandsbeschreibung liest, streicht einen ganzen Auftrittsteil.

Das ist kein Einzelfall und keine Nachlässigkeit des Kunden. Ein Betriebsinhaber beschreibt sein Geschäft, nicht seine Software. Er sagt „wir verkaufen über Beratung“ und meint damit alles, was ihm an seinem Beruf wichtig ist; dass dieselbe Seite nebenbei einen Katalog mit Preisen führt, ist für ihn kein Widerspruch, sondern selbstverständliches Beiwerk. Die Übersetzung dieser Selbstauskunft in eine Bestandsliste ist unsere Arbeit, nicht seine.

**Die Regel lautet deshalb:** Jede Aussage im Briefing, die sich auf den bestehenden Auftritt bezieht, wird vor der Umfangsplanung gegen den Auftritt geprüft. Nicht jede Aussage über das Geschäft, nicht jede Absicht, nicht jeder Wunsch. Nur die Tatsachenbehauptungen über das, was heute existiert. Das sind meist weniger als zehn Sätze, und sie zu prüfen kostet eine halbe Stunde. Sie nicht zu prüfen kostet einen Nachbau oder einen verlorenen Funktionsteil.

**Woran man sie erkennt.** Eine Tatsachenbehauptung über den Bestand steht im Präsens und ließe sich mit einem Klick widerlegen: „Es gibt keine Terminbuchung.“ „Die Seite hat keine Preise.“ „Der Katalog ist nur ein Platzhalter.“ „Das Kontaktformular funktioniert nicht.“ Jede dieser Aussagen ist entweder eine Beobachtung oder eine Vermutung, und aus dem Text geht nicht hervor, welche von beiden.

**Was besonders leicht übersehen wird.** Funktionen, die von einem fremden Dienst nachgeladen werden, stehen nicht im Quelltext. Dort steht ein leeres Element mit einem Namen, das erst im Browser gefüllt wird. Wer die Seite herunterlädt und liest, findet nichts und hält die Funktion für nicht vorhanden. Deshalb prüft [`werkzeuge/markeninventur.mjs`](../werkzeuge/markeninventur.mjs) auch die fremden Herkünfte eines Auftritts und die beim Laden leeren Behälter. Jede gefundene Herkunft ist entweder eine **Funktion**, die weitergeführt werden muss, oder eine **Abhängigkeit**, die endet. Beides gehört entschieden, bevor der Umfang steht.

**Der Befund wird in beide Richtungen notiert.** Wenn die Prüfung das Briefing bestätigt, ist das ein Ergebnis und wird als solches festgehalten, mit Datum. Wenn sie es widerlegt, ist die Abweichung selbst wertvoll: Sie zeigt, dass der Betrieb einen Teil seines eigenen Auftritts nicht als Leistung wahrnimmt. Das ist regelmäßig ein Positionierungsbefund, kein Datenfehler. Im genannten Projekt war der übersehene Katalog gleichzeitig der beste Beleg für die Positionierung, weil sein Bestand zeigte, welche Art von Laden das ist.

## Die Discovery-Fragen

Gute Discovery-Fragen öffnen einen Zusammenhang. „Was macht ihr?“ führt oft zu einer Aufzählung. „In welchem Moment entscheidet sich ein Interessent für euch oder gegen euch?“ führt zu Verhalten. „Welche Frage wird vor dem Erstkontakt am häufigsten gestellt?“ legt Informationslücken frei. „Welcher Kunde passt gut, obwohl er nicht der größte ist?“ zeigt die gewünschte Qualität von Nachfrage.

Fragen werden nach ihrem Einfluss priorisiert. Eine offene Frage ist nur dann wichtig, wenn ihre Antwort Struktur, Ton, Angebot oder technische Umsetzung verändern würde. So bleibt Discovery fokussiert und wird nicht zu einer Enzyklopädie des Unternehmens.

## Interviews als Beobachtung von Entscheidungen

Interviews mit Inhabern, Vertrieb, Mitarbeitenden und Kunden werden nicht geführt, um schöne Zitate zu sammeln. Sie sollen zeigen, welche Sprache Menschen verwenden, welche Unterschiede sie wahrnehmen und wo Erwartungen auseinanderfallen. Frage nach konkreten Situationen: „Woran haben Sie damals gemerkt, dass Sie Hilfe brauchen?“ ist ergiebiger als „Was ist Ihnen wichtig?“

Dokumentiere nicht nur Aussagen, sondern Auslöser, Zweifel, Alternativen und Folgen. Wenn ein Kunde sagt, er habe wegen der „persönlichen Betreuung“ gewählt, muss klar werden, welches Verhalten diese Betreuung beweist. Ist es schnelle Rückmeldung, verständliche Beratung, ein fester Ansprechpartner oder das Gefühl, nicht abgefertigt zu werden? Die spätere Copy braucht den konkreten Mechanismus, nicht das abstrakte Lob.

## Die Ausgangssynthese

Am Ende der Discovery stehen keine Personas mit erfundenen Lebensgeschichten, sondern wenige arbeitsfähige Aussagen:

**Situation:** In welchem Moment beginnt die Suche?  
**Aufgabe:** Was soll der Besucher für sich lösen?  
**Widerstand:** Warum ist die Entscheidung schwierig oder riskant?  
**Beweis:** Was kann das Unternehmen glaubwürdig zeigen?  
**Nächster Schritt:** Welche Handlung ist realistisch und angemessen?

Diese Synthese ist die Brücke zum [Research über Zielgruppe und Positionierung](02-zielgruppen-und-positionierung.md). Sie verhindert, dass spätere Kapitel aus dem Bauch heraus mit unterschiedlichen Menschenbildern arbeiten.

## Umgang mit widersprüchlichen Aussagen

Widersprüche sind oft die wertvollsten Ergebnisse. Der Inhaber kann das Angebot als individuell beschreiben, während Kunden vor allem die Zuverlässigkeit erwähnen. Das Marketing spricht von Innovation, während Interessenten nach Einfachheit suchen. VELLOX glättet solche Unterschiede nicht zu einem Kompromisssatz. Das Team prüft, ob die Marke ein gewünschtes Selbstbild kommuniziert, das von der erlebten Leistung nicht getragen wird.

Eine Aussage wird nicht automatisch wahr, weil sie von einer internen Person stammt. Sie wird aber auch nicht automatisch verworfen, weil sie nicht in eine erste Analyse passt. Markiere Herkunft und Sicherheit jeder Erkenntnis. So kann die Positionierung später klar sein, ohne ihre Entstehung zu verleugnen.

## Discovery als Vertrag

Discovery liefert auch einen Arbeitsvertrag für das Projekt. Der Kunde sieht, welche Fragen beantwortet wurden und welche noch offen sind. Das Team kann erklären, warum manche Wünsche aufgenommen und andere verschoben werden. Stakeholder werden nicht zu anonymen Absendern von Geschmack; sie werden zu Beteiligten an konkreten Entscheidungen.

Ein gutes Discovery-Ergebnis beantwortet damit drei Fragen: Was muss die Website für das Geschäft leisten? Was muss ein richtiger Besucher verstehen oder fühlen? Welche Annahme könnte das Ergebnis am stärksten gefährden? Diese Fragen führen direkt in das [Entscheidungsframework](../00_SYSTEM/02-entscheidungsframework.md) und in die [Angebots- und Einwandanalyse](03-angebot-konkurrenz-und-einwaende.md).
## Von Notizen zu Prioritäten

Nach Interviews und Materialsammlung braucht Discovery eine Verdichtung. Markiere Aussagen, die sich wiederholen, Aussagen mit hoher Konsequenz und Aussagen, die nur ein einzelnes Selbstbild beschreiben. Wiederholung zeigt Relevanz, Konsequenz zeigt Risiko, und Einzelstimmen zeigen oft eine Hypothese, die geprüft werden muss. Diese drei Signale dürfen nicht einfach addiert werden. Eine seltene, aber geschäftskritische Information kann wichtiger sein als ein häufiges, nebensächliches Detail.

Ordne Erkenntnisse anschließend nach den Entscheidungen, die sie beeinflussen. Eine Erkenntnis ist für die Positionierung relevant, wenn sie die bevorzugte Zielgruppe oder den Unterschied verändert. Sie ist für UX relevant, wenn sie eine andere Reihenfolge oder einen anderen nächsten Schritt verlangt. Sie ist für Engineering relevant, wenn sie Inhalte, Integrationen, Datenschutz oder Performance beeinflusst. So bleibt die Synthese handlungsnah.

## Ein Discovery-Ergebnis, das trägt

Ein gutes Ergebnis enthält außerdem eine Liste der bewusst nicht beantworteten Fragen. Dazu gehört jeweils, warum die Frage offen bleibt, welche Entscheidung davon abhängt und bis wann sie geklärt werden muss. Das schützt das Projekt vor zwei Fehlern: dem stillen Erfinden einer Antwort und dem unendlichen Aufschieben aller Entscheidungen.

Die Freigabe erfolgt nicht durch ein allgemeines „passt“, sondern durch die Frage, ob Team und Kunde dieselbe Ausgangslage beschreiben. Wenn sie sich bei Zielgruppe, Angebot, Risiko und nächstem Schritt in unterschiedlichen Geschichten wiederfinden, ist weitere Gestaltung verfrüht. Discovery ist dann erfolgreich, wenn spätere Fachentscheidungen auf denselben Beobachtungen aufbauen.
