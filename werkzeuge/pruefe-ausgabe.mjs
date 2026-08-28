#!/usr/bin/env node
// pruefe-ausgabe.mjs
//
// Prueft die ausgelieferte Seite (ein gebautes Ausgabeverzeichnis, meist dist/)
// gegen die mechanisierbaren Gates aus 00_SYSTEM/06-erzwungene-qualitaet.md.
// Abhaengigkeitsfrei: reines Node, kein Browser, keine npm-Pakete. Damit laeuft
// es in jedem Projekt und in jeder CI.
//
// Jeder Befund nennt den gemessenen Wert, die Grenze und die Fundstelle
// ("ein guter Abbruch", 06). Exit-Code 1, sobald ein Gate der Stufe "abbruch"
// ausloest; Warnungen (Stufe "pruefen") aendern den Exit-Code nicht.
//
// Aufruf:
//   node werkzeuge/pruefe-ausgabe.mjs [dist-Verzeichnis] [--nur name,name] [--json]
// Beispiel:
//   node werkzeuge/pruefe-ausgabe.mjs dist
//
// Grenzen sind oben als Konstanten gesetzt und bewusst aenderbar. Wer eine
// Grenze anders braucht, aendert sie hier und schreibt in den Commit, warum.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const GRENZEN = {
  titelMax: 60,          // Google schneidet laengere Titel im Suchergebnis ab
  beschreibungMax: 155,  // dito fuer die Meta-Beschreibung
  schabloneAnteil: 0.6,  // ab diesem Anteil gleicher Ueberschriften: Verdacht
  schabloneMin: 3,       // ... und mindestens so viele gleiche Ueberschriften
};

// Floskeln, die VELLOX im ausgelieferten Text nicht sehen will (04_UI/06,
// 05_COPYWRITING). Kleinschreibung; die Pruefung ist case-insensitiv.
const FLOSKELN = [
  "in der heutigen digitalen welt", "nahtlos", "revolutionär", "revolutionaer",
  "fazit:", "es ist wichtig zu beachten", "kulinarische reise",
  "mit leidenschaft", "maßgeschneidert", "massgeschneidert",
  "wir freuen uns, sie", "höchste qualität", "hoechste qualitaet",
  "ihr zuverlässiger partner", "ihr zuverlaessiger partner",
];

const args = process.argv.slice(2);
const distDir = args.find((a) => !a.startsWith("--")) || "dist";
const nurArg = (args.find((a) => a.startsWith("--nur=")) || "").split("=")[1];
const nur = nurArg ? new Set(nurArg.split(",")) : null;
const alsJson = args.includes("--json");

const befunde = []; // {gate, stufe: "abbruch"|"pruefen", ort, gemessen, grenze, text}
function melde(gate, stufe, ort, text, extra = {}) {
  if (nur && !nur.has(gate)) return;
  befunde.push({ gate, stufe, ort, text, ...extra });
}

// --- Dateien einsammeln ---
function alleDateien(dir) {
  const out = [];
  let eintraege;
  try { eintraege = readdirSync(dir); } catch { return out; }
  for (const e of eintraege) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...alleDateien(p));
    else out.push(p);
  }
  return out;
}

const dateien = alleDateien(distDir);
if (dateien.length === 0) {
  console.error(`Kein Ausgabeverzeichnis gefunden: ${distDir}. Zuerst bauen (z. B. npm run build) oder Pfad angeben.`);
  process.exit(2);
}
const htmlDateien = dateien.filter((f) => f.endsWith(".html"));
const cssDateien = dateien.filter((f) => f.endsWith(".css"));

// --- HTML-Hilfen (leichtgewichtig, kein Parser noetig) ---
// HTML-Entities aufloesen, damit Laengen echt gezaehlt werden: "&amp;" ist ein
// Zeichen, nicht fuenf. Ohne das meldet das Titel-Gate falsche Ueberlaengen.
const decode = (s) =>
  s
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ").replace(/&shy;/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const strip = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();

const ueberschriften = (html, tag) =>
  [...html.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "gi"))].map((m) =>
    strip(m[1]).toLowerCase()
  );

