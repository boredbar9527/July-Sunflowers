// Admin allowlist + tightened write policies.
// Only emails in public.admins may write products/settings/images, even
// though anyone can authenticate via magic link.
import { runSql } from "./mgmt.mjs";

// The store owner. Add more admin emails here (or via the admins table later).
const OWNER_EMAIL = "boredbar9527@gmail.com";

const sql = `
create table if not exists public.admins (
  email text primary key,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;
drop policy if exists "admins self read" on public.admins;
create policy "admins self read" on public.admins
  for select to authenticated using (email = (auth.jwt() ->> 'email'));

insert into public.admins (email) values ('${OWNER_EMAIL}')
on conflict (email) do nothing;

create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.admins a
    where a.email = (auth.jwt() ->> 'email')
  );
$$;

-- Tighten write policies to admins only
drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings admin write" on public.settings;
create policy "settings admin write" on public.settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "catalog images admin insert" on storage.objects;
create policy "catalog images admin insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'catalog' and public.is_admin());
drop policy if exists "catalog images admin update" on storage.objects;
create policy "catalog images admin update" on storage.objects
  for update to authenticated using (bucket_id = 'catalog' and public.is_admin());
drop policy if exists "catalog images admin delete" on storage.objects;
create policy "catalog images admin delete" on storage.objects
  for delete to authenticated using (bucket_id = 'catalog' and public.is_admin());

select email from public.admins;
`;

runSql(sql).then(
  (r) => console.log("Admin allowlist ready. Admins:", JSON.stringify(r)),
  (e) => { console.error(String(e.message || e)); process.exit(1); }
);
