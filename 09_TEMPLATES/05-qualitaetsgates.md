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

## 11. Kein Farbwert außerhalb der Palette

Die Regel steht in den [Coding Standards](../07_ENGINEERING/01-coding-standards.md); hier die Prüfung. Sie läuft über die Quelldateien, nicht über die Ausgabe, weil die Meldung sonst eine Zeile in generiertem CSS nennt und niemandem hilft.

```ts
// werkzeuge/farbwerte-pruefen.ts, aufgerufen vor dem Bau
const MUSTER = [
  { name: 'Hexadezimalwert', regex: /#[0-9a-fA-F]{3,8}\b/g },
  { name: 'Funktionsschreibweise', regex: /\b(rgba?|hsla?|oklch|oklab|lab|lch)\s*\(/g },
  // Hilfsklassen, die nach einem Farbton statt nach einer Aufgabe benannt sind.
  // Der Tonname ist der Fehler, nicht die Zahl dahinter.
  {
    name: 'Hilfsklasse nach Farbton',
    regex:
      /\b(text|bg|border|ring|fill|stroke|from|via|to|decoration|outline|shadow)-(slate|gray|grey|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g,
  },
]

/** Dateien, die eigene Farbwerte tragen müssen. Jede Ergänzung braucht einen Grund. */
const AUSGENOMMEN = [
  'src/design/palette.ts', // die Palette selbst
  'src/assets/',           // Zeichen, Illustrationen, Fotos
  'public/',
]
```

Der Abbruch nennt nach den drei Teilen aus [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md) den gefundenen Wert, die Stelle und den Weg heraus:

```
Fester Farbwert außerhalb der Palette:
  src/components/PreisKarte.astro:34   #0a3d62   (Hexadezimalwert)

Farben werden über eine semantische Rolle bezogen, nicht über ihren Wert.
Verfügbare Rollen: flaeche, flaeche-erhoben, text, text-leise, kante,
handlung, handlung-aktiv, fokus, fehler, erfolg, warnung

Wenn keine Rolle passt, fehlt eine. Lege sie in src/design/palette.ts an,
statt den Wert hier einzutragen. Ausnahmen stehen in AUSGENOMMEN in
werkzeuge/farbwerte-pruefen.ts und brauchen eine Begründung im Commit.
```

Der letzte Absatz der Meldung ist der wichtigste. Eine Prüfung, die nur verbietet, wird beim ersten Termindruck umgangen. Eine, die den richtigen Weg im selben Text nennt, wird befolgt.

## 12. Kontrast aus den Rollen rechnen, bevor eine Seite existiert

Möglich wird das erst durch Abschnitt 11: Wenn jede Rolle ihre zulässigen Partner nennt, ist die Menge der zu prüfenden Paare bekannt, und der Kontrast ist eine Rechnung statt einer Messung. Die Formel ist die relative Leuchtdichte nach WCAG.

```ts
const kanal = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)

const leuchtdichte = (hex: string) => {
  const h = hex.replace('#', '')
  const voll = h.length === 3 ? [...h].map((z) => z + z).join('') : h
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(voll.slice(i, i + 2), 16) / 255)
  return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b)
}

export const kontrast = (a: string, b: string) => {
  const [hell, dunkel] = [leuchtdichte(a), leuchtdichte(b)].sort((x, y) => y - x)
  return (hell + 0.05) / (dunkel + 0.05)
}
```

Die Zielwerte stehen an genau einer Stelle, damit eine neue Fassung der Richtlinie eine Änderung an einer Datei bleibt:

```ts
/** WCAG 2.2 Stufe AA. Quelle: w3.org/TR/WCAG22, Erfolgskriterien 1.4.3 und 1.4.11. */
export const MINDESTKONTRAST = {
  text: 4.5,        // Fließtext
  textGross: 3.0,   // ab 24px oder ab 18,66px fett
  bedienelement: 3.0, // Grenzen, Zustände, Fokusring (1.4.11)
} as const
```

Jede Rolle nennt ihre Partner und die Aufgabe, aus der sich der Zielwert ergibt:

```ts
const paare = [
  { vorn: 'text', hinten: 'flaeche', zweck: 'text' },
  { vorn: 'text-leise', hinten: 'flaeche', zweck: 'text' },
  { vorn: 'text-leise', hinten: 'flaeche-erhoben', zweck: 'text' },
  { vorn: 'handlung', hinten: 'flaeche', zweck: 'bedienelement' },
  { vorn: 'fokus', hinten: 'flaeche', zweck: 'bedienelement' },
  { vorn: 'kante', hinten: 'flaeche', zweck: 'bedienelement' },
] as const

for (const { vorn, hinten, zweck } of paare) {
  const ist = kontrast(ROLLE[vorn], ROLLE[hinten])
  const soll = MINDESTKONTRAST[zweck]
  if (ist < soll) {
    throw new Error(
      `Kontrast zu gering: ${vorn} auf ${hinten} erreicht ${ist.toFixed(2)}:1, ` +
        `nötig sind ${soll}:1 (${zweck}).\n` +
        `  ${vorn} = ${ROLLE[vorn]}, ${hinten} = ${ROLLE[hinten]}\n` +
        `  Zielwerte stehen in src/design/palette.ts unter MINDESTKONTRAST.`
    )
  }
}
```

