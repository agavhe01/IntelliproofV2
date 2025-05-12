# Intelliproof

Intelliproof is an intelligent argument mapping and visualization platform that helps users create, analyze, and share structured arguments. The platform allows users to build argument graphs with different types of nodes (factual, policy, and value-based arguments) and visualize the relationships between them.

## Features

- Interactive argument graph visualization
- Different types of argument nodes (factual, policy, value)
- Belief strength tracking for arguments
- Real-time collaboration
- User authentication and profile management
- Graph sharing and export capabilities

## Tech Stack

- **Frontend:**
  - Next.js 14 (App Router)
  - TypeScript
  - React Flow (for graph visualization)
  - Tailwind CSS (for styling)
  - Geist Font

- **Backend:**
  - Supabase (PostgreSQL)
  - Row Level Security
  - Real-time subscriptions

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git
- Supabase account

### Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/intelliproof.git
cd intelliproof
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js app directory containing pages and components
- `/components` - Reusable React components
- `/types` - TypeScript type definitions
- `/lib` - Utility functions and shared logic

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Flow Documentation](https://reactflow.dev/docs/introduction/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## SQL Design

```sql
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
  created_at   timestamp with time zone not null default now(),
  updated_at   timestamp with time zone not null default now(),
  name         text
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

-- Additional profile columns
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

alter table public.profiles 
  add column last_login timestamp default CURRENT_TIMESTAMP; 

-- Enable Row Level Security
ALTER TABLE public.graphs ENABLE ROW LEVEL SECURITY;

-- Add updated_at column with default
ALTER TABLE public.graphs 
ADD COLUMN updated_at timestamp with time zone DEFAULT current_timestamp;

-- Add first_name column
alter table profiles add column first_name text;

-- Function to insert profile with name splitting
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