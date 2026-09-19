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
 * Stoerungen gehen an den Betreiber, nicht an den Kunden -- und zwar per
 * E-Mail ueber Resend.
 *
 * Nicht ueber WhatsApp, obwohl der Kanal danebenliegt: Eine
 * geschaeftsinitiierte WhatsApp-Nachricht braucht eine genehmigte Vorlage,
 * und eine Vorlage mit einer freien Fehlermeldung als Variable waere bei
 * Meta entweder abgelehnt oder sie zwaengt jede Stoerung in drei Felder.
 * Eine Stoerungsmeldung muss sagen duerfen, was kaputt ist.
 *
 * Resend steht ohnehin schon, weil die Kundenwebsites darueber verschicken.
 * Fehlt es, bleibt die Meldung im Protokoll -- verschluckt wird sie nie.
 */
export async function betreiberMelden(text, env) {
  const zeile = `Brücke: ${text}`
  console.log('STOERUNG | ' + zeile.replace(/\n/g, ' | '))

  if (!env.RESEND_TOKEN || !env.BETREIBER_MAIL || !env.ABSENDER_MAIL) return false
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
        subject: 'Anfragen-Brücke: Störung',
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
