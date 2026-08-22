# Der VELLOX-Prüfstand

Dieser Ordner ist kein Kapitel, sondern ein Werkzeug. Er enthält die
Prüfungen, mit denen die verbindlichen Regeln von VELLOX OS gegen eine
laufende Seite gemessen werden, und das Werkzeug, mit dem eine neue Prüfung
ihren eigenen Nachweis bekommt.

Die Begründung steht in der [Prüfdoktrin](../00_SYSTEM/06-pruefdoktrin.md). Der
Satz, auf dem alles hier beruht, lautet: **Eine Regel ohne Test ist eine
Absichtserklärung, und Absichtserklärungen halten genau bis zum nächsten
Termindruck.**

## Was der Prüfstand ist und was er nicht ist

Er misst das ausgelieferte Verhalten. Er startet einen Browser, ruft jede Route
auf und zählt, was tatsächlich passiert ist. Er liest nur dort Quelltext, wo der
Quelltext der Gegenstand der Regel ist, etwa beim Verbot von Farbliteralen.

Er ist framework-neutral. Ihm ist gleich, ob ein statischer Ordner, ein
Dev-Server oder eine Preview ausliefert, solange es das ausliefert, was später
live geht.

Er ersetzt weder den Blick noch das Urteil. Zweimal in dem Projekt, aus dem
diese Prüfungen stammen, meldete ein Gate grün, während die Seite sichtbar
kaputt war; beide Fehler fand ein Screenshot. Und die Frage, welche Aussage ein
Abschnitt trägt und welche Form dazu passt, beantwortet keine Messung.

## Einbau in ein Projekt

```
cp -r 12_PRUEFSTAND <projekt>/pruefstand
cd <projekt>/pruefstand
npm install
npx playwright install chromium
```

Danach `pruefstand.config.mjs` anpassen: Basis-URL, die vollständige Liste der
Routen, die Breiten, den Pfad zum Stylesheet und die Liste der Prüfungen.

**Die Routenliste ist vollständig oder sie ist falsch.** Was dort fehlt, wird
nie gemessen. Der Läufer meldet die Zahl bei jedem Lauf mit, damit ein
Vergessen sichtbar wird.

## Fahren

```
npm run pruefen                 # alle Prüfungen aus der Konfiguration
node lauf.mjs achse.mjs         # eine einzelne
node pruefungen/achse.mjs       # dieselbe, direkt
```

Der Läufer startet jede Prüfung als eigenen Prozess. Das ist Absicht: Jede
Prüfung beendet sich selbst mit einem Rückgabewert, und das ist die
Eigenschaft, die sie zu einem Gate macht. Ein Absturz einer Prüfung reisst den
Lauf nicht mit, sondern wird als Befund gemeldet.

Zwei Umgebungsvariablen helfen im Betrieb:

- `PRUEFSTAND_KONFIG` zeigt auf eine andere Konfigurationsdatei, etwa für einen
  zweiten Lauf gegen eine Preview.
- `PRUEFSTAND_BROWSER` setzt einen expliziten Chromium-Pfad, wenn Playwright
  seinen eigenen nicht findet.

## Die Gegenprobe

Wer eine Prüfung ergänzt oder ändert, baut den Fehler ein, den sie finden soll,
und weist nach, dass sie rot wird.

```
node gegenprobe.mjs kontrast.mjs --css "p { color: #eee }"
node gegenprobe.mjs a11y.mjs     --js  "document.querySelector('h1').remove()"
node gegenprobe.mjs farben.mjs   --quelle ".x { color: #f00; }"
```

`--css` und `--js` bauen den Fehler in die ausgelieferte Antwort ein, ohne das
Projekt anzufassen. Eingesetzt wird dabei in der HTTP-Antwort und nicht über
den Browser, weil sonst genau die Prüfung leer ausginge, die ohne JavaScript
misst. `--quelle` hängt eine Zeile an das Stylesheet und nimmt sie danach
wieder heraus; das brauchen nur die Prüfungen, die Quelltext lesen.

