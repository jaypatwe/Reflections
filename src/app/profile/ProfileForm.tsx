'use client'

import { updateProfile } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { toast } from 'sonner'
import { User, Mail, AtSign } from 'lucide-react'

export default function ProfileForm({ initialProfile }: { initialProfile: any }) {
  const [pending, setPending] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setPending(true)
    const result = await updateProfile(formData)
    setPending(false)
    
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success(result.success)
    }
  }

  return (
    <Card className="max-w-xl mx-auto border border-[#E9E9E7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white rounded-xl overflow-hidden">
      <CardHeader className="bg-stone-50/50 border-b border-stone-100 pb-6 pt-8">
        <CardTitle className="font-serif text-2xl font-medium text-[#37352F]">Your Profile</CardTitle>
        <CardDescription className="text-[#787774]">
          Manage your public profile information.
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-6 p-8">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#37352F] font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
              <Input 
                id="email" 
                value={initialProfile?.email} 
                disabled 
                className="pl-10 bg-stone-100 border-stone-200 text-stone-500 cursor-not-allowed h-11" 
              />
            </div>
            <p className="text-xs text-stone-400 pl-1">Email cannot be changed.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-[#37352F] font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
              <Input 
                id="full_name" 
                name="full_name" 
                defaultValue={initialProfile?.full_name || ''} 
                placeholder="Your Name" 
                className="pl-10 bg-white border-[#E9E9E7] focus:border-[#37352F]/20 focus:ring-0 h-11 transition-all" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-[#37352F] font-medium">Username</Label>
            <div className="relative">
              <AtSign className="absolute left-3 top-2.5 h-5 w-5 text-stone-400" />
              <Input 
                id="username" 
                name="username" 
                defaultValue={initialProfile?.username || ''} 
                placeholder="username" 
                className="pl-10 bg-white border-[#E9E9E7] focus:border-[#37352F]/20 focus:ring-0 h-11 transition-all" 
              />
            </div>
            <p className="text-xs text-stone-400 pl-1">Unique handle for your profile URL and mentions.</p>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-stone-50/50 border-t border-stone-100">
          <Button type="submit" className="bg-[#37352F] hover:bg-[#2F2D28] text-white h-11 px-6 font-medium rounded-lg shadow-sm transition-transform active:scale-[0.99]" disabled={pending}>
            {pending ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
