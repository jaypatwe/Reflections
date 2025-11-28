import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { HistoryCard } from '@/components/HistoryCard'
import { DateFilter } from '@/components/DateFilter'

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Await searchParams before accessing properties
  const params = await searchParams
  const dateFilter = params.date

  // Base query
  let query = supabase
    .from('reflections')
    .select(`
      *,
      profiles (
        email,
        full_name,
        username
      )
    `)
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  // Apply filter if exists
  if (dateFilter) {
    query = query.eq('date', dateFilter)
  }

  const { data: reflections } = await query

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-medium text-[#37352F]">Your History</h1>
          <p className="text-[#787774] text-lg">A timeline of your thoughts.</p>
        </div>
        <DateFilter />
      </div>

      <div className="space-y-4">
        {reflections?.map((reflection) => (
          <HistoryCard key={reflection.id} reflection={reflection} />
        ))}
      </div>

      {reflections?.length === 0 && (
        <div className="text-center py-16 px-4 bg-stone-50/50 rounded-xl border border-dashed border-stone-200">
          <p className="text-[#787774]">
            {dateFilter ? `No reflections found for ${new Date(dateFilter).toLocaleDateString()}.` : "No reflections yet."}
          </p>
          <p className="text-sm text-[#9B9A97] mt-1">Start by reflecting on your day.</p>
        </div>
      )}
    </div>
  )
}
