# Nivela · Tienda de cursos con Inglés A1 interactivo

Tienda de cursos (React + Vite) con el curso **Inglés A1** completo: 11 unidades, 48 lecciones (37 de contenido, 10 repasos y un examen final), 222 palabras, explicaciones de gramática en español y certificado de finalización. Ejercicios de elegir, escuchar, unir parejas, armar frases y escribir. Guarda XP, estrellas y racha por usuario.

## Cómo funciona

- **Tienda** (`/`): 6 cursos. Solo Inglés A1 tiene contenido; los otros aparecen como "Próximamente".
- **Curso** (`/curso/ingles-a1`) → **Crear cuenta** (`/entrar`) → **Pago de prueba** (`/pagar/ingles-a1`) → **Camino de lecciones** (`/aprender/ingles-a1`).
- Las lecciones se desbloquean en orden. Un error vuelve a aparecer al final de la lección.

## Dos modos de guardado

| Modo | Cuándo | Dónde se guarda |
|---|---|---|
| **Demo** (por defecto) | Sin variables de entorno | En el navegador (localStorage). Sirve para mostrar el producto. |
| **Supabase** | Con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` | Cuentas reales; el progreso se ve desde cualquier dispositivo. |

### Activar Supabase (gratis)

1. Crea un proyecto en https://supabase.com.
2. En **SQL Editor**, pega y ejecuta `supabase/schema.sql`.
3. En **Project Settings → API** copia la *Project URL* y la *anon public key*.
4. En Vercel → tu proyecto → **Settings → Environment Variables** agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`, y vuelve a desplegar.
5. En Supabase → **Authentication → URL Configuration**, pon la dirección de tu sitio en *Site URL*.

## Pagos

Hoy el pago es **simulado** (`PAYMENTS_MODE` en `src/lib/backend.js`). Para cobrar de verdad (Wompi, Mercado Pago, etc.):

1. En `src/pages/Checkout.jsx`, redirige a la pasarela en lugar de llamar a `purchase()`.
2. Crea una función de servidor (por ejemplo `api/webhook.js` en Vercel) que reciba la confirmación de la pasarela y cree la fila en `purchases` con `status = 'pagado'` usando la *service_role key*.
3. Borra las políticas "acceso simulado" de `supabase/schema.sql`.

## Desarrollo

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # pruebas de ejercicios y progreso
npm run build
```

## Agregar contenido

- Lecciones de inglés: `src/data/ingles-a1.js` (cada lección: 6 palabras, 3 frases y una explicación opcional `tip`). Los repasos y el examen se arman solos.
- Cursos de la tienda: `src/data/courses.js`.

> Nota: el plan gratis de Vercel (Hobby) es para uso no comercial. Cuando empieces a cobrar, usa Vercel Pro o Cloudflare Pages.
