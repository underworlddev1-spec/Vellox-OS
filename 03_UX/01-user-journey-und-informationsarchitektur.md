# User Journey und Informationsarchitektur

Informationsarchitektur ist die sichtbare Ordnung eines Geschäftsversprechens. Sie entscheidet, welche Fragen eine Seite zuerst beantwortet, welche Wege angeboten werden und welche Inhalte zusammengehören. Eine gute Architektur reduziert nicht nur Klicks. Sie reduziert das Gefühl, den falschen Weg wählen zu können.

## Die Journey als Veränderung

Eine User Journey beginnt nicht mit dem Besuch der Startseite. Sie beginnt mit einer Situation außerhalb der Website: ein Problem, ein Wunsch, eine Empfehlung, eine Suchanfrage oder eine wiederkehrende Unsicherheit. Die Seite empfängt einen Menschen, der bereits etwas weiß, aber noch nicht genug für eine Entscheidung.

Beschreibe für wichtige Journeys den Anfangszustand, die zentrale Frage, den nötigen Beweis und den gewünschten Endzustand. Für einen Termin kann der Endzustand eine passende Anfrage sein, nicht bloß ein Klick. Für eine komplexe Beratung kann er bedeuten, dass eine Person den Prozess versteht und sich bewusst für ein Gespräch entscheidet.

## Informationsarchitektur aus Aufgaben bauen

Beginne nicht mit Menüpunkten, die aus der internen Organisation stammen. Gruppiere Inhalte nach den Fragen und Aufgaben der Besucher. „Leistungen“, „Über uns“ und „Kontakt“ sind verständlich, aber oft zu grob. In manchen Fällen brauchen Menschen Wege nach Anliegen, Ergebnis, Ort oder Zielgruppe.

Jede Seite erhält eine primäre Aufgabe und maximal einige sekundäre Aufgaben. Eine Leistungsseite erklärt nicht nur die Leistung, sondern zeigt ihre Passung, ihren Ablauf, ihren Beweis und den nächsten Schritt. Eine Über-uns-Seite muss nicht die gesamte Geschichte erzählen, wenn Vertrauen an einer konkreten Arbeitsweise entsteht.

## Navigation als Versprechen

Navigation sagt: „Diese Ziele sind erreichbar, und wir haben sie für dich geordnet.“ Begriffe sollten daher die Sprache der Besucher verwenden, nicht die Organigramme des Unternehmens. Ein Menü darf reduziert sein, wenn die Seiteninhalte gute Abzweigungen und Suchmöglichkeiten bieten. Es darf umfangreicher sein, wenn die Entscheidung viele eigenständige Wege besitzt.

Der aktive Zustand, die mobile Navigation, der Zurückweg und der Footer müssen dieselbe Ordnung bestätigen. Ein Hamburger-Menü ist kein Freibrief, wichtige Orientierung zu verstecken. Die [UI-Regeln für Navigation und Hero](../04_UI/02-navigation-und-hero.md) prüfen die visuelle Umsetzung.

## Inhalte als progressive Offenlegung

Menschen brauchen nicht alle Informationen gleichzeitig. Progressive Offenlegung bedeutet aber nicht, wichtige Bedingungen zu verstecken. Sie zeigt zuerst den Zusammenhang, danach die relevanten Details und schließlich die Ausnahmefälle. Ein Akkordeon ist sinnvoll, wenn ein Detail nur manche Personen betrifft; es ist problematisch, wenn der Hauptbeweis darin verschwindet.

Ordne Inhalte nach Entscheidungsschwelle. Niedrig-riskante Aussagen können kurz sein. Aussagen, die Preis, Gesundheit, Datenschutz oder Ergebnis betreffen, benötigen mehr Kontext und klare Begrenzungen. So wird die Architektur der Konsequenz einer Entscheidung gerecht.

## Seitenmodelle

Ein Seitenmodell beschreibt die Aufgaben eines Typs, nicht eine fixe Pixelstruktur. Für eine Leistungsseite kann die Reihenfolge aus Einordnung, Ergebnis, Methode, Beweis, Ablauf, Fragen und Handlung bestehen. Für einen Case wird aus Ausgangslage, Entscheidung, Umsetzung und Ergebnis eine nachvollziehbare Geschichte. Die konkrete Reihenfolge darf variieren, wenn sie die Journey verbessert.

Jedes Modell benennt Pflichtinhalte, optionale Vertiefungen und Abbruch- oder Ausweichwege. Das verhindert, dass eine Komponente auf jeder Seite auftaucht, obwohl sie dort keine Aufgabe erfüllt. Templates in [`09_TEMPLATES`](../09_TEMPLATES) machen diese Modelle projektfähig.

## Wann eine Liste aufhört, eine Übersicht zu sein

Eine Übersichtsseite wächst mit jedem neuen Beitrag, und niemand merkt den Punkt, an dem sie kippt. Solange sechs oder acht Einträge untereinander stehen, liest ein Besucher sie alle und entscheidet danach. Ab etwa einem Dutzend liest er sie nicht mehr alle. Er überfliegt, findet die gesuchte Frage nicht in den ersten Sekunden und geht zurück zur Suche — obwohl die Antwort da war.

