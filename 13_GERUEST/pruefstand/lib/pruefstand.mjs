// Gemeinsame Grundlage aller Prüfungen.
//
// Zwei Dinge stehen hier und nicht in den einzelnen Prüfungen, weil sie sonst
// zwölfmal leicht verschieden wären: das Starten des Browsers und das Melden
// eines Ergebnisses.
//
// Jeder Pfad wird aus `import.meta.url` aufgelöst und nie aus dem
// Arbeitsverzeichnis. Eine Prüfung, die nur aus einem bestimmten Ordner heraus
// läuft, wird irgendwann aus einem anderen gestartet und meldet dann einen
// Fehler, der keiner ist.
import { chromium } from 'playwright';

// Die Konfiguration liegt neben dem Kit. `PRUEFSTAND_KONFIG` erlaubt eine
// andere Datei, etwa fuer einen zweiten Prueflauf gegen eine Preview oder fuer
// die Gegenprobe eines Gates gegen ein fremdes Projekt.
const konfigZiel = process.env.PRUEFSTAND_KONFIG
  ? new URL('file://' + process.env.PRUEFSTAND_KONFIG).href
  : new URL('../pruefstand.config.mjs', import.meta.url).href;
export const konfig = (await import(konfigZiel)).default;

export const wurzel = new URL('../../', import.meta.url).pathname;

export function adresse(route) {
  return konfig.basis.replace(/\/$/, '') + route;
}

// Ein Pfad aus der Konfiguration, aufgeloest gegen die Projektwurzel. Ein
// absoluter Pfad bleibt, wie er ist; das erlaubt einen Prueflauf gegen ein
// Projekt, das woanders liegt, etwa fuer die Gegenprobe eines Gates.
export function projektpfad(rel) {
  return rel.startsWith('/') ? rel : wurzel + rel;
}

// Der Browser. `PRUEFSTAND_BROWSER` erlaubt einen expliziten Pfad, sonst
// entscheidet Playwright. Reduzierte Bewegung ist die Grundeinstellung: Ohne
// sie messen Prüfungen Elemente, die noch in einer Einblendung stehen, und
// melden Nullwerte, die wie ein Layoutfehler aussehen.
export async function browserStarten() {
  const pfad = process.env.PRUEFSTAND_BROWSER;
  return chromium.launch(pfad ? { executablePath: pfad } : {});
}

export async function kontextOeffnen(browser, {
  breite = 1440,
  hoehe = 900,
  telefon = false,
  javascript = true,
} = {}) {
  const ctx = await browser.newContext({
    viewport: { width: breite, height: hoehe },
    deviceScaleFactor: telefon ? 2 : 1,
    isMobile: telefon,
    hasTouch: telefon,
    locale: 'de-DE',
    reducedMotion: 'reduce',
    javaScriptEnabled: javascript,
  });
  const p = await ctx.newPage();
  await p.addInitScript({ content: HELFER });
  await einspritzen(ctx);
  return { ctx, p };
}

// Gegenproben-Kanal.
//
// `PRUEFSTAND_EINSPRITZUNG` (CSS) und `PRUEFSTAND_EINSPRITZUNG_JS` bauen einen
// Fehler in die ausgelieferte Seite ein, ohne das Projekt anzufassen. Damit
// weist eine Gegenprobe nach, dass eine Behauptung wirklich rot wird.
//
// Eingesetzt wird in der Antwort und nicht ueber `addStyleTag`. Der Unterschied
// zaehlt bei genau einer Pruefung, und ausgerechnet die braucht ihn: Ohne
// JavaScript laesst sich nichts einfuegen, was JavaScript einfuegen muesste.
async function einspritzen(ctx) {
  const css = process.env.PRUEFSTAND_EINSPRITZUNG;
  const js = process.env.PRUEFSTAND_EINSPRITZUNG_JS;
  if (!css && !js) return;
  await ctx.route('**/*', async (route) => {
    const antwort = await route.fetch();
    const typ = (antwort.headers()['content-type'] || '');
    if (!typ.includes('text/html')) return route.fulfill({ response: antwort });
    let koerper = await antwort.text();
    const zusatz =
      (css ? `<style data-gegenprobe>${css}</style>` : '') +
      (js ? `<script data-gegenprobe>${js}<\/script>` : '');
    koerper = koerper.includes('</body>')
      ? koerper.replace('</body>', zusatz + '</body>')
      : koerper + zusatz;
    return route.fulfill({ response: antwort, body: koerper });
  });
}

// Ein Ergebnis, ein Rückgabewert. Eine Prüfung, die ihren Befund ausgibt und
// mit null endet, läuft jahrelang mit, ohne etwas zu verhindern.
export function melden(befunde, erfolgstext) {
  const einmalig = [...new Set(befunde)];
  if (einmalig.length) {
    console.log(`BEFUNDE (${einmalig.length}):\n - ` + einmalig.join('\n - '));
    process.exit(1);
  }
  console.log(erfolgstext);
  process.exit(0);
}

