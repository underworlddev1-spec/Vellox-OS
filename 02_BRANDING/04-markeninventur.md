# Markeninventur: Was vorhanden ist, bevor etwas Neues entsteht

Die meisten Projekte beginnen nicht bei null. Ein Betrieb, der seit Jahren am Markt ist, hat fast immer ein Zeichen, eine Farbe, eine Schrift und eine Art zu sprechen, auch wenn nichts davon in einem Markenhandbuch steht. Dieses Kapitel beschreibt, wie dieser Bestand festgestellt wird, bevor Markenstrategie und visuelles System daraus etwas machen. Bei einem Kunden mit vorhandenem Auftritt ist es das erste Kapitel dieses Ordners, das bearbeitet wird.

## Das Problem, das dieses Kapitel löst

Bei einem Relaunch entsteht regelmäßig der Befund, der Kunde habe keine Marke. Er klingt harmlos und wirkt wie eine Einladung zur gestalterischen Freiheit. Tatsächlich ist er der teuerste Fehler, den eine Agentur in dieser Phase machen kann. Er wirft weg, was bereits wiedererkennbar war, und ersetzt eine Entscheidung des Kunden durch eine Präferenz der Agentur.

Der Schaden zeigt sich selten sofort. Er zeigt sich, wenn der neue Auftritt neben dem Ladenschild, dem Fahrzeug und der Arbeitskleidung steht und nicht mehr zusammengehört. Er zeigt sich, wenn Bestandskunden die Seite nicht wiedererkennen. Und er zeigt sich im Gespräch, sobald jemand fragt, warum die Farbe eine andere ist als die, mit der der Betrieb seit zehn Jahren arbeitet.

Der [Anti-Template-Standard](../00_SYSTEM/05-anti-template-standard.md) verlangt für jede auffällige Entscheidung eine Herkunft. Die beste Herkunft ist der Kunde selbst. Eine Herleitung aus Branche, Material oder Zielgruppe ist zulässig, aber sie ist die zweite Wahl. Sie wird erst gebraucht, wenn wirklich nichts vorhanden ist.

## Ein negativer Befund braucht dieselbe Sorgfalt wie ein positiver

„Der Betrieb hat keine Markenfarbe" ist keine Zurückhaltung, sondern eine Tatsachenbehauptung. Sie ist nur dann zulässig, wenn die verwendete Methode überhaupt geeignet war, eine Markenfarbe zu finden. Abwesenheit von Evidenz ist keine Evidenz der Abwesenheit.

Diese Unterscheidung ist wichtiger, als sie klingt. Ein positiver Fund wird im Projekt automatisch geprüft, weil jemand ihn anwendet und dabei stutzt, wenn er nicht passt. Ein negativer Fund wird nie geprüft. Er verschwindet sofort hinter der Entscheidung, die auf ihm aufbaut, und niemand kommt später auf die Idee, ihn zu hinterfragen. Deshalb gilt: Wer feststellt, dass etwas fehlt, notiert dazu, wie er gesucht hat.

## Die Methode: am gerenderten Auftritt, nicht am Quelltext

Der häufigste Weg zum falschen negativen Befund ist die Suche im Quelltext. Sie ist schnell, sie fühlt sich gründlich an, und sie versagt in genau den Fällen, in denen der Bestand interessant wäre.

Sie versagt, weil ein Wert selten dort steht, wo gesucht wird. Er kann in einer eigenen, angepassten Build-Datei eines Frameworks liegen, in der nur wenige Standardwerte überschrieben sind, während die sichtbaren Zusatz-Stylesheets tatsächlich farblos aussehen. Er kann als Variable definiert und erst über die Kaskade wirksam werden. Er kann aus einer Grafik stammen, aus einem Hintergrundbild, aus einem Logo. Er kann zur Laufzeit gesetzt werden. In jedem dieser Fälle findet eine Textsuche nichts, obwohl der Wert im Browser deutlich sichtbar ist.

