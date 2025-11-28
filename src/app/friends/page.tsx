'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { acceptFriendRequest, removeFriend } from './actions'
import { Check, UserPlus, X, User } from 'lucide-react'

// Separate client component for the form to use hooks
import FriendRequestForm from './FriendRequestForm'

export default async function FriendsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch all friendships
  const { data: friendships } = await supabase
    .from('friends')
    .select(`
      id,
      status,
      user_id,
      friend_id,
      sender:profiles!friends_user_id_fkey(email, full_name, username),
      receiver:profiles!friends_friend_id_fkey(email, full_name, username)
    `)
    .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)

  // Helper to categorize friends
  const pendingIncoming = friendships?.filter(
    (f) => f.friend_id === user.id && f.status === 'pending'
  )
  const pendingOutgoing = friendships?.filter(
    (f) => f.user_id === user.id && f.status === 'pending'
  )
  const friends = friendships?.filter((f) => f.status === 'accepted')

  // Helper to get display name
  const getDisplayName = (profile: any) => {
    return profile.full_name || profile.username || profile.email
  }

  const getSubtext = (profile: any) => {
    return profile.username ? `@${profile.username}` : profile.email
  }

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="text-3xl font-serif font-medium text-[#37352F]">Friends</h1>
        <p className="text-[#787774]">Connect with others to see their private thoughts.</p>
      </div>

      <div className="grid gap-8">
        {/* Add Friend Section */}
        <Card className="bg-white border border-[#E9E9E7] shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="bg-stone-50/50 border-b border-stone-100 pb-4">
            <CardTitle className="text-lg font-medium text-[#37352F]">Add a Friend</CardTitle>
            <CardDescription className="text-stone-500">Send a request to start sharing.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <FriendRequestForm />
          </CardContent>
        </Card>

        {/* Incoming Requests */}
        {pendingIncoming && pendingIncoming.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-[#37352F] flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">
                {pendingIncoming.length}
              </span>
              Friend Requests
            </h2>
            <div className="grid gap-3">
              {pendingIncoming.map((request: any) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-white border border-[#E9E9E7] rounded-xl shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-[#37352F]">{getDisplayName(request.sender)}</p>
                      <p className="text-xs text-[#9B9A97]">{getSubtext(request.sender)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <form action={acceptFriendRequest.bind(null, request.id)}>
                      <Button size="sm" variant="outline" className="h-8 border-green-200 hover:bg-green-50 text-green-700 hover:text-green-800 text-xs font-medium">
                        <Check className="w-3.5 h-3.5 mr-1" /> Accept
                      </Button>
                    </form>
                    <form action={removeFriend.bind(null, request.id)}>
                      <Button size="sm" variant="ghost" className="h-8 text-[#9B9A97] hover:text-red-600 hover:bg-red-50">
                        <X className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[#37352F]">Your Friends ({friends?.length || 0})</h2>
          {friends && friends.length > 0 ? (
            <div className="grid gap-3">
              {friends.map((friendship: any) => {
                const friend = friendship.user_id === user.id ? friendship.receiver : friendship.sender
                return (
                  <div key={friendship.id} className="group flex items-center justify-between p-4 bg-white border border-[#E9E9E7] rounded-xl hover:border-stone-300 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-stone-200 transition-colors">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-[#37352F]">{getDisplayName(friend)}</p>
                        <p className="text-xs text-[#9B9A97]">{getSubtext(friend)}</p>
                      </div>
                    </div>
                    <form action={removeFriend.bind(null, friendship.id)}>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-[#9B9A97] hover:text-red-600 hover:bg-red-50 h-8 text-xs transition-all">
                        Remove
                      </Button>
                    </form>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-stone-50/50 rounded-xl border border-dashed border-stone-200">
              <p className="text-stone-500 text-sm">You haven&apos;t added any friends yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
