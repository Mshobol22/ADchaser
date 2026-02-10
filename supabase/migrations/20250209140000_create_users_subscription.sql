-- users: store subscription_plan per Clerk user (id = Clerk user ID).
-- Stripe webhook upserts via service role; dashboard reads via RLS with Clerk JWT.

create table public.users (
  id text primary key,
  subscription_plan text not null default 'free',
  updated_at timestamptz not null default now()
);

comment on column public.users.id is 'Clerk user ID (auth.jwt() ->> ''sub'' in RLS)';
comment on column public.users.subscription_plan is 'e.g. free, pro';

alter table public.users enable row level security;

create policy "Users can select own row"
  on public.users
  for select
  to authenticated
  using ((auth.jwt() ->> 'sub') = id);

-- Service role (webhook) can insert/update; no policy needed (bypasses RLS).
