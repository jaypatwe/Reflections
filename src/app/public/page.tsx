import { createClient } from '@/utils/supabase/server'
import { ReflectionCard } from '@/components/ReflectionCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const revalidate = 0 // Ensure fresh data on every request

export default async function PublicPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const today = new Date().toISOString().split('T')[0]

  // Fetch Public Reflections (Today Only)
  const { data: publicReflections } = await supabase
    .from('reflections')
    .select(`
      *,
      profiles (
        email,
        full_name,
        username
      )
    `)
    .or('visibility.eq.public,is_public.eq.true')
    .eq('date', today) // Filter by today
    .order('created_at', { ascending: false })
    .limit(50)

  // Fetch Friends-Only Reflections (Today Only)
  let friendsReflections: any[] = []
  
  if (user) {
    const { data: friendships } = await supabase
      .from('friends')
      .select('user_id, friend_id')
      .eq('status', 'accepted')
      .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
    
    const friendIds = friendships?.map(f => f.user_id === user.id ? f.friend_id : f.user_id) || []
    
    if (friendIds.length > 0) {
      const { data: friendsData } = await supabase
        .from('reflections')
        .select(`
          *,
          profiles (
            email,
            full_name,
            username
          )
        `)
        .in('user_id', friendIds)
        .eq('visibility', 'friends_only')
        .eq('date', today) // Filter by today
        .order('created_at', { ascending: false })
        .limit(50)
        
      friendsReflections = friendsData || []
    }
  }

  return (
    <div className="space-y-10 max-w-2xl mx-auto">
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-serif font-medium text-[#37352F]">Community Feed</h1>
        <p className="text-[#787774] text-lg">
          See what others are sharing <span className="font-semibold text-[#37352F]">today</span>.
        </p>
      </div>

      <Tabs defaultValue="public" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="bg-stone-100/50 p-1 border border-stone-200/50 rounded-lg">
            <TabsTrigger 
              value="public" 
              className="px-6 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-[#37352F] data-[state=active]:shadow-sm text-[#787774] font-medium transition-all"
            >
              Public
            </TabsTrigger>
            <TabsTrigger 
              value="friends" 
              className="px-6 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-[#37352F] data-[state=active]:shadow-sm text-[#787774] font-medium transition-all" 
              disabled={!user}
            >
              Friends
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="public">
          <div className="space-y-6">
            {publicReflections?.map((reflection) => (
              <ReflectionCard key={reflection.id} reflection={reflection} />
            ))}
          </div>
          {publicReflections?.length === 0 && (
            <div className="text-center py-16 px-4 bg-stone-50/50 rounded-xl border border-dashed border-stone-200">
              <p className="text-[#787774]">No public reflections yet today.</p>
              <p className="text-sm text-[#9B9A97] mt-1">Be the first to share your day!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="friends">
           {!user ? (
             <div className="text-center py-16 px-4 bg-stone-50/50 rounded-xl border border-dashed border-stone-200">
               <p className="text-[#787774]">Please log in to see friends&apos; reflections.</p>
             </div>
           ) : (
             <>
               <div className="space-y-6">
                 {friendsReflections.map((reflection) => (
                   <ReflectionCard key={reflection.id} reflection={reflection} />
                 ))}
               </div>
               {friendsReflections.length === 0 && (
                 <div className="text-center py-16 px-4 bg-stone-50/50 rounded-xl border border-dashed border-stone-200">
                   <p className="text-[#787774]">No reflections from friends today.</p>
                   <p className="text-sm text-[#9B9A97] mt-1">Check back later or add more friends.</p>
                 </div>
               )}
             </>
           )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
