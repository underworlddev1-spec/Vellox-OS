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
  pfaelzerhof@saphirweb.de
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
*Email Routing* aktivieren.

> ⚠️ **Zuerst prüfen, ob die Domain heute schon E-Mail empfängt.**
> Email Routing ersetzt die MX-Einträge der **ganzen** Zone. Läuft dort
> bereits ein Postfach, hört es in dem Moment auf, Mail zu bekommen.
>
> Der Ausweg ist eingebaut und kostet nichts: Vor dem Umschalten eine
> **Catch-all-Regel** auf die bisherige Adresse anlegen. Dann geht alles,
> was keine eigene Route hat, weiterhin dorthin. Erst danach umschalten.
>
> Prüfen lässt sich das in einer Zeile:
> ```
> dig +short MX saphirweb.de
> ```
> Kommt nichts zurück, empfängt die Domain heute keine Mail und du kannst
> ohne Weiteres umschalten.

**3. Ziel anlegen.** Unter *Destination addresses* deine eigene Mailadresse
eintragen und bestätigen. Die braucht die Brücke, um Störungen und die
Google-Bestätigung durchzureichen.

**4. Route anlegen.** *Custom address* → `pfaelzerhof@saphirweb.de` → Aktion
*Send to a Worker* → `anfragen-bruecke`.

**5. Konfiguration eintragen.** In `src/konfiguration.js` den Schlüssel
`pfaelzerhof@saphirweb.de` durch die echte Adresse ersetzen.

**6. Geheimnisse setzen.** Niemals in eine Datei:

```bash
npx wrangler secret put WHATSAPP_TOKEN          # aus der Meta-App
npx wrangler secret put WHATSAPP_TELEFON_ID     # aus der Meta-App
npx wrangler secret put WHATSAPP_NUMMER_KOSTA   # 49176...  ohne Plus, ohne Leerzeichen
npx wrangler secret put BETREIBER_MAIL          # wohin Störungen gehen; muss eine
                                                # verifizierte Destination address sein
npx wrangler secret put ABSENDER_MAIL           # z. B. bruecke@saphirweb.de -- die Domain
                                                # muss in diesem Konto Email Routing haben
npx wrangler secret put STATUS_SCHLUESSEL       # frei erfunden, lang
```

Für den Probelauf reichen die letzten drei. Ohne WhatsApp-Token stellt die
Brücke nicht zu, und mit `BETRIEBSMODUS = "probe"` versucht sie es gar nicht
erst.

### Warum hier kein Mail-Dienst mehr steht

Der Datenpfad der Brücke verschickt nichts: Mail rein, WhatsApp raus. Was
verschickt wird, ist allein die **Störungsmeldung an dich** — und die läuft
seit dem 20. September 2026 über Cloudflares eigenes `send_email`-Binding
(`[[send_email]] name = "MELDUNG"` in `wrangler.toml`) statt über Resend.

Das Binding darf nur an **verifizierte Zieladressen dieses Kontos** senden.
Für eine Meldung, die ausschließlich an den Betreiber geht, ist das keine
Hürde, sondern die richtige Grenze: Eine Störungsmeldung, die versehentlich
beim Kunden landet, wäre schlimmer als gar keine. Nebenbei fällt ein Konto,
ein Secret und eine fremde Abhängigkeit weg.

`RESEND_TOKEN` bleibt als **zweiter Weg** im Code und ist optional. Das ist
Absicht: Das Binding hängt an einer Liste, die im Dashboard gepflegt wird, und
wer dort eine Adresse austauscht, ohne die Brücke anzufassen, hätte sonst
einen stummen Alarmkanal, ohne es zu merken. Genau das soll die Funktion
verhindern. Fehlt auch der zweite Weg, bleibt die Meldung im Protokoll —
verschluckt wird sie nie.

> Und in keinem Fall über WhatsApp, obwohl der Kanal danebenliegt. Eine
> geschäftsinitiierte WhatsApp-Nachricht braucht eine genehmigte Vorlage, und
> eine Vorlage, die eine freie Fehlermeldung tragen soll, zwängt jede Störung
> in drei feste Felder. Der härtere Grund liegt eine Ebene tiefer: **Ein Alarm
> darf nicht den Kanal benutzen, dessen Ausfall er meldet.**

