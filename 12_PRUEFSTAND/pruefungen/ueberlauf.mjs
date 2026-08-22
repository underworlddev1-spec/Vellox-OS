// Waagerechter Überlauf.
//
// Eine Behauptung: Auf keiner Route und keiner Telefonbreite ist das Dokument
// breiter als das Fenster.
//
// Zusätzlich wird das schuldige Element benannt. Die Meldung „irgendwo läuft
// etwas über“ kostet mehr Zeit, als die Prüfung spart.
import { konfig, adresse, browserStarten, kontextOeffnen, melden } from '../lib/pruefstand.mjs';

const browser = await browserStarten();
const befunde = [];
const breiten = [...konfig.breiten.telefon, ...konfig.breiten.zwischen];

for (const breite of breiten) {
  const { ctx, p } = await kontextOeffnen(browser, { breite, telefon: breite < 600 });
  for (const route of konfig.routen) {
    await p.goto(adresse(route));
    await p.waitForTimeout(120);
    const fund = await p.evaluate(() => {
      const w = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth <= w + 1) return null;
      // Das schuldige Element ist das äußerste, das über die rechte Kante
      // hinausragt. Ein Kind, das mit seinem Elternteil hinausragt, ist eine
      // Folge und keine Ursache.
      let schuld = null;
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.right <= w + 1 || r.width === 0) continue;
        if (!schuld || el.contains(schuld)) schuld = el;
      }
      const beschreiben = (el) =>
        el ? el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).join('.') : '') : 'unbekannt';
      return {
        dokument: document.documentElement.scrollWidth,
        fenster: w,
        schuld: beschreiben(schuld),
        rechts: schuld ? Math.round(schuld.getBoundingClientRect().right) : null,
      };
    });
    if (fund) {
      befunde.push(
        `${route} @${breite}px: Dokument ${fund.dokument}px gegen Fenster ${fund.fenster}px. ` +
          `Äußerstes überstehendes Element: ${fund.schuld} (rechte Kante ${fund.rechts}px)`
      );
    }
  }
  await ctx.close();
}

await browser.close();
melden(befunde, `Kein waagerechter Überlauf, ${konfig.routen.length} Routen x ${breiten.length} Breiten.`);
