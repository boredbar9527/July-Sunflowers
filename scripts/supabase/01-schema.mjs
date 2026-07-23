// Creates the online-admin schema: products + settings tables, a public
// storage bucket for images, and RLS (public read, authenticated write).
import { runSql } from "./mgmt.mjs";

const sql = `
-- ---------- products ----------
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null,
  name text not null default '',
  category text not null default 'uncategorized',
  category_label text not null default 'Uncategorized',
  unit text not null default '',
  price numeric(10,2) not null default 0,
  image text not null default '',
  hero_image text not null default '',
  story text not null default '',
  badge text not null default '',
  hover_image text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_category_idx on public.products (category_label, sort_order);

alter table public.products enable row level security;
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select using (true);
drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products
  for all to authenticated using (true) with check (true);

-- ---------- settings (single row store info) ----------
create table if not exists public.settings (
  id integer primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);
alter table public.settings enable row level security;
drop policy if exists "settings public read" on public.settings;
create policy "settings public read" on public.settings for select using (true);
drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write" on public.settings
  for all to authenticated using (true) with check (true);

-- ---------- storage bucket for images ----------
insert into storage.buckets (id, name, public)
values ('catalog', 'catalog', true)
on conflict (id) do update set public = true;

drop policy if exists "catalog images public read" on storage.objects;
create policy "catalog images public read" on storage.objects
  for select using (bucket_id = 'catalog');
drop policy if exists "catalog images admin insert" on storage.objects;
create policy "catalog images admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'catalog');
drop policy if exists "catalog images admin update" on storage.objects;
create policy "catalog images admin update" on storage.objects
  for update to authenticated using (bucket_id = 'catalog');
drop policy if exists "catalog images admin delete" on storage.objects;
create policy "catalog images admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'catalog');
`;

runSql(sql).then(
  () => console.log("Schema created ✓"),
  (e) => {
    console.error(String(e.message || e));
    process.exit(1);
  }
);
