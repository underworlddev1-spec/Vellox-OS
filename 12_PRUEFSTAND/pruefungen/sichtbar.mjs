// Verbotene Begriffe im sichtbaren Text.
//
// Eine Behauptung: Auf keiner Route steht ein Begriff aus der Verbotsliste im
// sichtbaren Text.
//
// Die Liste trägt zwei Arten von Einträgen. Arbeitsspuren wie „Lorem ipsum“ oder
// „TODO“ sind Unfälle. Der Gedankenstrich als Satzzeichen ist eine Regel des
// Anti-Template-Standards, und er steht hier, weil genau diese Regel sich ohne
// Prüfung nicht gehalten hat: Im Wissensrepository selbst standen vier davon,
// drei im jüngsten Kapitel.
//
// Gemessen wird `innerText` des Bodys und nicht der Quelltext. Ein Begriff in
// einem Kommentar oder in einem Attribut ist kein sichtbarer Text; ein Begriff,
// den ein Skript einsetzt, dagegen schon.
import { konfig, adresse, browserStarten, kontextOeffnen, melden } from '../lib/pruefstand.mjs';

const browser = await browserStarten();
const { ctx, p } = await kontextOeffnen(browser, { breite: 1440 });
const befunde = [];

for (const route of konfig.routen) {
  await p.goto(adresse(route));
  await p.waitForTimeout(120);
  const text = await p.evaluate(() => document.body.innerText);
  for (const begriff of konfig.verboteneBegriffe) {
    if (!text.includes(begriff)) continue;
    const stelle = text.indexOf(begriff);
    const umfeld = text.slice(Math.max(0, stelle - 40), stelle + begriff.length + 40).replace(/\s+/g, ' ');
    befunde.push(`${route}: „${begriff}“ im sichtbaren Text. Umfeld: …${umfeld}…`);
  }
}

await ctx.close();
await browser.close();
melden(
  befunde,
  `Sichtbarer Text: keiner der ${konfig.verboteneBegriffe.length} verbotenen Begriffe kommt vor, ${konfig.routen.length} Routen.`
);
