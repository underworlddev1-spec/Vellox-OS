# Anfragen-Brücke

Fängt Anfragen aus dem **bestehenden Postfach** eines Betriebs ab und stellt sie
als kurze Nachricht auf WhatsApp oder Telegram zu.

Sie braucht keine Website. Sie braucht kein Passwort des Kunden. Sie braucht
nur eine Weiterleitungsregel in seinem Postfach und seine Nummer.

```
Was heute im Postfach des Betriebs ankommt
(Kontaktformular, Portal, Gäste die direkt schreiben)
        │
        │  Weiterleitungsregel — richtet der Kunde einmal ein
        ▼
  kunde@bruecken-domain
        │
        ▼
  Cloudflare Worker: lesen · filtern · kürzen
        │
        ▼
  WhatsApp oder Telegram

  Das Original bleibt im Postfach liegen.
```

## Die Entscheidung, aus der alles folgt

Es ist eine **Weiterleitung** und kein Postfachzugriff. Daraus folgt:

- Fällt die Brücke aus, kommt die Anfrage nur später an — sie geht nicht verloren.
- Wir halten keine fremden Zugangsdaten und können keine fremde Post lesen.
- Wir sind nicht sein Mailserver. Ein Fehler hier legt seine Kommunikation nicht lahm.

Die beiden Alternativen wurden verworfen: **IMAP-Zugriff** würde bedeuten, sein
Passwort zu halten und damit seine gesamte Korrespondenz lesen zu können.
**MX-Eintrag** würde bedeuten, für seine komplette E-Mail verantwortlich zu sein.
Beides ist für einen Ein-Personen-Betrieb eine Haftung, die in keinem Verhältnis
zum Nutzen steht.

---

## Stand

| Teil | Zustand |
|---|---|
| Worker, Filter, Felderkennung, Nachrichtenbau | **fertig** |
| WhatsApp-Ausgang | **fertig** |
| Telegram-Ausgang | **fertig**, als Ausweichweg falls Meta die Nummer sperrt |
| Mehrkundenfähigkeit | **fertig** — ein Eintrag je Betrieb |
| Prüfstand mit sieben Proben | **fertig**, `npm run pruefen` |
| Gmail-Bestätigung durchreichen | **fertig** |
| Störungsmeldung und Lebenszeichen | **fertig** |

Was fehlt, steht unten in **A**, **B** und **C** und ist keine Programmierarbeit.

---

## A — Deine Seite, einmalig (Cloudflare)

Alles kostenlos im Gratisrahmen.

```bash
npm install
npx wrangler login
```

**1. Domain zu Cloudflare.** Die Brückendomain wird dort verwaltet. Kann
dieselbe sein, die auch die Aufsteller tragen.

**2. Email Routing einschalten.** Cloudflare-Oberfläche → Domain → *Email* →
*Email Routing* aktivieren. Die MX-Einträge setzt Cloudflare selbst.

**3. Ziel anlegen.** Unter *Destination addresses* deine eigene Mailadresse
eintragen und bestätigen. Die braucht die Brücke, um Störungen und die
Google-Bestätigung durchzureichen.

**4. Route anlegen.** *Custom address* → `kosta@deine-domain` → Aktion
*Send to a Worker* → `anfragen-bruecke`.

**5. Konfiguration eintragen.** In `src/konfiguration.js` den Schlüssel
`kosta@BRUECKENDOMAIN` durch die echte Adresse ersetzen.

**6. Geheimnisse setzen.** Niemals in eine Datei:

```bash
npx wrangler secret put WHATSAPP_TOKEN          # aus der Meta-App
npx wrangler secret put WHATSAPP_TELEFON_ID     # aus der Meta-App
npx wrangler secret put WHATSAPP_NUMMER_KOSTA   # 49176...  ohne Plus, ohne Leerzeichen
npx wrangler secret put BETREIBER_MAIL          # wohin Störungen gehen
npx wrangler secret put ABSENDER_MAIL           # verifizierter Absender bei Resend
npx wrangler secret put RESEND_TOKEN            # dasselbe Konto wie die Kundenwebsites
npx wrangler secret put STATUS_SCHLUESSEL       # frei erfunden, lang
```

> Störungsmeldungen gehen per **E-Mail über Resend**, nicht über WhatsApp.
> Eine geschäftsinitiierte WhatsApp-Nachricht braucht eine genehmigte Vorlage,
> und eine Vorlage, die eine freie Fehlermeldung tragen soll, zwängt jede
> Störung in drei feste Felder. Eine Störungsmeldung muss sagen dürfen, was
> kaputt ist.

**7. Gedächtnis anlegen** (optional, für Zähler und Lebenszeichen):

```bash
npx wrangler kv namespace create ZUSTAND
# die ausgegebene ID in wrangler.toml eintragen, Block einkommentieren
```

**8. Ausliefern:**

```bash
npm run pruefen      # sieben Proben, müssen grün sein
npm run ausliefern
```

---

## B — Meta, für den WhatsApp-Ausgang

**Du kannst testen, bevor die Geschäftsverifizierung durch ist.** Meta gibt
jedem neuen Konto eine Testnummer und erlaubt bis zu fünf Empfängernummern
ohne Verifizierung. Damit lässt sich die ganze Kette beweisen, während die
Verifizierung läuft.

