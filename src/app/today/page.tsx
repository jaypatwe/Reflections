import ReflectionForm from './ReflectionForm'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function TodayPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user has already reflected today
  const today = new Date().toISOString().split('T')[0]
  const { data: existingReflection } = await supabase
    .from('reflections')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', today)
    .single()

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-medium text-stone-800">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </h1>
        <p className="text-stone-500">Capture your thoughts, feelings, and learnings.</p>
      </div>
      
      {existingReflection ? (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border border-stone-200 text-center space-y-4">
          <h2 className="text-xl font-serif text-stone-800">You&apos;ve already reflected today!</h2>
          <p className="text-stone-500">Come back tomorrow for a new reflection.</p>
          {/* Could add an "Edit" button here later if needed */}
        </div>
      ) : (
        <ReflectionForm />
      )}
    </div>
  )
}

