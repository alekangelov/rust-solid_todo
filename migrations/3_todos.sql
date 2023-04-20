create table "todos" (
  id uuid primary key default uuid_generate_v1mc(),
  title text not null,
  description text not null default '',
  image text not null default '',
  date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz
);

SELECT trigger_updated_at('"todos"');
