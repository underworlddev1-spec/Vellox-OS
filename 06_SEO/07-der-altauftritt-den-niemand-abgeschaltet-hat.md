# Der Altauftritt, den niemand abgeschaltet hat

## Das Problem, aus dem dieses Kapitel entstand

Vor der Prüfung eines Betriebs mit Ladengeschäft schien die Lage einfach: eine
Website, gebaut 2018, dünn, unauffällig, verbesserungsfähig. Der Auftrag hätte
gelautet, sie neu zu bauen.

Die Prüfung fand eine zweite. Unter derselben Domain, in einem Unterverzeichnis
namens `/html/`, lag der Auftritt von 2017 vollständig erreichbar. Nicht
archiviert, nicht gesperrt, nicht weitergeleitet. Ein Abruf lieferte `200 OK`
und `Last-Modified: 19. April 2017`.

Vier Dinge machten ihn zu mehr als einem Schönheitsfehler:

**Er nannte falsche Öffnungszeiten.** „Montag bis Freitag", dazu ein langer
Donnerstag. Der Betrieb hatte inzwischen montags geschlossen und den langen
Donnerstag abgeschafft.

**Er hatte keine Impressumsseite mehr.** Die Navigation zeigte auf
`impressum.html`, die Datei lieferte `404`. Die Pflichtangaben standen auf
einer anderen Seite, erreichbar über genau einen Link.

**Er war auf dem Telefon nicht bedienbar.** Kein `viewport`-Meta. Gemessen bei
390 Pixeln Fensterbreite: Dokumentbreite 980 Pixel. Zweieinhalbmal so breit
wie das Gerät.

**Er hatte keinen Einstieg mehr.** `index.html` lieferte `404`, die
Unterseiten `200`. Es waren verwaiste Seiten ohne Startpunkt — für einen
Besucher eine Sackgasse, für eine Suchmaschine indexierbarer Inhalt. Gefunden
wurde eine davon über eine gewöhnliche Suche nach dem Betriebsnamen.

Der Schaden ließ sich weiterverfolgen. Ein Branchenportal führte den Betrieb
mit genau den alten Zeiten: Montag geöffnet, Donnerstag bis 19:30. Wer das
liest und montags hinfährt, steht vor verschlossener Tür.

Daraus folgt die Regel dieses Kapitels: **Ein Betrieb hat genau einen
Auftritt. Der zweite ist kein Überbleibsel, sondern eine widersprechende
Stimme, die niemand mehr kontrolliert.**

## Warum das nicht auffällt

Ein Altauftritt hat drei Eigenschaften, die ihn unsichtbar machen.

Er stört den Betreiber nicht. Der Inhaber gibt seine Domain ein, landet auf
der neuen Seite und sieht die alte nie. Die Weiterleitung von der Wurzel
funktioniert; sie deckt nur die Wurzel ab, nicht das Verzeichnis darunter.

Er stört die Agentur nicht. Wer eine neue Seite baut, prüft die neue. Ein
Verzeichnis, das im aktuellen System nicht vorkommt, gehört zu keinem Werkzeug
und zu keiner Sitemap.

Und er stört die Suchmaschine nicht. Sie hat den Bestand vor Jahren indexiert,
bekommt seither weder ein `404` noch ein `301` noch ein `noindex`, und behält
ihn deshalb.

Nur der Kunde stößt darauf, und zwar an der schlechtesten Stelle: bei der
Suche nach Öffnungszeiten.

## Warum der Relaunch das Problem verschärft

Ein neuer Auftritt beseitigt den alten nicht, sondern gibt ihm ein Gegenüber.
Vorher war eine veraltete Seite die einzige Auskunft und damit wenigstens
widerspruchsfrei. Danach stehen zwei Auskünfte nebeneinander, und die
Suchmaschine muss raten, welche gilt.

Das gilt besonders für Betriebsdaten. Adresse, Telefonnummer und
Öffnungszeiten sind die Angaben, die Verzeichnisse automatisiert übernehmen.
Wandert eine falsche Zeitangabe einmal in ein Portal, ist sie dort auch dann
noch, wenn die Quelle längst gelöscht ist. Der Aufwand für die Korrektur
liegt dann nicht mehr beim Hoster, sondern bei jedem Portal einzeln.

## Wie geprüft wird

Die Prüfung gehört in die Discovery, nicht in den Launch. Sie kostet Minuten
und entscheidet über die Reihenfolge aller weiteren Schritte.