Das Problem ist nicht die Höhe, sondern der Suchvorgang. Eine flache Liste zwingt zum linearen Lesen, weil sie keine Vorauswahl anbietet. Deshalb hilft es auch nicht, die Einträge zu kürzen: Zwanzig kurze Zeilen sind genauso schwer zu durchsuchen wie zwanzig lange, nur unattraktiver.

Die Antwort sind wenige, benannte Gruppen. Wenige heißt drei bis vier, weil eine Gruppierung, die selbst zwanzig Kategorien hat, das Problem nur verschiebt. Benannt heißt in der Sprache der Besucher und in der Reihenfolge ihrer Fragen, nicht alphabetisch und nicht nach interner Logik. Wer eine Wissenssammlung nach dem Weg eines Interessenten ordnet — was vor der Entscheidung gefragt wird, was währenddessen, was danach —, gibt jedem Besucher eine Gruppe, die er überspringen darf.

Die Gruppenzugehörigkeit gehört dabei in das Datenmodell, nicht in eine gepflegte Liste in der Übersichtsseite. Ein Pflichtfeld mit fester Auswahl erzwingt bei jedem neuen Beitrag eine Entscheidung und macht den Fall unmöglich, dass ein Eintrag nirgendwo auftaucht. Eine Liste in der Seite dagegen vergisst man beim nächsten Beitrag. Das ist dieselbe Leiter wie in [`00_SYSTEM/06-erzwungene-qualitaet.md`](../00_SYSTEM/06-erzwungene-qualitaet.md): Die Regel wird zum Typ, statt eine Erinnerung zu bleiben.

Eine Angabe, die auf jeder Zeile dieselbe ist, gehört nicht in die Übersicht. Ein Stand, ein Autor oder eine Kategorie, die siebzehnmal identisch erscheint, trägt keine Information und kostet siebzehnmal Höhe. Sie gehört auf den einzelnen Beitrag, wo sie eine Aussage über genau diesen Text ist. Sobald sich die Werte unterscheiden, ist das neu zu entscheiden.

## Architektur testen

Teste zuerst Sprache, nicht Farbe. Bitte Menschen, eine Seite zu finden, die eine Aufgabe löst, und beobachte, welche Begriffe sie erwarten. Prüfe anschließend, ob sie erklären können, wo sie sind, was sie gerade erfahren haben und wie sie zurück oder weiterkommen. Ein Tree Test kann Benennungen prüfen; ein einfacher Click-Dummy kann Reihenfolge und Priorität prüfen.

Eine Architektur ist nicht gut, weil viele Menschen den ersten Link anklicken. Sie ist gut, wenn passende Menschen den richtigen Weg ohne unnötige Umwege finden und dabei eine realistische Erwartung an das Ergebnis entwickeln.
## Journey-Matrix

Für wichtige Zielgruppen wird eine kleine Journey-Matrix erstellt. Sie verbindet Auslöser, Einstiegsseite, offene Frage, benötigten Beweis, mögliche Handlung und Rückweg. Die Matrix zeigt, ob die Website nur einen idealen Pfad kennt oder auch Menschen auffängt, die über eine Referenz, eine lokale Suche, eine Unterseite oder eine konkrete Leistungsfrage einsteigen.

Die Matrix wird nicht als starres Flowchart behandelt. Menschen bewegen sich nicht immer linear. Entscheidend ist, dass jeder Einstieg eine nächste sinnvolle Frage beantwortet und dass kein Seitenweg in einer Sackgasse endet. Interne Links, verwandte Leistungen, Kontaktmöglichkeiten und der Footer bilden die Rückfallebene.

## Benennungen validieren

Wenn eine Benennung intern eindeutig, extern aber nicht verständlich ist, wird sie nicht durch einen erklärenden Untertitel gerettet, ohne die Alternative zu prüfen. Gute Navigationstexte sind kurz, unterscheidbar und erwartbar. Teste sie mit Aufgaben, nicht mit Meinungsfragen: „Wo würdest du herausfinden, ob dieses Angebot für ein kleines Team passt?“ Die Antwort zeigt, welche mentale Kategorie tatsächlich existiert.
## Inhalte bei Veränderung

Eine gute Architektur hält Änderungen aus. Neue Leistungen, ein neuer Standort oder ein anderer Kontaktprozess sollten einen klaren Platz finden, ohne das gesamte Menü zu überladen. Prüfe bei jeder Ergänzung, ob eine bestehende Seite erweitert, eine neue Seite angelegt oder ein Inhalt entfernt werden sollte. Wachstum ist nicht automatisch ein Grund für mehr Navigation.

## Sackgassen und Rückwege

Suche, leere Zustände, alte URLs, fehlende Medien und nicht verfügbare Termine brauchen Rückwege. Jede Journey wird auch in ihrem unidealen Verlauf betrachtet. Eine Person darf wissen, ob ihr Ziel nicht existiert, vorübergehend nicht verfügbar ist oder nur an einem anderen Ort zu finden ist.

## Übergabe

Dokumentiere Seitenmodelle so, dass Redaktion, Design und Engineering dieselbe Aufgabe darunter verstehen. Ein Modell mit Pflichtinhalten, optionalen Vertiefungen und Grenzen schützt die Architektur bei späterer Pflege.
