#!/usr/bin/env node
/**
 * Farbwortwächter: prüft, ob ein Farbtoken misst, was sein Name behauptet.
 *
 * Das Werkzeug gehört zu 02_BRANDING/05-farbe-und-material.md und setzt dessen
 * Stufe 3 um. Es beantwortet drei Fragen, die alle drei aus echten Fehlern
 * stammen:
 *
 *   1. Heißt ein Token, wie es aussieht? Ein Token namens `gold` bei Farbton
 *      36 Grad ist Orange.
 *   2. Hält Text auf einer Fläche mit Verlauf an jeder Stufe? Auf einem Verlauf
 *      zählt die schlechteste Stufe, nicht die Grundfarbe.
 *   3. Ist die Akzentfarbe wirklich die auffälligste Farbe? Wenn ein anderes
 *      Token gesättigter ist, gibt es zwei Akzente.
 *
 * Warum es das gibt
 * -----------------
 * Ein Projektbrief nannte die Akzentfarbe „warmes Amber" und gab #E4A03C vor.
 * Weil eine Hexzahl wie ein Messwert aussieht, wurde sie übernommen und nie
 * gegen ihren eigenen Namen gehalten. Gemessen liegt sie bei Farbton 36 Grad
 * und Sättigung 76 Prozent; Gold liegt bei 46 bis 52 Grad und 47 bis 65
 * Prozent. Der Fehler fiel erst beim Kunden auf. Die Begründung steht in
 * 00_SYSTEM/08-vorgabe-ist-keine-messung.md.
 *
 * Was es nicht kann
 * -----------------
 * Es beurteilt nicht, ob eine Farbe schön ist, ob sie zur Marke passt oder ob
 * der Kunde dieses Farbwort überhaupt meint. Amber und Gold sind beide warm und
 * beide richtig; welches die Marke ist, bleibt eine Frage an den Kunden und
 * damit auf Stufe 4. Es kennt außerdem nur die Wörter in der Tabelle unten.
 * Ein Token, dessen Name kein bekanntes Farbwort trägt, wird übersprungen.
 *
 * Aufruf
 * ------
 *   node werkzeuge/farbwort-pruefen.mjs pfad/zu/tokens.css
 *   node werkzeuge/farbwort-pruefen.mjs dist/            (alle .css und .html)
 *   node werkzeuge/farbwort-pruefen.mjs dist/ --akzent gold
 *   node werkzeuge/farbwort-pruefen.mjs --selbsttest
 *
 * Endet mit 1, wenn ein Befund vorliegt, damit es in einem Bau abbrechen kann.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

/* ------------------------------------------------------------------ */
/* Die Bereiche der Farbwörter                                         */
/*                                                                     */
/* Gemessen an gebräuchlichen Referenzen, mit einer kleinen Toleranz   */
/* nach beiden Seiten. Die ausführliche Tabelle mit Begründung steht   */
/* in 02_BRANDING/05-farbe-und-material.md.                            */
/* ------------------------------------------------------------------ */
const WORTBEREICHE = {
  gold:    { h: [40, 54],   s: [40, 70], hinweis: 'Darunter Orange, darüber Gelb. Zu gesättigt wirkt es billig.' },
  messing: { h: [42, 56],   s: [35, 60], hinweis: 'Messing liegt grüner und matter als Gold.' },
  bronze:  { h: [20, 40],   s: [35, 65], hinweis: 'Bronze liegt röter und dunkler als Gold.' },
  kupfer:  { h: [10, 30],   s: [45, 80], hinweis: 'Kupfer liegt im Rotorange.' },
  amber:   { h: [30, 45],   s: [60, 95], hinweis: 'Amber ist bewusst gesättigt. Wer Gold meint, meint nicht Amber.' },
  rose:    { h: [335, 20],  s: [15, 60], hinweis: 'Rosé liegt im Rot, nicht im Orange.' },
  teal:    { h: [165, 195], s: [20, 90], hinweis: 'Teal liegt zwischen Grün und Blau.' },
  tuerkis: { h: [160, 190], s: [30, 90], hinweis: 'Türkis liegt zwischen Grün und Blau.' },
  mint:    { h: [140, 170], s: [15, 60], hinweis: 'Mint ist ein helles, entsättigtes Grün.' },
  oliv:    { h: [55, 95],   s: [20, 60], hinweis: 'Oliv liegt im gedämpften Gelbgrün.' },
  sand:    { h: [30, 55],   s: [8, 30],  hinweis: 'Sand ist fast neutral. Mehr Sättigung ist Ocker.' },
  stein:   { h: [0, 360],   s: [0, 20],  hinweis: 'Stein ist ein Neutralton.' },
  stone:   { h: [0, 360],   s: [0, 20],  hinweis: 'Stone ist ein Neutralton.' },
};

