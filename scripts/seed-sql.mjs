// Genera supabase/seed.sql con los cursos, paquetes y contenido de src/data.
// Uso: npm run seed   (vuelve a ejecutarlo cuando cambies lecciones o cursos)
import { writeFileSync } from 'node:fs'
import { seedBundles, seedContent, seedCourses } from '../src/data/seedData.js'

const str = (s) => `'${String(s ?? '').replace(/'/g, "''")}'`
const num = (n) => (n == null ? 'null' : Number(n))
const json = (o) => {
  const j = JSON.stringify(o)
  if (j.includes('$nivela$')) throw new Error('El contenido no puede incluir $nivela$')
  return `$nivela$${j}$nivela$::jsonb`
}
const arr = (a) => `array[${a.map(str).join(', ')}]`

const lines = [
  '-- Generado con: npm run seed  (no lo edites a mano)',
  '-- Ejecútalo en Supabase → SQL Editor después de schema.sql. Se puede repetir sin problema.',
  '-- Al repetirlo NO cambia precios, estado, color, portada ni etiquetas (eso se administra desde el panel).',
  '',
]
for (const c of seedCourses) {
  lines.push(
    `insert into public.courses (slug, title, short, description, level, category, price, compare_at_price, badge, currency, color, cover, status, outline, sort) values (` +
    [str(c.slug), str(c.title), str(c.short), str(c.description), str(c.level), str(c.category), num(c.price), num(c.compare_at_price), str(c.badge || ''), str(c.currency), str(c.color), str(c.cover), str(c.status), json(c.outline), num(c.sort)].join(', ') +
    `)\n  on conflict (slug) do update set title = excluded.title, short = excluded.short, description = excluded.description, level = excluded.level, category = excluded.category, outline = excluded.outline, sort = excluded.sort;`,
  )
}
lines.push('')
for (const b of seedBundles) {
  lines.push(
    `insert into public.bundles (slug, title, short, price, currency, color, cover, status, courses, sort) values (` +
    [str(b.slug), str(b.title), str(b.short), num(b.price), str(b.currency), str(b.color), str(b.cover), str(b.status), arr(b.courses), num(b.sort)].join(', ') +
    `)\n  on conflict (slug) do update set title = excluded.title, short = excluded.short, courses = excluded.courses, sort = excluded.sort;`,
  )
}
lines.push('')
for (const [slug, content] of Object.entries(seedContent)) {
  lines.push(`insert into public.course_content (course_slug, data) values (${str(slug)}, ${json(content)})\n  on conflict (course_slug) do update set data = excluded.data;`)
}
writeFileSync(new URL('../supabase/seed.sql', import.meta.url), lines.join('\n') + '\n')
console.log(`✓ supabase/seed.sql: ${seedCourses.length} cursos, ${seedBundles.length} paquetes, ${Object.keys(seedContent).length} con contenido`)
