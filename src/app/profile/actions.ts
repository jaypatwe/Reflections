'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const full_name = formData.get('full_name') as string
  const username = formData.get('username') as string

  // Validate username format
  if (!/^[a-zA-Z0-9_.]+$/.test(username)) {
    return { error: 'Username can only contain letters, numbers, underscores, and dots.' }
  }

  if (username.length < 3) {
    return { error: 'Username must be at least 3 characters long.' }
  }

  // Check uniqueness (if username changed)
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  if (currentProfile?.username !== username) {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single()

    if (existing) {
      return { error: 'Username is already taken.' }
    }
  }

  // Update profile
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name,
      username,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/profile')
  revalidatePath('/public') // To update feed cards
  return { success: 'Profile updated successfully!' }
}

