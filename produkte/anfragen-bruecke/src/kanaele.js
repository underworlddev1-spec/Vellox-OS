/**
 * Die Ausgaenge. Austauschbar, und das ist Absicht.
 *
 * WhatsApp braucht bei Meta eine verifizierte Nummer und eine genehmigte
 * Vorlage; das dauert Tage bis Wochen. Telegram braucht zehn Minuten und
 * kostet nichts. **Deshalb wird gegen Telegram gebaut und geprueft, und
 * WhatsApp wird angehaengt, wenn Meta durch ist.** Ein Bau, der auf eine
 * fremde Freigabe wartet, steht still, ohne dass jemand etwas lernt.
 *
 * Wenn Meta morgen die Preise verdoppelt oder die Nummer sperrt, ist der
 * Wechsel eine Variable und kein Umbau.
 */

const GRAPH = 'https://graph.facebook.com/v21.0'

class ZustellFehler extends Error {
  constructor(kanal, status, meldung) {
    super(`${kanal}: ${status} ${meldung}`)
    this.kanal = kanal
    this.status = status
  }
}

async function antwortLesen(res) {
  try {
    const t = await res.text()
    try {
      const j = JSON.parse(t)
      // Nur die Fehlermeldung herausziehen. Die Antwort des Dienstes darf
      // nicht vollstaendig nach aussen wandern -- sie enthaelt IDs und
      // gelegentlich Teile der Anfrage.
      return (j.error && (j.error.message || j.error.type)) || (j.description) || t.slice(0, 200)
    } catch {
      return t.slice(0, 200)
    }
  } catch {
    return '(keine Antwort lesbar)'
  }
}

/** WhatsApp Cloud API. Geschaeftsinitiiert, also zwingend eine Vorlage. */
export async function whatsappSenden({ nummer, parameter, env }) {
  if (!env.WHATSAPP_TOKEN || !env.WHATSAPP_TELEFON_ID) {
    throw new ZustellFehler('whatsapp', 0, 'nicht eingerichtet (Token oder Telefon-ID fehlt)')
  }
  if (!nummer) throw new ZustellFehler('whatsapp', 0, 'keine Zielnummer hinterlegt')

  const res = await fetch(`${GRAPH}/${env.WHATSAPP_TELEFON_ID}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: String(nummer).replace(/\D/g, ''),
      type: 'template',
      template: {
        name: env.WHATSAPP_VORLAGE || 'neue_anfrage',
        language: { code: env.WHATSAPP_SPRACHE || 'de' },
        components: [{
          type: 'body',
          parameters: parameter.map((text) => ({ type: 'text', text })),
        }],
      },
    }),
  })

  if (!res.ok) throw new ZustellFehler('whatsapp', res.status, await antwortLesen(res))
  return { kanal: 'whatsapp', status: res.status }
}

/** Telegram. Fuer den Bau, den Test und als Ausweichweg im Betrieb. */
export async function telegramSenden({ chat, text, env }) {
  if (!env.TELEGRAM_TOKEN) {
    throw new ZustellFehler('telegram', 0, 'nicht eingerichtet (Token fehlt)')
  }
  const ziel = chat || env.TELEGRAM_CHAT
  if (!ziel) throw new ZustellFehler('telegram', 0, 'kein Chat hinterlegt')

  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: ziel, text, disable_web_page_preview: true }),
  })

  if (!res.ok) throw new ZustellFehler('telegram', res.status, await antwortLesen(res))
  return { kanal: 'telegram', status: res.status }
}

/**
 * Zustellen ueber den konfigurierten Kanal.
 * Der Kunde gewinnt gegen die globale Einstellung.
 */
export async function zustellen({ kunde, text, parameter, env }) {
  const kanal = (kunde && kunde.kanal) || env.KANAL || 'telegram'
  const ziel = (kunde && kunde.ziel) || {}

  if (kanal === 'whatsapp') {
    const nummer = ziel.whatsapp && env[ziel.whatsapp] ? env[ziel.whatsapp] : ziel.whatsapp
    return whatsappSenden({ nummer, parameter, env })
  }
  return telegramSenden({ chat: ziel.telegram, text, env })
}

/**
 * Baut die Meldung als RFC-5322-Nachricht.
 *
 * Eigenhaendig und ohne Bibliothek, weil eine reine Textmail aus acht
 * Kopfzeilen besteht und eine Abhaengigkeit dafuer teurer waere als der
 * Code. Zwei Stellen darin sind keine Formsache.
 *
 * Der Betreff traegt einen Umlaut, und ein Kopfzeilenwert ist nach Norm
 * US-ASCII. Ohne die Kodierung nach RFC 2047 kommt "St?rung" an oder der
 * Empfaenger verwirft die Zeile.
 *
 * Der Rumpf geht als Base64 und nicht als 8-Bit-Text. Eine Stoerungsmeldung
 * traegt fremden Text -- eine Absenderadresse, die Antwort eines Dienstes --
 * und darin kann eine Zeile stehen, die mit einem einzelnen Punkt beginnt
 * oder laenger als 998 Zeichen ist. Beides bricht SMTP an einer Stelle, an
 * der niemand mehr hinsieht, und ausgerechnet die Meldung ueber einen
 * Ausfall darf nicht selbst ausfallen.
 *
 * Rein, damit sie ohne Worker-Laufzeit geprueft werden kann; die Kennung
 * kommt deshalb von aussen.
 */
export function meldungMime({ von, an, betreff, text, kennung }) {
  const roh = (s) => {
    const bytes = new TextEncoder().encode(s)
    let binaer = ''
    for (const b of bytes) binaer += String.fromCharCode(b)
    return btoa(binaer)
  }
  return [
    `From: ${von}`,
    `To: ${an}`,
    `Subject: =?UTF-8?B?${roh(betreff)}?=`,
    `Message-ID: <${kennung}>`,
    `Date: ${new Date().toUTCString().replace('GMT', '+0000')}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: base64',
    '',
    roh(text).replace(/(.{76})/g, '$1\r\n'),
  ].join('\r\n')
}

