# Vorlage: Qualitätsgates für ein neues Projekt

Diese Vorlage macht aus [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md) Code. Sie wird zu Projektbeginn übernommen, nicht am Ende nachgezogen: Ein Gate, das erst nach dem Bauen entsteht, findet die Fehler, die schon im Text stehen, und muss sie einzeln nachverhandeln.

Die Beispiele sind in Astro mit Zod formuliert, weil das der VELLOX-Standard-Stack ist. Die Muster übertragen sich auf jeden Stack, in dem Inhalt ein Schema hat und der Bau abbrechen kann. Was nicht übertragbar ist, ist die Haltung dahinter: Der Bau darf nicht durchlaufen, wenn eine prüfbare Regel verletzt ist.

## 1. Längen, die im Suchergebnis abgeschnitten werden

Ins gemeinsame Layout, also an die Stelle, durch die jede Seite läuft. Ein zu langer Titel hat keine sichtbare Folge beim Entwickeln, deshalb braucht er eine erzwungene.

```ts
const TITEL_MAX = 60
const BESCHREIBUNG_MAX = 155
const suffix = ` · ${SITE.name}`

if (!noindex) {
  if (fullTitle.length > TITEL_MAX) {
    throw new Error(
      `Titel zu lang: ${fullTitle.length} von ${TITEL_MAX} Zeichen auf ${pfad}\n` +
        `  ${fullTitle}\n` +
        `  Das Suffix "${suffix}" kostet ${suffix.length} Zeichen; ` +
        `für die Seite selbst bleiben ${TITEL_MAX - suffix.length}.`
    )
  }
  if (description && description.length > BESCHREIBUNG_MAX) {
    throw new Error(
      `Beschreibung zu lang: ${description.length} von ${BESCHREIBUNG_MAX} auf ${pfad}\n  ${description}`
    )
  }
}
```

`noindex`-Seiten sind ausgenommen: Eine Anzeigegrenze für eine Anzeige, die es nicht geben soll, wäre eine Regel ohne Wirkung.

Die Grenze im Schema mitzuführen, ist die stärkere Variante, weil der Fehler dann beim Schreiben des Inhalts auffällt und nicht erst beim Bauen der Seite:

```ts
/** Höchstens 48, weil das Layout " · Marke" anhängt und Google bei 60 schneidet. */
seoTitel: z.string().max(48),
```

## 2. Zwei Titel, weil sie zwei Aufgaben haben

Der Titel auf der Seite und der Titel im Suchergebnis sind nicht dasselbe Feld. Der erste spricht zu jemandem, der die Seite offen hat, und darf eine Beobachtung sein. Der zweite spricht zu jemandem, der die Seite noch nicht kennt, und trägt vorn, was getippt wird.

```ts
titel: z.string(),          // Überschrift auf der Seite
seoTitel: z.string().max(48) // Zeile im Suchergebnis, Keyword vorn
```

Wer beide Aufgaben in ein Feld legt, verliert eine von beiden. Beobachtet: Ein vierundachtzig Zeichen langer Titel, bei dem im Suchergebnis der Markenname wegfiel und vorne ein Satz stand, nach dem niemand sucht.

## 3. Doorway-Seiten: Beleg erzwingen

Eine Ortsseite entsteht nur, wenn es dort etwas zu zeigen gibt.

```ts
const orte = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/orte' }),
  schema: z
    .object({
      name: z.string(),
      sitz: z.boolean().default(false),
      referenzen: z.array(z.string()).default([]),
      vorOrt: z.array(z.object({ titel: z.string(), text: z.string() })).min(2),
    })
    .refine((d) => d.sitz || d.referenzen.length > 0, {
      message:
        'Ortsseite ohne Beleg: mindestens eine Referenz in diesem Ort oder sitz: true. ' +
        'Sonst entstünde eine Doorway-Page.',
      path: ['referenzen'],
    }),
})
```

Die Wirkung ist eine andere als die einer Regel im Text: Wer einen Ort ergänzen will, braucht zuerst ein Projekt dort. Das Gate verhindert nicht nur eine schwache Seite, es verhindert eine falsche Reihenfolge im Vertrieb.

## 4. Doorway-Seiten: Schablonenüberschriften erkennen

Der Fall, der ohne Gate immer wieder entsteht. Die vollständige Begründung steht in [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md); hier die Umsetzung.

