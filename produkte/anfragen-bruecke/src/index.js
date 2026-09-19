/**
 * Anfragen-Bruecke
 * ================
 *
 * Nimmt E-Mails entgegen, die ein Betrieb aus seinem eigenen Postfach
 * hierher weiterleitet, und stellt sie als kurze Nachricht auf WhatsApp
 * oder Telegram zu.
 *
 * Die tragende Entscheidung ist, dass es eine WEITERLEITUNG ist und kein
 * Postfachzugriff. Daraus folgt alles Weitere:
 *
 *   - Das Original bleibt im Postfach des Kunden liegen. Faellt die Bruecke
 *     aus, kommt die Anfrage nur spaeter an, sie geht nicht verloren.
 *   - Wir brauchen kein Passwort des Kunden und koennen seine Post nicht
 *     lesen. Ein Dienstleister, der Zugangsdaten haelt, haftet dafuer.
 *   - Wir sind nicht sein Mailserver. Ein Fehler hier legt seine
 *     Kommunikation nicht lahm.
 *
 * Und eine Regel, die im Code steht und nicht nur im Kopf: **Eine gefilterte
 * Mail wird angenommen und still verworfen, niemals abgelehnt.** Gmail
 * schaltet eine Weiterleitung nach wiederholten Unzustellbarkeiten ab. Ein
 * `setReject` auf einen Newsletter wuerde also nach ein paar Wochen die
 * ganze Bruecke stilllegen, und niemand wuesste warum.
 */

import PostalMime from 'postal-mime'
import { kundeFinden, GOOGLE_BESTAETIGUNG } from './konfiguration.js'
import { pruefen } from './filter.js'
import { extrahieren } from './extrahieren.js'
import { bauen, vorlagenParameter } from './nachricht.js'
import { zustellen, betreiberMelden } from './kanaele.js'
import { lesen, schreiben, zaehlen } from './zustand.js'

const jetzt = () => new Date().toISOString()