**1.** Konto auf `developers.facebook.com` → neue App → Produkt *WhatsApp*.

**2.** Im WhatsApp-Bereich stehen sofort bereit: eine **Testnummer**, eine
**Phone Number ID** und ein **temporäres Token** (24 Stunden).
Kostas Nummer unter *To* als Empfänger hinzufügen — er bekommt einen Code
und muss bestätigen.

**3. Vorlage anlegen.** *Message Templates* → *Create template*

| Feld | Wert |
|---|---|
| Name | `neue_anfrage` |
| Kategorie | **Utility** — nicht Marketing, sonst wird sie teuer und abgelehnt |
| Sprache | Deutsch |

Rumpf exakt so:

```
Neue Reservierungsanfrage.

Termin: {{1}}
Gäste: {{2}}
Kontakt: {{3}}

Details im Postfach.
```

Beispielwerte für die Einreichung:

```
{{1}}  04.10.2026 · 19:30 Uhr
{{2}}  4 Personen
{{3}}  Familie Müller · 0176 1234567
```

> Meta lehnt Vorlagen ab, die mit einer Variablen beginnen oder enden. Der
> Rumpf oben hält das ein. Wenn du ihn änderst, prüfe das zuerst.

**4.** Die drei Werte stehen im WhatsApp-Bereich der App und gehören in die
Geheimnisse aus Abschnitt A. `KANAL = "whatsapp"` steht bereits in
`wrangler.toml`.

**5. Für den Dauerbetrieb** danach: Geschäftsverifizierung, eigene Nummer
statt der Testnummer, und ein **dauerhaftes Token** über einen System User.
Das temporäre läuft nach 24 Stunden ab — wenn die Brücke nach einem Tag
stumm wird, ist fast immer das die Ursache.

---

## C — Kosta, in seinem Gmail

Zwei Schritte, zehn Minuten, einmal.

**1. Weiterleitungsadresse hinterlegen.**
Gmail → *Einstellungen* → *Weiterleitung und POP/IMAP* →
*Weiterleitungsadresse hinzufügen* → `kosta@deine-domain`

Google schickt daraufhin einen Bestätigungscode an diese Adresse. **Der landet
bei dir** — die Brücke erkennt Googles Absender und reicht die Mail
unverändert an `BETREIBER_MAIL` weiter. Code an Kosta geben, er bestätigt.

Dann **nicht** „Kopien weiterleiten" aktivieren. Sonst landet jede Mail auf
dem Handy und er schaltet es in einer Woche ab.

**2. Filter anlegen.**
Gmail → Suchfeld → Filtersymbol → Kriterien eintragen, dann
*Filter erstellen* → **Weiterleiten an** die neue Adresse.

Sinnvolle Kriterien, je nachdem was er hat:

```
Von:     die Adresse seines Kontaktformulars
Betreff: reservier OR tisch OR anfrage OR buchung OR catering
```

Zusätzlich braucht die Brücke von ihm:

- **Welche Adresse** bekommt heute die Anfragen?
- **WhatsApp Business** einrichten. Kostenlos, läuft auf derselben Nummer,
  zehn Minuten. Ein privates Konto geschäftlich zu benutzen verstößt gegen
  die Nutzungsbedingungen von WhatsApp — das ist kein Formalismus, Konten
  werden dafür gesperrt.

---

## Testen

```bash
npm run pruefen        # Felderkennung und Filter gegen sieben Proben
npm run protokoll      # Live-Protokoll des ausgelieferten Workers
```

Vor dem scharfen Betrieb `BETRIEBSMODUS = "probe"` setzen: Die Brücke liest,
filtert und baut die Nachricht, stellt sie aber nicht zu, sondern schreibt sie
ins Protokoll. So lässt sich an echten Mails prüfen, was ankommen würde.

Zustand abfragen:

```
https://anfragen-bruecke.<dein-subdomain>.workers.dev/zustand?schluessel=...
```

---

## Ein neuer Kunde

Drei Handgriffe, keine Programmierung:

1. Route in Cloudflare: `betrieb@deine-domain` → Worker
2. Eintrag in `src/konfiguration.js` kopieren und anpassen
3. Weiterleitungsregel im Postfach des Kunden

Das ist der Grund, warum die Konfiguration nach Empfängeradresse aufgeteilt
ist und nicht fest verdrahtet: **Der zwanzigste Betrieb kostet dieselben zehn
Minuten wie der erste.**

---

## Recht

Mit der Brücke laufen **Gästedaten aus dem Postfach des Kunden über deine
Infrastruktur zu Meta.** Damit bist du sein Auftragsverarbeiter.

Vor dem Start, nicht danach:

- **AVV zwischen dir und dem Betrieb** (Art. 28 DSGVO)
- **Absatz in seiner Datenschutzerklärung** über die Weiterleitung an WhatsApp
- **AVV mit Meta** über die WhatsApp Business Platform

Die sparsame Fassung ist eingebaut: `umfang: 'knapp'` je Kunde schickt nur
Termin und Personenzahl aufs Handy, Name und Telefonnummer bleiben im
Postfach. Damit verlassen deutlich weniger personenbezogene Daten sein Haus.
Der Preis ist, dass er für jede Antwort ins Postfach muss — und ein System,
für das man jedes Mal woanders hinschauen muss, benutzt auf Dauer niemand.

Das ist keine Rechtsberatung.
