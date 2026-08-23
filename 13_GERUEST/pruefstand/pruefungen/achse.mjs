// Achse, Spaltennutzung und Polsterung.
//
// Drei Behauptungen:
//
//   1. Die Mitte der gesetzten Tinte eines Abschnitts liegt höchstens fünf
//      Prozent der Fensterbreite neben der Fenstermitte.
//   2. Ein Block mit eigener Fläche oder Kante, der Text trägt, nutzt auf dem
//      Telefon mindestens neunzig Prozent seiner Spalte.
//   3. Ein solcher Block polstert auf allen vier Seiten oder auf keiner.
//
// Behauptung 1 fängt den Fehler, bei dem ein schmaler Block in einer breiten
// Bahn an deren linker Kante klebt. Der Versatz ist absolut konstant und fällt
// prozentual sogar, je breiter das Fenster wird: gemessen 12,5 Prozent bei
// 1024 px, 15,0 bei 1280, 10,4 bei 1853. Er ist deshalb ausdrücklich kein
// Problem grosser Schirme und war auf jedem Desktop da, seit es die Spalte gab.
//
// Behauptung 2 ist aus einem Fehler entstanden, bei dem zweiundzwanzig
// Prüfungen grün waren und alle dasselbe bestätigten: Ein Adressschild stand
// schön in der Mitte. Nur eben zu schmal, sodass der Name des Hauses mitten
// durchbrach. Kein Überlauf, keine Zwangsspalte, kein Achsversatz. Abdeckung
// ist nicht die Zahl der Prüfungen, sondern die Zahl der unabhängigen Fragen.
//
// Gemessen wird die Tinte und nicht der Kasten. Ein Rasterkind ohne eigene
// Ausrichtung wird gestreckt und reicht bis zur Unterkante seiner Zeile,
// während sein Text oben klebt.
import { konfig, adresse, browserStarten, kontextOeffnen, melden } from '../lib/pruefstand.mjs';

const ABWEICHUNG = 0.05;
const SPALTENNUTZUNG = 0.9;
const MINDESTZEICHEN = 24;

const browser = await browserStarten();
const befunde = [];

// --- 1. Achse --------------------------------------------------------------
for (const breite of konfig.breiten.desktop) {
  const { ctx, p } = await kontextOeffnen(browser, { breite });
  for (const route of konfig.routen) {
    await p.goto(adresse(route));
    await p.waitForTimeout(140);
    for (const fund of await p.evaluate((grenze) => {
      const out = [];
      const mitte = window.innerWidth / 2;
      for (const abschnitt of document.querySelectorAll('main > *')) {
        if (!window.vx.sichtbar(abschnitt)) continue;
        const t = window.vx.tinte(abschnitt);
        if (!t || t.breite < 40) continue;
        const versatz = (t.links + t.rechts) / 2 - mitte;
        if (Math.abs(versatz) > window.innerWidth * grenze) {
          out.push({
            was: abschnitt.id || abschnitt.className || abschnitt.tagName.toLowerCase(),
            versatz: Math.round(versatz),
            anteil: Math.round((Math.abs(versatz) / window.innerWidth) * 1000) / 10,
          });
        }
      }
      return out;
    }, ABWEICHUNG)) {
      befunde.push(
        `1) ${route} @${breite}px: Abschnitt „${fund.was}“ steht ${fund.versatz}px neben der ` +
          `Fenstermitte (${fund.anteil} Prozent der Fensterbreite, erlaubt ${ABWEICHUNG * 100})`
      );
    }
  }
  await ctx.close();
}

// --- 2. und 3. Schilder auf dem Telefon ------------------------------------
for (const breite of konfig.breiten.telefon) {
  const { ctx, p } = await kontextOeffnen(browser, { breite, telefon: true });
  for (const route of konfig.routen) {
    await p.goto(adresse(route));
    await p.waitForTimeout(140);
    const funde = await p.evaluate(({ nutzung, zeichen }) => {
      const out = [];
      const beschreiben = (el) =>
        el.id ? '#' + el.id : (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : el.tagName.toLowerCase());
      for (const el of document.querySelectorAll('body *')) {
        if (!window.vx.sichtbar(el)) continue;
        // Bedienbare Elemente sind ausgenommen: Ein Knopf soll die Breite
        // seiner Beschriftung haben und nicht die seiner Spalte.
        if (el.closest('a, button, label, summary, [role="button"]')) continue;
        const s = getComputedStyle(el);
        if (s.display === 'inline') continue;
        // Ein Schild ist ein Kasten, kein Trenner. Eine einzelne Haarlinie
        // oben ist eine Naht zwischen zwei Zeilen und hat weder eine Flaeche
        // zu fuellen noch eine Polsterung ringsum zu tragen. Gezaehlt wird
        // deshalb nur, was sich vom Untergrund abhebt oder vollstaendig
        // umrandet ist.
        const eltern = el.parentElement;
        if (!eltern) continue;
        const eigen = window.vx.hintergrund(el);
        const drunter = window.vx.hintergrund(eltern);
        const eigeneFlaeche = eigen.slice(0, 3).some((v, i) => Math.abs(v - drunter[i]) > 2);
        const rundum = ['Top', 'Right', 'Bottom', 'Left'].every(
          (k) => parseFloat(s['border' + k + 'Width']) > 0
        );
        if (!eigeneFlaeche && !rundum) continue;
        const text = (el.innerText || '').replace(/\s+/g, ' ').trim();
        if (text.length < zeichen) continue;
        const r = el.getBoundingClientRect();
        // Randlose Abschnitte sind keine Schilder.
        if (r.width >= document.documentElement.clientWidth - 1) continue;
        // Gemessen wird gegen den Inhaltskasten des Elternteils und nicht
        // gegen seinen Rahmen. Ein Block, der 280 px in einer 320 px breiten
        // Spur misst, nutzt sie vollstaendig, wenn die Spur 20 px polstert.
        const es = getComputedStyle(eltern);
        const spalte = eltern.clientWidth - (parseFloat(es.paddingLeft) || 0) - (parseFloat(es.paddingRight) || 0);
        if (spalte < 40) continue;
        if (r.width < spalte * nutzung) {
          out.push({ art: 'nutzung', was: beschreiben(el), breite: Math.round(r.width), spalte: Math.round(spalte) });
        }
        const p4 = ['Top', 'Right', 'Bottom', 'Left'].map((k) => parseFloat(s['padding' + k]) || 0);
        const mit = p4.filter((x) => x > 0).length;
        if (mit > 0 && mit < 4) {
          out.push({ art: 'polster', was: beschreiben(el), polster: p4.map(Math.round).join('/') });
        }
      }
      return out;
    }, { nutzung: SPALTENNUTZUNG, zeichen: MINDESTZEICHEN });

    for (const f of funde) {
      if (f.art === 'nutzung') {
        befunde.push(
          `2) ${route} @${breite}px: Block „${f.was}“ misst ${f.breite}px in einer Spalte von ` +
            `${f.spalte}px (${Math.round((f.breite / f.spalte) * 100)} Prozent, verlangt ${SPALTENNUTZUNG * 100})`
        );
      } else {
        befunde.push(
          `3) ${route} @${breite}px: Block „${f.was}“ polstert nur auf einigen Seiten (${f.polster})`
        );
      }
    }
  }
  await ctx.close();
}

await browser.close();
melden(
  befunde,
  `Achse: jeder Abschnitt steht mittig (${konfig.breiten.desktop.length} Breiten), jedes Schild nutzt ` +
    `seine Spalte und polstert ringsum (${konfig.breiten.telefon.length} Telefonbreiten), ${konfig.routen.length} Routen.`
);
