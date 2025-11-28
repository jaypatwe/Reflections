'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitReflection(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to submit a reflection.' }
  }

  const went_well = formData.get('went_well') as string
  const learned = formData.get('learned') as string
  const stuck = formData.get('stuck') as string
  const emotion = formData.get('emotion') as string
  const energy = parseInt(formData.get('energy') as string)
  const visibility = formData.get('visibility') as string // 'private', 'public', 'friends_only'
  
  // Backwards compatibility with is_public boolean if needed, though we should migrate DB
  const is_public = visibility === 'public'

  const { error } = await supabase.from('reflections').insert({
    user_id: user.id,
    went_well,
    learned,
    stuck,
    emotion,
    energy,
    is_public, // Keep updating this for now if column exists
    visibility,
    date: new Date().toISOString().split('T')[0], // Store as YYYY-MM-DD
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/today')
  revalidatePath('/history')
  revalidatePath('/public')
  
  return { success: true }
}
