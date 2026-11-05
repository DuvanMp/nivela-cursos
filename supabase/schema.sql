-- ════════════════════════════════════════════════════════════════════
-- Nivela · Base de datos (Supabase / PostgreSQL)
-- Ejecuta este archivo completo en Supabase → SQL Editor → New query → Run.
-- Después ejecuta seed.sql (cursos, paquetes y contenido) y crea tu usuario
-- administrador (ver README, sección "Base de datos").
-- Se puede ejecutar varias veces: también sirve para actualizar.
--
-- Seguridad: TODAS las tablas tienen Row Level Security. Las reglas se
-- cumplen en el servidor aunque alguien modifique la página en su navegador.
-- ════════════════════════════════════════════════════════════════════

-- ── Perfiles y roles ────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '' check (char_length(full_name) <= 80),
  role text not null default 'student' check (role in ('student', 'admin')),
  ref_code text unique,
  created_at timestamptz not null default now()
);
alter table public.profiles add column if not exists ref_code text unique;
update public.profiles set ref_code = substr(md5(id::text), 1, 8) where ref_code is null;

-- ¿El usuario que hace la petición es administrador?
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Al registrarse un usuario se crea su perfil con rol "student" y su código de afiliado
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, ref_code)
  values (new.id, new.email, coalesce(left(new.raw_user_meta_data ->> 'name', 80), ''), substr(md5(new.id::text), 1, 8));
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Un usuario puede cambiar su nombre, pero no su rol, correo ni código.
-- Solo un administrador cambia roles, y nunca el suyo propio (evita quedar sin admin).
-- (Desde el SQL Editor de Supabase no aplica: así creas el primer administrador.)
create or replace function public.protect_profile() returns trigger
language plpgsql set search_path = public as $$
begin
  if current_user in ('authenticated', 'anon') then
    if new.id is distinct from old.id or new.email is distinct from old.email or new.ref_code is distinct from old.ref_code then
      raise exception 'No se puede cambiar este dato';
    end if;
    if new.role is distinct from old.role then
      if not public.is_admin() then raise exception 'Solo un administrador puede cambiar roles'; end if;
      if old.id = auth.uid() then raise exception 'No puedes cambiar tu propio rol'; end if;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile before update on public.profiles
  for each row execute function public.protect_profile();

