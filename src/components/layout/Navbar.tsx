'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Settings, LogOut, BookOpen } from 'lucide-react'

export default function Navbar({ user }: { user: any }) {
  const pathname = usePathname()

  if (!user) return null

  const links = [
    { href: '/today', label: 'Today' },
    { href: '/history', label: 'History' },
    { href: '/public', label: 'Community' },
    { href: '/friends', label: 'Friends' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-200/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/today" className="flex items-center gap-2 font-serif text-lg font-semibold text-[#37352F] hover:opacity-80 transition-opacity">
            <BookOpen className="h-5 w-5" />
            <span>Reflection</span>
          </Link>
          <div className="hidden md:flex md:gap-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-[#37352F]',
                  pathname === link.href 
                    ? 'text-[#37352F] border-b-2 border-[#37352F] py-5 mt-0.5' 
                    : 'text-[#9ca3af] py-5 mt-0.5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/profile">
             <Button variant="ghost" size="icon" className="h-9 w-9 text-[#787774] hover:text-[#37352F] hover:bg-stone-100" title="Profile Settings">
               <Settings className="h-4.5 w-4.5" />
             </Button>
          </Link>
          <form action={signOut}>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#787774] hover:text-[#EB5757] hover:bg-red-50" title="Sign Out">
              <LogOut className="h-4.5 w-4.5" />
            </Button>
          </form>
        </div>
      </div>
    </nav>
  )
}
