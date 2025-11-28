'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const loginIdentifier = formData.get('email') as string // Can be email or username
  const password = formData.get('password') as string

  // 1. Check if it's an email (simple regex)
  const isEmail = loginIdentifier.includes('@')
  
  let email = loginIdentifier

  // 2. If it's a username, find the associated email first
  if (!isEmail) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('username', loginIdentifier)
      .single()
      
    if (profile) {
      email = profile.email
    } else {
      return { error: 'Invalid username or password' }
    }
  }

  // 3. Sign in with Email
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/today')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const username = formData.get('username') as string

  // Validate username uniqueness first (optional but good UX)
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .single()

  if (existingUser) {
    return { error: 'Username is already taken' }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/callback`,
      data: {
        full_name,
        username,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { message: 'Check your email to verify your account.' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}
