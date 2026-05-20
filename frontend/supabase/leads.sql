-- Aqari Pro Leads System
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  city text,
  property_type text,
  operation_type text,
  budget numeric(12,2),
  notes text,
  source text default 'website',
  status text not null default 'جديد',
  property_id uuid references public.properties(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy if not exists "anon can insert leads"
on public.leads
for insert
to anon
with check (true);

create policy if not exists "authenticated can manage leads"
on public.leads
for all
to authenticated
using (true)
with check (true);

create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_property_id_idx on public.leads(property_id);
