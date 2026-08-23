// Semantik, Landmarken und Beschriftungen.
//
// Fünf Behauptungen. Sie überschneiden sich absichtlich nicht mit axe-core,
// sondern schliessen Lücken, die dort als Best Practice oder gar nicht geprüft
// werden:
//
//   1. Jede Route setzt `lang` am Dokument.
//   2. Jede Route hat genau eine sichtbare h1.
//   3. Jede Route hat eine `main`-Landmarke.
//   4. Die Überschriftenränge überspringen keine Stufe.
//   5. Jedes Bedienelement hat einen zugänglichen Namen.
//
// Behauptung 4 ist die, die im Alltag am häufigsten bricht, und zwar leise:
// Eine h4 unter einer h2 sieht richtig aus, solange die Schriftgrade passen.
// Für ein Vorlesewerkzeug ist sie eine Ebene, die es nicht gibt.
import { konfig, adresse, browserStarten, kontextOeffnen, melden } from '../lib/pruefstand.mjs';

const browser = await browserStarten();
const { ctx, p } = await kontextOeffnen(browser, { breite: 1280 });
const befunde = [];

for (const route of konfig.routen) {
  await p.goto(adresse(route));
  await p.waitForTimeout(150);
  const fund = await p.evaluate(() => {
    const sichtbare = (s) => [...document.querySelectorAll(s)].filter((el) => window.vx.sichtbar(el));

    const raenge = sichtbare('h1, h2, h3, h4, h5, h6').map((el) => Number(el.tagName[1]));
    const spruenge = [];
    for (let i = 1; i < raenge.length; i++) {
      if (raenge[i] > raenge[i - 1] + 1) spruenge.push(`h${raenge[i - 1]} auf h${raenge[i]}`);
    }

    const name = (el) => {
      const beschriftet =
        el.getAttribute('aria-label') ||
        (el.getAttribute('aria-labelledby') &&
          [...document.querySelectorAll('#' + el.getAttribute('aria-labelledby').split(/\s+/).join(', #'))]
            .map((n) => n.textContent)
            .join(' ')) ||
        (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)?.textContent) ||
        el.closest('label')?.textContent ||
        el.getAttribute('title') ||
        el.getAttribute('placeholder') ||
        (el.tagName === 'BUTTON' || el.tagName === 'A' ? el.textContent : '');
      return (beschriftet || '').replace(/\s+/g, ' ').trim();
    };
    const ohneNamen = sichtbare('input, select, textarea, button, a[href]')
      .filter((el) => el.type !== 'hidden')
      .filter((el) => !name(el))
      .map((el) => el.tagName.toLowerCase() + (el.name ? `[name=${el.name}]` : '') + (el.id ? '#' + el.id : ''));

    return {
      sprache: document.documentElement.getAttribute('lang') || '',
      h1: sichtbare('h1').length,
      main: sichtbare('main').length,
      spruenge,
      ohneNamen: ohneNamen.slice(0, 6),
      ohneNamenGesamt: ohneNamen.length,
    };
  });

  if (!fund.sprache) befunde.push(`1) ${route}: kein lang-Attribut am Dokument`);
  if (fund.h1 !== 1) befunde.push(`2) ${route}: ${fund.h1} sichtbare h1 statt genau einer`);
  if (fund.main < 1) befunde.push(`3) ${route}: keine main-Landmarke`);
  for (const s of fund.spruenge) befunde.push(`4) ${route}: Rangsprung ${s}`);
  if (fund.ohneNamenGesamt) {
    befunde.push(
      `5) ${route}: ${fund.ohneNamenGesamt} ${fund.ohneNamenGesamt === 1 ? "Bedienelement" : "Bedienelemente"} ohne zugänglichen Namen: ${fund.ohneNamen.join(', ')}`
    );
  }
}

await ctx.close();
await browser.close();
melden(befunde, `Semantik: Sprache, eine h1, main-Landmarke, keine Rangsprünge, alle Bedienelemente benannt. ${konfig.routen.length} Routen.`);
