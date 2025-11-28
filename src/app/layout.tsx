import type { Metadata } from 'next'
import { Inter, Lora } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import { createClient } from '@/utils/supabase/server'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Daily Reflection',
  description: 'A minimal daily reflection journal',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="font-sans antialiased bg-[#F7F6F3] text-[#37352F] min-h-screen flex flex-col">
        <Navbar user={user} />
        <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
}