```ts
const schablone = (text: string, eigenname: string) => {
  let s = text.toLowerCase()
  const teile = [eigenname, ...eigenname.split(/[\s&-]+/)]
    .map((t) => t.trim().toLowerCase())
    .filter((t) => t.length > 2)
    .sort((a, b) => b.length - a.length)
  for (const teil of teile) s = s.split(teil).join(' ')
  return s.replace(/[^a-zäöüß]+/g, ' ').trim()
}

export function pruefeSchablonen(
  art: string,
  eintraege: { id: string; eigenname: string; ueberschriften: Record<string, string> }[]
) {
  const positionen = new Set(eintraege.flatMap((e) => Object.keys(e.ueberschriften)))
  for (const position of positionen) {
    const gesehen = new Map<string, string>()
    for (const e of eintraege) {
      const roh = e.ueberschriften[position]
      if (!roh) continue
      const muster = schablone(roh, e.eigenname)
      if (!muster) {
        throw new Error(
          `Schablone in ${art} (${position}) auf "${e.id}": ` +
            `Die Überschrift besteht nur aus dem Eigennamen.\n  ${roh}`
        )
      }
      const zwilling = gesehen.get(muster)
      if (zwilling) {
        throw new Error(
          `Schablone in ${art} (${position}): "${zwilling}" und "${e.id}" tragen ` +
            `dieselbe Überschrift mit getauschtem Namen.\n  ${roh}`
        )
      }
      gesehen.set(muster, e.id)
    }
  }
}
```

Aufgerufen wird sie dort, wo die vollständige Sammlung vorliegt, also in `getStaticPaths`:

```ts
export async function getStaticPaths() {
  const orte = await getCollection('orte')
  pruefeSchablonen(
    'Ortsseiten',
    orte.map((o) => ({
      id: o.id,
      eigenname: o.data.name,
      ueberschriften: {
        h1: o.data.headline,
        abschnitt: o.data.abschnittTitel,
        abschluss: o.data.abschlussTitel,
      },
    }))
  )
  return orte.map((o) => ({ params: { ort: o.id }, props: { ort: o } }))
}
```

Damit das Gate etwas zu prüfen hat, müssen die Zwischenüberschriften Felder sein und nicht fest im Markup stehen. Das ist der eigentliche Eingriff: Solange „Was das für {Ort} heißt" in der Vorlage steht, kann keine Prüfung sie unterscheiden.

## 5. Erfundene Inhalte unmöglich machen

Drei Regeln, die zusammen wirken.

**Leer rendert nichts.** Kein Platzhalter, kein leerer Rahmen, keine Auszeichnung.

```ts
stimme: z
  .object({
    zitat: z.string().min(1),
    name: z.string().min(1),
    rolle: z.string().min(1),
    betrieb: z.string().min(1),
  })
  .optional(),
```

Alle Felder sind Pflicht, wenn das Objekt existiert. Ein halb ausgefülltes Objekt wäre schlimmer als ein fehlendes: Es sieht nach Arbeit aus und ist trotzdem wertlos.

**Fremde Zahl braucht eine Quelle, alternde Zahl ein Datum.**

```ts
quelle: z.string().optional(), // Pflicht, sobald Marktzahlen vorkommen
stand: z.string(),             // wann erhoben
```

**Getrennte Felder für Nachprüfbares und Behauptetes.**

```ts
/**
 * Nur was an der gebauten Seite nachprüfbar ist. Niemals eine Wirkung.
 * Prüffrage: Könnte ich das belegen, indem ich die Seite aufmache?
 */
absicht: z.string().min(1),
/** Wirkungen. `quelle` ist hier Pflicht. */
ergebnis: z
  .array(z.object({ wert: z.string(), label: z.string(), quelle: z.string() }))
  .min(2)
  .max(4)
  .optional(),
```

Die Untergrenze zwei ist kein Formalismus: Ein Raster mit einem Wert sieht immer aus wie ein Fehler. Wer eine Zahl hat, hat eine Randnotiz und keine Bilanz.

## 6. Format erzwingen, wo das Format die Wirkung ist

Bei Inhalten, die zitiert werden sollen, entscheidet der Aufbau. Wer die Antwort in den vierten Absatz schreibt, wird nicht zitiert.

