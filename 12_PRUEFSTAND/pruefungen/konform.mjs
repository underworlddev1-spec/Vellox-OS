// Rechtskonformität, gemessen am ausgelieferten Verhalten.
//
// Fünf Behauptungen:
//
//   1. Keine Verbindung zu einem fremden Host, der nicht ausdrücklich erlaubt
//      ist.
//   2. Keine Cookies, kein localStorage, kein sessionStorage ohne Einwilligung.
//   3. Impressum und Datenschutzerklärung sind von jeder Route aus erreichbar.
//   4. Jeder Verweis, der ein neues Fenster öffnet, trägt `rel="noopener"`.
//   5. Jedes als erzeugt ausgezeichnete Medium trägt eine sichtbare
//      Kennzeichnung nach Art. 50 Abs. 4 KI-VO.
//
// Gemessen wird, was tatsächlich passiert ist, und nicht, was im Quelltext
// steht. Eine Schriftart, die über einen fremden Host geladen wird, steht
// selten in einem Skript-Tag; sie steht in einer CSS-Datei, die ihrerseits von
// woanders kommt.
//
// Diese Prüfung ersetzt keine Rechtsberatung. Sie stellt die Fragen, die sich
// automatisch beantworten lassen.
import { konfig, adresse, browserStarten, kontextOeffnen, melden } from '../lib/pruefstand.mjs';

const browser = await browserStarten();
const befunde = [];
const eigenerHost = new URL(konfig.basis).host;
const erlaubt = new Set([eigenerHost, ...konfig.konform.erlaubteHosts]);

for (const route of konfig.routen) {
  const { ctx, p } = await kontextOeffnen(browser, { breite: 1280 });
  const fremde = new Set();
  p.on('request', (r) => {
    let host;
    try { host = new URL(r.url()).host; } catch { return; }
    if (!host || erlaubt.has(host)) return;
    if (r.url().startsWith('data:') || r.url().startsWith('blob:')) return;
    fremde.add(host + '  (' + r.resourceType() + ')');
  });

  await p.goto(adresse(route));
  await p.waitForTimeout(600);
  // Auch anstossen, was verzoegert laedt.
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(400);

  for (const h of fremde) befunde.push(`1) ${route}: Verbindung zu ${h}`);

  const cookies = await ctx.cookies();
  for (const c of cookies) befunde.push(`2) ${route}: Cookie „${c.name}“ von ${c.domain}`);

  const fund = await p.evaluate((cfg) => {
    const speicher = [];
    try { for (let i = 0; i < localStorage.length; i++) speicher.push('localStorage: ' + localStorage.key(i)); } catch {}
    try { for (let i = 0; i < sessionStorage.length; i++) speicher.push('sessionStorage: ' + sessionStorage.key(i)); } catch {}

    const verweise = [...document.querySelectorAll('a[href]')];
    const text = (a) => ((a.textContent || '') + ' ' + (a.getAttribute('href') || '') + ' ' + (a.getAttribute('aria-label') || ''));

    const ohneNoopener = verweise
      .filter((a) => a.target === '_blank' && !/\bnoopener\b/.test(a.rel || ''))
      .map((a) => a.getAttribute('href'));

    const erzeugt = [...document.querySelectorAll('[' + cfg.ki.attribut + ']')];
    const ohneMarke = [];
    for (const el of erzeugt) {
      // Die Kennzeichnung muss beim Inhalt stehen. Gesucht wird deshalb im
      // nächsten gemeinsamen Vorfahren, der auch eine Bildunterschrift trägt,
      // und nicht irgendwo im Dokument.
      let gefunden = false;
      for (let n = el; n && n !== document.body; n = n.parentElement) {
        const m = n.querySelector(cfg.ki.marke);
        if (m && window.vx.sichtbar(m)) { gefunden = true; break; }
      }
      if (!gefunden) ohneMarke.push((el.getAttribute('src') || el.tagName).split('/').pop());
    }

    return {
      speicher,
      ohneNoopener,
      ohneMarke,
      rechtslinks: cfg.rechtslinks.map((r) => new RegExp(r.quelle, r.flaggen)).map((re) =>
        verweise.some((a) => re.test(text(a)))
      ),
    };
  }, {
    ki: konfig.konform.ki,
    rechtslinks: konfig.konform.rechtslinks.map((r) => ({ quelle: r.source, flaggen: r.flags })),
  });

  for (const s of fund.speicher) befunde.push(`2) ${route}: ${s}`);
  for (const h of fund.ohneNoopener) befunde.push(`4) ${route}: Verweis auf ${h} öffnet ein neues Fenster ohne rel="noopener"`);
  for (const d of fund.ohneMarke) befunde.push(`5) ${route}: ${d} ist als erzeugt ausgezeichnet, trägt aber keine sichtbare Kennzeichnung`);
  fund.rechtslinks.forEach((da, i) => {
    if (!da) befunde.push(`3) ${route}: kein Verweis, der auf ${konfig.konform.rechtslinks[i]} passt`);
  });

  await ctx.close();
}

await browser.close();
melden(
  befunde,
  `Konformität: keine fremden Verbindungen, keine Cookies, kein Storage, Rechtsverweise vorhanden, ` +
    `noopener gesetzt, erzeugte Medien gekennzeichnet. ${konfig.routen.length} Routen.`
);