// Helfer im Browser. Sie werden über `addInitScript` bei jeder Navigation neu
// gesetzt und stehen den Prüfungen als `window.vx` zur Verfügung.
//
// Der wichtigste ist `tinte`. Ein Element hat zwei Geometrien: den Kasten, den
// das Layout ihm zuweist, und die Schrift, die ein Mensch sieht. Ein
// gestrecktes Rasterkind reicht bis zur Unterkante seiner Zeile, während sein
// Text oben klebt; wer den Kasten misst, prüft das Rastermodell und nicht die
// Seite. Textknoten und ersetzte Elemente liefern ihre echten Rechtecke, alles
// andere wird übersprungen.
const HELFER = `
window.vx = {
  sichtbar(el) {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || s.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  },

  tinte(wurzel) {
    let links = Infinity, rechts = -Infinity, oben = Infinity, unten = -Infinity, gefunden = 0;
    const lauf = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let k;
    while ((k = lauf.nextNode())) {
      let r = null;
      if (k.nodeType === 3) {
        if (!/\\S/.test(k.textContent)) continue;
        const el = k.parentElement;
        if (!el || !window.vx.sichtbar(el)) continue;
        const g = document.createRange();
        g.selectNodeContents(k);
        r = g.getBoundingClientRect();
      } else if (/^(IMG|VIDEO|CANVAS|SVG|HR|INPUT|SELECT|TEXTAREA|BUTTON)$/i.test(k.tagName)) {
        if (!window.vx.sichtbar(k)) continue;
        r = k.getBoundingClientRect();
      } else continue;
      if (!r || r.width < 1 || r.height < 1) continue;
      gefunden++;
      links = Math.min(links, r.left);
      rechts = Math.max(rechts, r.right);
      oben = Math.min(oben, r.top);
      unten = Math.max(unten, r.bottom);
    }
    return gefunden ? { links, rechts, oben, unten, breite: rechts - links, hoehe: unten - oben } : null;
  },

  // Bedienelemente zaehlen als Tinte, obwohl sie keinen Textknoten tragen.
  // Ohne sie misst ein Formularabschnitt nur seine Beschriftungen: Gemessen
  // hielt das Gate einen Abschnitt fuer 99 px aus der Mitte geschoben, waehrend
  // die Felder darunter die Spalte sichtbar fuellten. Ein gerendertes Feld ist
  // sichtbare Masse, auch wenn eine Textbereichsmessung sie nicht sieht.

  // Zeilen werden über Textknoten gezählt und nicht über Elemente. Seit Zeilen
  // auch als Blockelemente gesetzt werden, liefert ein Element je Zeile zwei
  // Rechtecke, und ein dreizeiliger Satz wird als sechszeilig gemeldet.
  zeilen(el) {
    const kanten = [];
    const lauf = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let k;
    while ((k = lauf.nextNode())) {
      if (!/\\S/.test(k.textContent)) continue;
      const g = document.createRange();
      g.selectNodeContents(k);
      for (const r of g.getClientRects()) if (r.width > 0 && r.height > 0) kanten.push(Math.round(r.top));
    }
    return new Set(kanten).size;
  },

  // Die tatsächliche Hintergrundfarbe hinter einem Element: die Elternkette
  // hinauf, bis eine deckende Fläche gefunden ist.
  hintergrund(el) {
    const misch = (v, h) => {
      const a = v[3];
      if (a >= 0.999) return v;
      return [0,1,2].map((i) => v[i] * a + h[i] * (1 - a)).concat(1);
    };
    const lies = (s) => {
      const m = s.match(/rgba?\\(([^)]+)\\)/);
      if (!m) return null;
      const t = m[1].split(/[,\\s\\/]+/).filter(Boolean).map(Number);
      return [t[0], t[1], t[2], t.length > 3 ? t[3] : 1];
    };
    let stapel = [];
    for (let n = el; n; n = n.parentElement) {
      const f = lies(getComputedStyle(n).backgroundColor);
      if (!f || f[3] === 0) continue;
      stapel.push(f);
      if (f[3] >= 0.999) break;
    }
    let unten = stapel.pop() || [255, 255, 255, 1];
    while (stapel.length) unten = misch(stapel.pop(), unten);
    return unten;
  },

  helligkeit(v) {
    const k = v.slice(0, 3).map((x) => {
      const c = x / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * k[0] + 0.7152 * k[1] + 0.0722 * k[2];
  },

  kontrast(a, b) {
    const l1 = window.vx.helligkeit(a), l2 = window.vx.helligkeit(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  },
};
`;