**Eine grüne Gegenprobe sagt eines von drei Dingen**, und alle drei sehen im
Protokoll gleich aus:

1. Das Gate ist zu schwach.
2. Die geprüfte Regel tut nichts und kann weg.
3. Die Gegenprobe selbst greift nicht.

Beim Bau dieses Kits sind alle drei vorgekommen. Der dritte Fall war der
lehrreichste: `img { width: 3000px }` änderte gar nichts, weil ein
`max-width: 100%` im Projekt die Breite deckelte. Das Gate hatte recht, die
Gegenprobe war falsch. Wer eine grüne Gegenprobe sieht, misst deshalb ein
zweites Mal und schliesst nicht aus dem Code.

## Die Prüfungen

| Prüfung | Behauptungen |
|---|---|
| `farben.mjs` | Farbwerte nur in Tokendefinitionen; kein Token nach Aussehen benannt; kein Kommentar zwischen Komma und Selektor; keine Rolle ohne Verbraucher |
| `staffel.mjs` | kein Rang unter seinem Untergeordneten; kein Grad mit zwei Rängen; kein Grössentoken ohne Verbraucher |
| `kontrast.mjs` | Text erfüllt WCAG AA; die Grenze jedes Formularfelds und Knopfes erfüllt 3 zu 1 |
| `axe.mjs` | axe-core gegen WCAG 2.0/2.1/2.2 A und AA sowie Best Practice, Desktop und Handy |
| `a11y.mjs` | Sprache gesetzt; genau eine sichtbare h1; `main`-Landmarke; keine Rangsprünge; jedes Bedienelement benannt |
| `ueberlauf.mjs` | kein waagerechter Überlauf auf Telefon- und Zwischenbreiten, mit Nennung des schuldigen Elements |
| `textfluss.mjs` | keine Zeile über dem Höchstmass; keine Zwangsspalte |
| `achse.mjs` | Abschnittsmitte auf der Fenstermitte; Schild nutzt seine Spalte; Schild polstert ringsum oder gar nicht |
| `bilder.mjs` | `sizes` nur mit echter Auswahl; Zahl im Dateinamen und jeder w-Deskriptor gleich der echten Breite; keine Hochrechnung bei einfacher Dichte, gerechnet mit Beschnitt |
| `konform.mjs` | keine fremden Verbindungen; keine Cookies, kein Storage; Rechtsverweise erreichbar; `noopener` gesetzt; erzeugte Medien gekennzeichnet |
| `sichtbar.mjs` | keiner der verbotenen Begriffe im sichtbaren Text, einschliesslich des Gedankenstrichs |
| `ausfall.mjs` | ohne JavaScript sind Bilder sichtbar, ist keine Route leer, und ein ausgeblendetes Formular hat einen Ersatz |

## Nachweis der Prüfungen selbst

Alle Behauptungen sind gegen ein reales Projekt gefahren worden, einmal grün
und einmal mit eingebautem Fehler rot. Die Gegenproben im Einzelnen:

