-- saved_ads: user (Clerk) saves ads to personal collection.
-- RLS uses auth.jwt() ->> 'sub' (Clerk user ID). Configure Supabase client with Clerk session token for RLS to apply.

create table public.saved_ads (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  ad_id uuid not null references public.ads(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, ad_id)
);

comment on column public.saved_ads.user_id is 'Clerk user ID (auth.jwt() ->> ''sub'' in RLS)';
comment on column public.saved_ads.ad_id is 'References ads.id';

-- RLS: users can only INSERT, DELETE, and SELECT their own rows.
alter table public.saved_ads enable row level security;

create policy "Users can select own saved_ads"
  on public.saved_ads
  for select
  to authenticated
  using ((auth.jwt() ->> 'sub') = user_id);

create policy "Users can insert own saved_ads"
  on public.saved_ads
  for insert
  to authenticated
  with check ((auth.jwt() ->> 'sub') = user_id);

create policy "Users can delete own saved_ads"
  on public.saved_ads
  for delete
  to authenticated
  using ((auth.jwt() ->> 'sub') = user_id);

-- Optional: index for listing a user's saved ads and for unique check.
create index saved_ads_user_id_idx on public.saved_ads (user_id);
create index saved_ads_ad_id_idx on public.saved_ads (ad_id);
