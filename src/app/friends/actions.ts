'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendFriendRequest(identifier: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  // 1. Find the user by email OR username
  const { data: targetUser, error: findError } = await supabase
    .from('profiles')
    .select('id')
    .or(`email.eq.${identifier},username.eq.${identifier}`)
    .single()

  if (findError || !targetUser) {
    return { error: 'User not found. Check the username or email.' }
  }

  if (targetUser.id === user.id) {
    return { error: 'You cannot friend yourself.' }
  }

  // 2. Check if relationship already exists
  const { data: existing } = await supabase
    .from('friends')
    .select('*')
    .or(`and(user_id.eq.${user.id},friend_id.eq.${targetUser.id}),and(user_id.eq.${targetUser.id},friend_id.eq.${user.id})`)
    .single()

  if (existing) {
    return { error: 'Friend request already sent or you are already friends.' }
  }

  // 3. Insert friend request
  const { error: insertError } = await supabase.from('friends').insert({
    user_id: user.id,
    friend_id: targetUser.id,
    status: 'pending',
  })

  if (insertError) {
    return { error: insertError.message }
  }

  revalidatePath('/friends')
  return { success: 'Friend request sent!' }
}

export async function acceptFriendRequest(friendshipId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('friends')
    .update({ status: 'accepted' })
    .eq('id', friendshipId)

  if (error) return { error: error.message }
  revalidatePath('/friends')
  return { success: 'Friend request accepted!' }
}

export async function removeFriend(friendshipId: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', friendshipId)

  if (error) return { error: error.message }
  revalidatePath('/friends')
  return { success: 'Friend removed.' }
}
