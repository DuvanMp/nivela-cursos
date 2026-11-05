# Nivela · Tienda de cursos con Inglés A1 interactivo

Tienda de cursos (React + Vite + Supabase) con:

- **8 cursos:**
  - Inglés para conversar (módulos 1, 2 y 3, con juegos, audio y diálogos reales)
  - Reto Militar 21 días (hombres y mujeres, con figuras animadas de cada ejercicio)
  - Domina las ventas por WhatsApp
  - Inteligencia artificial desde cero
  - Vende productos digitales en redes
- **Paquetes con descuento:** los 3 módulos de inglés y el Kit emprendedor digital.
- **Tienda con ofertas honestas:** precio anterior y descuento configurables. «Más vendido» y número de estudiantes se calculan solos con ventas reales.
- **Programa de afiliados:** enlace personal y comisión por venta calculada en el servidor. Sin niveles ni pagos por reclutar.
- **Usuarios y roles** (estudiante y administrador) y panel `/admin`.
- **Certificado de finalización** en todos los cursos.
- **Seguridad en la base de datos** (Row Level Security): las reglas se cumplen en el servidor aunque alguien modifique la página.

## Dos modos

| Modo | Cuándo | Dónde se guarda |
|---|---|---|
| **Demo** | Sin variables de entorno | En el navegador. El **primer usuario que se registra queda como administrador**. Sirve para mostrar el producto. |
| **Supabase** | Con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` | Base de datos real: cuentas, compras y progreso desde cualquier dispositivo. |

## Base de datos (Supabase, gratis)

1. Crea un proyecto en https://supabase.com (región São Paulo o la más cercana). Guarda la contraseña de la base de datos.
2. **SQL Editor → New query**: pega todo `supabase/schema.sql` y pulsa **Run**.
3. Otra consulta nueva: pega `supabase/seed.sql` y pulsa **Run** (cursos, precios iniciales y lecciones).
4. **Authentication → Sign In / Providers → Email**:
   - Deja activado **Confirm email**.
   - **Minimum password length**: 8.
   - **Password requirements**: letras y números.
5. **Authentication → URL Configuration → Site URL**: la dirección de tu sitio en Vercel.
6. **Project Settings → API**: copia la *Project URL* y la *anon public key*.
7. En Vercel → tu proyecto → **Settings → Environment Variables** agrega:
   - `VITE_SUPABASE_URL` = Project URL
   - `VITE_SUPABASE_ANON_KEY` = anon public key

   Luego **Deployments → Redeploy**.
8. Regístrate en tu sitio y conviértete en administrador. En **SQL Editor** ejecuta (con tu correo):

   ```sql
   update public.profiles set role = 'admin' where email = 'tu-correo@ejemplo.com';
   ```

   Cierra sesión y vuelve a entrar: verás **Administrar** en el menú.

> La *anon key* es pública por diseño: la protección está en las reglas de la base de datos. **Nunca** pongas la *service_role key* en Vercel con el prefijo `VITE_` ni en el código del navegador.

## Panel de administración (`/admin`)

- **Cursos y precios:** imagen de portada (subir, cambiar o volver a la ilustración original), precio, precio anterior (descuento), etiqueta «Nuevo» o «Recomendado», estado, textos y cursos nuevos.
- **Paquetes:** cursos incluidos, precio e imagen propia opcional; el ahorro se calcula solo.
- **Afiliados:** comisiones por pagar y pagadas; marca como pagado cuando transfieras.
- **Usuarios y roles:** busca usuarios, cambia su rol, registra una venta pagada por fuera (Nequi, transferencia) o da acceso de cortesía, y quita accesos.
- **Ventas:** ingresos reales, pagos de prueba, cortesías y la lista de compras.
- **Ajustes:** activa o desactiva los pagos de prueba (**desactívalos antes de lanzar**) y define el % de comisión de afiliados.

## Imágenes de portada

Cada curso trae su ilustración propia (`src/components/CoverArt.jsx`). Desde `/admin` puedes reemplazarla por una imagen tuya, en el curso o en el paquete:

- La página la recorta a 16:9 (1280 × 720), la comprime a WebP y la sube a la carpeta pública `covers` de Supabase Storage (solo admite JPG, PNG y WebP de hasta 1 MB; nunca SVG).
- Solo un administrador puede subir, cambiar o borrar imágenes: lo exige la base de datos (`supabase/schema.sql`), no la página.
- Si actualizas una instalación que ya tenías, **vuelve a ejecutar `supabase/schema.sql`** en el SQL Editor (se puede repetir sin riesgo): agrega la columna `image` y crea la carpeta con sus reglas.
- Los cursos nuevos sin imagen ni ilustración usan una portada de color con el «Texto de portada».

## Seguridad

- **Row Level Security en todas las tablas** (`supabase/schema.sql`):
  - El catálogo es público, pero solo un admin cambia precios o crea cursos. Los borradores solo los ve el admin.
  - El **contenido de las lecciones** solo lo recibe quien compró el curso (o un admin). Con Supabase, el contenido no viaja en el código de la página.
  - Las **compras** no se pueden crear desde el navegador: el pago de prueba pasa por la función `simulate_purchase`, que usa el precio guardado en la base de datos y solo funciona para cursos publicados y con los pagos de prueba activos.
  - Cada usuario ve solo su perfil, sus compras y su progreso. Nadie puede cambiar su propio rol; solo un admin cambia roles.
  - El progreso solo se guarda en cursos a los que el usuario tiene acceso.
- **Contraseñas:** las gestiona Supabase Auth (cifradas, con límite de intentos). La página exige 8 caracteres con letras y números.
- **Cabeceras de seguridad** en `vercel.json`: Content-Security-Policy, HSTS, protección contra iframes (clickjacking), `nosniff` y `Referrer-Policy`.
- **Pruebas:** `npm run test:db` comprueba 95 reglas de seguridad (precios, roles, contenido, compras, paquetes, comisiones e imágenes) en un PostgreSQL embebido.

**Límite conocido:** la calificación de las lecciones ocurre en el navegador, así que un usuario técnico con acceso al curso podría marcar lecciones como completadas sin hacerlas. Afecta solo a su propio progreso y certificado (que no es oficial). Si algún día el certificado tiene valor formal, el examen final debe calificarse en el servidor.

## Pagos reales (siguiente paso)

1. En `src/pages/Checkout.jsx`, redirige a la pasarela (Wompi, Mercado Pago…) en lugar de llamar a `purchase()`.
2. Crea una función de servidor (por ejemplo `api/webhook.js` en Vercel) que verifique la firma de la pasarela y cree la fila en `purchases` con `status = 'pagado'`, `amount` y `provider_ref`, usando la *service_role key* (variable de entorno **sin** `VITE_`).
3. En `/admin → Ajustes`, desactiva los pagos de prueba.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # pruebas de ejercicios y progreso
npm run test:db   # pruebas de seguridad de la base de datos
npm run seed      # regenera supabase/seed.sql si cambias lecciones o cursos
npm run build
```

## Agregar contenido

- Inglés: `src/data/ingles-a1.js`, `ingles-m2.js`, `ingles-m3.js` (cada lección: 6 palabras, 3 frases, diálogo y explicación opcional). Los repasos y el examen se arman solos.
- Reto Militar: `src/data/reto-militar.js` (rutinas) y `src/data/ejercicios.js` (técnica y figura de cada ejercicio; ahí puedes agregar un enlace de video).
- WhatsApp, IA y Redes: `src/data/ventas-whatsapp.js`, `ia-desde-cero.js`, `redes-digitales.js` (bloques de texto, pasos, chats, plantillas y mini pruebas).
- Cursos iniciales: `src/data/seedData.js`. Después de cambiar algo, ejecuta `npm run seed` y vuelve a correr `supabase/seed.sql` en Supabase (no cambia precios ni estados que ya editaste en el panel).

> Nota: el plan gratis de Vercel (Hobby) es para uso no comercial. Cuando empieces a cobrar, usa Vercel Pro o Cloudflare Pages (si usas Cloudflare, copia las cabeceras de `vercel.json` a un archivo `public/_headers`).
