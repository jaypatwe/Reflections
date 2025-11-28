-- ... (previous content)

-- 5. Enable RLS on 'profiles' and add policies
alter table profiles enable row level security;

-- Policy: Everyone can view profiles (to find friends)
-- Or restrict to authenticated users only:
create policy "Authenticated users can view profiles"
on profiles for select
to authenticated
using (true);

-- Policy: Users can update their own profile
create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

-- 6. CRITICAL: Trigger to create profile on user signup
-- Without this, the profiles table stays empty and you can't find users!
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid conflicts when re-running
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7. Backfill Profiles for existing users (Run this once manually if you have users)
-- insert into public.profiles (id, email)
-- select id, email from auth.users
-- on conflict (id) do nothing;