Der belastbare Nachweis läuft deshalb über den gerenderten Zustand. Die Seite wird geöffnet, und die tatsächlich berechneten Stile werden ausgelesen, gewichtet nach der Fläche, die sie einnehmen. Was auf zehntausend Pixeln liegt, sagt mehr über eine Marke als eine Deklaration, die nirgends greift. Das gilt auch für Typografie: Entscheidend ist, welche Schrift der Browser wirklich verwendet, nicht welche in einer Liste an erster Stelle steht.

Wenn der Auftritt nicht direkt abrufbar ist, etwa wegen eines Proxys, einer Anmeldung oder einer Netzsperre, wird er lokal gespiegelt und dann gerendert. Der Umweg kostet Minuten. Ein nicht gerenderter Auftritt ist kein geprüfter Auftritt, und ein Befund aus einer reinen Textsuche wird nicht als Ergebnis der Markeninventur geführt.

## Wo Markenwerte tatsächlich liegen

Die folgende Reihenfolge hat sich bewährt, weil sie mit den Orten beginnt, die am häufigsten übersehen werden.

Zuerst der gerenderte Auftritt selbst, mit berechneten Farben, Schriften und Flächen. Danach die Dateien auf der eigenen Domain des Kunden, insbesondere eine angepasste Fassung eines Frameworks. Der Ort ist deshalb aussagekräftig, weil dort jemand bewusst wenige Standardwerte ersetzt hat, und genau diese wenigen Werte sind die Markenentscheidung.

Danach das Zeichen. Ein Logo trägt oft mehr Information, als es auf den ersten Blick zeigt: die Farbwerte selbst, die Formensprache der Buchstaben, ein Bildteil, der eine eigene Geschichte hat. Anschließend die kleinen technischen Angaben, die niemand für Marke hält und die trotzdem eine Entscheidung enthalten: Favicon, Themenfarbe im Kopfbereich, App-Symbole.

Danach die Kanäle außerhalb der Website. Profilbilder, Kanalgrafiken und Beitragsvorlagen zeigen, womit der Betrieb tatsächlich arbeitet, und häufig sind sie aktueller als die Website. Zuletzt und am wichtigsten die Wirklichkeit außerhalb des Bildschirms: Ladenschild, Fassade, Fahrzeugbeschriftung, Arbeitskleidung, Briefbogen, Rechnungsvorlage, E-Mail-Signatur. Ein Foto der Fassade beantwortet Fragen, die kein Stylesheet beantworten kann.

## Was inventarisiert wird

Die Inventur erfasst Zeichen, Farbe, Schrift, Bildsprache, Tonalität und die Anwendungen, in denen all das auftaucht. Für jeden Eintrag werden vier Angaben festgehalten: die Quelle mit Datum, der Zustand der Datei, die Rechtelage und die Sicherheit des Befundes.

Die Rechtelage wird oft vergessen und rächt sich spät. Ein Logo gehört dem Kunden, aber die Vektorfassung liegt häufig bei der Agentur, die es erstellt hat. Eine Schrift kann kommerziell lizenziert und über die Plattform des bisherigen Anbieters ausgeliefert werden, sodass die Lizenz mit der Abschaltung dieser Plattform endet. Herstellerlogos brauchen eine nachweisbare Nutzungserlaubnis. Wer diese Punkte erst beim Livegang bemerkt, hat entweder ein Rechtsproblem oder eine Lücke im Auftritt.

## Drei Zustände, die getrennt bleiben müssen

Jede sichtbare Eigenschaft des neuen Auftritts erhält genau einen von drei Zuständen.

**Übernommen** bedeutet, dass die Eigenschaft belegbar vom Kunden stammt. Die Quelle wird genannt. **Abgeleitet** bedeutet, dass sie aus etwas Vorhandenem folgt, ohne selbst vorhanden gewesen zu sein, etwa eine Schriftwahl, die der Formensprache des Zeichens folgt. **Neu entschieden** bedeutet, dass nichts vorhanden war und die Agentur entschieden hat.

