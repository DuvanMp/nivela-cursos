// Prueba las reglas de seguridad de la base de datos en un PostgreSQL embebido.
// Uso: npm run test:db
import { PGlite } from '@electric-sql/pglite'
import { readFileSync } from 'node:fs'

const db = new PGlite()
const R = new URL('../supabase/', import.meta.url)
const sql = (f) => readFileSync(new URL(f, R), 'utf8')

// Simulación mínima de Supabase: esquema auth, auth.uid() y roles
await db.exec(`
create schema auth;
create table auth.users (id uuid primary key, email text, raw_user_meta_data jsonb);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create role anon nologin; create role authenticated nologin;
grant usage on schema public, auth to anon, authenticated;
alter default privileges in schema public grant all on tables to anon, authenticated;
alter default privileges in schema public grant all on functions to anon, authenticated;
`)
await db.exec(sql('schema.sql'))
await db.exec(sql('schema.sql')) // se puede repetir
await db.exec(sql('seed.sql'))
await db.exec(sql('seed.sql'))

const A = '11111111-1111-1111-1111-111111111111' // admin
const B = '22222222-2222-2222-2222-222222222222' // Ana, estudiante
const C = '33333333-3333-3333-3333-333333333333' // Carlos, afiliado
await db.exec(`insert into auth.users values ('${A}','admin@x.co','{"name":"Admin"}'), ('${B}','ana@x.co','{"name":"Ana"}'), ('${C}','carlos@x.co','{"name":"Carlos"}');`)
await db.exec(`update public.profiles set role='admin' where email='admin@x.co';`) // como en el SQL Editor
const refC = (await db.query(`select ref_code from public.profiles where id='${C}'`)).rows[0].ref_code

