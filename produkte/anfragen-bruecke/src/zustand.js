/**
 * Gedaechtnis der Bruecke. Optional.
 *
 * Fehlt die KV-Bindung, laeuft alles weiter -- nur ohne Zaehler und ohne
 * Herzschlag. Eine Bruecke, die nur mit Datenbank funktioniert, ist am
 * ersten Tag schwerer einzurichten und am zweiten anfaelliger.
 */

const SCHLUESSEL = 'bruecke:zustand'

const LEER = {
  letzteMail: null,
  letzteZustellung: null,
  letzterFehler: null,
  gezaehlt: { angekommen: 0, zugestellt: 0, geblockt: 0, fehler: 0 },
}

export async function lesen(env) {
  if (!env.ZUSTAND) return { ...LEER, gedaechtnis: false }
  try {
    const roh = await env.ZUSTAND.get(SCHLUESSEL, 'json')
    return { ...LEER, ...(roh || {}), gedaechtnis: true }
  } catch {
    return { ...LEER, gedaechtnis: false }
  }
}

export async function schreiben(env, aenderung) {
  if (!env.ZUSTAND) return
  try {
    const jetzt = await lesen(env)
    const neu = {
      ...jetzt,
      ...aenderung,
      gezaehlt: { ...jetzt.gezaehlt, ...(aenderung.gezaehlt || {}) },
    }
    delete neu.gedaechtnis
    await env.ZUSTAND.put(SCHLUESSEL, JSON.stringify(neu))
  } catch { /* Gedaechtnisverlust darf keine Zustellung verhindern */ }
}

export async function zaehlen(env, feld) {
  if (!env.ZUSTAND) return
  const z = await lesen(env)
  await schreiben(env, { gezaehlt: { [feld]: (z.gezaehlt[feld] || 0) + 1 } })
}
