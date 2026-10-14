# Native Bewegung, Video und die Messung der Bühne

Dieses Kapitel ist die technische Hälfte von [Wenn die Arbeit das Produkt ist](../04_UI/10-wenn-die-arbeit-das-produkt-ist.md). Dort steht, welche Szenen eine Seite für einen Betrieb mit Bild braucht. Hier steht, wie sie gebaut werden, ohne dass die Seite schwer, fragil oder für einen Teil der Besucher unbenutzbar wird. Die Zahlen stammen aus einem Relaunch, in dem sie gemessen wurden. Sie sind Ausgangswerte und keine Naturgesetze.

## Erst nativ, dann eine Bibliothek

Die bisherige Seite des Projekts lud GSAP, ScrollTrigger und Lenis: 56 KB JavaScript, übertragen, für die Bewegung und das geglättete Scrollen. Die neue Seite lädt für zwölf Verhaltensweisen (Intro, Einblenden, Menü, Cursor, Orientierung, Reel, Flächen, Format-Morph, Vorschau, Zähler, Uhr, Magnet) ein Skript von 4,3 KB übertragen. Die Bewegung der Wow-Szenen kommt aus dem Browser: scrollgekoppelte Animationen (`animation-timeline: view()` und `scroll()`, benannte Zeitleisten mit `view-timeline` für Szenen, die kleben), `position: sticky`, View Transitions für den Seitenwechsel, `mix-blend-mode` und `clip-path` für das Fenster, `:has(:checked)` für Zustände ohne Skript.

Das ist kein Bekenntnis gegen Bibliotheken. Eine Bibliothek ist gerechtfertigt, wenn die Aufgabe sie braucht: Physik, WebGL, eine Abfolge, die mehrere Elemente über Zeit koordiniert, oder Zielbrowser ohne die native Funktion. Sie ist nicht gerechtfertigt, weil sie bekannt ist. Die Frage steht in [Projektstruktur und Delivery](02-projektstruktur-und-delivery.md) und gilt hier verschärft, weil Bewegung die Funktion ist, bei der Gewicht am wenigsten sichtbar ist und am meisten kostet.

**Ehrliche Grenze:** Geprüft wurde in Chromium. Safari und Firefox kennen `animation-timeline` später oder in Teilen, und das ist der Grund für den nächsten Abschnitt.

## Der Rückfall ist der fertige Zustand

Jede scrollgekoppelte Wirkung steht hinter `@supports (animation-timeline: view())`. Ausserhalb davon gilt der Zustand, in dem die Seite vollständig lesbar ist: Der Aufmacher-Text steht in voller Helligkeit, die Fenster-Szene steht statisch einen Bildschirm hoch mit dem Standbild in den Buchstaben, die Flächen stehen übereinander ohne Eintritt. Das ist kein Notbehelf, sondern der Ausgangspunkt: Die Wirkung wird zuerst im ruhigen Zustand gebaut und dann ergänzt.

