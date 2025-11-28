-- FIX: Point foreign keys to 'profiles' so the frontend can fetch names/emails
-- Currently, they point to 'auth.users' which prevents the 'profiles' join from working.

-- 1. Drop existing constraints (which point to auth.users)
alter table friends
drop constraint if exists friends_user_id_fkey;

alter table friends
drop constraint if exists friends_friend_id_fkey;

-- 2. Add new constraints (pointing to profiles)
-- We keep the same constraint names so the code doesn't need to change
alter table friends
add constraint friends_user_id_fkey
foreign key (user_id)
references profiles(id)
on delete cascade;

alter table friends
add constraint friends_friend_id_fkey
foreign key (friend_id)
references profiles(id)
on delete cascade;

