// Enlace de afiliado: si alguien llega con ?ref=CODIGO, se recuerda 30 días
// en este navegador y se envía al comprar. La comisión la calcula el servidor.
const KEY = 'nivela-ref'
const DAYS = 30

export function captureRef() {
  try {
    const code = new URLSearchParams(window.location.search).get('ref')
    if (code && /^[a-z0-9]{4,16}$/i.test(code)) localStorage.setItem(KEY, JSON.stringify({ code: code.toLowerCase(), at: Date.now() }))
  } catch { /* sin almacenamiento */ }
}

export function getRef() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY))
    if (v && Date.now() - v.at < DAYS * 86400000) return v.code
  } catch { /* sin almacenamiento */ }
  return null
}

export const affiliateLink = (code) => `${window.location.origin}/?ref=${code}`
