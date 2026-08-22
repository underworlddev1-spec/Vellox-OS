// Der Bildvertrag.
//
// Vier Behauptungen:
//
//   1. Jede Quelle mit `sizes` hat mindestens zwei Kandidaten mit
//      w-Deskriptor. Ein `sizes` an einer einzigen URL verspricht dem Browser
//      eine Wahl, die es nicht gibt.
//   2. Trägt ein Dateiname eine Zahl, ist das ihre tatsächliche Breite.
//   3. Jeder w-Deskriptor nennt die echte Breite der Datei, die er auszeichnet.
//   4. Kein Bild wird bei einfacher Pixeldichte hochgerechnet, gerechnet mit
//      Beschnitt: Ein hoher Rahmen über einer flachen Quelle skaliert nach der
//      Höhe und nicht nach der Breite.
//
// `naturalWidth` am gerenderten Bild taugt als Messgrösse nicht: Der Browser
// rechnet bei w-Deskriptoren die Dichte heraus und meldet für eine 1376x768
// grosse Datei bei 2560 px glatte 1920x1071. Die echten Masse werden deshalb
// über ein eigenes Image-Objekt gelesen.
//
// Je Breite ein frischer Kontext. Der Browser wählt aus einem `srcset` auch
// nach dem, was schon im Zwischenspeicher liegt; mit einer geteilten Sitzung
// war dieselbe Messung einmal grün und einmal rot.
import { konfig, adresse, browserStarten, kontextOeffnen, melden } from '../lib/pruefstand.mjs';

const browser = await browserStarten();
const befunde = [];
const masse = new Map();

// Echte Dateimasse einmal lesen und merken.
const { ctx: mctx, p: mp } = await kontextOeffnen(browser, { breite: 1280 });
await mp.goto(adresse(konfig.routen[0]));

async function mass(url) {
  if (masse.has(url)) return masse.get(url);
  const m = await mp.evaluate(async (u) => {
    const i = new Image();
    i.src = u;
    try { await i.decode(); return [i.naturalWidth, i.naturalHeight]; } catch { return null; }
  }, url);
  masse.set(url, m);
  return m;
}

// --- 1., 2. und 3.: der Vertrag im Markup ----------------------------------
for (const route of konfig.routen) {
  await mp.goto(adresse(route));
  await mp.waitForTimeout(120);
  const quellen = await mp.evaluate(() =>
    [...document.querySelectorAll('source[srcset], img[srcset]')].map((el) => ({
      tag: el.tagName.toLowerCase(),
      sizes: el.getAttribute('sizes'),
      kandidaten: (el.getAttribute('srcset') || '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => {
          const t = x.split(/\s+/);
          return { url: new URL(t[0], location.href).href, deskriptor: t[1] || null };
        }),
    }))
  );

  for (const q of quellen) {
    const mitW = q.kandidaten.filter((k) => /^\d+w$/.test(k.deskriptor || ''));
    if (q.sizes && mitW.length < 2) {
      befunde.push(
        `1) ${route}: ${q.tag} mit sizes="${q.sizes}" hat ${mitW.length} von ${q.kandidaten.length} ` +
          `Kandidaten mit w-Deskriptor`
      );
    }
    for (const k of q.kandidaten) {
      const datei = k.url.split('/').pop().split('?')[0];
      const echt = await mass(k.url);
      if (!echt) { befunde.push(`2) ${route}: ${datei} lässt sich nicht dekodieren`); continue; }
      const imNamen = datei.match(/-(\d+)\.(webp|jpe?g|png|avif)$/i);
      if (imNamen && Number(imNamen[1]) !== echt[0]) {
        befunde.push(`2) ${datei} heisst -${imNamen[1]}, misst aber ${echt[0]}x${echt[1]} px`);
      }
      if (k.deskriptor && /^\d+w$/.test(k.deskriptor)) {
        const behauptet = Number(k.deskriptor.slice(0, -1));
        if (behauptet !== echt[0]) {
          befunde.push(`3) ${route}: ${datei} ist als ${behauptet}w ausgezeichnet, misst aber ${echt[0]} px`);
        }
      }
    }
  }
}

// --- 4.: keine Hochrechnung bei einfacher Dichte ---------------------------
for (const breite of konfig.breiten.desktop) {
  const { ctx, p } = await kontextOeffnen(browser, { breite });
  for (const route of konfig.routen) {
    await p.goto(adresse(route));
    await p.waitForTimeout(200);
    // Alles anstossen, was verzoegert laedt: Ein Bild unterhalb des Falzes
    // waehlt seine Datei erst, wenn es an die Reihe kommt.
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 30));
      }
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(300);
    const bilder = await p.evaluate(() =>
      [...document.querySelectorAll('img')]
        .map((el) => {
          const r = el.getBoundingClientRect();
          return {
            url: el.currentSrc || el.src,
            breite: r.width,
            hoehe: r.height,
            passung: getComputedStyle(el).objectFit,
          };
        })
        .filter((b) => b.breite >= 40 && b.hoehe >= 40 && b.url)
    );
    for (const b of bilder) {
      const echt = await mass(b.url);
      if (!echt || !echt[0]) continue;
      const faktor =
        b.passung === 'cover'
          ? Math.max(b.breite / echt[0], b.hoehe / echt[1])
          : b.breite / echt[0];
      if (faktor > 1.005) {
        befunde.push(
          `4) ${route} @${breite}px: ${b.url.split('/').pop()} (${echt[0]}x${echt[1]}) in ` +
            `${Math.round(b.breite)}x${Math.round(b.hoehe)} px hochgerechnet, Faktor ${faktor.toFixed(3)}`
        );
      }
    }
  }
  await ctx.close();
}

await mctx.close();
await browser.close();
melden(
  befunde,
  `Bilder: vier Behauptungen halten. ${masse.size} Dateien, ${konfig.routen.length} Routen x ` +
    `${konfig.breiten.desktop.length} Breiten.`
);
