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

## 9. Eine Angabe, eine Quelle

Preise, Namen, Rufnummern, Laufzeiten stehen in genau einer Datei. Jede Anzeige wird abgeleitet, auch die Meta-Beschreibung und die strukturierten Daten.

```ts
const abEinmalig = Math.min(...PAKETE.map((p) => p.preisEinmalig))
```

Zwei Stellen mit demselben Wert bedeuten, dass eine bei der nächsten Änderung stehen bleibt, und zwar die, die niemand findet. Am teuersten ist der Fall, in dem eine sichtbare Angabe und ihre maschinenlesbare Fassung auseinanderlaufen: Das ist gegenüber Suchmaschinen eine Falschangabe.

## Aufnahmeprüfung

Bevor das Projekt in Phase 3 geht:

- [ ] Längenprüfung im gemeinsamen Layout, `noindex` ausgenommen
- [ ] Zwischenüberschriften der Seitenfamilien sind Felder, nicht Markup
- [ ] Schablonen-Wächter aufgerufen und **negativ getestet**
- [ ] Ortsseiten und vergleichbare Familien haben eine Belegbedingung
- [ ] Leere Belege rendern nichts, geprüft mit geleertem Frontmatter
- [ ] Bildleser kennt jedes im Projekt verwendete Format
- [ ] Jede Zahl auf der Seite hat genau eine Quelle im Code
- [ ] Der Katalog in [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md) ist um projektspezifische Gates ergänzt

Der negative Test in Zeile drei wird am häufigsten übersprungen und ist der wichtigste. Ein Gate mit einem Denkfehler in der Bedingung erzeugt Vertrauen, das es nicht deckt.
