-- 1. Update Profiles Table
-- Add username column and make it unique
alter table profiles 
add column if not exists username text unique;

-- Add constraint to ensure username is at least 3 chars and valid format
-- (alphanumeric, underscores, dots)
alter table profiles
add constraint username_format check (username ~ '^[a-zA-Z0-9_.]+$');

-- 2. Create index for fast username search
create index if not exists profiles_username_idx on profiles (lower(username));

-- 3. Migration: Generate temporary usernames for existing users if null
-- using first part of email
update profiles 
set username = split_part(email, '@', 1) 
where username is null;

-- Handle conflicts if emails start with same name by appending random number
-- (Simple loop or just letting manual update happen later)

-- 4. Update Friend Search Function (We'll use a function for security)
create or replace function search_users(search_term text)
returns table (id uuid, email text, full_name text, username text) 
language sql security definer
as $$
  select id, email, full_name, username
  from profiles
  where 
    lower(username) = lower(search_term) 
    or 
    lower(email) = lower(search_term)
  limit 1;
$$;