-- ── Cursos (catálogo y precios) ─────────────────────────────────────
create table if not exists public.courses (
  slug text primary key check (slug ~ '^[a-z0-9-]{2,60}$'),
  title text not null check (char_length(title) between 2 and 120),
  short text not null default '' check (char_length(short) <= 200),
  description text not null default '' check (char_length(description) <= 2000),
  level text not null default '' check (char_length(level) <= 60),
  category text not null default '' check (char_length(category) <= 40),
  price integer not null check (price between 0 and 100000000),
  compare_at_price integer check (compare_at_price is null or compare_at_price between 0 and 100000000),
  badge text not null default '' check (badge in ('', 'nuevo', 'recomendado')),
  currency text not null default 'COP' check (currency in ('COP', 'USD')),
  color text not null default 'ultra' check (color in ('ultra', 'mint', 'mango', 'rose', 'ink', 'sky', 'olive', 'sand')),
  cover text not null default '' check (char_length(cover) <= 20),
  status text not null default 'draft' check (status in ('draft', 'coming_soon', 'published')),
  outline jsonb not null default '[]',
  sort integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.courses add column if not exists category text not null default '';
alter table public.courses add column if not exists compare_at_price integer;
alter table public.courses add column if not exists badge text not null default '';
alter table public.courses drop constraint if exists courses_color_check;
alter table public.courses add constraint courses_color_check check (color in ('ultra', 'mint', 'mango', 'rose', 'ink', 'sky', 'olive', 'sand'));

-- Contenido de las lecciones: solo lo ven quienes compraron el curso
create table if not exists public.course_content (
  course_slug text primary key references public.courses (slug) on update cascade on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- ── Paquetes (varios cursos con descuento) ──────────────────────────
create table if not exists public.bundles (
  slug text primary key check (slug ~ '^[a-z0-9-]{2,60}$'),
  title text not null check (char_length(title) between 2 and 120),
  short text not null default '' check (char_length(short) <= 200),
  price integer not null check (price between 0 and 100000000),
  currency text not null default 'COP' check (currency in ('COP', 'USD')),
  color text not null default 'ultra' check (color in ('ultra', 'mint', 'mango', 'rose', 'ink', 'sky', 'olive', 'sand')),
  cover text not null default '' check (char_length(cover) <= 20),
  status text not null default 'draft' check (status in ('draft', 'coming_soon', 'published')),
  courses text[] not null check (cardinality(courses) between 2 and 20),
  sort integer not null default 0,
  updated_at timestamptz not null default now()
);

-- ── Compras ─────────────────────────────────────────────────────────
-- status: pendiente (esperando pasarela) · pagado · simulado (pago de prueba)
--         cortesia (acceso regalado por un admin) · reembolsado (sin acceso)
-- commission_status: pendiente · pagada · anulada · prueba (venta simulada)
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_slug text not null references public.courses (slug) on update cascade,
  status text not null check (status in ('pendiente', 'pagado', 'simulado', 'cortesia', 'reembolsado')),
  amount integer not null default 0 check (amount >= 0),
  currency text not null default 'COP',
  bundle_slug text,
  affiliate_id uuid references auth.users (id) on delete set null,
  commission integer not null default 0 check (commission >= 0),
  commission_status text check (commission_status in ('pendiente', 'pagada', 'anulada', 'prueba')),
  provider text,
  provider_ref text,
  created_at timestamptz not null default now(),
  unique (user_id, course_slug)
);
alter table public.purchases add column if not exists bundle_slug text;
alter table public.purchases add column if not exists affiliate_id uuid references auth.users (id) on delete set null;
alter table public.purchases add column if not exists commission integer not null default 0;
alter table public.purchases add column if not exists commission_status text;
create index if not exists purchases_user_idx on public.purchases (user_id);
create index if not exists purchases_affiliate_idx on public.purchases (affiliate_id);

-- ¿El usuario tiene acceso a este curso?
create or replace function public.has_access(p_slug text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.purchases
    where user_id = auth.uid() and course_slug = p_slug
      and status in ('pagado', 'simulado', 'cortesia')
  );
$$;

-- ── Progreso ────────────────────────────────────────────────────────
create table if not exists public.progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_slug text not null references public.courses (slug) on update cascade on delete cascade,
  data jsonb not null check (pg_column_size(data) < 200000),
  updated_at timestamptz not null default now(),
  primary key (user_id, course_slug)
);

-- ── Ajustes ─────────────────────────────────────────────────────────
create table if not exists public.settings (
  key text primary key,
  value jsonb not null
);
insert into public.settings (key, value) values ('payments_mode', '"simulado"'), ('affiliate_rate', '0.3')
  on conflict (key) do nothing;

-- ── Fecha de actualización automática ───────────────────────────────
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at = now(); return new; end $$;

drop trigger if exists courses_updated on public.courses;
create trigger courses_updated before update on public.courses for each row execute function public.set_updated_at();
drop trigger if exists bundles_updated on public.bundles;
create trigger bundles_updated before update on public.bundles for each row execute function public.set_updated_at();
drop trigger if exists content_updated on public.course_content;
create trigger content_updated before update on public.course_content for each row execute function public.set_updated_at();
drop trigger if exists progress_updated on public.progress;
create trigger progress_updated before update on public.progress for each row execute function public.set_updated_at();

-- ── Estadísticas públicas (insignias reales de la tienda) ───────────
-- Solo cuenta ventas reales: "Más vendido" y "estudiantes" nunca se inventan.
create or replace function public.course_stats()
returns table (course_slug text, students integer, sales integer)
language sql stable security definer set search_path = public as $$
  select course_slug,
         count(*) filter (where status in ('pagado', 'cortesia'))::int,
         count(*) filter (where status = 'pagado')::int
  from public.purchases group by course_slug;
$$;
grant execute on function public.course_stats() to anon, authenticated;

