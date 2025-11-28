-- Fix: Point reflections.user_id to profiles.id
-- Currently reflections.user_id points to auth.users, which hides it from standard joins
-- We need to add a foreign key to profiles to enable: .select('*, profiles(*)')

-- 1. Drop old constraint if it exists (usually implicit)
-- We don't need to drop the auth.users constraint necessarily, but adding a new one is safe

alter table reflections
drop constraint if exists reflections_user_id_fkey;

-- 2. Add foreign key to profiles
alter table reflections
add constraint reflections_user_id_fkey
foreign key (user_id)
references profiles(id)
on delete cascade;