| Prüfung | Behauptung | Eingebauter Fehler | Befunde |
|---|---|---|---|
| farben | 1 | `.x { color: #ff0000 }` in der Quelle | 1 |
| farben | 2 und 4 | `--farbe-flaeche-dunkel` definiert und nicht benutzt | 2 |
| farben | 3 | Kommentar zwischen Komma und Selektor | 1 |
| staffel | 1 | `h3 { font-size: 60px }` | 16 |
| staffel | 2 | `h2, h3 { font-size: 30px }` | 16 |
| staffel | 3 | `--gr-unbenutzt` definiert und nicht benutzt | 1 |
| kontrast | 1 | `p { color: #efe9e0 }` | 456 |
| kontrast | 2 | Feldkante auf `#efe9e0` | 10 |
| axe | alle | `body { color: #d8d0c4 }` | 16 |
| a11y | 2 | `h1 { display: none }` | 8 |
| a11y | 3 | `main { display: none }` | 16 |
| a11y | 4 | h4 direkt nach h2 eingefügt | 7 |
| a11y | 5 | Knopf ohne Beschriftung eingefügt | 8 |
| ueberlauf | alle | `body { min-width: 900px }` | 40 |
| textfluss | 1 | `p { max-width: none; font-size: 11px }` | 827 |
| textfluss | 2 | `main p { max-width: 34px }` | 1908 |
| achse | 1 | `main > * { padding-left: 500px }` | 157 |
| achse | 2 | Schild mit 40 Prozent Spaltenbreite eingefügt | 32 |
| achse | 3 | Kasten mit `padding: 12px 0` eingefügt | 32 |
| bilder | 1 | `srcset` auf einen Kandidaten gekürzt, `sizes` behalten | 46 |
| bilder | 2 | Datei mit falscher Zahl im Namen eingehängt | 1 |
| bilder | 3 | jeden w-Deskriptor um sieben erhöht | 54 |
| bilder | 4 | `img { width: 3000px; max-width: none }` | 78 |
| konform | 1 und 2 | `fetch` auf einen fremden Host, `localStorage.setItem` | 16 |
| konform | 3 | Rechtsverweise entfernt | 15 |
| konform | 4 | `rel="noopener"` durch `noreferrer` ersetzt | 34 |
| konform | 5 | `.ki-marke { display: none }` | 2 |
| sichtbar | alle | „TODO“ in den Fliesstext eingefügt | 8 |
| ausfall | 1 | `img { opacity: 0 }` | 8 |
| ausfall | 2 | `body * { display: none }` | 8 |
| ausfall | 3 | `noscript, noscript * { display: none }` | 1 |

Zwei dieser Zeilen sind erst im zweiten Anlauf rot geworden, und beide Male lag
es am Gate. `ausfall.mjs` las `innerText`, und der fällt bei einem nicht
gerenderten Element auf `textContent` zurück: Die Prüfung sah Text, den
niemand sehen konnte. Gemessen wird seither die Fläche.

## Was der Prüfstand nicht abdeckt

Diese Fragen sind echt, aber nicht allgemein messbar. Sie werden je Projekt als
eigene Prüfung geschrieben, in die Liste eingetragen und gegengeprüft.

- **Geteilte Kanten einer Komposition.** Ob die Überschrift auf der Oberkante
  des Fotos beginnt, weiss nur das Projekt.
- **Inhaltliche Vollständigkeit ohne JavaScript.** Ein Schieber mit neun
  Stimmen, der ohne Wischgeste eine zeigt, sieht für ein generisches Gate
  vollständig aus.
- **Kontrast über einem Foto.** Wo kein berechenbarer Untergrund existiert,
  muss am fotografierten Pixel gemessen werden. `kontrast.mjs` erkennt diese
  Stellen geometrisch, überspringt sie und meldet ihre Zahl.
- **Fachliche Wahrheit.** Preise, Öffnungszeiten, Namen, Belege.

## Eine eigene Prüfung ergänzen

Eine neue Datei in `pruefungen/`, die `konfig`, `adresse`, `browserStarten`,
`kontextOeffnen` und `melden` aus `lib/pruefstand.mjs` benutzt, ihre
Behauptungen im Kopfkommentar nennt und über `melden` endet. Danach in die
Liste in der Konfiguration eintragen und die Gegenprobe fahren.

Zwei Hinweise, die Zeit sparen:

`window.vx` steht in jeder Seite zur Verfügung und bringt die Helfer mit, die
sonst zwölfmal leicht verschieden wären: `tinte` misst die Schrift statt des
Kastens, `zeilen` zählt über Textknoten statt über Elemente, `hintergrund`
löst die Fläche über die Elternkette auf, `kontrast` rechnet.

Jeder Pfad wird aus `import.meta.url` aufgelöst und nie aus dem
Arbeitsverzeichnis. Eine Prüfung, die nur aus einem bestimmten Ordner heraus
läuft, wird irgendwann aus einem anderen gestartet.
