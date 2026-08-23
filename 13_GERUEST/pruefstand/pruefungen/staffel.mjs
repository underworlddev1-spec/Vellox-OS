// Die typografische Staffel.
//
// Drei Behauptungen:
//
//   1. Kein Rang steht unter seinem Untergeordneten. Eine h3 ist nie grösser
//      als die h2 desselben Dokuments.
//   2. Kein Grad trägt zwei Ränge. Wenn h2 und h3 auf derselben Seite denselben
//      Schriftgrad haben, ist die Gliederung für den Leser keine.
//   3. Kein Grössentoken ohne Verbraucher. Eine Skala mit einer Stufe, die
//      niemand verwendet, ist keine Skala, sondern eine Wunschliste.
//
// Behauptung 1 und 2 werden gerendert gemessen, weil ein Grad aus einem
// `clamp()` kommen kann und dann von der Fensterbreite abhängt. Behauptung 3
// liest den Quelltext.
//
// Gemessen werden nur sichtbare Überschriften. Eine Überschrift, die nur für
// Screenreader existiert, hat keinen Grad, den ein Auge vergleichen könnte.
import { readFileSync } from 'node:fs';
import { konfig, projektpfad, adresse, browserStarten, kontextOeffnen, melden } from '../lib/pruefstand.mjs';

const befunde = [];
const breiten = [konfig.breiten.telefon[1] ?? 360, 768, 1280, konfig.breiten.desktop.at(-1) ?? 1920];

const browser = await browserStarten();
for (const breite of breiten) {
  const { ctx, p } = await kontextOeffnen(browser, { breite, telefon: breite < 600 });
  for (const route of konfig.routen) {
    await p.goto(adresse(route));
    await p.waitForTimeout(120);
    const grade = await p.evaluate(() => {
      const nach = {};
      for (const stufe of ['h1', 'h2', 'h3', 'h4']) {
        for (const el of document.querySelectorAll(stufe)) {
          if (!window.vx.sichtbar(el)) continue;
          const g = Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10;
          (nach[stufe] ??= new Set()).add(g);
        }
      }
      return Object.fromEntries(Object.entries(nach).map(([k, v]) => [k, [...v]]));
    });

    const stufen = ['h1', 'h2', 'h3', 'h4'].filter((s) => grade[s]?.length);
    for (let i = 0; i < stufen.length - 1; i++) {
      const oben = Math.min(...grade[stufen[i]]);
      const unten = Math.max(...grade[stufen[i + 1]]);
      if (unten > oben) {
        befunde.push(
          `1) ${route} @${breite}px: ${stufens(stufen[i + 1])} misst ${unten}px und ist damit grösser ` +
            `als ${stufens(stufen[i])} mit ${oben}px`
        );
      }
      if (unten === oben) {
        befunde.push(
          `2) ${route} @${breite}px: ${stufens(stufen[i])} und ${stufens(stufen[i + 1])} tragen ` +
            `denselben Grad (${oben}px)`
        );
      }
    }
  }
  await ctx.close();
}
await browser.close();

function stufens(s) { return s.toUpperCase(); }

// --- 3. Tokens ohne Verbraucher --------------------------------------------
let stufenZahl = 0;
if (konfig.stylesheet) {
  const css = readFileSync(projektpfad(konfig.stylesheet), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  const praefix = konfig.groessentoken;
  const definiert = [...new Set(
    [...css.matchAll(/(?:^|[;{])\s*(--[a-z0-9-]+)\s*:/gim)].map((x) => x[1]).filter((n) => n.startsWith(praefix))
  )];
  const benutzt = new Set([...css.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((x) => x[1]));
  stufenZahl = definiert.length;
  for (const t of definiert) {
    if (!benutzt.has(t)) befunde.push(`3) Grössentoken ohne Verbraucher: ${t}`);
  }
}

melden(
  befunde,
  `Staffel: drei Behauptungen halten. ${konfig.routen.length} Routen x ${breiten.length} Breiten, ` +
    `${stufenZahl} Grössentoken, alle mit Verbraucher.`
);
