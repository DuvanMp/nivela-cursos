-- Tablas para cuentas reales con Supabase.
-- Pégalo completo en Supabase → SQL Editor → New query → Run.

create table if not exists public.purchases (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id text not null,
  status text not null default 'simulado', -- 'simulado' | 'pagado'
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

create table if not exists public.progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, course_id)
);

alter table public.purchases enable row level security;
alter table public.progress enable row level security;

-- Cada usuario solo ve y modifica lo suyo
create policy "ver mis compras" on public.purchases for select using (auth.uid() = user_id);
create policy "ver mi progreso" on public.progress for select using (auth.uid() = user_id);
create policy "crear mi progreso" on public.progress for insert with check (auth.uid() = user_id);
create policy "actualizar mi progreso" on public.progress for update using (auth.uid() = user_id);

-- TEMPORAL mientras el pago es simulado: permite que el usuario active su propio acceso.
-- Cuando conectes la pasarela, BORRA esta política y crea las compras desde el servidor
-- (webhook de la pasarela con la service_role key):
--   drop policy "activar acceso simulado" on public.purchases;
create policy "activar acceso simulado" on public.purchases for insert with check (auth.uid() = user_id and status = 'simulado');
create policy "actualizar acceso simulado" on public.purchases for update using (auth.uid() = user_id and status = 'simulado');