Einen Mail-Dienst braucht weiterhin die **Kundenwebsite**, nicht die Brücke:
Die Empfangsbestätigung an den Gast geht an eine fremde Adresse, und genau das
darf `send_email` nicht. Das ist eine Entscheidung über das Kontaktformular
und keine über dieses Produkt.

**7. Gedächtnis anlegen** (optional, für Zähler und Lebenszeichen):

```bash
npx wrangler kv namespace create ZUSTAND
# die ausgegebene ID in wrangler.toml eintragen, Block einkommentieren
```

**8. Ausliefern:**

```bash
npm run pruefen      # sieben Proben und elf Behauptungen, müssen grün sein
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
*Weiterleitungsadresse hinzufügen* → `pfaelzerhof@saphirweb.de`

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
npm run pruefen        # Felderkennung und Filter gegen sieben Proben,
                       # dazu elf Behauptungen über den Alarmkanal
npm run protokoll      # Live-Protokoll des ausgelieferten Workers
```

`npm run protokoll` zeigt nur, was passiert, **während** es offen ist. Deshalb
steht `[observability] enabled = true` in der `wrangler.toml`: Die Zeilen
bleiben danach abfragbar, im Dashboard unter *Workers & Pages → anfragen-bruecke
→ Logs*. Ohne das wäre eine Anfrage, die samstags um halb elf schiefgeht, am
Sonntag nicht mehr rekonstruierbar — und bei einem System, dessen einziger
stiller Fehler eine nicht zugestellte Reservierung ist, ist das die falsche
Ausfallrichtung.

> Eine Warnung aus dem Aufbau, die für jedes Werkzeug hier gilt: **`wrangler
> tail` nie durch eine Pipe schicken, die puffert.** `grep` ohne
> `--line-buffered` hält jede Zeile zurück, solange es nicht in ein Terminal
> schreibt — und ein leeres Protokoll sieht genauso aus wie ein Worker, der
> nichts tut. Entweder direkt in eine Datei schreiben oder `--line-buffered`
> setzen.

Beide Läufe kommen ohne Netz und ohne Worker-Laufzeit aus. `fetch` und das
Binding sind gestellt, denn **ein Gate, das eine echte Meldung verschickt, ist
kein Gate, sondern ein Absender.** Alle acht Gegenproben des Alarmkanals sind
mit eingebautem Fehler nachweislich rot geworden.

### Die vollständige Kette, am 21. September 2026 belegt

Eine echte Mail an die Kundenadresse ist als WhatsApp-Nachricht auf einem
Telefon angekommen. Damit ist der Hauptweg des Produkts zum ersten Mal ohne
Lücke gefahren worden:

```
Mail → Cloudflare Email Routing → Worker → Filter → Extraktion
     → WhatsApp Cloud API → Telefon
```

Vorausgegangen war die Freigabe der Vorlage `neue_anfrage` durch Meta, rund
26 Stunden nach Einreichung. Am Worker war dafür nichts zu tun: Er ruft
dieselbe Vorlage auf, die eine Stunde zuvor noch mit `404 (#132001)`
abgelehnt wurde. **Eine Zustellung, die an einer fremden Freigabe hängt,
braucht kein Deployment, wenn die Freigabe kommt** -- sie braucht nur einen
Kanal, der so lange sauber scheitert. Genau das hat der Alarmkanal am Vortag
getan.

Was diese Messung nicht abdeckt und was für einen Kunden noch fehlt:
die Weiterleitungsregel in seinem Postfach, seine Nummer als registrierter
Empfänger bei Meta, und die Absenderadresse seines Kontaktformulars.

### Der Alarmkanal, am 20. September 2026 im Betrieb belegt

Die Gegenprobe unten ist gefahren worden, und sie ist grün: Bei scharf
geschaltetem Worker und noch nicht freigegebener WhatsApp-Vorlage scheiterte
die Zustellung, und keine zehn Sekunden später lag die Störungsmeldung im
Postfach des Betreibers.

```
Von:     bruecke@saphirweb.de
Betreff: Anfragen-Brücke: Störung

Zustellung gescheitert für Gasthaus Pfälzer Hof.
whatsapp: 404 (#132001) Template name does not exist in the translation

Die Mail liegt weiter im Postfach des Kunden.
```

Damit ist belegt, was `npm run pruefen` grundsätzlich nicht erreichen kann:
dass das `send_email`-Binding in der Worker-Laufzeit wirklich sendet, dass
der RFC-2047-Betreff beim Empfänger als Umlaut ankommt, und dass eine
gescheiterte Zustellung nicht still bleibt.

