alter table "users"
  ADD COLUMN user_id uuid references "users" (id) on delete cascade;