let ok = 0, failN = 0
async function as(uid, role, q, expectError) {
  try {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '${uid || ''}', false); set role ${role};`)
    const r = await db.query(q)
    await db.exec('reset role')
    if (expectError) { console.log('✗ DEBIÓ FALLAR:', q); failN++ } else ok++
    return r.rows
  } catch (e) {
    await db.exec('reset role')
    if (expectError) { ok++; return e.message }
    console.log('✗ ERROR:', q, '→', e.message); failN++
    return []
  }
}
const check = (cond, msg) => { if (cond) ok++; else { failN++; console.log('✗', msg) } }

// ── Anónimo
let r = await as(null, 'anon', `select slug from public.courses`)
check(r.length === 8, 'anon ve los 8 cursos')
r = await as(null, 'anon', `select slug from public.bundles`); check(r.length === 2, 'anon ve los 2 paquetes')
r = await as(null, 'anon', `select * from public.course_content`); check(r.length === 0, 'anon no ve contenido')
await as(null, 'anon', `select public.simulate_purchase('ingles-a1')`, true)
await as(null, 'anon', `select * from public.course_stats()`)

// ── Estudiante Ana
r = await as(B, 'authenticated', `select * from public.course_content`); check(r.length === 0, 'Ana sin compra no ve contenido')
await as(B, 'authenticated', `insert into public.purchases (user_id, course_slug, status) values ('${B}','ingles-a1','pagado')`, true)
await as(B, 'authenticated', `select public.register_purchase(array['ingles-a1'], array[0], null, null)`, true) // función interna, prohibida
await as(B, 'authenticated', `update public.courses set price = 1 where slug='ingles-a1'`)
r = await as(null, 'anon', `select price from public.courses where slug='ingles-a1'`); check(r[0].price === 59900, 'Ana no pudo cambiar el precio')
await as(B, 'authenticated', `update public.bundles set price = 1 where slug='ingles-completo'`)
r = await as(null, 'anon', `select price from public.bundles where slug='ingles-completo'`); check(r[0].price === 119900, 'Ana no pudo cambiar el precio del paquete')
await as(B, 'authenticated', `update public.profiles set role='admin' where id='${B}'`, true)
await as(B, 'authenticated', `update public.profiles set ref_code='hack' where id='${B}'`, true)
await as(B, 'authenticated', `insert into public.progress (user_id, course_slug, data) values ('${B}','ingles-a1','{}')`, true)

// Compra de un curso con enlace de afiliado de Carlos
await as(B, 'authenticated', `select public.simulate_purchase('ingles-a1', '${refC}')`)
r = await as(B, 'authenticated', `select status, amount, affiliate_id, commission, commission_status from public.purchases`)
check(r.length === 1 && r[0].amount === 59900 && r[0].status === 'simulado', 'compra simulada con precio del servidor')
check(r[0].affiliate_id === C && r[0].commission === Math.round(59900 * 0.3) && r[0].commission_status === 'prueba', 'comisión del afiliado calculada en el servidor')
r = await as(B, 'authenticated', `select data->'units' is not null as ok from public.course_content`); check(r.length === 1, 'Ana con compra ve solo ese contenido')

// Paquete de inglés: ya tiene el módulo 1, se cobran los otros 2 con el precio del paquete
await as(B, 'authenticated', `select public.simulate_bundle_purchase('ingles-completo', '${refC}')`)
r = await as(B, 'authenticated', `select course_slug, amount, bundle_slug from public.purchases where bundle_slug='ingles-completo' order by course_slug`)
check(r.length === 2 && r[0].amount + r[1].amount === 119900, `paquete reparte el precio entre los cursos nuevos (${JSON.stringify(r)})`)
await as(B, 'authenticated', `select public.simulate_bundle_purchase('ingles-completo')`, true) // ya los tiene todos
r = await as(B, 'authenticated', `select count(*)::int n from public.course_content`); check(r[0].n === 3, 'Ana ve el contenido de los 3 módulos')

// Auto-referido: Carlos compra con su propio código → sin comisión
await as(C, 'authenticated', `select public.simulate_purchase('ia-desde-cero', '${refC}')`)
r = await as(C, 'authenticated', `select affiliate_id, commission from public.purchases`); check(r[0].affiliate_id === null && r[0].commission === 0, 'no hay comisión por comprarse a sí mismo')

// Panel del afiliado: ve sus ventas sin datos del comprador
r = await as(C, 'authenticated', `select * from public.my_affiliate_sales()`)
check(r.length === 3 && !('user_id' in r[0]), 'Carlos ve sus 3 ventas sin saber quién compró')
r = await as(C, 'authenticated', `select * from public.purchases where user_id='${B}'`); check(r.length === 0, 'Carlos no ve las compras de Ana')

await as(B, 'authenticated', `insert into public.progress (user_id, course_slug, data) values ('${B}','ingles-a1','{"xp":10}')`)
await as(B, 'authenticated', `insert into public.progress (user_id, course_slug, data) values ('${A}','ingles-a1','{}')`, true) // progreso ajeno
r = await as(B, 'authenticated', `select * from public.profiles`); check(r.length === 1, 'Ana solo ve su perfil')
await as(B, 'authenticated', `update public.profiles set full_name='Ana María' where id='${B}'`)
await as(B, 'authenticated', `update public.settings set value='"real"' where key='payments_mode'`)
r = await as(null, 'anon', `select value #>> '{}' v from public.settings where key='payments_mode'`); check(r[0].v === 'simulado', 'Ana no puede cambiar ajustes')

// ── Admin
await as(A, 'authenticated', `update public.courses set price = 49900, compare_at_price = 59900, badge='nuevo' where slug='ingles-a1'`)
r = await as(null, 'anon', `select price, compare_at_price, badge from public.courses where slug='ingles-a1'`); check(r[0].price === 49900 && r[0].badge === 'nuevo', 'admin cambia precio y etiqueta')
await as(A, 'authenticated', `update public.courses set badge='mas vendido' where slug='ingles-a1'`, true) // "Más vendido" no se pone a mano
await as(A, 'authenticated', `update public.bundles set price = 99900 where slug='ingles-completo'`)
r = await as(A, 'authenticated', `select * from public.profiles`); check(r.length === 3, 'admin ve todos los perfiles')
await as(A, 'authenticated', `update public.profiles set role='student' where id='${A}'`, true) // su propio rol
await as(A, 'authenticated', `update public.purchases set commission_status='pagada' where affiliate_id='${C}'`)
await as(A, 'authenticated', `update public.purchases set status='pagado' where user_id='${B}'`)
r = await as(null, 'anon', `select students, sales from public.course_stats() where course_slug='ingles-a1'`); check(r[0].sales === 1, 'estadísticas cuentan solo ventas pagadas')
await as(A, 'authenticated', `update public.purchases set status='reembolsado' where user_id='${B}' and course_slug='ingles-a1'`)
r = await as(B, 'authenticated', `select count(*)::int n from public.course_content where course_slug='ingles-a1'`); check(r[0].n === 0, 'tras quitar acceso, Ana ya no ve ese contenido')
await as(B, 'authenticated', `update public.progress set data='{"xp":99}' where user_id='${B}'`)
r = await as(A, 'authenticated', `select data from public.progress where user_id='${B}'`); check(r[0].data.xp === 10, 'sin acceso no puede modificar progreso')
await as(A, 'authenticated', `update public.settings set value='"real"' where key='payments_mode'`)
await as(B, 'authenticated', `select public.simulate_purchase('ventas-whatsapp')`, true) // pagos de prueba desactivados
await as(B, 'authenticated', `select public.simulate_bundle_purchase('kit-emprendedor')`, true)
await as(A, 'authenticated', `update public.courses set price = -5 where slug='ingles-a1'`, true)
await as(A, 'authenticated', `insert into public.courses (slug, title, price) values ('Malo Slug','x',1)`, true)
await as(A, 'authenticated', `insert into public.bundles (slug, title, price, courses) values ('uno','Solo uno',1, array['ingles-a1'])`, true)

console.log(`${failN ? '✗' : '✓'} Base de datos: ${ok} verificaciones correctas, ${failN} fallidas`)
if (failN) process.exit(1)
