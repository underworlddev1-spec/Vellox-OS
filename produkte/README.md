# Produkte

Hier liegt Software, die **beim Kunden läuft** — im Unterschied zu
[`werkzeuge/`](../werkzeuge/README.md), wo Skripte liegen, die bei uns laufen,
und im Unterschied zu den nummerierten Kapiteln, in denen Wissen steht.

Die Trennung hat einen Grund: Ein Kapitel erklärt eine Entscheidung und altert
langsam. Ein Produkt hat Zugangsdaten, einen Betriebszustand und einen Kunden,
der anruft, wenn es nicht läuft. Beides im selben Ordner zu führen, hieße die
Frage „darf ich das ändern?" für jede Datei neu zu stellen.

| Produkt | Was es tut | Läuft auf |
|---|---|---|
| [`anfragen-bruecke`](anfragen-bruecke/README.md) | Fängt Anfragen aus dem bestehenden Postfach eines Betriebs ab und stellt sie als kurze Nachricht auf WhatsApp zu | Cloudflare Worker |

## Was ein Produkt hier erfüllen muss

**Es läuft ohne uns.** Ein Betrieb, der uns morgen kündigt, darf davon nicht
ausfallen, solange er zahlt — und wir dürfen nicht der einzige Mensch sein,
der es starten kann. Deshalb gehört zu jedem Produkt eine Einrichtungsanleitung,
die jemand anderes abarbeiten kann.

**Es scheitert laut.** Der gefährlichste Zustand ist nicht der Ausfall, sondern
der stille Ausfall: Eine Anfrage kommt nicht an, und niemand merkt es bis
Samstagabend. Jedes Produkt hier meldet seine Störungen aktiv an uns und nicht
an den Kunden.

**Es hält keine fremden Zugangsdaten.** Wer das Passwort eines Kunden hält,
haftet für alles, was damit geschieht. Wo ein Produkt Zugriff braucht, wird der
Weg gewählt, der am wenigsten Zugriff verlangt — auch wenn er umständlicher ist.

**Der zwanzigste Kunde kostet so viel wie der erste.** Was je Kunde
konfiguriert wird, steht in einer Konfigurationsdatei und nicht im Code.
