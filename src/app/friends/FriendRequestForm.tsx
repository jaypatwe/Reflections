'use client'

import { sendFriendRequest } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { toast } from 'sonner'
import { UserPlus, Search } from 'lucide-react'

export default function FriendRequestForm() {
  const [pending, setPending] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setPending(true)
    const result = await sendFriendRequest(formData.get('identifier') as string)
    setPending(false)

    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success(result.success)
      // (document.getElementById('friend-form') as HTMLFormElement).reset()
    }
  }

  return (
    <form action={handleSubmit} className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
        <Input
          name="identifier"
          type="text"
          placeholder="Search by username or email..."
          required
          className="pl-9 bg-stone-50 border-[#E9E9E7] focus:border-[#37352F]/20 focus:ring-0 h-10 transition-all"
        />
      </div>
      <Button type="submit" disabled={pending} className="bg-[#37352F] hover:bg-[#2F2D28] text-white h-10 font-medium px-4 shadow-sm">
        {pending ? 'Sending...' : <><UserPlus className="w-4 h-4 mr-2" /> Add Friend</>}
      </Button>
    </form>
  )
}
