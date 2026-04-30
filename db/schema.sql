-- Life OS Postgres schema (initial)

create table if not exists users (
  id uuid primary key,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists transactions (
  id text primary key,
  user_id uuid references users(id) on delete cascade,
  tx_date date,
  description text,
  category text,
  amount numeric(12,2) not null default 0,
  tx_type text not null check (tx_type in ('income','expense')),
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists habit_definitions (
  id text not null,
  user_id uuid references users(id) on delete cascade,
  name text not null,
  color text,
  icon text,
  created_at timestamptz not null default now(),
  primary key (id, user_id)
);

create table if not exists habit_logs (
  id bigserial primary key,
  user_id uuid references users(id) on delete cascade,
  habit_id text not null,
  log_date date not null,
  completed boolean not null default true,
  created_at timestamptz not null default now()
);