/**
 * Stoerungen gehen an den Betreiber, nicht an den Kunden -- und zwar per
 * E-Mail.
 *
 * Nicht ueber WhatsApp, obwohl der Kanal danebenliegt: Eine
 * geschaeftsinitiierte WhatsApp-Nachricht braucht eine genehmigte Vorlage,
 * und eine Vorlage mit einer freien Fehlermeldung als Variable waere bei
 * Meta entweder abgelehnt oder sie zwaengt jede Stoerung in drei Felder.
 * Eine Stoerungsmeldung muss sagen duerfen, was kaputt ist. Der haertere
 * Grund liegt eine Ebene tiefer: **Ein Alarm darf nicht den Kanal benutzen,
 * dessen Ausfall er meldet.**
 *
 * Der erste Weg ist seit dem 20. September 2026 Cloudflares eigenes
 * `send_email`-Binding und nicht mehr Resend. Das Binding darf nur an
 * *verifizierte* Zieladressen des Accounts senden. Fuer eine Meldung, die
 * ausschliesslich an den Betreiber geht, ist das keine Huerde, sondern die
 * richtige Grenze: Eine Stoerungsmeldung, die versehentlich beim Kunden
 * landet, waere schlimmer als gar keine. Und es faellt eine Abhaengigkeit
 * weg, die die Bruecke fuer ihren Datenpfad nie gebraucht hat -- Mail rein,
 * WhatsApp raus, dazwischen wird nichts verschickt.
 *
 * Resend bleibt als zweiter Weg stehen, und das ist Absicht und kein
 * Zoegern. Das Binding haengt an einer Liste, die im Dashboard gepflegt
 * wird; wer dort eine Adresse austauscht und die Bruecke nicht anfasst, hat
 * einen stummen Alarmkanal, ohne es zu merken. Genau dieser Zustand ist der,
 * den die Funktion verhindern soll. Beide Wege sind optional, und fehlt auch
 * der zweite, bleibt die Meldung im Protokoll -- verschluckt wird sie nie.
 */
export async function betreiberMelden(text, env) {
  const zeile = `Brücke: ${text}`
  console.log('STOERUNG | ' + zeile.replace(/\n/g, ' | '))

  if (!env.BETREIBER_MAIL || !env.ABSENDER_MAIL) return false
  const betreff = 'Anfragen-Brücke: Störung'

  // Erster Weg: das Binding. `cloudflare:email` gibt es nur in der
  // Worker-Laufzeit, deshalb erst hier und nicht im Dateikopf -- ausserhalb
  // wuerde schon das Laden des Moduls scheitern.
  if (env.MELDUNG) {
    try {
      const { EmailMessage } = await import('cloudflare:email')
      const kennung = `${crypto.randomUUID()}@${env.ABSENDER_MAIL.split('@')[1]}`
      const roh = meldungMime({ von: env.ABSENDER_MAIL, an: env.BETREIBER_MAIL, betreff, text, kennung })
      await env.MELDUNG.send(new EmailMessage(env.ABSENDER_MAIL, env.BETREIBER_MAIL, roh))
      return true
    } catch (e) {
      // Nicht abbrechen. Genau dafuer steht der zweite Weg da.
      console.log('Meldung ueber send_email gescheitert:', e.message)
    }
  }

  // Zweiter Weg: Resend.
  if (!env.RESEND_TOKEN) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.ABSENDER_MAIL,
        to: [env.BETREIBER_MAIL],
        subject: betreff,
        text,
      }),
    })
    if (!res.ok) {
      console.log('Stoerungsmeldung nicht zustellbar:', res.status, await antwortLesen(res))
      return false
    }
    return true
  } catch (e) {
    // Eine Meldung, die selbst scheitert, darf den Lauf nicht abbrechen.
    console.log('Stoerungsmeldung gescheitert:', e.message)
    return false
  }
}
