// Prepara la imagen de portada en el navegador antes de subirla:
// la recorta a 16:9 (1280×720), la comprime a WebP y verifica tipo y tamaño.
// Así nunca se sube una foto de 8 MB y la tienda carga rápido.
const TIPOS = ['image/png', 'image/jpeg', 'image/webp']

export async function prepareCover(file, { w = 1280, h = 720, maxBytes = 450 * 1024 } = {}) {
  if (!file || !TIPOS.includes(file.type)) throw new Error('Usa una imagen JPG, PNG o WebP.')
  if (file.size > 12 * 1024 * 1024) throw new Error('La imagen pesa más de 12 MB. Elige una más liviana.')
  let bmp
  try { bmp = await createImageBitmap(file) } catch { throw new Error('No pude leer esa imagen. Prueba con otra.') }
  if (bmp.width < 640 || bmp.height < 360) throw new Error('La imagen es muy pequeña. Usa una de mínimo 640 × 360 píxeles.')

  // Recorte centrado a 16:9 (como "cover")
  const scale = Math.max(w / bmp.width, h / bmp.height)
  const sw = w / scale, sh = h / scale
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bmp, (bmp.width - sw) / 2, (bmp.height - sh) / 2, sw, sh, 0, 0, w, h)
  bmp.close?.()

  const toBlob = (type, q) => new Promise((res) => canvas.toBlob(res, type, q))
  let q = 0.86, blob = await toBlob('image/webp', q)
  if (!blob || blob.type !== 'image/webp') { blob = await toBlob('image/jpeg', q) }
  while (blob && blob.size > maxBytes && q > 0.4) { q -= 0.12; blob = await toBlob(blob.type, q) }
  if (!blob) throw new Error('No pude procesar la imagen.')
  if (blob.size > 1024 * 1024) throw new Error('La imagen sigue muy pesada. Prueba con otra.')
  return blob
}

export const blobToDataUrl = (blob) => new Promise((res, rej) => {
  const r = new FileReader()
  r.onload = () => res(r.result)
  r.onerror = () => rej(new Error('No pude leer la imagen.'))
  r.readAsDataURL(blob)
})
