#!/usr/bin/env node
/**
 * Markeninventur: Bestand eines vorhandenen Auftritts erheben.
 *
 * Das Werkzeug gehört zu 02_BRANDING/04-markeninventur.md und setzt dessen
 * Stufe 3 um. Es beantwortet eine einzige Frage: Welche Farben und Schriften
 * führt ein bestehender Auftritt tatsächlich?
 *
 * Warum es das gibt
 * -----------------
 * Der häufigste Weg zum falschen Befund „der Kunde hat keine Markenfarbe" ist
 * die Suche im Quelltext. Sie versagt genau dann, wenn der Bestand interessant
 * wäre: Der Wert liegt in einer angepassten Framework-Datei, entsteht erst über
 * die Kaskade oder steckt in einer Grafik. Deshalb misst dieses Werkzeug am
 * gerenderten Zustand, über berechnete Stile, gewichtet nach der Fläche und
 * nach der Textmenge, auf der sie liegen.
 *
 * Was es nicht kann
 * -----------------
 * Es beurteilt nicht, ob eine Farbe stimmt. Ob Ladenschild, Fahrzeug und
 * Arbeitskleidung denselben Ton führen, bleibt eine Frage an den Kunden und
 * damit auf Stufe 4.
 *
 * Aufruf
 * ------
 *   node werkzeuge/markeninventur.mjs https://www.kunde.de
 *   node werkzeuge/markeninventur.mjs https://www.kunde.de --aus inventur.md
 *   node werkzeuge/markeninventur.mjs https://www.kunde.de --spiegeln
 *   node werkzeuge/markeninventur.mjs https://www.kunde.de /unterseite /kontakt
 *
 * --spiegeln lädt den Auftritt mit curl herunter, serviert ihn lokal und
 * rendert diese Kopie. Der Umweg wird gebraucht, wenn der direkte Abruf an
 * einem Proxy, einer Netzsperre oder einem Bot-Schutz scheitert. curl erbt
 * dabei die Proxy-Einstellungen der Umgebung, der Browser oft nicht.
 *
 * Voraussetzung: Playwright, lokal oder global installiert.
 *   npm install -g playwright && npx playwright install chromium
 */

import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { tmpdir } from "node:os";

/* ==========================================================================
   1  Aufruf lesen
   ========================================================================== */

