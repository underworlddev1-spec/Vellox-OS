# Layout, Grid und Spacing: Ordnung, die nicht auffällt

Ein gutes Layout erklärt sich nicht selbst. Es lässt Inhalte so zusammenwirken, dass Menschen Beziehungen, Prioritäten und nächste Schritte fast ohne bewusste Anstrengung erkennen. Grid und Spacing sind deshalb keine Zahlenästhetik. Sie sind die Infrastruktur der visuellen Hierarchie.

## Das Layout folgt dem Inhalt

Beginne mit dem Inhalt, der zusammengehört, und mit dem Abstand, der eine neue Bedeutung markiert. Ein Raster darf nicht dazu führen, dass eine wichtige Aussage zu schmal wird oder eine Nebeninformation zu viel Fläche erhält. Die Frage lautet nicht „Welche Spalten sind modern?“, sondern „Welche Beziehungen müssen auf dieser Seite stabil bleiben?“

Ein Layout braucht eine Hauptachse, eine Lesebreite und definierte Ausnahmen. Die Hauptachse hält die Seite zusammen. Die Lesebreite schützt lange Texte vor zu langen Zeilen. Ausnahmen dürfen einen Moment betonen, müssen aber an das System anschließen. So entsteht Charakter ohne strukturelle Beliebigkeit.

## Grid als Verhalten

Ein Grid schafft gemeinsame Bezugspunkte für Text, Bild und Handlung. Wenn Überschriften, Textkörper und CTA an zufälligen Kanten beginnen, wird der Blick unruhig. Wenn alle Elemente starr im Raster bleiben, kann die Seite mechanisch werden. SAPHIRWEB verwendet das Grid daher als unsichtbare Ordnung mit wenigen bewusst gesetzten Brüchen.

Definiere Container, Außenabstände, Spalten, Gutter und die Übergänge zwischen Breakpoints. Die Werte sollten nicht allein aus einem Framework übernommen werden. Sie müssen zeigen, welche Inhaltsmengen und Bildverhältnisse zuverlässig funktionieren. Responsive Regeln beschreiben, wie die Beziehung zwischen Elementen erhalten bleibt, nicht nur, wann eine Spalte auf eine Zeile fällt.

## Spacing als Grammatik

Abstände sagen, ob Inhalte zusammengehören, ob ein Gedanke abgeschlossen ist und wie viel Ruhe ein Abschnitt benötigt. Eine kleine Skala ist leichter konsistent zu halten als viele Einzelfälle. Der kleinste Schritt trennt Elemente innerhalb einer Gruppe; größere Schritte trennen Gruppen; der größte Rhythmus markiert einen neuen Abschnitt oder eine neue Entscheidung.

Ein Abstand ist zu groß, wenn die Beziehung zwischen Überschrift und Inhalt verloren geht. Er ist zu klein, wenn mehrere Inhalte wie ein einziger Block wirken. Prüfe nicht nur die Zahl, sondern die Lesebeziehung. Besonders auf mobilen Geräten müssen Abstände oft neu gewichtet werden, weil die vertikale Länge steigt und jede Lücke stärker sichtbar wird.

## Sections und Dichte

Eine Section ist keine dekorative Box, sondern eine inhaltliche Einheit. Sie braucht eine erkennbare Aufgabe, ein eigenes Gewicht und einen Übergang zur nächsten Frage. Ein hoher Abschnitt ohne substanzielle Aussage wirkt wie Leerlauf; ein dichter Abschnitt ohne Pause erzeugt Ermüdung.

Variiere Dichte über Bedeutung, nicht über Zufall. Ein starkes Ergebnis, eine kurze Einordnung oder ein Beweis kann mehr Raum erhalten. Details, die nur bei Bedarf wichtig sind, können kompakter werden. Der [Storytelling-Bereich](../03_UX/03-storytelling-und-aufmerksamkeit.md) liefert die narrative Begründung für diesen Rhythmus.

## Tokens statt Pixelentscheidungen

Im Engineering werden Layout- und Spacing-Werte als benannte Tokens organisiert. Die Benennung sollte ihre Rolle ausdrücken, nicht ihre zufällige Größe. Ein Token für „content-gap“ ist verständlicher als eine lange Folge von Einzelfixes. Änderungen am System lassen sich so nachvollziehen und sicher ausrollen.

Tokens ersetzen nicht das Urteil. Eine Ausnahme darf existieren, wenn sie eine bestimmte Komposition trägt. Sie sollte dann kommentiert oder als neue Rolle in das System aufgenommen werden. Unbenannte Sonderwerte sind ein Signal, dass die Entscheidung noch nicht verstanden wurde.
## Layout-Review in drei Zuständen

Prüfe das Layout zunächst als Silhouette: Sind die Hauptbereiche, die primäre Handlung und die größten Kontraste schnell erkennbar? Prüfe es danach als Lesefläche: Sind Textbreiten, Zeilenhöhen und Abstände ruhig genug, um den Inhalt zu tragen? Prüfe es zuletzt als Interaktion: Bleiben Klickflächen, Fokus, lange Zustände und Fehler sichtbar?

Diese Reihenfolge verhindert, dass ein Team Details poliert, während die Gesamtführung noch unklar ist. Die Review wird mit einem Desktop, einer mobilen Breite und mindestens einer Zwischenbreite durchgeführt. Reale Inhalte, nicht Platzhalter, zeigen, ob die Grammatik des Layouts wirklich funktioniert.

## Ausnahme bewusst machen

Eine asymmetrische Komposition darf existieren, wenn sie eine inhaltliche Spannung oder eine Markenidee sichtbar macht. Dokumentiere dann, welches Element die Ausnahme trägt und wie sie in kleineren Ansichten zurückgeführt wird. So bleibt Ausdruck möglich, ohne das System für jede Seite neu zu erfinden.
## Inhaltsdichte und Barrierefreiheit

Spacing muss mit Zoom, großer Schrift und langen Überschriften funktionieren. Vermeide feste Höhen, die Inhalt abschneiden, und setze Abstände nicht als Ersatz für semantische Gruppen. Ein großzügiges Layout ist erst dann ruhig, wenn auch die alternative Darstellung ausreichend Raum und Beziehung behält.

## Übergabe in Code

Dokumentiere Grid und Spacing als Rollen und Tokens. Ein zukünftiges Team soll erkennen, welcher Abstand innerhalb einer Gruppe, zwischen Gruppen oder zwischen Abschnitten verwendet wird. So wird das Layout als Grammatik weitergeführt und nicht durch einzelne Pixelentscheidungen langsam zerlegt.

## Reviewfrage

Wenn alle Farben, Bilder und Schatten entfernt werden: Bleibt die Seite durch Position, Größe und Abstand verständlich? Wenn nein, muss die strukturelle Hierarchie stärker werden, bevor dekorative Mittel weiter verfeinert werden.
