-- SupportFlow AI starter schema. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create type public.ticket_status as enum ('Open','In progress','Waiting','Resolved');
create type public.ticket_priority as enum ('Urgent','High','Medium','Low');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'agent' check (role in ('admin','manager','agent')),
  created_at timestamptz not null default now()
);

create table public.tickets (
  id text primary key,
  customer_name text not null,
  customer_email text not null,
  subject text not null,
  message text not null,
  category text not null default 'General',
  priority public.ticket_priority not null default 'Medium',
  status public.ticket_status not null default 'Open',
  assignee text not null default 'Unassigned',
  sentiment text not null default 'Unclassified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ticket_events (
  id uuid primary key default gen_random_uuid(),
  ticket_id text not null references public.tickets(id) on delete cascade,
  actor_id uuid references auth.users(id),
  event_type text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_events enable row level security;

-- Authenticated workspace members can read tickets. Writes require authentication.
create policy "members read tickets" on public.tickets for select to authenticated using (true);
create policy "members create tickets" on public.tickets for insert to authenticated with check (true);
create policy "members update tickets" on public.tickets for update to authenticated using (true) with check (true);
create policy "members read profiles" on public.profiles for select to authenticated using (true);
create policy "users create own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "members read ticket events" on public.ticket_events for select to authenticated using (true);
create policy "members create ticket events" on public.ticket_events for insert to authenticated with check (auth.uid() = actor_id);

create index tickets_status_idx on public.tickets(status);
create index tickets_priority_idx on public.tickets(priority);
create index tickets_created_at_idx on public.tickets(created_at desc);

-- Production hardening TODO:
-- 1) Scope RLS policies to organization_id and membership.
-- 2) Add role-aware policies for status changes and ticket assignment.
-- 3) Add an organization table and invitation flow before multi-tenant use.
