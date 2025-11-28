'use client'

import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { BookOpen } from 'lucide-react'

export default function LoginPage() {
  const [pending, setPending] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setPending(true)
    const result = await login(formData)
    setPending(false)
    
    if (result?.error) {
      toast.error(result.error)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center p-4">
      <Card className="w-full max-w-md border border-[#E9E9E7] shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-xl overflow-hidden">
        <CardHeader className="space-y-3 bg-stone-50/50 border-b border-stone-100 pb-8 pt-10 text-center">
          <div className="mx-auto w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-2 text-[#37352F]">
            <BookOpen className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-serif font-medium text-[#37352F]">Welcome back</CardTitle>
          <CardDescription className="text-[#787774] text-base">
            Enter your details to sign in
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-[#37352F] font-medium">Email or Username</Label>
              <Input 
                id="email" 
                name="email" 
                type="text" 
                placeholder="username or email" 
                required 
                className="h-11 bg-white border-[#E9E9E7] focus:border-[#37352F]/20 focus:ring-0 transition-all" 
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#37352F] font-medium">Password</Label>
                <Link href="#" className="text-xs text-[#9B9A97] hover:text-[#37352F]">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="h-11 bg-white border-[#E9E9E7] focus:border-[#37352F]/20 focus:ring-0 transition-all" 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 p-8 pt-0">
            <Button type="submit" className="w-full h-11 bg-[#37352F] hover:bg-[#2F2D28] text-white font-medium text-base shadow-sm active:scale-[0.99] transition-all" disabled={pending}>
              {pending ? 'Signing in...' : 'Sign in'}
            </Button>
            <div className="text-sm text-[#787774] text-center pt-2">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-[#37352F] font-medium hover:underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