Diese Trennung wird dokumentiert und bleibt im Projekt sichtbar. Ohne sie kann später niemand mehr sagen, welche Gestaltung dem Kunden gehört und welche der Agentur. Das ist nicht nur eine Frage der Höflichkeit. Es entscheidet darüber, was bei einem Anbieterwechsel mitgeht, worüber verhandelt werden darf und was bei einer Änderung ohne Rückfrage angepasst werden kann.

## Rangfolge bei Widersprüchen

Die gelebte Wirklichkeit schlägt die Datei. Wenn das Ladenschild einen anderen Ton führt als das Stylesheet, gilt das Ladenschild, weil Kunden es sehen. Die Datei schlägt die Herleitung. Ein Wert aus dem bestehenden Auftritt ist ein Beleg, auch wenn er ungünstig ist. Die Herleitung kommt zuletzt und nur dann, wenn beides fehlt.

Ein Fund im Stylesheet ist damit ein Beleg, aber kein Beweis für den Rest der Markenwirklichkeit. Er wird als solcher notiert und beim Kundentermin gegen die Wirklichkeit geprüft. Eine offene Frage an dieser Stelle ist billig; eine falsche Annahme wird teuer, sobald Druckmaterial folgt.

## Übernahme ist keine Pflicht zur Fortführung

Identität und Anwendung werden getrennt bewertet. Übernommen wird die Identität: das Zeichen, die Farbwerte, die Schrift, der Ton. Nicht übernommen werden muss die Art, wie der alte Auftritt damit umgegangen ist.

Eine Marke, deren Farbe im Bestand eine ganze Navigationsleiste füllt, kann im neuen System als Akzent für die primäre Handlung geführt werden. Die Marke wird dadurch nicht verletzt, sondern präziser eingesetzt, weil eine Farbe, die zugleich Fläche und Handlung ist, ihre Aussage verliert. Diese Unterscheidung gehört in die Dokumentation, sonst wirkt sie im Kundengespräch wie eine Nachlässigkeit statt wie eine Entscheidung.

Ebenso wird nicht alles fortgeführt, was rechtlich oder technisch nicht mitkommt. Eine Schrift ohne übertragbare Lizenz wird ersetzt, und der Ersatz wird begründet. Ein Zeichen, das nur als kleines Pixelbild vorliegt, reicht für den Bildschirm und nicht für Druck; die Vektorfassung wird als offene Anforderung geführt, nicht stillschweigend nachgezeichnet.

## Die Schwester dieser Regel: der Funktionsbestand

Dieses Kapitel behandelt, was ein Auftritt an Markenwerten führt. Die gleiche Prüfung mit derselben Begründung gilt für das, was er **kann**: welche Funktionen er anbietet, welche Inhalte er veröffentlicht, welche fremden Dienste ihn mitbetreiben. Auch hier ist die häufigste Fehlerquelle nicht Nachlässigkeit, sondern eine Quelle, die zu früh für ausreichend gehalten wird. Bei der Marke ist es der Quelltext, beim Funktionsbestand das Briefing. Beide klingen, als beschrieben sie den Bestand, und beide tun es nicht.

Ausgearbeitet ist das in [Das Briefing beschreibt eine Auffassung, nicht einen Bestand](../01_RESEARCH/01-discovery.md). Wer diese Inventur ohnehin durchführt, erledigt beides in einem Durchgang: Der Bericht des Werkzeugs nennt neben Farben und Schriften auch die fremden Herkünfte und die beim Laden leeren Behälter.

## Wann dieses Kapitel nicht gilt