function argumenteLesen(argv) {
  const roh = argv.slice(2);
  if (!roh.length || roh.includes("--hilfe") || roh.includes("-h")) {
    console.log(readFileSync(new URL(import.meta.url)).toString().split("*/")[0].replace(/^#!.*\n/, ""));
    process.exit(roh.length ? 0 : 1);
  }

  const opt = { pfade: [], aus: null, breite: 1440, hoehe: 1600, spiegeln: false, proxy: null };
  let start = null;

  for (let i = 0; i < roh.length; i++) {
    const a = roh[i];
    if (a === "--aus") opt.aus = roh[++i];
    else if (a === "--breite") opt.breite = Number(roh[++i]);
    else if (a === "--hoehe") opt.hoehe = Number(roh[++i]);
    else if (a === "--proxy") opt.proxy = roh[++i];
    else if (a === "--spiegeln") opt.spiegeln = true;
    else if (a.startsWith("--")) fehlerAbbruch(`Unbekannte Option: ${a}`);
    else if (!start) start = a;
    else opt.pfade.push(a);
  }

  if (!start) fehlerAbbruch("Es fehlt die Adresse des zu prüfenden Auftritts.");
  try {
    opt.start = new URL(start).href;
  } catch {
    fehlerAbbruch(`Keine gültige Adresse: ${start}`);
  }
  return opt;
}

function fehlerAbbruch(text) {
  console.error(`\nAbbruch: ${text}\n`);
  process.exit(1);
}

/* ==========================================================================
   2  Playwright auflösen
   Das Werkzeug soll auch dann laufen, wenn Playwright global installiert ist
   und nicht neben diesem Repository liegt.
   ========================================================================== */

async function chromiumLaden() {
  const versuche = [];

  for (const name of ["playwright", "playwright-core"]) {
    try {
      const mod = await import(name);
      const chromium = mod.chromium ?? mod.default?.chromium;
      if (chromium) return chromium;
    } catch (e) {
      versuche.push(`${name}: ${e.message.split("\n")[0]}`);
    }
  }

  try {
    const wurzel = execFileSync("npm", ["root", "-g"], { encoding: "utf8" }).trim();
    const auflösen = createRequire(pathToFileURL(wurzel + "/"));
    for (const name of ["playwright", "playwright-core"]) {
      try {
        const mod = await import(pathToFileURL(auflösen.resolve(name)).href);
        const chromium = mod.chromium ?? mod.default?.chromium;
        if (chromium) return chromium;
      } catch (e) {
        versuche.push(`global ${name}: ${e.message.split("\n")[0]}`);
      }
    }
  } catch (e) {
    versuche.push(`npm root -g: ${e.message.split("\n")[0]}`);
  }

  fehlerAbbruch(
    "Playwright wurde nicht gefunden. Installation:\n" +
      "  npm install -g playwright && npx playwright install chromium\n\n" +
      "Versuche:\n  " + versuche.join("\n  ")
  );
}

/* ==========================================================================
   3  Spiegeln
   Ein Auftritt, der sich nicht direkt rendern lässt, wird heruntergeladen und
   lokal serviert. curl erbt die Proxy-Einstellungen der Umgebung, der Browser
   oft nicht. Gespiegelt wird nur, was für die Darstellung gebraucht wird.
   ========================================================================== */

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".gif": "image/gif", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".avif": "image/avif", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".otf": "font/otf",
};

function holen(url, ziel) {
  mkdirSync(dirname(ziel), { recursive: true });
  try {
    const code = execFileSync(
      "curl",
      ["-sSL", "--max-time", "30", "--compressed", "-o", ziel, "-w", "%{http_code}", url],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    ).trim();
    if (code !== "200") {
      if (existsSync(ziel)) rmSync(ziel);
      return false;
    }
    return true;
  } catch {
    if (existsSync(ziel)) rmSync(ziel);
    return false;
  }
}

/** Aus einer absoluten Adresse einen stabilen, flachen Dateinamen machen. */
function dateiname(absolut) {
  const ohneProtokoll = absolut.replace(/^https?:\/\//, "").split("?")[0].split("#")[0];
  return "res/" + ohneProtokoll.replace(/[^A-Za-z0-9._-]/g, "_").slice(-140);
}

function spiegeln(startUrl, verzeichnis) {
  const seite = join(verzeichnis, "index.html");
  if (!holen(startUrl, seite)) {
    fehlerAbbruch(
      `Die Seite ließ sich auch mit curl nicht laden: ${startUrl}\n` +
        "Prüfe Adresse, Netzzugang und Proxy-Variablen."
    );
  }

  let html = readFileSync(seite, "utf8");
  const karte = new Map();

  const einsammeln = (rohAdresse, basis) => {
    if (!rohAdresse || rohAdresse.startsWith("data:") || rohAdresse.startsWith("#")) return null;
    let absolut;
    try {
      absolut = new URL(rohAdresse, basis).href;
    } catch {
      return null;
    }
    if (karte.has(absolut)) return karte.get(absolut);
    const lokal = dateiname(absolut);
    if (!holen(absolut, join(verzeichnis, lokal))) return null;
    karte.set(absolut, lokal);
    return lokal;
  };

  // Verweise im Markup. Auch srcset und der Hintergrund in style-Attributen,
  // weil dort regelmäßig genau die Grafik steckt, die die Farbe trägt.
  const muster = /(?:href|src)="([^"]+\.(?:css|js|mjs|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|otf))"/gi;
  for (const treffer of [...html.matchAll(muster)]) {
    const lokal = einsammeln(treffer[1], startUrl);
    if (lokal) html = html.split(`"${treffer[1]}"`).join(`"${lokal}"`);
  }
  for (const treffer of [...html.matchAll(/url\(["']?([^"')]+)["']?\)/gi)]) {
    const lokal = einsammeln(treffer[1], startUrl);
    if (lokal) html = html.split(treffer[1]).join(lokal);
  }

  // Verweise innerhalb der Stilvorlagen, meist Schriften und Hintergrundbilder.
  for (const [absolut, lokal] of [...karte]) {
    if (!lokal.endsWith(".css")) continue;
    const pfad = join(verzeichnis, lokal);
    let css = readFileSync(pfad, "utf8");
    for (const treffer of [...css.matchAll(/url\(["']?([^"')]+)["']?\)/gi)]) {
      const innen = einsammeln(treffer[1], absolut);
      // Die Stilvorlagen liegen unter res/, die Ziele ebenfalls. Ein Verweis
      // ohne Verzeichniswechsel trifft deshalb.
      if (innen) css = css.split(treffer[1]).join(innen.replace(/^res\//, ""));
    }
    writeFileSync(pfad, css);
  }

  writeFileSync(seite, html);
  return karte;
}

function serverStarten(verzeichnis) {
  return new Promise((fertig) => {
    const server = createServer((anfrage, antwort) => {
      const pfad = decodeURIComponent(anfrage.url.split("?")[0]);
      const datei = join(verzeichnis, pfad === "/" ? "index.html" : pfad);
      if (!datei.startsWith(verzeichnis) || !existsSync(datei)) {
        antwort.writeHead(404).end("nicht gefunden");
        return;
      }
      antwort.writeHead(200, { "content-type": MIME[extname(datei)] ?? "application/octet-stream" });
      antwort.end(readFileSync(datei));
    });
    server.listen(0, "127.0.0.1", () => fertig({ server, port: server.address().port }));
  });
}

/* ==========================================================================
   4  Messung im Browser
   Läuft im Kontext der Seite. Die Gewichtung ist der eigentliche Kern:
   Was auf zehntausend Pixeln liegt, sagt mehr über eine Marke als eine
   Deklaration, die nirgends greift.
   ========================================================================== */

const MESSUNG = () => {
  const sichtbar = (el) => {
    const s = getComputedStyle(el);
    return s.display !== "none" && s.visibility !== "hidden" && Number(s.opacity) > 0.05;
  };
  const deckend = (farbe) => {
    if (!farbe) return false;
    const m = farbe.match(/rgba?\(([^)]+)\)/);
    if (!m) return false;
    const teile = m[1].split(",").map((x) => parseFloat(x));
    return teile.length < 4 || teile[3] > 0.5;
  };

  const flaechen = new Map();   // Farbe -> Fläche in Pixeln
  const texte = new Map();      // Farbe -> Textgewicht
  const handlung = new Map();   // Farbe an Links und Schaltflächen
  const schriften = new Map();  // Schriftfamilie -> Textgewicht
  const zaehlen = (karte, schluessel, wert) =>
    karte.set(schluessel, (karte.get(schluessel) ?? 0) + wert);

  const alle = [...document.querySelectorAll("body *")];

  for (const el of alle) {
    if (!sichtbar(el)) continue;
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const flaeche = Math.max(0, r.width) * Math.max(0, r.height);

    // Fläche. Kindflächen mit eigener deckender Fläche werden abgezogen,
    // damit ein Kasten im Kasten nicht doppelt zählt.
    if (flaeche > 300 && deckend(s.backgroundColor)) {
      let verdeckt = 0;
      for (const kind of el.children) {
        const ks = getComputedStyle(kind);
        if (!deckend(ks.backgroundColor)) continue;
        const kr = kind.getBoundingClientRect();
        verdeckt += Math.max(0, kr.width) * Math.max(0, kr.height);
      }
      zaehlen(flaechen, s.backgroundColor, Math.max(0, flaeche - verdeckt));
    }

    // Text. Gewichtet nach Zeichenzahl und Schriftgröße, weil eine große
    // Überschrift mehr über die Marke aussagt als eine lange Fußzeile.
    const eigenerText = [...el.childNodes]
      .filter((k) => k.nodeType === 3)
      .map((k) => k.textContent.trim())
      .join("").length;
    if (eigenerText > 0) {
      const gewicht = eigenerText * parseFloat(s.fontSize);
      zaehlen(texte, s.color, gewicht);
      zaehlen(schriften, s.fontFamily.split(",")[0].replace(/["']/g, "").trim(), gewicht);
      const rolle = el.closest("a, button, [role=button], input[type=submit]");
      if (rolle) {
        zaehlen(handlung, s.color, gewicht);
        const rs = getComputedStyle(rolle);
        if (deckend(rs.backgroundColor)) zaehlen(handlung, rs.backgroundColor, gewicht);
      }
    }
  }

  // Zeichen und technische Angaben, die eine Markenentscheidung enthalten.
  // Partnerlogos sehen im Markup aus wie das eigene Zeichen. Getrennt wird
  // nach Ort: Was im Kopfbereich oder in der Navigation steht, ist das eigene
  // Zeichen. Alles andere sind Kandidaten zweiter Ordnung, meist Hersteller.
  const bildLesen = (i) => ({
    quelle: i.currentSrc || i.src,
    alt: i.alt,
    // naturalWidth ist null, solange ein Bild nicht dekodiert ist. Dann gilt
    // die dargestellte Größe als Untergrenze.
    breite: i.naturalWidth || Math.round(i.getBoundingClientRect().width),
    hoehe: i.naturalHeight || Math.round(i.getBoundingClientRect().height),
    gemessen: i.naturalWidth ? "Originalmaß" : "Darstellungsmaß",
  });
  const imKopf = [...document.querySelectorAll("header img, nav img, .navbar img, a[href='/'] img")];
  const sonstige = [...document.querySelectorAll('[class*=logo] img, img[alt*="logo" i], img[src*="logo" i]')]
    .filter((i) => !imKopf.includes(i));
  const bildKandidaten = imKopf.map(bildLesen);
  const weitereBilder = sonstige.map(bildLesen);

  const symbole = [...document.querySelectorAll('link[rel~="icon"], link[rel~="apple-touch-icon"], link[rel~="mask-icon"]')]
    .map((l) => ({ rel: l.getAttribute("rel"), quelle: l.href }));

  // Stilvorlagen. Eine Framework-Datei auf der eigenen Domain des Kunden ist
  // der Ort, an dem angepasste Werte am häufigsten übersehen werden.
  const eigeneHerkunft = location.origin;
  const stilvorlagen = [...document.querySelectorAll('link[rel~="stylesheet"]')].map((l) => {
    const u = l.href;
    const rahmenwerk = /bootstrap|tailwind|foundation|bulma|materialize|uikit/i.test(u);
    return { quelle: u, eigen: u.startsWith(eigeneHerkunft), rahmenwerk };
  });

  // Gesetzte Eigenschaftswerte, falls das Projekt bereits mit Tokens arbeitet.
  const variablen = [];
  for (const bogen of document.styleSheets) {
    let regeln;
    try { regeln = bogen.cssRules; } catch { continue; }
    for (const regel of regeln ?? []) {
      if (!regel.style) continue;
      for (const name of regel.style) {
        if (!name.startsWith("--")) continue;
        const wert = regel.style.getPropertyValue(name).trim();
        if (/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i.test(wert)) variablen.push({ name, wert });
      }
    }
  }

  const geladeneSchriften = [...new Set([...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family))];

  // Fremde Herkünfte. Nicht wegen der Marke, sondern wegen der Bestandsfrage:
  // Eine Funktion, die hinter einem fremden Skript steckt, steht nicht im
  // Quelltext. Wer nur den Quelltext liest, hält sie für nicht vorhanden und
  // liefert später eine Seite ohne sie aus. Die Herkünfte sind der kürzeste
  // Weg zu der Frage, was dieser Auftritt eigentlich kann.
  const fremdeHerkuenfte = (() => {
    const zaehler = new Map();
    const merken = (roh, art) => {
      if (!roh) return;
      let h;
      try { h = new URL(roh, location.href).origin; } catch { return; }
      if (h === eigeneHerkunft || h === "null") return;
      const eintrag = zaehler.get(h) ?? { herkunft: h, abrufe: 0, arten: new Set() };
      eintrag.abrufe += 1;
      eintrag.arten.add(art);
      zaehler.set(h, eintrag);
    };
    for (const e of performance.getEntriesByType("resource")) merken(e.name, e.initiatorType || "abruf");
    // Skripte, die noch nicht geladen sind, tauchen oben nicht auf.
    for (const s of document.querySelectorAll("script[src]")) merken(s.getAttribute("src"), "script");
    for (const f of document.querySelectorAll("iframe[src]")) merken(f.getAttribute("src"), "iframe");
    return [...zaehler.values()]
      .map((e) => ({ herkunft: e.herkunft, abrufe: e.abrufe, arten: [...e.arten].sort() }))
      .sort((a, b) => b.abrufe - a.abrufe)
      .slice(0, 20);
  })();

  // Behälter, die beim Laden leer sind. Ein leeres Element mit sprechendem
  // Namen ist fast immer die Anschlussstelle eines fremden Dienstes.
  const leereBehaelter = [...document.querySelectorAll("div[id], section[id]")]
    .filter((el) => el.children.length === 0 && !el.textContent.trim() && el.id.length > 3)
    .map((el) => ({ kennung: el.id, marke: el.tagName.toLowerCase() }))
    .slice(0, 12);

  const sortieren = (karte) =>
    [...karte].filter(([, g]) => g > 0).sort((a, b) => b[1] - a[1]).slice(0, 12);

  return {
    titel: document.title,
    sprache: document.documentElement.lang || null,
    themenfarbe: document.querySelector('meta[name="theme-color"]')?.content ?? null,
    flaechen: sortieren(flaechen),
    texte: sortieren(texte),
    handlung: sortieren(handlung),
    schriften: sortieren(schriften),
    geladeneSchriften,
    bildKandidaten: bildKandidaten.slice(0, 6),
    weitereBilder: weitereBilder.slice(0, 6),
    symbole: symbole.slice(0, 6),
    stilvorlagen: stilvorlagen.slice(0, 15),
    fremdeHerkuenfte,
    leereBehaelter,
    variablen: [...new Map(variablen.map((v) => [v.name + v.wert, v])).values()].slice(0, 25),
  };
};

/* ==========================================================================
   5  Auswertung und Bericht
   ========================================================================== */

function alsHex(farbe) {
  const m = farbe.match(/rgba?\(([^)]+)\)/);
  if (!m) return farbe;
  const [r, g, b] = m[1].split(",").map((x) => Math.round(parseFloat(x)));
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

/** Relative Leuchtdichte nach WCAG, für den Hinweis auf dunklen Flächen. */
function leuchtdichte(hex) {
  const teile = hex.replace("#", "").match(/../g)?.map((x) => parseInt(x, 16) / 255) ?? [0, 0, 0];
  const [r, g, b] = teile.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function kontrast(a, b) {
  const [x, y] = [leuchtdichte(a), leuchtdichte(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

/** Unbunte Töne sind Grundflächen, keine Markenfarben. */
function istBunt(hex) {
  const [r, g, b] = hex.replace("#", "").match(/../g).map((x) => parseInt(x, 16));
  return Math.max(r, g, b) - Math.min(r, g, b) > 24;
}

function berichtBauen(quelle, seiten) {
  const heute = new Date().toISOString().slice(0, 10);
  const z = [];
  z.push(`# Markeninventur: ${quelle}`);
  z.push("");
  z.push(`Erhoben am ${heute} am gerenderten Auftritt, nicht im Quelltext.`);
  z.push(`Verfahren und Regeln: [Markeninventur](../02_BRANDING/04-markeninventur.md).`);
  z.push("");

  // Kandidaten für die Markenfarbe über alle geprüften Seiten sammeln.
  // Fläche und Handlungssignal bleiben getrennt, weil sie Unterschiedliches
  // aussagen. Eine große Fläche kann ein Bildüberzug oder ein Hover-Ton sein.
  // Eine Farbe an Schaltflächen und Links ist die Farbe, mit der der Betrieb
  // seine Handlungen markiert, und damit das schärfere Signal.
  const bunt = new Map();
  const merken = (hex, feld, gewicht) => {
    const e = bunt.get(hex) ?? { flaeche: 0, handlung: 0 };
    e[feld] += gewicht;
    bunt.set(hex, e);
  };
  for (const s of seiten) {
    for (const [farbe, g] of s.daten.flaechen) {
      const hex = alsHex(farbe);
      if (istBunt(hex)) merken(hex, "flaeche", g);
    }
    for (const [farbe, g] of s.daten.handlung) {
      const hex = alsHex(farbe);
      if (istBunt(hex)) merken(hex, "handlung", g);
    }
  }
  const kandidaten = [...bunt]
    .sort((a, b) => b[1].handlung - a[1].handlung || b[1].flaeche - a[1].flaeche)
    .slice(0, 6);

  z.push("## Befund");
  z.push("");
  if (!kandidaten.length) {
    z.push("Es wurde keine bunte Farbe auf nennenswerter Fläche oder an Handlungselementen gefunden.");
    z.push("");
    z.push("**Dieser Befund ist noch nicht belastbar.** Bevor daraus „der Betrieb hat keine");
    z.push("Markenfarbe\" wird, sind die Orte zu prüfen, die dieses Werkzeug nicht sieht: das");
    z.push("Zeichen selbst, Druckmaterial, Fahrzeugbeschriftung, Arbeitskleidung und die");
    z.push("Profilgrafiken der Kanäle. Ein negativer Befund braucht dieselbe Sorgfalt wie ein");
    z.push("positiver.");
  } else {
    z.push("Kandidaten für die Markenfarbe. Unbunte Töne sind ausgenommen, weil sie");
    z.push("Grundflächen sind. Sortiert nach dem Vorkommen an Handlungselementen: Eine");
    z.push("große Fläche kann ein Bildüberzug oder ein Hover-Ton sein, eine Farbe an");
    z.push("Schaltflächen und Links ist die Farbe, mit der der Betrieb seine Handlungen");
    z.push("markiert.");
    z.push("");
    z.push("| Farbe | An Handlungen | Fläche | Auf Weiß | Auf Anthrazit | Hinweis |");
    z.push("|---|---|---|---|---|---|");
    for (const [hex, g] of kandidaten) {
      const aufHell = kontrast(hex, "#ffffff");
      const aufDunkel = kontrast(hex, "#15181b");
      const hinweis =
        aufDunkel < 4.5
          ? "braucht eine hellere Fassung für dunkle Flächen"
          : aufHell < 4.5
          ? "braucht eine dunklere Fassung für helle Flächen"
          : "trägt auf beiden Untergründen";
      const zahl = (x) => (x ? Math.round(x).toLocaleString("de-DE") : "0");
      z.push(`| \`${hex}\` | ${zahl(g.handlung)} | ${zahl(g.flaeche)} | ${aufHell.toFixed(2)}:1 | ${aufDunkel.toFixed(2)}:1 | ${hinweis} |`);
    }
    z.push("");
    z.push("Töne, die nur in der Flächenspalte auftauchen, sind oft abgedunkelte oder");
    z.push("aufgehellte Fassungen desselben Werts. Prüfe das, bevor du sie als zweite");
    z.push("Markenfarbe führst.");
  }
  z.push("");

  for (const seite of seiten) {
    const d = seite.daten;
    z.push(`## Gemessen auf ${seite.adresse}`);
    z.push("");
    z.push(`Titel: ${d.titel || "ohne"}${d.sprache ? ` · Sprache: ${d.sprache}` : ""}${d.themenfarbe ? ` · theme-color: \`${d.themenfarbe}\`` : ""}`);
    z.push("");

    const tabelle = (titel, eintraege, einheit) => {
      if (!eintraege.length) return;
      z.push(`**${titel}**`);
      z.push("");
      z.push(`| Wert | ${einheit} |`);
      z.push("|---|---|");
      for (const [wert, gewicht] of eintraege) {
        const anzeige = wert.startsWith("rgb") ? `\`${alsHex(wert)}\`` : wert;
        z.push(`| ${anzeige} | ${Math.round(gewicht).toLocaleString("de-DE")} |`);
      }
      z.push("");
    };

    tabelle("Flächen", d.flaechen, "Pixel");
    tabelle("Textfarben", d.texte, "Textgewicht");
    tabelle("An Handlungselementen", d.handlung, "Textgewicht");
    tabelle("Schriften", d.schriften, "Textgewicht");

    if (d.geladeneSchriften.length) {
      z.push(`Tatsächlich geladene Schriftdateien: ${d.geladeneSchriften.map((f) => `\`${f}\``).join(", ")}`);
      z.push("");
      z.push("Jede davon braucht eine übertragbare Lizenz. Eine kommerzielle Schrift, die von");
      z.push("der Plattform des bisherigen Anbieters ausgeliefert wird, endet mit deren");
      z.push("Abschaltung.");
      z.push("");
    }

    if (d.variablen.length) {
      z.push("**Gesetzte Eigenschaftswerte mit Farbe**");
      z.push("");
      for (const v of d.variablen) z.push(`- \`${v.name}: ${v.wert}\``);
      z.push("");
    }

    const eigeneRahmenwerke = d.stilvorlagen.filter((s) => s.eigen && s.rahmenwerk);
    if (eigeneRahmenwerke.length) {
      z.push("**Angepasste Rahmenwerk-Dateien auf der eigenen Domain**");
      z.push("");
      for (const s of eigeneRahmenwerke) z.push(`- ${s.quelle}`);
      z.push("");
      z.push("Genau hier liegen angepasste Werte am häufigsten. Eine Datei mit einem");
      z.push("Rahmenwerk-Namen auf der Kundendomain ist selten der Standard des Rahmenwerks.");
      z.push("Öffne sie und vergleiche die Palette mit den Standardwerten: Was abweicht, ist");
      z.push("eine Entscheidung des Betriebs.");
      z.push("");
    }

    if (d.fremdeHerkuenfte.length || d.leereBehaelter.length) {
      z.push("**Fremde Dienste in diesem Auftritt**");
      z.push("");
      if (d.fremdeHerkuenfte.length) {
        z.push("| Herkunft | Abrufe | Art |");
        z.push("|---|---|---|");
        for (const f of d.fremdeHerkuenfte) {
          z.push(`| ${f.herkunft} | ${f.abrufe} | ${f.arten.join(", ")} |`);
        }
        z.push("");
      }
      if (d.leereBehaelter.length) {
        z.push("Beim Laden leere Behälter, meist die Anschlussstelle eines dieser Dienste:");
        z.push("");
        for (const b of d.leereBehaelter) z.push(`- \`<${b.marke} id="${b.kennung}">\``);
        z.push("");
      }
      z.push("Jede Zeile ist entweder eine **Funktion**, die der neue Auftritt weiterführen");
      z.push("muss, oder eine **Abhängigkeit**, die endet. Beides muss entschieden werden,");
      z.push("und zwar bevor der Umfang steht. Eine Funktion, die hinter einem fremden");
      z.push("Skript steckt, ist im Quelltext nicht zu sehen: Dort steht nur ein leeres");
      z.push("Element. Wer nur liest statt aufzurufen, hält sie für nicht vorhanden.");
      z.push("");
    }

    if (d.bildKandidaten.length) {
      z.push("**Kandidaten für das Zeichen**");
      z.push("");
      for (const b of d.bildKandidaten) {
        z.push(`- ${b.quelle} (${b.breite}×${b.hoehe}${b.alt ? `, alt: „${b.alt}"` : ""})`);
      }
      z.push("");
      z.push("Die Pixelmaße entscheiden darüber, ob für Druck eine Vektorfassung");
      z.push("angefordert werden muss.");
      z.push("");
    }

    if (d.weitereBilder?.length) {
      z.push("**Weitere Treffer, meist Partner- und Herstellerlogos**");
      z.push("");
      for (const b of d.weitereBilder) z.push(`- ${b.quelle}${b.alt ? ` (alt: „${b.alt}")` : ""}`);
      z.push("");
      z.push("Fremde Bildmarken brauchen eine nachweisbare Nutzungserlaubnis des jeweiligen");
      z.push("Herstellers. Ohne sie bleibt es bei der Textnennung.");
      z.push("");
    }

    if (d.symbole.length) {
      z.push("**Symbole**");
      z.push("");
      for (const s of d.symbole) z.push(`- \`${s.rel}\`: ${s.quelle}`);
      z.push("");
    }
  }

  z.push("## Zustand je Eigenschaft");
  z.push("");
  z.push("Diese Tabelle wird von Hand ausgefüllt und geht in den Projektbrief. Jede sichtbare");
  z.push("Eigenschaft des neuen Auftritts trägt genau einen Zustand. Ohne diese Trennung kann");
  z.push("später niemand sagen, welche Gestaltung dem Kunden gehört und welche der Agentur.");
  z.push("");
  z.push("| Eigenschaft | Wert | Zustand | Quelle oder Begründung |");
  z.push("|---|---|---|---|");
  if (kandidaten.length) {
    z.push(`| Akzentfarbe | \`${kandidaten[0][0]}\` | übernommen | ${quelle}, erhoben am ${heute} |`);
  } else {
    z.push("| Akzentfarbe | | | |");
  }
  z.push("| Grundfläche | | | |");
  z.push("| Textfarbe | | | |");
  z.push("| Überschriftenschrift | | | |");
  z.push("| Fließtextschrift | | | |");
  z.push("| Zeichen | | | |");
  z.push("");
  z.push("Zulässige Zustände: `übernommen` mit Fundstelle und Datum, `abgeleitet` mit der");
  z.push("Angabe, woraus, oder `neu entschieden` mit Begründung und Entscheidungseintrag.");
  z.push("");
  z.push("## Was dieses Werkzeug nicht geprüft hat");
  z.push("");
  z.push("Ob Ladenschild, Fassade, Fahrzeugbeschriftung und Arbeitskleidung denselben Ton");
  z.push("führen. Das kann kein Skript beurteilen und bleibt eine Frage an den Kunden. Ein");
  z.push("Foto der Fassade genügt zur Kontrolle. Die gelebte Wirklichkeit schlägt die Datei.");
  z.push("");
  z.push("Und was die fremden Dienste oben tatsächlich leisten. Das Werkzeug nennt ihre");
  z.push("Herkunft, nicht ihren Wert. Ob dort ein Zählpixel sitzt oder der halbe");
  z.push("Warenbestand, entscheidet sich erst, wenn jemand den Dienst aufruft und");
  z.push("nachsieht. Genau dieser Schritt wird am häufigsten übersprungen.");
  z.push("");

  return z.join("\n");
}

/* ==========================================================================
   6  Ablauf
   ========================================================================== */

async function hauptlauf() {
  const opt = argumenteLesen(process.argv);
  const chromium = await chromiumLaden();

  let basis = opt.start;
  let server = null;
  let spiegelVerzeichnis = null;
  let zurueckUebersetzen = (text) => text;

  if (opt.spiegeln) {
    spiegelVerzeichnis = mkdtempSync(join(tmpdir(), "markeninventur-"));
    process.stderr.write(`Spiegele ${opt.start} ...\n`);
    const karte = spiegeln(opt.start, spiegelVerzeichnis);
    const gestartet = await serverStarten(spiegelVerzeichnis);
    server = gestartet.server;
    basis = `http://127.0.0.1:${gestartet.port}/index.html`;
    // Rückweg von der lokalen Kopie zur echten Adresse. Ein Bericht, der
    // Adressen auf 127.0.0.1 nennt, ist für den Kundentermin wertlos.
    zurueckUebersetzen = (text) => {
      let aus = text;
      for (const [absolut, lokal] of karte) {
        aus = aus.split(`http://127.0.0.1:${gestartet.port}/${lokal}`).join(absolut);
      }
      return aus.split(`http://127.0.0.1:${gestartet.port}/index.html`).join(opt.start)
                .split(`http://127.0.0.1:${gestartet.port}/`).join(new URL("/", opt.start).href);
    };
    process.stderr.write(`${karte.size} Ressourcen gespiegelt, serviert auf Port ${gestartet.port}.\n`);
  }

  const browser = await chromium.launch(opt.proxy ? { proxy: { server: opt.proxy } } : {});
  const kontext = await browser.newContext({
    viewport: { width: opt.breite, height: opt.hoehe },
    locale: "de-DE",
    ignoreHTTPSErrors: true,
  });

  const adressen = [basis, ...opt.pfade.map((p) => new URL(p, basis).href)];
  const seiten = [];

  for (const adresse of adressen) {
    const seite = await kontext.newPage();
    try {
      await seite.goto(adresse, { waitUntil: "load", timeout: 45000 });
      // Einmal durchscrollen, damit verzögert geladene Bilder wirklich
      // dekodiert sind. Ohne diesen Durchlauf meldet naturalWidth null, und
      // die Aussage über die Auflösung des Zeichens wäre falsch.
      await seite.evaluate(async () => {
        const schritt = window.innerHeight;
        for (let y = 0; y < document.body.scrollHeight; y += schritt) {
          window.scrollTo(0, y);
          await new Promise((f) => setTimeout(f, 120));
        }
        window.scrollTo(0, 0);
      });
      await seite.waitForTimeout(1200);
      try { await seite.evaluate(() => document.fonts.ready); } catch { /* ohne Fonts-API weiter */ }
      const daten = await seite.evaluate(MESSUNG);
      seiten.push({ adresse: opt.spiegeln ? opt.start : adresse, daten });
      process.stderr.write(`Gemessen: ${adresse}\n`);
    } catch (e) {
      process.stderr.write(`Nicht erreichbar: ${adresse}\n  ${e.message.split("\n")[0]}\n`);
      if (!opt.spiegeln) {
        process.stderr.write(
          "\nHinweis: Wenn der Browser nicht durchkommt, der Rechner aber schon,\n" +
            "hilft meist der Umweg über eine lokale Kopie:\n" +
            `  node werkzeuge/markeninventur.mjs ${opt.start} --spiegeln\n\n`
        );
      }
    } finally {
      await seite.close();
    }
  }

  await browser.close();
  if (server) server.close();
  if (spiegelVerzeichnis) rmSync(spiegelVerzeichnis, { recursive: true, force: true });

  if (!seiten.length) fehlerAbbruch("Keine Seite konnte gemessen werden.");

  const bericht = zurueckUebersetzen(berichtBauen(opt.start, seiten));
  if (opt.aus) {
    writeFileSync(opt.aus, bericht);
    process.stderr.write(`\nBericht geschrieben: ${opt.aus}\n`);
  } else {
    process.stdout.write(bericht);
  }
}

hauptlauf().catch((e) => fehlerAbbruch(e.stack ?? e.message));