Szenen, die kleben, haben zwei zusätzliche Bedingungen. Sie kleben nur, wenn die Seite Skript hat (`html.js`) und die Besucherin Bewegung zulässt (`prefers-reduced-motion: no-preference`). Und was sie schalten, schaltet sich ohne Skript selbst: Der Format-Morph wählt per Radio und `:has(:checked)`, das Skript gleicht nur den Scrollfortschritt mit der Auswahl ab und scrollt bei Klick an die passende Stelle. Ohne Skript und ohne Bewegung ist die Szene normal hoch und bleibt per Klick und Tastatur bedienbar.

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    html.js .szene { height: 280svh; view-timeline: --szene block; }
    html.js .buehne { position: sticky; top: 0; height: 100svh; }
    html.js .ziel {
      animation: eintauchen linear both;
      animation-timeline: --szene;
      animation-range: contain 0% contain 100%;
    }
  }
}
```

Die Zeitleiste steht als eigene Deklaration, nicht in der Kurzform. Warum, steht im nächsten Abschnitt.

## Der Fehler, den kein Auge sieht

**Beobachtung:** Alle scrollgekoppelten Effekte der Seite liefen nicht. Die Seite sah ruhig aus, nichts war kaputt, kein Fehler stand in der Konsole. Im gebauten CSS hatte der Minifizierer (lightningcss, die Voreinstellung von Vite) `animation` und `animation-timeline` zu einer Kurzform zusammengefasst, `animation: linear both eintauchen --szene`. Der verwendete Chrome 152 verwarf diese Deklaration, und die berechnete Eigenschaft `animation-name` stand auf `none`. Die Quelle war richtig, die Auslieferung nicht. Gefunden wurde es nur durch den Blick auf den berechneten Stil im Browser.

**Ursache:** Der Rückfall aus dem vorigen Abschnitt hat ein Nebenprodukt: Er kaschiert einen Totalausfall. Eine Wirkung, die ohne sie ruhig weiterläuft, meldet ihren Ausfall nicht.

**Entscheidung:** Der Bau minifiziert mit esbuild, das Longhands nicht zusammenfasst. Das beseitigt diesen Fall, aber nicht die Ursache, deshalb wandert die Regel nach der [Verschiebungsregel](../00_SYSTEM/06-erzwungene-qualitaet.md) eine Stufe nach oben: ein Gate, das das ausgelieferte CSS liest und jede Kurzform mit eingeschlossener Zeitleiste meldet. Es steht in [Qualitätsgates](../09_TEMPLATES/05-qualitaetsgates.md), Abschnitt 11, und wurde an beiden Fällen getestet. Die Fassung mit `view()` oder `scroll()` in der Kurzform wurde im Browser nicht geprüft, das Gate untersagt sie trotzdem, weil ihre Unterstützung nicht belegt ist.

Der allgemeine Satz dazu steht in [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md): Ein Effekt, der still ausfallen kann, braucht eine Prüfung am gerenderten Ergebnis, nicht am Code.

## Klebende Szenen messen

Eine klebende Bühne muss in jedes Fenster passen, sonst fehlt unten etwas, und niemand sieht es am Schreibtisch. Die erste Fassung des Format-Morphs rechnete die Bildbreite aus der Fensterhöhe minus eines Festwerts und lief bei 1024 mal 768 um 25 Pixel über. Die zweite lässt das Bild so groß werden, wie der Platz neben Überschrift und Fuß es zulässt, mit Container-Einheiten:

```css
.feld { container-type: size; display: grid; place-items: center; min-height: 0; }
.bild { width: min(100cqw, calc(100cqh * 16 / 9)); aspect-ratio: 16 / 9; }
.buehne { height: 100svh; }
.innen  { height: 100%; display: grid; grid-template-rows: auto minmax(0, 1fr) auto; }
```

Gemessen wird die Höhe der Bühne gegen die Fensterhöhe bei 320 mal 640, 390 mal 844, 768 mal 1024, 1024 mal 768, 1280 mal 720, 1440 mal 900 und 2560 mal 1440. Alle sieben müssen gleich sein. Das Ergebnis gehört in das Messprotokoll des Projekts. Zwei Fallen dabei: Gemessen wird nach dem Ende der Einblendung, denn ein laufender Eintritt vergrößert die Überlaufhöhe (909 statt 900 in der ersten Sekunde, 900 danach). Und ein verdecktes Browserfenster drosselt Bildaktualisierungen und Scroll-Ereignisse: Wer dort misst, löst das Ereignis selbst aus und verwirft den ersten Screenshot nach einem Sprung, weil er den Stand der vorigen Position zeigt.

## Video: Rollen und Budget

Ein Video ist kein Hintergrund, sondern eine Datei mit einer Aufgabe und einem Gewicht. Das Projekt hat vier Rollen unterschieden.

| Rolle | Form | Gewicht | Wann es lädt |
|---|---|---|---|
| Hero-Clip | 6 bis 8 Sekunden, 720p, rund 2,3 MBit/s, ohne Ton | 1,8 bis 2,3 MB | nach dem Laden der Seite, nacheinander |
| Flächen-Schleife | 7 bis 10 Sekunden, ohne Ton | 2,0 bis 2,6 MB | erst, wenn ihre Fläche oben liegt |
| Kachel-Vorschau | rund 10 bis 16 Sekunden, ohne Ton | 1,1 bis 2,4 MB | beim Überfahren oder Fokussieren, auf Touch beim Sichtbarwerden |
| Film | volle Länge, mit Ton | 3,5 bis 37 MB | nach Klick, die Größe steht am Knopf |

Alle Videos tragen `preload="none"`. **Es läuft immer nur das Video der obersten Fläche**, damit gestapelte Flächen im Hintergrund keine Akkus leeren. Bei Datensparmodus und reduzierter Bewegung bleibt das Standbild, und jede Bewegung, die länger als fünf Sekunden läuft, hat einen Pause-Schalter. Das Standbild jedes Clips ist ein Einzelbild aus dem Clip selbst, damit der Wechsel zwischen Bild und Video keinen Sprung hat.

Die Rollen sind nicht Geschmack, sondern Rechnung: Der erste Ladevorgang der Startseite wog 193 KB, die bisherige Seite 2.372 KB, und die Filme wurden gegenüber den Originalen 3,2 bis 7,1 Mal kleiner (der längste von 263 auf 37 MB). Ohne die Rollen wäre jedes Video ein Hero gewesen.

Wo kein ffmpeg zur Verfügung steht, genügt auf dem Mac AVFoundation mit eigener Bitrate. Das Systemwerkzeug `avconvert` kennt nur feste, hohe Bitraten und hat die Dateien um den Faktor drei zu groß gemacht.

## Fingerziele, gemessen

**Beobachtung:** Auf 375 Pixel Breite waren 22 von 52 Zielen der neuen Startseite niedriger als 44 Pixel (Kontakt-Links 24, Fußbereich 23, der Titel im Hero 18). Die bisherige Seite lag bei 12 von 36, meist 43. Die erste Fassung war damit schlechter als die, die sie ersetzen sollte, und das war ohne Messung nicht aufgefallen.

**Lösung:** Eine Klasse für Textlinks, die die klickbare Fläche vergrößert, ohne die Zeile zu ändern: `display: inline-block; padding-block: 0.85rem; margin-block: -0.85rem`. Danach: 0 von 52.

**Falle:** Linien, die per `background` als Unterstreichung gezeichnet werden, rutschen mit dem Innenabstand nach unten und laufen durch das nächste Element. Gemeldet wurde es als Strich durch einen Timecode. Der Ursprung des Hintergrunds muss auf die Inhaltsfläche gesetzt werden, und zwar mit `!important`, weil die `background`-Kurzform der Komponente den Ursprung sonst zurücksetzt:

```css
.ziel { background-origin: content-box !important; }
```

Gemessen wird in der Konsole, bei 375 Breite. Außerhalb des Bildes liegende Felder (ein Honigtopf gegen Spam) werden ausgenommen, und Verweise mitten im Fließtext sind nach WCAG 2.2 von der Mindestgröße ausgenommen, was die Messung nicht erkennt und ein Mensch beurteilt:

```js
(() => {
  const sichtbar = (e) => {
    const b = e.getBoundingClientRect()
    return b.width > 0 && b.height > 0 && b.right > 0 && b.left < innerWidth && getComputedStyle(e).visibility !== 'hidden'
  }
  const ziele = [...document.querySelectorAll('a, button, input, select, textarea, summary')]
    .filter((e) => sichtbar(e) && !e.closest('[inert], [hidden], dialog:not([open])'))
  const klein = ziele.filter((e) => { const b = e.getBoundingClientRect(); return b.height < 43.5 || b.width < 43.5 })
  return { breite: innerWidth, ziele: ziele.length, klein: klein.length,
    beispiele: klein.slice(0, 10).map((e) => `${e.tagName} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`) }
})()
```

## Verhältnis zu den anderen Kapiteln

[Accessibility und Animation](04-accessibility-und-animation.md) legt fest, welche Grenzen Bewegung respektieren muss. Dieses Kapitel zeigt, wie ein Rückfall gebaut wird, der sie hält. [Performance und Core Web Vitals](../06_SEO/04-performance-und-core-web-vitals.md) liefert die Messgrößen, deren Budget die Videorollen festlegen. [Das Handy ist nicht die kleine Fassung](../04_UI/07-handy-zuerst-und-gemessen.md) und [Das obere Ende](../04_UI/08-grosse-bildschirme-und-obergrenzen.md) sind die Orte, an denen die Messungen dieses Kapitels notiert werden.