// --- Pro HTML-Seite: Titel, Beschreibung, Floskeln, Rating, Bilder, AVIF ---
const seitenH = []; // fuer den Schablonen-Waechter
for (const f of htmlDateien) {
  const ort = relative(process.cwd(), f);
  const html = readFileSync(f, "utf8");

  const titel = decode((html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "").trim());
  if (titel && titel.length > GRENZEN.titelMax)
    melde("titel", "abbruch", ort, `Titel ${titel.length} von max ${GRENZEN.titelMax} Zeichen. Kuerzen; Grenze in GRENZEN.titelMax.`);

  const desc = decode((html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([\s\S]*?)["']/i)?.[1] || "").trim());
  if (desc && desc.length > GRENZEN.beschreibungMax)
    melde("beschreibung", "abbruch", ort, `Beschreibung ${desc.length} von max ${GRENZEN.beschreibungMax} Zeichen. Grenze in GRENZEN.beschreibungMax.`);

  // Genau eine h1
  const h1 = ueberschriften(html, "h1");
  if (h1.length !== 1)
    melde("eine-h1", "abbruch", ort, `${h1.length} h1 gefunden, genau 1 erwartet.`);

  // Floskeln + Gedankenstriche im ausgelieferten Text
  const text = strip(html);
  const tl = text.toLowerCase();
  for (const fl of FLOSKELN)
    if (tl.includes(fl)) melde("floskel", "abbruch", ort, `Floskel im Text: "${fl}".`);
  // Gedankenstrich als Satzmelodie: — oder von Leerzeichen umgebener Halbgeviert-/Bindestrich
  const dash = text.match(/\s—\s|\s–\s|\s-\s/);
  if (dash) melde("gedankenstrich", "abbruch", ort, `Gedankenstrich als Satzzeichen gefunden ("${dash[0].trim()}"). Punkt, Komma oder Doppelpunkt verwenden.`);

  // Kein Bewertungsschema ohne Bewertungen
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    const raw = m[1];
    if (/aggregateRating|ratingValue|"@type"\s*:\s*"Review"/.test(raw))
      melde("rating-ohne-bewertung", "abbruch", ort, `Bewertungs-Schema (aggregateRating/Review) im JSON-LD. Nur zulaessig mit echten, eigenen Bewertungsdaten. Sonst entfernen (06: geschaeftsschaedigend/abmahnbar).`);
  }

  // Bildmaße: jedes <img> braucht width und height (gegen Layout-Shift)
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0];
    if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) {
      const src = tag.match(/\bsrc=["']([^"']+)["']/)?.[1] || "?";
      melde("bildmasse", "abbruch", ort, `<img> ohne width/height (Layout-Shift): ${src}. Maße aus der Datei setzen.`);
    }
  }

  // Inhaltsbild ohne stille Rueckfalllücke: AVIF-Quelle im <picture>
  if (/<source[^>]+type=["']image\/avif["']/i.test(html))
    melde("avif-ohne-matrix", "abbruch", ort, `<source type="image/avif"> gefunden. AVIF faellt bei Dekodier-Fehler nicht zurueck (07_ENGINEERING/06). WebP+JPG ausliefern oder Browsermatrix erklaeren.`);

  seitenH.push({ ort, titel, h: [...ueberschriften(html, "h1"), ...ueberschriften(html, "h2")] });
}

// AVIF-Dateien ueberhaupt im Ausgabeverzeichnis?
const avifDateien = dateien.filter((f) => extname(f) === ".avif");
if (avifDateien.length)
  melde("avif-ohne-matrix", "abbruch", relative(process.cwd(), avifDateien[0]),
    `${avifDateien.length} .avif-Datei(en) im Ausgabeverzeichnis. Siehe oben; WebP+JPG ist die Voreinstellung.`);

// --- CSS-Gates: fluide Wurzel verlangt px-Breakpoints; metrische Fallback-Fonts ---
// CSS liegt entweder in eigenen Dateien ODER inline in <style> (viele Build-Tools
// inlinen kleines CSS). Beide Quellen einsammeln, sonst laufen die Gates ins Leere.
const inlineCss = htmlDateien
  .map((f) => [...readFileSync(f, "utf8").matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join("\n"))
  .join("\n");
const cssAll = cssDateien.map((f) => readFileSync(f, "utf8")).join("\n") + "\n" + inlineCss;
if (cssAll.trim()) {
  const fluideWurzel = /(?:^|[^-\w])(?:html|:root)\s*\{[^}]*font-size:\s*clamp\([^}]*vw[^}]*\}/i.test(cssAll);
  const remBreakpoint = /@media[^{]*\(min-width:\s*[\d.]+rem\)/i.test(cssAll);
  if (fluideWurzel && remBreakpoint)
    melde("fluid-root-px-breakpoints", "abbruch", "CSS",
      `Fluide Wurzel-Schriftgroeße (clamp mit vw) UND rem-Breakpoints gefunden. Die Breakpoints verrutschen mit der wachsenden Schrift (04_UI/08). Breakpoints in px definieren.`);
  const hatEchteFonts = /@font-face[^}]*src:[^}]*\.woff2?/i.test(cssAll);
  const hatMetrik = /@font-face[^}]*(size-adjust|ascent-override)/i.test(cssAll);
  if (hatEchteFonts && !hatMetrik)
    melde("fallback-fonts", "pruefen", "CSS",
      `Selbst gehostete Schrift, aber kein @font-face mit size-adjust/ascent-override gefunden. Ohne metrisch angepasste Fallback-Schrift springt das Layout beim Schriftwechsel (07_ENGINEERING/06).`);
}

