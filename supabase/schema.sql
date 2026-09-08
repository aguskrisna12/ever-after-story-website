create table if not exists public.inquiries (
  id text primary key,
  couple text not null,
  event_date date not null,
  location text not null,
  package_name text not null,
  source text not null,
  status text not null check (status in ('Baru', 'Tindak lanjut', 'Proposal dikirim', 'Dipesan')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.production_items (
  id text primary key,
  couple text not null,
  deliverable text not null,
  due_date date not null,
  progress integer not null default 0 check (progress between 0 and 100),
  status text not null check (status in ('Materi masuk', 'Editing', 'Review', 'Siap dikirim', 'Terkirim')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;
alter table public.production_items enable row level security;

revoke all on table public.inquiries from anon, authenticated;
revoke all on table public.production_items from anon, authenticated;
grant select, insert, update, delete on table public.inquiries to service_role;
grant select, insert, update, delete on table public.production_items to service_role;