export default {
  /** Eingang: eine weitergeleitete E-Mail. */
  async email(message, env, ctx) {
    const an = String(message.to || '').toLowerCase()
    const von = String(message.from || '').toLowerCase()

    // 1. Googles Bestaetigung der Weiterleitung durchreichen.
    //
    //    Ohne diesen Zweig laesst sich die Weiterleitung nie aktivieren:
    //    Gmail schickt den Bestaetigungscode an genau diese Adresse, und
    //    hier sitzt ein Programm und kein Mensch. Die Mail wird deshalb
    //    unveraendert an den Betreiber weitergereicht.
    if (von.includes('forwarding-noreply@google.com') || von.includes(GOOGLE_BESTAETIGUNG)) {
      if (env.BETREIBER_MAIL) {
        await message.forward(env.BETREIBER_MAIL)
        console.log('Google-Bestaetigung an Betreiber weitergereicht')
      } else {
        console.log('Google-Bestaetigung angekommen, aber BETREIBER_MAIL fehlt')
      }
      return
    }

    // 2. Zu welchem Betrieb gehoert diese Adresse?
    const kunde = kundeFinden(an)
    if (!kunde) {
      console.log(`unbekannte Empfaengeradresse: ${an}`)
      if (env.BETREIBER_MAIL) await message.forward(env.BETREIBER_MAIL)
      return
    }

    await zaehlen(env, 'angekommen')
    await schreiben(env, { letzteMail: jetzt() })

    // 3. Lesen.
    let mail
    try {
      mail = await new PostalMime().parse(message.raw)
    } catch (e) {
      console.log('Mail nicht lesbar:', e.message)
      await zaehlen(env, 'fehler')
      await schreiben(env, { letzterFehler: { zeit: jetzt(), was: 'nicht lesbar' } })
      if (env.BETREIBER_MAIL) await message.forward(env.BETREIBER_MAIL)
      return
    }

    const absenderAdresse = (mail.from && mail.from.address) || von
    const absenderName = (mail.from && mail.from.name) || ''
    const betreff = mail.subject || ''
    const text = mail.text || (mail.html ? mail.html.replace(/<[^>]+>/g, ' ') : '')

    // 4. Zweite Filterschicht.
    const entscheidung = pruefen({ absender: absenderAdresse, betreff, text }, kunde.filter)
    console.log(`${kunde.name} | ${absenderAdresse} | "${betreff}" | ${entscheidung.durch ? 'durch' : 'geblockt'}: ${entscheidung.grund}`)

    if (!entscheidung.durch) {
      await zaehlen(env, 'geblockt')
      return // annehmen und still verwerfen -- siehe Kopf dieser Datei
    }

    // 5. Felder ziehen und Nachricht bauen.
    const felder = extrahieren({ betreff, text, absenderName, absenderAdresse })
    const nachricht = bauen(felder, kunde)
    const parameter = vorlagenParameter(felder, kunde)

    if (env.BETRIEBSMODUS === 'probe') {
      console.log('PROBE, nicht zugestellt:\n' + nachricht)
      return
    }

    // 6. Zustellen.
    try {
      const ergebnis = await zustellen({ kunde, text: nachricht, parameter, env })
      await zaehlen(env, 'zugestellt')
      await schreiben(env, { letzteZustellung: { zeit: jetzt(), kanal: ergebnis.kanal, kunde: kunde.name } })
      console.log(`zugestellt ueber ${ergebnis.kanal}`)
    } catch (e) {
      // Eine gescheiterte Zustellung darf nie wie Erfolg aussehen und sie
      // darf nie still sein. Der Betreiber erfaehrt es sofort, und die Mail
      // liegt weiterhin im Postfach des Kunden.
      console.log('Zustellung gescheitert:', e.message)
      await zaehlen(env, 'fehler')
      await schreiben(env, { letzterFehler: { zeit: jetzt(), was: e.message, kunde: kunde.name } })
      ctx.waitUntil(betreiberMelden(
        `Zustellung gescheitert für ${kunde.name}.\n${e.message}\n\nDie Mail liegt weiter im Postfach des Kunden.`,
        env,
      ))
    }
  },

  /** Zustandsabfrage. Nur mit Schluessel, sonst waere es eine offene Statistik. */
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname !== '/zustand') {
      return new Response('Anfragen-Brücke', { status: 200 })
    }
    if (!env.STATUS_SCHLUESSEL || url.searchParams.get('schluessel') !== env.STATUS_SCHLUESSEL) {
      return new Response('kein Zugang', { status: 403 })
    }
    const z = await lesen(env)
    return Response.json({
      ...z,
      kanal: env.KANAL || 'telegram',
      betriebsmodus: env.BETRIEBSMODUS || 'scharf',
      whatsappEingerichtet: Boolean(env.WHATSAPP_TOKEN && env.WHATSAPP_TELEFON_ID),
      telegramEingerichtet: Boolean(env.TELEGRAM_TOKEN && env.TELEGRAM_CHAT),
    })
  },

  /**
   * Herzschlag.
   *
   * Nicht "seit 24 Stunden keine Mail" -- ein Gasthaus bekommt manche Woche
   * zwei Anfragen per Mail, und eine Warnung, die zehnmal falsch war, liest
   * beim elften Mal niemand mehr. Gemeldet wird deshalb, was wirklich etwas
   * bedeutet: ein Fehler seit der letzten Pruefung, und einmal in der Woche
   * ein Lebenszeichen mit den Zaehlern.
   */
  async scheduled(event, env, ctx) {
    const z = await lesen(env)
    if (!z.gedaechtnis) return

    const heute = new Date(event.scheduledTime || Date.now())
    const letzterBericht = z.letzterBericht ? new Date(z.letzterBericht) : null
    const fehler = z.letzterFehler
    const fehlerNeu = fehler && (!letzterBericht || new Date(fehler.zeit) > letzterBericht)

    if (fehlerNeu) {
      ctx.waitUntil(betreiberMelden(
        `Seit der letzten Prüfung ist ein Fehler aufgetreten.\n${fehler.zeit}\n${fehler.was}`,
        env,
      ))
    } else if (heute.getUTCDay() === 1) {
      const g = z.gezaehlt
      ctx.waitUntil(betreiberMelden(
        `Lebenszeichen.\nAngekommen ${g.angekommen} · zugestellt ${g.zugestellt} · geblockt ${g.geblockt} · Fehler ${g.fehler}\nLetzte Mail: ${z.letzteMail || 'noch keine'}`,
        env,
      ))
    }
    await schreiben(env, { letzterBericht: jetzt() })
  },
}