**Die Grenze dieses Gates gehört zu ihm.** Es prüft Farbe gegen Farbe. Text auf einem Foto, auf einem Verlauf oder auf einer halbtransparenten Fläche hat keinen einzelnen Hintergrundwert, und dort sagt das Gate nichts, obwohl genau dort die Fehler sitzen, die auffallen. Diese Fälle bleiben eine Prüfung am gerenderten Zustand. Ein Gate, dem mehr zugetraut wird, als es leistet, ist gefährlicher als keines.

Dazu läuft ein Prüflauf über **alle** gebauten Seiten, nicht über eine Auswahl:

```json
{
  "scripts": {
    "pruefe:a11y": "astro build && pa11y-ci --sitemap http://localhost:4321/sitemap-0.xml"
  }
}
```

Die Sitemap ist hier die Auswahlregel, und das ist ihr Zweck: Wer eine Seite ausliefert, prüft sie. Ein Durchlauf über drei von Hand eingetragene Adressen findet die Startseite in Ordnung und das Kontaktformular nie.

## 13. Wartezustände vollständig machen

Die Begründung steht in [Wartezustände](../04_UI/08-wartezustaende-und-skelette.md). Der vergessene Zustand ist fast immer der Fehlerausgang, und das Ergebnis ist ein Skelett, das stehen bleibt. Zwei Wahrheitswerte erlauben diesen Fall; eine unterscheidbare Variante nicht.

```ts
export type Ladelage<T> =
  | { lage: 'laedt' }
  | { lage: 'leer' }
  | { lage: 'fehler'; grund: string; rueckweg: string }
  | { lage: 'inhalt'; daten: T }
```

`rueckweg` ist Pflicht und kein Text zur Zierde: Er ist der Weg, der ohne diesen Dienst funktioniert, also die Rufnummer, wenn der Terminkalender nicht lädt. Ein Fehlerzustand ohne Ausweg ist eine Sackgasse mit Erklärung.

Der erschöpfende Abgleich macht den vergessenen Fall zum Typfehler statt zur leeren Fläche:

```ts
switch (lage.lage) {
  case 'laedt':   return <Skelett plaetze={ERWARTETE_PLAETZE} />
  case 'leer':    return <Hinweis>{leerText}</Hinweis>
  case 'fehler':  return <Stoerung grund={lage.grund} rueckweg={lage.rueckweg} />
  case 'inhalt':  return <Liste daten={lage.daten} />
  default:        {
    const _unbehandelt: never = lage   // bricht den Bau bei einem neuen Zustand
    throw new Error(`Unbehandelter Ladezustand: ${JSON.stringify(_unbehandelt)}`)
  }
}
```

Die Maße des Skeletts werden abgeleitet und nicht gezeichnet. Es benutzt dieselbe Komponente wie der Inhalt und ersetzt nur den Text durch Fläche, damit beide Fassungen dieselbe Höhe berechnen:

```astro
---
interface Props { plaetze: number }
const { plaetze } = Astro.props
---
<ul aria-busy="true" class="liste">
  {Array.from({ length: plaetze }, () => (
    <li class="liste__eintrag" aria-hidden="true">
      <Eintrag titel="" text="" skelett />
    </li>
  ))}
</ul>
<p class="nur-vorlesen" role="status">Inhalte werden geladen.</p>
```

`aria-hidden` an den Platzhaltern und die Statusmeldung daneben gehören zusammen: Eine Folge bedeutungsloser Elemente vorzulesen ist schlechter als keine, aber gar keine Auskunft ist es auch. Die Zeitgrenzen, 200 Millisekunden Verzögerung vor dem Erscheinen und 400 Millisekunden Mindeststandzeit, stehen als benannte Werte an einer Stelle, weil sie Konvention sind und mit einer Messung geändert werden dürfen.

## Aufnahmeprüfung

Bevor das Projekt in Phase 3 geht:

- [ ] Längenprüfung im gemeinsamen Layout, `noindex` ausgenommen
- [ ] Zwischenüberschriften der Seitenfamilien sind Felder, nicht Markup
- [ ] Schablonen-Wächter aufgerufen und **negativ getestet**
- [ ] Ortsseiten und vergleichbare Familien haben eine Belegbedingung
- [ ] Leere Belege rendern nichts, geprüft mit geleertem Frontmatter
- [ ] Bildleser kennt jedes im Projekt verwendete Format
- [ ] Jede Zahl auf der Seite hat genau eine Quelle im Code
- [ ] Jeder Design-Token trägt eine Herkunft, übernommene mit Fundstelle und Datum
- [ ] Farbrollen sind benannt, die Palette ist die einzige Datei mit Farbwerten
- [ ] Farbwert-Prüfung läuft vor dem Bau und **negativ getestet**, Ausnahmeliste begründet
- [ ] Jedes zulässige Farbpaar ist deklariert und sein Kontrast wird gerechnet
- [ ] Zugänglichkeitsprüfung läuft über die Sitemap, nicht über eine Auswahl
- [ ] Asynchrone Flächen führen ihre vier Zustände als unterscheidbare Varianten
- [ ] Skelettmaße kommen aus derselben Komponente wie der Inhalt
- [ ] Der Katalog in [Erzwungene Qualität](../00_SYSTEM/06-erzwungene-qualitaet.md) ist um projektspezifische Gates ergänzt

Der negative Test in Zeile drei wird am häufigsten übersprungen und ist der wichtigste. Ein Gate mit einem Denkfehler in der Bedingung erzeugt Vertrauen, das es nicht deckt.