**Erstens, die Suchmaschine nach dem Betriebsnamen fragen** und die Treffer
über die ersten zehn hinaus ansehen. Ein zweiter Auftritt taucht selten oben
auf, aber er taucht auf.

**Zweitens, `site:` auf die Domain anwenden** und die Adressen mit den Seiten
der Sitemap vergleichen. Was indexiert ist und in keiner Sitemap steht, ist
entweder vergessen oder alt.

**Drittens, die üblichen Verzeichnisnamen direkt abrufen.** `/html/`, `/alt/`,
`/old/`, `/neu/`, `/n/`, `/site/`, `/wp/`, `/backup/`, dazu Jahreszahlen. Ein
`403` auf ein Verzeichnis ist kein Entwarnungssignal, sondern ein Hinweis: Der
Verzeichnisindex ist gesperrt, die Dateien darunter sind es meist nicht.

**Viertens, den `Last-Modified`-Kopf lesen.** Er datiert den Fund, ohne dass
man den Inhalt beurteilen muss.

**Fünftens, drei Verzeichnisse mit den Betriebsdaten der neuen Seite
vergleichen.** Weicht eines ab, ist die Quelle der Abweichung zu suchen. Sie
liegt oft im Altauftritt.

Ein negativer Befund braucht dabei dieselbe Sorgfalt wie ein positiver. „Es
gibt keine zweite Seite" ist nur belastbar, wenn das verwendete Verfahren
dabeisteht.

## Was daraus für die Reihenfolge folgt

Das Abschalten steht **vor** dem Neubau, nicht danach, und es steht auch dann
an, wenn kein Auftrag zustande kommt. Es kostet den Hoster Minuten und
beseitigt in einem Schritt: falsche Öffnungszeiten, fehlende Pflichtangaben,
nicht bedienbare Seiten und doppelte Inhalte.

Abgeschaltet wird per Weiterleitung, nicht per Löschung. Eine `301` auf die
entsprechende neue Seite erhält, was der Altbestand an Ansehen gesammelt hat.
Wo es keine Entsprechung gibt, führt die Weiterleitung auf die Startseite; ein
`410` ist nur richtig, wenn die Leistung tatsächlich entfallen ist.

Danach, und erst danach, werden die Verzeichnisse korrigiert. Sonst korrigiert
man gegen eine Quelle an, die weiter sendet.

## Der Fund gehört ins Erstgespräch, aber nicht an dessen Anfang

Ein Inhaber, dem man mit „Ihre Website hat kein Impressum" begegnet, hört
einen Vorwurf. Häufig hat ein Bekannter, ein Familienmitglied oder ein kleiner
Dienstleister aus der Nachbarschaft die alte Seite gebaut; im geprüften Fall
stand der Name im Impressum der Altseite.

Die tragfähige Reihenfolge beginnt bei dem, was der Betrieb besitzt, und
kommt erst danach zum Befund. Innerhalb des Befunds gilt: **zuerst der
Schaden am Kunden, dann das Formale.** Falsche Öffnungszeiten kosten Besuche
und lassen sich ohne Schuldzuweisung erzählen. Ein fehlendes Impressum klingt
nach Vorwurf, auch wenn es keiner ist.

Und was in Ordnung ist, gehört ausdrücklich gesagt. Im geprüften Fall war der
Betrieb datenschutzrechtlich unauffällig: kein Analysewerkzeug, kein Zählpixel,
keine fremde Schrift, kein Karteneinbau. Ein Befund, der nur Mängel nennt,
ist Verkauf und keine Prüfung.

## Was dieses Kapitel nicht behauptet

Ob ein fehlendes Impressum auf verwaisten Altseiten im Einzelfall gegen § 5
DDG verstößt, ist eine Frage an einen Anwalt. Für die Arbeit reicht die
schwächere und unstrittige Aussage: Eine Seite, die Öffnungszeiten nennt, die
nicht stimmen, schadet dem Betrieb unabhängig davon, wie sie rechtlich zu
bewerten ist.

## Weiterführend

Die Reihenfolge Verzeichnis vor Seite steht in
[Die ersten Besucher](05-die-ersten-besucher.md). Die Prüfung der
Betriebsdaten über alle Kanäle steht in [Local SEO](02-local-seo.md). Die
Erhebung des Markenbestands am vorhandenen Auftritt — der im geprüften Fall
das einzige Logo in Druckauflösung im Altbestand fand — steht in
[Markeninventur](../02_BRANDING/04-markeninventur.md). Das zugehörige Gate
steht im Gatterkatalog in
[Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md).