**Nur lag sie im Spam. Und ein Alarm im Spamordner ist derselbe Fehler wie
kein Alarm.**

Gemessen fehlte ein DMARC-Eintrag. Die Domain hatte SPF und DKIM, verschickte
aber ihre allererste Mail überhaupt, und Gmail sortiert genau dieses Profil
aus: neue Domain, keine Historie, kurzer Text, das Wort "Störung". Repariert
mit einem TXT-Eintrag auf `_dmarc`:

```
v=DMARC1; p=none; rua=mailto:dmarc@<domain>; fo=1
```

`p=none` beobachtet nur und lehnt nichts ab; das ist der Einstieg, der nichts
kaputtmachen kann.

**Die Lehre gilt über diesen Fall hinaus.** Dieses Projekt prüft an vielen
Stellen, ob eine Meldung *erzeugt* wird. Ob sie *gelesen* wird, hat bis dahin
nichts geprüft, und dazwischen liegt eine Zustellkette mit eigenen
Ausfallarten. Wer einen neuen Kunden anschließt, schickt deshalb einmal
absichtlich eine Störung los und sieht nach, **wo** sie landet -- nicht nur,
**ob** es sie gibt.

### Was `npm run pruefen` nicht erreicht

Den Versand über das Binding selbst. `cloudflare:email` gibt es nur in der
Worker-Laufzeit; in Node scheitert schon der Import — und genau das macht den
Rückfall auf den zweiten Weg prüfbar, ohne ihn stellen zu müssen.

Die Gegenprobe dafür ist kein Skript, sondern ein Lauf, und sie kostet zwei
Minuten:

1. `BETRIEBSMODUS = "scharf"`, `KANAL = "whatsapp"`, **kein** `WHATSAPP_TOKEN`
2. eine Mail an die Kundenadresse schicken
3. die Zustellung scheitert — und es **muss** eine Störungsmail ankommen

Kommt keine, ist der Alarmkanal stumm, und das ist der einzige Fehler dieses
Systems, den ohne diesen Lauf niemand bemerkt.

Vor dem scharfen Betrieb `BETRIEBSMODUS = "probe"` setzen: Die Brücke liest,
filtert und baut die Nachricht, stellt sie aber nicht zu, sondern schreibt sie
ins Protokoll. So lässt sich an echten Mails prüfen, was ankommen würde.

Zustand abfragen:

```
https://anfragen-bruecke.<dein-subdomain>.workers.dev/zustand?schluessel=...
```

---

## Ein neuer Kunde

**Null. Von welcher Adresse verschickt das Kontaktformular des Kunden?**

Diese Frage steht vor allen anderen, und sie wird beantwortet, bevor irgendetwas
eingerichtet wird — nicht geraten, sondern an einer echten Mail abgelesen.

Ein Kontaktformular sendet fast immer von einer technischen Adresse, meist
`noreply@`. Auf der Blockliste `absenderNein` steht genau dieses Wort, und die
Liste ist richtig: Eine fremde `noreply@` ist zuverlässig Werbung. Nur ist die
eigene `noreply@` ebenso zuverlässig das Formular des Betriebs.

Aufgelöst wird das über `filter.eigeneDomains`. Trägt man sie nicht ein, wird
**jede echte Anfrage still verworfen**, und niemand merkt es: Eine geblockte
Mail wird angenommen und weggeworfen, nie abgelehnt. Der Betrieb glaubt, es
kämen keine Anfragen.

Die Domain der Website und die Domain der Mailadresse sind dabei nicht
zwangsläufig dieselbe — beim Pfälzer Hof läuft die Website auf
`pfaelzer-hof-walldorf.de`, die Mail aber auf `pfaelzerhofwalldorf.de`. Beide
gehören in die Liste.

Danach vier Handgriffe, keine Programmierung:

1. Route in Cloudflare: `cafe@saphirweb.de` → Worker
2. Eintrag in `src/konfiguration.js` kopieren und anpassen,
   **`eigeneDomains` ausfüllen**
3. Weiterleitungsregel im Postfach des Kunden
4. Eine echte Anfrage durchschicken und im Protokoll nachsehen, **welche
   Felder wirklich erkannt wurden** — die Beschriftungen jedes Formulars sind
   anders, und `FELDNAMEN` in `src/extrahieren.js` kennt nur, was schon
   einmal vorkam

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