Bei einer Neugründung ohne jede Präsenz gibt es nichts zu inventarisieren, und die Markenstrategie beginnt bei der Positionierung. Bei einem ausdrücklich beauftragten Markenwechsel wird die Inventur trotzdem durchgeführt, dann aber als Grundlage für die Entscheidung, was bewusst aufgegeben wird. Ein Bruch, der weiß, was er bricht, ist etwas anderes als ein Bruch aus Unkenntnis.

## Wo diese Regel wohnt

Nach [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md) gehört eine prüfbare Regel nicht in Prosa. Die Markeninventur zerfällt dabei in Teile, die auf unterschiedliche Stufen gehören, und diese Aufteilung ist selbst eine Aussage darüber, was ein Skript leisten kann.

Auf **Stufe 2** gehört die Vollständigkeit der Herkunftsangabe. Jeder Design-Token trägt einen der drei Zustände, übernommene tragen zusätzlich Fundstelle und Abrufdatum. Fehlt eine dieser Angaben, bricht der Bau ab. Das Gate steht als übernehmbarer Code in [`09_TEMPLATES/05-qualitaetsgates.md`](../09_TEMPLATES/05-qualitaetsgates.md), Abschnitt 10. Es prüft nicht, ob eine Farbe stimmt, sondern ob jemand die Frage nach ihrer Herkunft überhaupt gestellt hat.

Auf **Stufe 3** gehört die Erhebung selbst. Das Skript [`werkzeuge/markeninventur.mjs`](../werkzeuge/markeninventur.mjs) öffnet den bestehenden Auftritt, liest die berechneten Stile aus und gibt Farben und Schriften gewichtet aus, getrennt nach Fläche und nach Vorkommen an Handlungselementen. Damit ist der Weg über den gerenderten Zustand nicht mehr eine Frage der Disziplin, sondern der voreingestellte Weg.

```bash
node werkzeuge/markeninventur.mjs https://www.kunde.de --aus inventur.md
```

Scheitert der direkte Abruf an einem Proxy, einer Netzsperre oder einem Bot-Schutz, spiegelt `--spiegeln` den Auftritt lokal und rendert die Kopie. Der Bericht enthält zusätzlich die Kontrastwerte auf hellem und dunklem Grund, die geladenen Schriftdateien mit dem Hinweis auf ihre Lizenz und die Rahmenwerk-Dateien, die auf der eigenen Domain des Kunden liegen. Findet das Skript keine bunte Farbe, schreibt es das als noch nicht belastbaren Zwischenstand mit der Liste der Orte, die es nicht sehen kann, und nicht als Feststellung.

Auf **Stufe 4** bleibt der Abgleich mit der Wirklichkeit. Ob Ladenschild, Fahrzeug und Arbeitskleidung denselben Ton führen wie das Stylesheet, kann kein Skript beurteilen. Das ist eine Frage an den Kunden und gehört auf die Checkliste, nicht in den Bau.

Auf **Stufe 5**, also hier, bleibt die Begründung: warum ein negativer Befund gefährlicher ist als ein falscher positiver, und warum die Rangfolge bei Widersprüchen so herum verläuft.

## Prüfung vor der Freigabe

Die Inventur ist belastbar, wenn vier Fragen beantwortet sind.

Wurde der bestehende Auftritt gerendert und nicht nur gelesen? Ist zu jedem negativen Befund notiert, wie gesucht wurde? Trägt jede sichtbare Eigenschaft des neuen Entwurfs einen der drei Zustände übernommen, abgeleitet oder neu entschieden? Und ist zu jeder übernommenen Datei die Rechtelage geklärt?

Wenn eine dieser Fragen offen ist, beginnt die Gestaltung zu früh. Die Ergebnisse fließen in die [Markenstrategie](01-markenstrategie.md) und in das [visuelle System](02-visuelles-system.md); die offenen Punkte gehen als benannte Fragen in den [Discovery-Brief](../09_TEMPLATES/02-discovery-brief.md) und in die [Discovery-Checkliste](../10_CHECKLISTS/02-discovery.md).