/* Namen, die keine Farbwörter sind, auch wenn sie so klingen. */
const KEINE_FARBWOERTER = new Set(['border', 'background', 'foreground', 'surface']);

/* ------------------------------------------------------------------ */
/* Farbrechnung                                                        */
/* ------------------------------------------------------------------ */

function zuHex(wert) {
  const k = wert.trim().toLowerCase();
  const m3 = k.match(/^#([0-9a-f]{3})$/);
  if (m3) return '#' + [...m3[1]].map((c) => c + c).join('');
  const m6 = k.match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/);
  if (m6) return '#' + m6[1];
  return null;
}

function hsl(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const l = (max + min) / 2;
  if (d === 0) return { h: 0, s: 0, l: Math.round(l * 100) };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h =
    max === r ? 60 * (((g - b) / d) % 6)
    : max === g ? 60 * ((b - r) / d + 2)
    : 60 * ((r - g) / d + 4);
  if (h < 0) h += 360;
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const linear = (c) => {
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const leuchtdichte = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
};
const kontrast = (a, b) => {
  const la = leuchtdichte(a);
  const lb = leuchtdichte(b);
  const [hoch, tief] = la > lb ? [la, lb] : [lb, la];
  return (hoch + 0.05) / (tief + 0.05);
};

/* Ein Bereich darf über null Grad hinweg laufen, etwa bei Rosé. */
const imBereich = (wert, [von, bis]) =>
  von <= bis ? wert >= von && wert <= bis : wert >= von || wert <= bis;

/* ------------------------------------------------------------------ */
/* Einlesen                                                            */
/* ------------------------------------------------------------------ */

function dateienSammeln(pfad) {
  if (!existsSync(pfad)) {
    console.error(`Nicht gefunden: ${pfad}`);
    process.exit(2);
  }
  if (!statSync(pfad).isDirectory()) return [pfad];
  const raus = [];
  for (const eintrag of readdirSync(pfad, { withFileTypes: true })) {
    const voll = join(pfad, eintrag.name);
    if (eintrag.isDirectory()) raus.push(...dateienSammeln(voll));
    else if (['.css', '.html', '.astro', '.scss'].includes(extname(voll))) raus.push(voll);
  }
  return raus;
}

function stilLesen(dateien) {
  let alles = '';
  for (const d of dateien) {
    const inhalt = readFileSync(d, 'utf8');
    if (extname(d) === '.css' || extname(d) === '.scss') {
      alles += inhalt + '\n';
    } else {
      for (const m of inhalt.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)) {
        alles += m[1] + '\n';
      }
    }
  }
  return alles;
}

/* ------------------------------------------------------------------ */
/* Die drei Prüfungen                                                  */
/* ------------------------------------------------------------------ */

function tokensLesen(css) {
  const tokens = new Map();
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*[;}]/g)) {
    const hex = zuHex(m[2]);
    if (hex) tokens.set(m[1].toLowerCase(), hex);
  }
  return tokens;
}

function pruefeNamen(tokens) {
  const befunde = [];
  let geprueft = 0;

  for (const [name, hex] of tokens) {
    const kern = name.replace(/^--(color-|farbe-|c-)?/, '');
    const teile = kern.split('-');
    const wort = Object.keys(WORTBEREICHE).find(
      (w) => teile.includes(w) && !KEINE_FARBWOERTER.has(w),
    );
    if (!wort) continue;

    geprueft++;
    const { h, s } = hsl(hex);
    const regel = WORTBEREICHE[wort];

    if (!imBereich(h, regel.h)) {
      befunde.push(
        `${name}: ${hex.toUpperCase()} hat Farbton ${h}°, ` +
          `"${wort}" liegt bei ${regel.h[0]} bis ${regel.h[1]}°.\n      ${regel.hinweis}`,
      );
    } else if (s < regel.s[0] || s > regel.s[1]) {
      befunde.push(
        `${name}: ${hex.toUpperCase()} hat Sättigung ${s} %, ` +
          `"${wort}" liegt bei ${regel.s[0]} bis ${regel.s[1]} %.\n      ${regel.hinweis}`,
      );
    }
  }
  return { befunde, geprueft };
}

