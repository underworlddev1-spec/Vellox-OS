// Konfiguration des Prüfstands.
//
// Diese Datei wird je Projekt angepasst. Alles andere im Ordner bleibt
// unverändert, damit ein Update des Kits nicht mit lokalen Eingriffen kollidiert.
// Projektspezifische Behauptungen kommen als eigene Datei nach `pruefungen/`
// und in die Liste unten.

export default {
  // Wo die Seite im Prüflauf erreichbar ist. Ein statischer Server, ein
  // Dev-Server oder eine Preview: dem Prüfstand ist gleich, was ausliefert,
  // solange es das ausliefert, was später live geht.
  basis: 'http://127.0.0.1:8099',

  // Jede Route, die geprüft wird. Vollständig, nicht beispielhaft: Was hier
  // fehlt, wird nie gemessen. Der Läufer meldet die Zahl bei jedem Lauf mit,
  // damit ein Vergessen sichtbar wird.
  routen: [
    '/index.html',
  ],

  // Breiten. Getrennt geführt, weil die Behauptungen unterschiedliche Gruppen
  // brauchen: Eine Achsmessung ist auf dem Telefon sinnlos, eine Überlaufprüfung
  // auf 2560 px fast immer.
  breiten: {
    telefon: [320, 360, 390, 414],
    zwischen: [768, 992],
    desktop: [1024, 1280, 1440, 1600, 1920, 2560],
  },

  // Quelle des Stylesheets, relativ zur Projektwurzel. Nur `farben.mjs` und
  // `staffel.mjs` lesen sie; beide prüfen Regeln über den Quelltext selbst.
  // Auf null setzen, wenn das Projekt seine Stile nicht in einer Datei führt
  // (CSS-in-JS, Utility-Framework). Dann entfallen die beiden Prüfungen und
  // das Projekt braucht einen eigenen Nachweis für dieselben Regeln.
  stylesheet: 'assets/style.css',

  // Präfixe der Rollentoken und der Grundfarben. `farben.mjs` unterscheidet
  // daran, was im Regelwerk stehen darf und was nicht.
  farbtoken: {
    rolle: '--farbe-',
    grundfarben: /^--(creme|oliv|gold|tinte|grau|weiss|schwarz)/,
  },

  // Präfix der typografischen Stufen für `staffel.mjs`.
  groessentoken: '--gr-',

  // Begriffe, die im sichtbaren Text nicht vorkommen dürfen. Die ersten sind
  // Arbeitsspuren, der letzte ist eine VELLOX-Regel: Der Anti-Template-Standard
  // verbietet den Gedankenstrich als Stilmittel.
  verboteneBegriffe: [
    'Lorem ipsum',
    'TODO',
    'TBD',
    'Platzhalter',
    'Beispieltext',
    'XXX',
    ' — ',
    ' – ',
  ],

  // Rechtskonformität.
  konform: {
    // Hosts, zu denen eine Verbindung erlaubt ist. Leer heißt: keine. Jede
    // fremde Verbindung vor einer Einwilligung ist ein Befund.
    erlaubteHosts: [],
    // Diese Verweise müssen von jeder Route aus erreichbar sein.
    rechtslinks: [/impressum/i, /datenschutz/i],
    // Kennzeichnung erzeugter Medien nach Art. 50 Abs. 4 KI-VO.
    ki: { attribut: 'data-erzeugt', marke: '.ki-marke' },
  },

  // Fingerflächen und Lesbarkeit.
  mobil: {
    mindestFingerflaeche: 44,
    hoechstZeichenJeZeile: 80,
  },

  // Die Prüfungen, die der Läufer fährt, in dieser Reihenfolge. Was hier nicht
  // steht, fährt niemand mit. Projektspezifische Prüfungen werden ergänzt.
  pruefungen: [
    'farben.mjs',
    'staffel.mjs',
    'kontrast.mjs',
    'axe.mjs',
    'a11y.mjs',
    'ueberlauf.mjs',
    'textfluss.mjs',
    'achse.mjs',
    'bilder.mjs',
    'konform.mjs',
    'sichtbar.mjs',
    'ausfall.mjs',
  ],
};
