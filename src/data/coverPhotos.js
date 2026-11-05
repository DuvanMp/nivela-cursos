// Fotos de portada de cada curso (Unsplash, licencia gratuita para uso comercial).
// Se cargan directamente desde el servidor de imágenes de Unsplash, que las
// recorta a 16:9 y las comprime según el tamaño de la tarjeta.
// Si el administrador sube una imagen propia, esa tiene prioridad.
// Si la foto no carga, se muestra la ilustración del curso (CoverArt.jsx).
export const COVER_PHOTOS = {
  'ingles-a1': {
    src: 'https://images.unsplash.com/photo-1582298538104-fe2e74c27f59',
    label: 'Inglés · Módulo 1',
    credit: 'Toa Heftiba', page: 'https://unsplash.com/photos/four-friends-laughing-and-high-fiving-over-coffee-l_ExpFwwOEg',
  },
  'ingles-m2': {
    src: 'https://images.unsplash.com/photo-1543269865-cbf427effbad',
    label: 'Inglés · Módulo 2',
    credit: 'Brooke Cagle', page: 'https://unsplash.com/photos/a-group-of-friends-at-a-coffee-shop--uHVRvDr7pg',
  },
  'ingles-m3': {
    src: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d',
    label: 'Inglés · Módulo 3',
    credit: 'JESHOOTS.COM', page: 'https://unsplash.com/photos/man-sitting-on-gang-chair-with-feet-on-luggage-looking-at-airplane-mSESwdMZr-A',
  },
  'reto-militar-hombres': {
    src: 'https://images.unsplash.com/photo-1760084081757-6f918c08403b',
    label: 'Misión 21 · Hombres', tone: 'olive',
    credit: 'Rahul Gupta', page: 'https://unsplash.com/photos/man-doing-push-ups-in-a-sunlit-living-room-2rZ4nhCdQNc',
  },
  'reto-militar-mujeres': {
    src: 'https://images.unsplash.com/photo-1714646442330-9068099f5521',
    label: 'Misión 21 · Mujeres', tone: 'olive',
    credit: 'Vitaly Gariev', page: 'https://unsplash.com/photos/a-woman-is-doing-push-ups-on-the-floor-7C_Ri-7kyXc',
  },
  'ventas-whatsapp': {
    src: 'https://images.unsplash.com/photo-1770013413878-2530e2c3d82b',
    label: 'Ventas por WhatsApp',
    credit: 'Rifki Kurniawan', page: 'https://unsplash.com/photos/woman-checking-package-with-phone-near-laptop-and-boxes-k63Or81F8-M',
  },
  'ia-desde-cero': {
    src: 'https://images.unsplash.com/photo-1682420636597-0786f3406a94',
    label: 'IA desde cero',
    credit: 'Viralyft', page: 'https://unsplash.com/photos/a-man-sitting-in-front-of-a-laptop-computer-2LI1Rl5b_P4',
  },
  'redes-digitales': {
    src: 'https://images.unsplash.com/photo-1695408247109-3bf125ad0538',
    label: 'Redes y negocio digital',
    credit: 'Wesley Tingey', page: 'https://unsplash.com/photos/a-woman-taking-a-picture-of-herself-in-a-kitchen-RAH1ipSQh24',
  },
}

// Dirección de la foto recortada a 16:9 (o cuadrada) al ancho pedido
export const photoUrl = (src, w, square = false) =>
  `${src}?w=${w}&h=${square ? w : Math.round((w * 9) / 16)}&fit=crop&crop=faces,entropy&auto=format&q=72`