function pruefeVerlaeufe(css, tokens) {
  const aufloesen = (wert) => {
    let v = wert;
    for (let runde = 0; runde < 4 && /var\(/.test(v); runde++) {
      v = v.replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,[^)]*)?\)/gi,
        (_, name) => tokens.get(name.toLowerCase()) ?? '');
    }
    return v;
  };

  const befunde = new Set();
  const flaechen = new Set();

  for (const m of css.matchAll(/([^{}]+)\{([^{}]*linear-gradient[^{}]*)\}/gi)) {
    const selektor = m[1].trim().replace(/\s+/g, ' ');
    const koerper = m[2];
    const farbe = koerper.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i)?.[1];
    if (!farbe) continue;

    const text = zuHex(aufloesen(farbe).match(/#[0-9a-fA-F]{3,8}/)?.[0] ?? '');
    if (!text) continue;

    const verlauf = koerper.match(/linear-gradient\(([^;]*)\)/i)?.[1] ?? '';
    const stufen = [...aufloesen(verlauf).matchAll(/#[0-9a-fA-F]{3,8}/g)]
      .map((x) => zuHex(x[0]))
      .filter(Boolean);
    if (stufen.length === 0) continue;

    flaechen.add(selektor);
    for (const stufe of stufen) {
      const cr = kontrast(text, stufe);
      if (cr < 4.5) {
        befunde.add(
          `${selektor}: Text ${text.toUpperCase()} auf Verlaufsstufe ` +
            `${stufe.toUpperCase()} misst ${cr.toFixed(2)}:1, nötig sind 4,5:1.`,
        );
      }
    }
  }
  return { befunde: [...befunde], flaechen: flaechen.size };
}

/**
 * Auffälligkeit einer Farbe.
 *
 * Sättigung allein ist das falsche Maß. Die dunkle Grundfarbe eines Projekts
 * kann rechnerisch hoch gesättigt sein und trotzdem nichts an sich ziehen,
 * weil sie fast schwarz ist. Das Auge nimmt Buntheit dort am stärksten wahr,
 * wo die Helligkeit in der Mitte liegt. Deshalb wird die Sättigung mit dem
 * Abstand zur mittleren Helligkeit gewichtet.
 *
 * Gerechnet an den vier Werten, aus denen die Regel entstand:
 *   Gold  #BE9A52  S 45  L 53  ->  42   Akzent
 *   Deep  #0F2E2A  S 51  L 12  ->  12   Grundfläche, nicht laut
 *   Water #2FA08C  S 54  L 41  ->  44   lauter als der Akzent, ein Befund
 *   Water #4E8F80  S 29  L 44  ->  26   ruhig, kein Befund
 */
function auffaelligkeit(hex) {
  const { s, l } = hsl(hex);
  return Math.round(s * (1 - Math.abs(l - 50) / 50));
}

function pruefeAkzent(tokens, akzentWort) {
  if (!akzentWort) return null;
  const akzent = [...tokens].find(([name]) => name.includes(akzentWort));
  if (!akzent) return { fehlt: true };

  const akzentWert = auffaelligkeit(akzent[1]);
  const lauter = [];

  for (const [name, hex] of tokens) {
    if (name === akzent[0]) continue;
    /* Stufen desselben Akzents zählen nicht als zweiter Akzent. */
    if (name.includes(akzentWort)) continue;
    /* Neutraltöne sind keine Akzente. */
    if (hsl(hex).s < 25) continue;
    const wert = auffaelligkeit(hex);
    if (wert > akzentWert) lauter.push(`${name} ${hex.toUpperCase()} (${wert})`);
  }
  return { akzent: `${akzent[0]} ${akzent[1].toUpperCase()} (${akzentWert})`, lauter };
}

/* ------------------------------------------------------------------ */
/* Selbsttest                                                          */
/* ------------------------------------------------------------------ */

if (process.argv.includes('--selbsttest')) {
  console.log('\nSelbsttest gegen die echten Werte, aus denen die Regeln entstanden.\n');
  const faelle = [
    ['Gold bei 36 Grad',        ':root{--color-gold:#E4A03C}', (c) => pruefeNamen(tokensLesen(c)).befunde.length > 0],
    ['Gold korrekt',            ':root{--color-gold:#BE9A52}', (c) => pruefeNamen(tokensLesen(c)).befunde.length === 0],
    ['Amber korrekt',           ':root{--color-amber:#E4A03C}', (c) => pruefeNamen(tokensLesen(c)).befunde.length === 0],
    ['Verlaufsstufe zu dunkel',
      ':root{--g:#BE9A52;--d:#A17F3C;--t:#0F2E2A}.k{color:var(--t);background-image:linear-gradient(158deg,var(--g),var(--d))}',
      (c) => pruefeVerlaeufe(c, tokensLesen(c)).befunde.length > 0],
    ['Verlauf haelt',
      ':root{--g:#C9A55F;--d:#B18F4A;--t:#0F2E2A}.k{color:var(--t);background-image:linear-gradient(158deg,var(--g),var(--d))}',
      (c) => pruefeVerlaeufe(c, tokensLesen(c)).befunde.length === 0],
    ['Zweiter Akzent lauter',
      ':root{--color-gold:#BE9A52;--color-tuerkis:#2FA08C}',
      (c) => (pruefeAkzent(tokensLesen(c), 'gold')?.lauter ?? []).length > 0],
    ['Kein zweiter Akzent',
      ':root{--color-gold:#BE9A52;--color-teal:#4E8F80}',
      (c) => (pruefeAkzent(tokensLesen(c), 'gold')?.lauter ?? []).length === 0],
    ['Dunkle Grundfarbe ist kein Akzent',
      ':root{--color-gold:#BE9A52;--color-deep:#0F2E2A}',
      (c) => (pruefeAkzent(tokensLesen(c), 'gold')?.lauter ?? []).length === 0],
  ];

  let alleGut = true;
  for (const [name, css, pruefung] of faelle) {
    const gut = pruefung(css);
    console.log(`  ${gut ? 'richtig   ' : 'FALSCH    '} ${name}`);
    if (!gut) alleGut = false;
  }
  console.log(
    alleGut
      ? '\nAlle Prüfungen verhalten sich wie erwartet.\n'
      : '\nMindestens eine Prüfung verhält sich falsch.\n',
  );
  process.exit(alleGut ? 0 : 1);
}

/* ------------------------------------------------------------------ */
/* Lauf                                                                */
/* ------------------------------------------------------------------ */

/* --akzent nimmt einen Wert. Ohne diese Unterscheidung landet der Wert in der
   Liste der Pfade und das Werkzeug sucht eine Datei namens "gold". */
const roh = process.argv.slice(2);
const argumente = [];
let akzentWort = null;
for (let i = 0; i < roh.length; i++) {
  if (roh[i] === '--akzent') {
    akzentWort = roh[++i] ?? null;
  } else if (!roh[i].startsWith('--')) {
    argumente.push(roh[i]);
  }
}

if (argumente.length === 0) {
  console.error(
    'Aufruf: node werkzeuge/farbwort-pruefen.mjs <datei-oder-ordner> [--akzent gold]\n' +
      '        node werkzeuge/farbwort-pruefen.mjs --selbsttest',
  );
  process.exit(2);
}

const dateien = argumente.flatMap(dateienSammeln);
const css = stilLesen(dateien);
const tokens = tokensLesen(css);

console.log(`\n${dateien.length} Datei(en) gelesen, ${tokens.size} Farbtoken gefunden.\n`);

const befunde = [];

const namen = pruefeNamen(tokens);
if (namen.befunde.length > 0) {
  befunde.push(['Ein Farbtoken misst nicht, was sein Name behauptet', namen.befunde]);
} else {
  console.log(`  bestanden   Farbtoken messen, was ihr Name behauptet (${namen.geprueft} geprüft)`);
}

const verlaeufe = pruefeVerlaeufe(css, tokens);
if (verlaeufe.befunde.length > 0) {
  befunde.push(['Text auf einem Verlauf hält nicht an jeder Stufe', verlaeufe.befunde]);
} else {
  console.log(`  bestanden   Text auf Verläufen hält an jeder Stufe (${verlaeufe.flaechen} Fläche(n))`);
}

const akzent = pruefeAkzent(tokens, akzentWort);
if (akzent?.fehlt) {
  console.log(`  Hinweis     Kein Token gefunden, das "${akzentWort}" enthält.`);
} else if (akzent && akzent.lauter.length > 0) {
  befunde.push([
    'Ein anderes Token ist auffälliger als die Akzentfarbe',
    [
      `Akzent: ${akzent.akzent}`,
      ...akzent.lauter.map((l) => `lauter: ${l}`),
      'Wenn eine zweite Farbe auffälliger ist als die Akzentfarbe, ist sie der',
      'Akzent, unabhängig davon, wie das Token heißt. Die Zahl in Klammern ist',
      'die Sättigung, gewichtet mit dem Abstand zur mittleren Helligkeit.',
    ],
  ]);
} else if (akzent) {
  console.log(`  bestanden   ${akzent.akzent} ist die auffälligste Farbe`);
}

if (befunde.length === 0) {
  console.log('\nKeine Befunde.\n');
  process.exit(0);
}

console.log('');
for (const [titel, zeilen] of befunde) {
  console.log(`  BEFUND      ${titel}`);
  for (const z of zeilen) console.log(`    ${z}`);
  console.log('');
}
console.log(
  `${befunde.length} Befund(e). Begründung in 02_BRANDING/05-farbe-und-material.md.\n`,
);
process.exit(1);
