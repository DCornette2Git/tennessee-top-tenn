-- Supabase Schema for Tennessee Top Tenn Membership
-- Run this in the Supabase SQL Editor

-- 1. Create a profiles table for public information
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  tier text default 'Novice Investigator',
  badges jsonb default '[]'::jsonb,
  check_ins jsonb default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- 3. Create policies so users can only view and edit THEIR OWN profile
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- 4. Create a trigger to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