```ts
/** Die Antwort, vor jeder Begründung. Muss ohne den Rest der Seite stehen können. */
antwortKurz: z.string().min(1).max(320),
/** Jede Zwischenüberschrift ist eine echte Frage. */
abschnitte: z
  .array(
    z.object({
      frage: z.string().refine((s) => s.trim().endsWith('?'), {
        message: 'Jede Zwischenüberschrift ist eine Frage.',
      }),
      text: z.string(),
    })
  )
  .min(3),
/** Kein Weg zurück ins Angebot ist eine Sackgasse. */
weiterlesen: z.array(z.object({ titel: z.string(), href: z.string() })).min(1),
```

Die Grenze von 320 Zeichen ist der Punkt und keine Bequemlichkeit: Wer mehr braucht, hat die Frage eingeleitet statt beantwortet.

## 7. Tabellen, die nicht verrutschen

```ts
tabelle: z
  .object({
    kopf: z.array(z.string()).min(2),
    zeilen: z.array(z.array(z.string())).min(2),
  })
  .optional()
  .refine((t) => !t || t.zeilen.every((z) => z.length === t.kopf.length), {
    message: 'Jede Tabellenzeile braucht genauso viele Zellen wie die Kopfzeile.',
  }),
```

Eine verrutschte Zeile ist auf einer Preisseite keine Kosmetik, sondern eine Falschaussage.

## 8. Bilder

Maße kommen aus der Datei, nie aus dem Markup. Eine fehlende Datei bricht den Bau, statt einen toten Verweis auszuliefern. `loading` ist ein Pflichtwert ohne Vorgabe, weil ein Bild oberhalb der Falz mit `lazy` Ladezeit kostet und eines darunter mit `eager` ebenfalls.

```astro
---
interface Props {
  src: string
  alt: string
  loading: 'eager' | 'lazy'   // Pflicht, kein Standardwert
  fetchpriority?: 'high' | 'low' | 'auto'
}
const masse = bildmasse(src)   // liest die Datei, wirft wenn sie fehlt
const ohneEndung = src.replace(/\.[^.]+$/, '')
const modern = (['avif', 'webp'] as const)
  .map((typ) => ({ typ, pfad: `${ohneEndung}.${typ}` }))
  .filter(({ pfad }) => pfad !== src && bildmasseWennDa(pfad))
---
<picture>
  {modern.map(({ typ, pfad }) => <source srcset={pfad} type={`image/${typ}`} />)}
  <img src={src} alt={alt} width={masse.breite} height={masse.hoehe}
       loading={loading} fetchpriority={fetchpriority} decoding="async" />
</picture>
```

Der Leser muss jedes Format kennen, das im Projekt vorkommt. Beobachtet: Der Bau brach ab, weil AVIF-Dateien angelegt wurden, der Leser aber nur WebP, PNG und JPEG kannte. Das war der richtige Abbruch, und die Fehlermeldung sollte dazu auffordern, den Leser zu ergänzen statt die Maße von Hand einzutragen.

### Der Bildplatz, solange kein Bild da ist

Bei der Erstauslieferung ist der Normalfall, dass die Fotos fehlen. Dieselbe Komponente trägt deshalb beide Zustände, und der leere ist der wichtigere: Er wird länger ausgeliefert als der gefüllte.