-- ── Compra (pago de prueba) ─────────────────────────────────────────
-- El navegador NO puede crear compras directamente. Esta función lo hace en el
-- servidor: solo si los pagos de prueba están activos, solo para cursos
-- publicados, con el precio guardado en la base de datos y calculando la
-- comisión del afiliado (si llegó con un enlace válido y no es el mismo comprador).
create or replace function public.register_purchase(p_courses text[], p_prices integer[], p_bundle text, p_ref text)
returns void language plpgsql security definer set search_path = public as $$
declare v_aff uuid; v_rate numeric; i integer;
begin
  select id into v_aff from public.profiles where ref_code = nullif(trim(p_ref), '') and id <> auth.uid();
  select coalesce((value #>> '{}')::numeric, 0.3) into v_rate from public.settings where key = 'affiliate_rate';
  for i in 1 .. array_length(p_courses, 1) loop
    insert into public.purchases (user_id, course_slug, status, amount, provider, bundle_slug, affiliate_id, commission, commission_status)
    values (auth.uid(), p_courses[i], 'simulado', p_prices[i], 'simulado', p_bundle, v_aff,
            case when v_aff is null then 0 else round(p_prices[i] * coalesce(v_rate, 0.3))::int end,
            case when v_aff is null then null else 'prueba' end)
    on conflict (user_id, course_slug) do nothing;
  end loop;
end $$;
revoke all on function public.register_purchase(text[], integer[], text, text) from public, anon, authenticated;

create or replace function public.simulate_purchase(p_slug text, p_ref text default null) returns void
language plpgsql security definer set search_path = public as $$
declare v_price integer; v_mode text;
begin
  if auth.uid() is null then raise exception 'Debes iniciar sesión'; end if;
  select value #>> '{}' into v_mode from public.settings where key = 'payments_mode';
  if coalesce(v_mode, '') <> 'simulado' then raise exception 'Los pagos de prueba están desactivados'; end if;
  select price into v_price from public.courses where slug = p_slug and status = 'published';
  if v_price is null then raise exception 'Este curso no está disponible'; end if;
  perform public.register_purchase(array[p_slug], array[v_price], null, p_ref);
end $$;

-- Paquete: el precio del paquete se reparte entre los cursos que el usuario aún no tiene
create or replace function public.simulate_bundle_purchase(p_slug text, p_ref text default null) returns void
language plpgsql security definer set search_path = public as $$
declare v_mode text; v_b public.bundles; v_courses text[]; v_prices integer[]; v_n integer; v_share integer; i integer;
begin
  if auth.uid() is null then raise exception 'Debes iniciar sesión'; end if;
  select value #>> '{}' into v_mode from public.settings where key = 'payments_mode';
  if coalesce(v_mode, '') <> 'simulado' then raise exception 'Los pagos de prueba están desactivados'; end if;
  select * into v_b from public.bundles where slug = p_slug and status = 'published';
  if v_b.slug is null then raise exception 'Este paquete no está disponible'; end if;
  if exists (select 1 from unnest(v_b.courses) c where not exists (select 1 from public.courses where slug = c and status = 'published')) then
    raise exception 'Un curso del paquete no está disponible';
  end if;
  select array_agg(c) into v_courses from unnest(v_b.courses) c
    where not exists (select 1 from public.purchases where user_id = auth.uid() and course_slug = c);
  if v_courses is null then raise exception 'Ya tienes todos los cursos de este paquete'; end if;
  v_n := array_length(v_courses, 1);
  v_share := v_b.price / v_n;
  v_prices := array[]::integer[];
  for i in 1 .. v_n loop
    v_prices := v_prices || (case when i = v_n then v_b.price - v_share * (v_n - 1) else v_share end);
  end loop;
  perform public.register_purchase(v_courses, v_prices, p_slug, p_ref);
end $$;

revoke all on function public.simulate_purchase(text, text) from public, anon;
grant execute on function public.simulate_purchase(text, text) to authenticated;
revoke all on function public.simulate_bundle_purchase(text, text) from public, anon;
grant execute on function public.simulate_bundle_purchase(text, text) to authenticated;
drop function if exists public.simulate_purchase(text);

-- ── Afiliados ───────────────────────────────────────────────────────
-- El afiliado ve sus ventas y comisiones, pero no quién compró.
create or replace function public.my_affiliate_sales()
returns table (created_at timestamptz, course_slug text, amount integer, commission integer, commission_status text)
language sql stable security definer set search_path = public as $$
  select created_at, course_slug, amount, commission, commission_status
  from public.purchases where affiliate_id = auth.uid() and status <> 'reembolsado'
  order by created_at desc;
$$;
revoke all on function public.my_affiliate_sales() from public, anon;
grant execute on function public.my_affiliate_sales() to authenticated;

-- ════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ════════════════════════════════════════════════════════════════════
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_content enable row level security;
alter table public.bundles enable row level security;
alter table public.purchases enable row level security;
alter table public.progress enable row level security;
alter table public.settings enable row level security;

-- Borra políticas anteriores para poder ejecutar este archivo varias veces
do $$ declare r record; begin
  for r in select policyname, tablename from pg_policies where schemaname = 'public'
    and tablename in ('profiles', 'courses', 'course_content', 'bundles', 'purchases', 'progress', 'settings')
  loop execute format('drop policy %I on public.%I', r.policyname, r.tablename); end loop;
end $$;

-- Perfiles: cada quien ve el suyo; el admin ve y edita todos
create policy profiles_select on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_update on public.profiles for update using (id = auth.uid() or public.is_admin());

-- Cursos y paquetes: el catálogo es público (menos los borradores); solo el admin edita precios
create policy courses_select on public.courses for select using (status <> 'draft' or public.is_admin());
create policy courses_insert on public.courses for insert with check (public.is_admin());
create policy courses_update on public.courses for update using (public.is_admin());
create policy courses_delete on public.courses for delete using (public.is_admin());
create policy bundles_select on public.bundles for select using (status <> 'draft' or public.is_admin());
create policy bundles_write on public.bundles for all using (public.is_admin()) with check (public.is_admin());

-- Contenido: solo con acceso al curso
create policy content_select on public.course_content for select using (public.is_admin() or public.has_access(course_slug));
create policy content_write on public.course_content for all using (public.is_admin()) with check (public.is_admin());

-- Compras: cada quien ve las suyas; solo el admin las crea o cambia
-- (los pagos de prueba pasan por simulate_purchase; los reales, por el webhook con la service_role key)
create policy purchases_select on public.purchases for select using (user_id = auth.uid() or public.is_admin());
create policy purchases_admin on public.purchases for all using (public.is_admin()) with check (public.is_admin());

-- Progreso: solo el dueño, y solo en cursos a los que tiene acceso
create policy progress_select on public.progress for select using (user_id = auth.uid() or public.is_admin());
create policy progress_insert on public.progress for insert with check (user_id = auth.uid() and (public.has_access(course_slug) or public.is_admin()));
create policy progress_update on public.progress for update using (user_id = auth.uid() and (public.has_access(course_slug) or public.is_admin()))
  with check (user_id = auth.uid() and (public.has_access(course_slug) or public.is_admin()));

-- Ajustes: lectura pública (la página necesita el modo de pago y el % de comisión); escribe solo el admin
create policy settings_select on public.settings for select using (true);
create policy settings_write on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- ── Imágenes de portada ─────────────────────────────────────────────
-- Cada curso y paquete puede tener una imagen propia (si queda vacía se usa la
-- ilustración de la tienda). Solo se guarda la dirección (https://… o /…).
alter table public.courses add column if not exists image text not null default ''
  check (char_length(image) <= 500 and (image = '' or image ~ '^(https://|/)[^[:space:]]+$'));
alter table public.bundles add column if not exists image text not null default ''
  check (char_length(image) <= 500 and (image = '' or image ~ '^(https://|/)[^[:space:]]+$'));

-- Carpeta pública «covers» en Supabase Storage: cualquiera puede VER las imágenes,
-- pero solo un administrador puede subir, cambiar o borrar. Solo acepta
-- WebP, JPG o PNG de hasta 1 MB (nada de SVG, que podría llevar código).
do $$
begin
  if exists (select 1 from information_schema.schemata where schema_name = 'storage') then
    insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    values ('covers', 'covers', true, 1048576, array['image/webp', 'image/jpeg', 'image/png'])
    on conflict (id) do update set public = true, file_size_limit = 1048576,
      allowed_mime_types = array['image/webp', 'image/jpeg', 'image/png'];

    drop policy if exists covers_admin_select on storage.objects;
    drop policy if exists covers_admin_insert on storage.objects;
    drop policy if exists covers_admin_update on storage.objects;
    drop policy if exists covers_admin_delete on storage.objects;
    -- (borrar y reemplazar también necesitan poder «ver» el archivo; ver las imágenes en la tienda no depende de esto)
    create policy covers_admin_select on storage.objects for select to authenticated
      using (bucket_id = 'covers' and public.is_admin());
    create policy covers_admin_insert on storage.objects for insert to authenticated
      with check (bucket_id = 'covers' and public.is_admin());
    create policy covers_admin_update on storage.objects for update to authenticated
      using (bucket_id = 'covers' and public.is_admin()) with check (bucket_id = 'covers' and public.is_admin());
    create policy covers_admin_delete on storage.objects for delete to authenticated
      using (bucket_id = 'covers' and public.is_admin());
  end if;
end $$;
