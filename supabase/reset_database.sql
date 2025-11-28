-- ⚠️ DESTRUCTIVE SCRIPT: This will delete all your data! ⚠️

-- 1. DROP EXISTING TABLES
drop table if exists friends cascade;
drop table if exists reflections cascade;
drop table if exists profiles cascade;

-- 2. CREATE TABLES

-- Profiles Table (Public metadata for users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  full_name text,
  updated_at timestamp with time zone,
  constraint email_length check (char_length(email) >= 3)
);

-- Reflections Table (Journal entries)
create table reflections (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  went_well text,
  learned text,
  stuck text,
  emotion text,
  energy integer check (energy >= 1 and energy <= 10),
  is_public boolean default false, -- kept for backward compatibility if code uses it
  visibility text check (visibility in ('private', 'public', 'friends_only')) default 'private',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Friends Table (Relationships)
create table friends (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  friend_id uuid references auth.users(id) on delete cascade not null,
  status text check (status in ('pending', 'accepted')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, friend_id),
  constraint not_self_friend check (user_id != friend_id)
);

-- 3. ENABLE ROW LEVEL SECURITY (RLS)
alter table profiles enable row level security;
alter table reflections enable row level security;
alter table friends enable row level security;

-- 4. RLS POLICIES

-- Profiles
create policy "Public profiles are viewable by everyone" 
  on profiles for select 
  using (true);

create policy "Users can insert their own profile" 
  on profiles for insert 
  with check (auth.uid() = id);

create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

-- Reflections
create policy "Users can view own reflections" 
  on reflections for select 
  using (auth.uid() = user_id);

create policy "Users can view public reflections" 
  on reflections for select 
  using (visibility = 'public');

create policy "Users can view friends-only reflections" 
  on reflections for select 
  using (
    visibility = 'friends_only' 
    and (
      exists (
        select 1 from friends 
        where status = 'accepted' 
        and (
          (user_id = auth.uid() and friend_id = reflections.user_id) 
          or 
          (friend_id = auth.uid() and user_id = reflections.user_id)
        )
      )
    )
  );

create policy "Users can create reflections" 
  on reflections for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own reflections" 
  on reflections for update 
  using (auth.uid() = user_id);

create policy "Users can delete own reflections" 
  on reflections for delete 
  using (auth.uid() = user_id);

-- Friends
create policy "Users can view their own friendships"
  on friends for select
  using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can send friend requests"
  on friends for insert
  with check (auth.uid() = user_id);

create policy "Users can accept/reject requests"
  on friends for update
  using (auth.uid() = friend_id or auth.uid() = user_id);

create policy "Users can remove friends"
  on friends for delete
  using (auth.uid() = user_id or auth.uid() = friend_id);

-- 5. TRIGGERS

-- Function to handle new user signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. BACKFILL (Fix for existing users)
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

