This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


-- 1) Enable UUID generation
create extension if not exists "pgcrypto";

-- 2) Define account‐tier enum
create type public.account_type_enum as enum ('free', 'basic', 'pro');

-- 3) Create profiles with email as PK and optional country
create table public.profiles (
  email        text                   primary key,
  user_id      uuid       not null    references auth.users(id) on delete cascade,
  account_type account_type_enum      not null default 'free',
  country      varchar(50),                   -- nullable by default
  created_at   timestamp with time zone not null default now(),
  first name text, 
  last name text,
);

-- 4) Create graphs, now referencing profiles(email)
create table public.graphs (
  id           uuid       primary key default gen_random_uuid(),
  owner_email  text       not null      references public.profiles(email) on delete cascade,
  graph_data   jsonb      not null,
  created_at   timestamp with time zone not null default now()
);

-- Optional: speed up searches inside JSONB
create index if not exists idx_graphs_data on public.graphs using gin (graph_data);

-- 5) Trigger function: on new Auth user, insert into profiles(email, user_id)
create or replace function public.sync_auth_user_to_profiles()
returns trigger language plpgsql as $$
begin
  insert into public.profiles(email, user_id)
    values (new.email, new.id)
    on conflict (email) do nothing;
  return new;
end;
$$;

-- 6) Attach trigger to auth.users
create trigger trg_sync_auth_user
  after insert on auth.users
  for each row
  execute procedure public.sync_auth_user_to_profiles();

-- 5) SECURITY DEFINER trigger function (no SET ROLE)
create or replace function public.sync_auth_user_to_profiles()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles(email, user_id, first_name, last_name)
    values (
      new.email, 
      new.id,
      new.raw_user_meta_data->>'first_name',
      new.raw_user_meta_data->>'last_name'
    )
    on conflict (email) do nothing;
  return new;
end;
$$;

-- 6) Attach the trigger (drop existing if present)
drop trigger if exists trg_sync_auth_user on auth.users;
create trigger trg_sync_auth_user
  after insert on auth.users
  for each row
  execute procedure public.sync_auth_user_to_profiles();


  alter table public.profiles
  add column avatar_url text;

alter table public.profiles
  add column instagram_url text;

alter table public.profiles
  add column linkedin_url text;

alter table public.profiles
  add column twitter_url text;

alter table public.profiles
  add column bio text;

alter table public.profiles add column last_login timestamp default CURRENT_TIMESTAMP; 


ALTER TABLE public.graphs ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.graphs 
ADD COLUMN updated_at timestamp with time zone DEFAULT current_timestamp;

alter table profiles add column first_name text;

CREATE OR REPLACE FUNCTION insert_profile(display_name text)
RETURNS void AS $$
DECLARE
  first_name text;
  last_name  text;
BEGIN
  first_name := split_part(display_name, ' ', 1);
  last_name  := split_part(display_name, ' ', 2);

  INSERT INTO public.profiles (first_name, last_name)
  VALUES (first_name, last_name);
END;
$$ LANGUAGE plpgsql;