Zwei Angaben machen ihn tragfähig. Der Name der Aufnahme ist Pflicht ohne Vorgabe, damit ein offener Platz nicht zum Rätsel wird; die Begründung steht in [Erstauslieferung](../00_SYSTEM/07-erstauslieferung.md#der-verkleidete-platzhalter). Und der leere Platz trägt eine Auszeichnung im Markup, damit ein Skript ihn im gebauten Verzeichnis wiederfindet.

```astro
---
interface Props {
  bild?: ImageMetadata | null
  alt: string
  verhaeltnis: string          // Pflicht, sonst springt das Layout beim Tausch
  aufnahme: string             // Pflicht ohne Vorgabe: welche Aufnahme hier hingehört
}
---
{bild
  ? <Bild {...} />
  : <div class="platz-offen" style={`aspect-ratio: ${verhaeltnis}`} data-aufnahme={aufnahme}>
      <p><span>Foto folgt</span><span>{aufnahme}</span></p>
    </div>}
```

Drei Entscheidungen daran sind nicht dekorativ:

**Kein `role="img"`, kein `aria-label`.** Hier ist kein Bild. Einem Screenreader eine Behandlungsliege anzusagen, die es nicht gibt, ist eine Falschauskunft. Vorgelesen wird, was dasteht.

**Zurückhaltend statt gestaltet.** Ein heller Rahmen mit einer Andeutung von Fläche, nicht die dunkelste Fläche der Seite. Ein offener Platz, der mehr Aufmerksamkeit zieht als der Text daneben, verschiebt die Hierarchie so lange, bis das Foto kommt.

**Am Telefon gar nicht.** Ein Platz ohne Information kostet dort die knappste Größe der Seite und schiebt den nächsten Abschnitt unter die Falz. Die Regel sitzt an der Hülle und nicht an der Fläche, sonst erzeugt ein leeres Rasterfeld weiter eine Zeile.

Dazu der Hinweis im Bau, der die offenen Plätze zählt:

```js
const offen = new Map()
for (const datei of htmlDateien) {
  for (const m of lies(datei).matchAll(/data-aufnahme="([^"]*)"/g)) {
    offen.set(m[1], [...(offen.get(m[1]) ?? []), datei])
  }
}
if (offen.size > 0) hinweis(`${offen.size} Bildplätze noch offen`, [...offen.keys()])
```

Ein Hinweis bricht den Bau nicht ab. Der Zustand ist bis zum Fototermin erlaubt; unsichtbar darf er nicht sein. Zur Abgrenzung von Befund und Hinweis siehe [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md#die-leiter-der-durchsetzung).

## 9. Eine Angabe, eine Quelle

Preise, Namen, Rufnummern, Laufzeiten stehen in genau einer Datei. Jede Anzeige wird abgeleitet, auch die Meta-Beschreibung und die strukturierten Daten.

```ts
const abEinmalig = Math.min(...PAKETE.map((p) => p.preisEinmalig))
```

Zwei Stellen mit demselben Wert bedeuten, dass eine bei der nächsten Änderung stehen bleibt, und zwar die, die niemand findet. Am teuersten ist der Fall, in dem eine sichtbare Angabe und ihre maschinenlesbare Fassung auseinanderlaufen: Das ist gegenüber Suchmaschinen eine Falschangabe.

## 10. Jeder Markenwert nennt seine Herkunft

An die Datei, in der die Design-Tokens stehen. Der Fehler, den dieses Gate
verhindert, ist nicht sichtbar und fällt deshalb in keinem Review auf: Eine
hergeleitete Farbe steht neben einer übernommenen, und nach der Übergabe kann
niemand mehr sagen, welche dem Kunden gehört. Die Regel dahinter steht in der
[Markeninventur](../02_BRANDING/04-markeninventur.md).

```ts
import { z } from "astro/zod"

const Herkunft = z.discriminatedUnion("art", [
  // Belegbar vom Kunden. Quelle und Abrufdatum sind Pflicht, weil ein
  // Beleg ohne Fundstelle beim ersten Zweifel wertlos ist.
  z.object({ art: z.literal("uebernommen"), quelle: z.string().min(10), geprueftAm: z.string().date() }),
  // Folgt aus etwas Vorhandenem, war aber selbst nicht vorhanden.
  z.object({ art: z.literal("abgeleitet"), aus: z.string().min(10) }),
  // Nichts vorhanden, die Agentur hat entschieden. Braucht den Grund und
  // die Stelle, an der die Entscheidung protokolliert ist.
  z.object({ art: z.literal("neu"), begruendung: z.string().min(20), entscheidung: z.string() }),
])

const Token = z.object({ wert: z.string(), rolle: z.string(), herkunft: Herkunft })

export const MARKE = {
  akzent: Token.parse({
    wert: "#015cab",
    rolle: "primäre Handlung, Preisangabe, Positionsnummer",
    herkunft: {
      art: "uebernommen",
      quelle: "kunde.de/css/bootstrap.min.css, --bs-primary",
      geprueftAm: "2026-08-08",
    },
  }),
}
```

Das Gate prüft nicht, ob die Farbe schön ist. Es prüft, ob jemand die Frage
nach der Herkunft überhaupt gestellt hat. Ein Token ohne `herkunft` bricht den
Bau ab, und ein `uebernommen` ohne Fundstelle ebenfalls. Genau diese beiden
Fälle sind die, in denen später eine Kundenentscheidung durch eine
Agenturpräferenz ersetzt wurde, ohne dass es jemand bemerkt hat.

Der Rest der Markeninventur bleibt bewusst auf Stufe 4. Ob das Ladenschild
denselben Ton führt wie das Stylesheet, kann kein Skript beurteilen.

## 11. Ein Farbtoken misst, was sein Name behauptet

Ein Projektbrief nannte die Akzentfarbe „warmes Amber" und gab `#E4A03C` vor.
Der Wert wurde übernommen, weil eine Hexzahl wie ein Messwert aussieht.
Gemessen liegt er bei Farbton 36 Grad und Sättigung 76 Prozent, also im Orange;
Gold liegt bei 46 bis 52 Grad. Der Fehler fiel erst beim Kunden auf, mit dem
Satz „das sieht altmodisch aus, unsere Farbe ist Gold, nicht Gelb".

Das Werkzeug dafür liegt fertig in
[`werkzeuge/farbwort-pruefen.mjs`](../werkzeuge/farbwort-pruefen.mjs) und läuft
unverändert in einem Kundenprojekt. Es endet mit 1, wenn ein Befund vorliegt.

```json
{
  "scripts": {
    "build": "astro check && astro build && npm run farbpruefung",
    "farbpruefung": "node werkzeuge/farbwort-pruefen.mjs dist/ --akzent gold"
  }
}
```

Wer das Werkzeug nicht mitnehmen will, braucht im Projekt mindestens diese drei
Prüfungen. Alle drei stammen aus demselben Projekt und aus echten Fehlern.

**Der Name gegen den Wert.** Ein Token, dessen Name ein Farbwort trägt, wird
gegen den Bereich dieses Wortes gemessen. Die Bereiche stehen in
[Farbe und Material](../02_BRANDING/05-farbe-und-material.md).

**Text auf einem Verlauf.** Auf einer Fläche mit Verlauf zählt die schlechteste
Stufe, nicht die Grundfarbe. Ein Knopf hielt auf der Grundfarbe 5,49:1 und an
der dunkelsten Stufe nur 3,89:1.

**Genau ein Akzent.** Wenn ein anderes Token auffälliger ist als die
Akzentfarbe, gibt es zwei Akzente. Gemessen wird Sättigung, gewichtet mit dem
Abstand zur mittleren Helligkeit; rohe Sättigung meldet sonst jede dunkle
Grundfarbe als Akzent.

Und die Grenze, die dazugehört: Das Gate beurteilt nicht, ob eine Farbe zur
Marke passt. Amber und Gold sind beide warm und beide richtig, und nur eines
davon ist die Marke. Diese Frage bleibt auf Stufe 4 und gehört in das
Freigabegespräch.

## Aufnahmeprüfung

Bevor das Projekt in Phase 3 geht:

- [ ] Längenprüfung im gemeinsamen Layout, `noindex` ausgenommen
- [ ] Zwischenüberschriften der Seitenfamilien sind Felder, nicht Markup
- [ ] Schablonen-Wächter aufgerufen und **negativ getestet**
- [ ] Ortsseiten und vergleichbare Familien haben eine Belegbedingung
- [ ] Leere Belege rendern nichts, geprüft mit geleertem Frontmatter
- [ ] Bildleser kennt jedes im Projekt verwendete Format
- [ ] Jeder offene Bildplatz nennt seine Aufnahme, und der Bau zählt die offenen mit
- [ ] Keine Fläche ist leer, ohne leer auszusehen: einem Projektfremden gezeigt und gefragt, was das ist
- [ ] Jede Zahl auf der Seite hat genau eine Quelle im Code
- [ ] Jeder Design-Token trägt eine Herkunft, übernommene mit Fundstelle und Datum
- [ ] Jedes Farbtoken misst, was sein Name behauptet, und der Akzent ist die auffälligste Farbe
- [ ] Text auf jeder Fläche mit Verlauf hält an der dunkelsten Stufe
- [ ] Der Katalog in [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md) ist um projektspezifische Gates ergänzt

Der negative Test in Zeile drei wird am häufigsten übersprungen und ist der wichtigste. Ein Gate mit einem Denkfehler in der Bedingung erzeugt Vertrauen, das es nicht deckt.
