-- Optional: store primary email for Clerk users (synced by Clerk webhook).
alter table public.users
  add column if not exists email text;

comment on column public.users.email is 'Primary email from Clerk (user.created webhook).';