// --- Schablonen-Waechter: zwei Seiten mit derselben Ueberschriften-Schablone ---
// Aus jeder Ueberschrift wird der Eigenname der Seite (aus dem Titel) entfernt,
// dann werden Ziffern getilgt. Was uebrig bleibt, ist die Schablone. Teilen zwei
// Seiten zu viele identische Zeilen, ist das der Doorway-Verdacht aus 06.
function schablone(seite) {
  const namensWorte = new Set(
    (seite.titel || "").toLowerCase().split(/[^a-zäöüß0-9]+/).filter((w) => w.length > 3)
  );
  return seite.h
    .map((z) =>
      z.split(/\s+/).filter((w) => !namensWorte.has(w)).join(" ").replace(/\d+/g, "").replace(/\s+/g, " ").trim()
    )
    .filter(Boolean);
}
for (let i = 0; i < seitenH.length; i++) {
  for (let j = i + 1; j < seitenH.length; j++) {
    const a = schablone(seitenH[i]), b = schablone(seitenH[j]);
    if (a.length < GRENZEN.schabloneMin || b.length < GRENZEN.schabloneMin) continue;
    const bSet = new Set(b);
    const gleich = a.filter((z) => bSet.has(z));
    const anteil = gleich.length / Math.min(a.length, b.length);
    if (gleich.length >= GRENZEN.schabloneMin && anteil >= GRENZEN.schabloneAnteil)
      melde("schablone", "abbruch", `${seitenH[i].ort} ↔ ${seitenH[j].ort}`,
        `${gleich.length} gleiche Ueberschriften (${Math.round(anteil * 100)}%) nach Abzug des Eigennamens. Verdacht auf Doorway-Schablone (06). Ueberschriften eigenstaendig formulieren.`);
  }
}

// --- Ausgabe ---
if (alsJson) {
  console.log(JSON.stringify(befunde, null, 2));
} else {
  const abbruch = befunde.filter((b) => b.stufe === "abbruch");
  const pruefen = befunde.filter((b) => b.stufe === "pruefen");
  console.log(`\npruefe-ausgabe: ${htmlDateien.length} HTML-Seiten, ${cssDateien.length} CSS-Dateien in ${distDir}\n`);
  if (!befunde.length) console.log("  Keine Befunde. Alle mechanisierten Gates bestanden.\n");
  for (const b of abbruch) console.log(`  ABBRUCH [${b.gate}] ${b.ort}\n     ${b.text}`);
  for (const b of pruefen) console.log(`  PRUEFEN [${b.gate}] ${b.ort}\n     ${b.text}`);
  console.log(`\n  ${abbruch.length} Abbruch, ${pruefen.length} zu pruefen.\n`);
}

process.exit(befunde.some((b) => b.stufe === "abbruch") ? 1 : 0);
