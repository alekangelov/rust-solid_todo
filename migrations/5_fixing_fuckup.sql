alter table "users"
  DROP COLUMN user_id;

alter table "todos"
  ADD COLUMN user_id uuid not null references users (id) on delete cascade;
