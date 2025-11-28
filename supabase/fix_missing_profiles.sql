-- 1. Create a 'friends' table to track relationships
create table if not exists friends (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  friend_id uuid references auth.users(id) not null,
  status text check (status in ('pending', 'accepted')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, friend_id)
);

-- 2. Create a 'profiles' table
create table if not exists profiles (
  id uuid references auth.users(id) primary key,
  email text,
  full_name text,
  updated_at timestamp with time zone
);

-- 3. Modify 'reflections' table to support more visibility options
alter table reflections 
add column if not exists visibility text check (visibility in ('private', 'public', 'friends_only')) default 'private';

-- Update existing public entries
update reflections set visibility = 'public' where is_public = true and visibility = 'private';

-- 4. Enable RLS
alter table friends enable row level security;
alter table profiles enable row level security;

-- Friends Policies
create policy "Users can view their own friendships"
on friends for select
using (auth.uid() = user_id or auth.uid() = friend_id);

create policy "Users can send friend requests"
on friends for insert
with check (auth.uid() = user_id);

create policy "Users can update their own friendships"
on friends for update
using (auth.uid() = friend_id);

create policy "Users can delete their own friendships"
on friends for delete
using (auth.uid() = user_id or auth.uid() = friend_id);

-- Profiles Policies
create policy "Authenticated users can view profiles"
on profiles for select
to authenticated
using (true);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

-- 5. Trigger to create profile on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 6. Backfill existing users into profiles
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do nothing;

