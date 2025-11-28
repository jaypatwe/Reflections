import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AuthCodeError() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-serif font-bold text-stone-800 mb-4">Authentication Error</h1>
      <p className="text-stone-500 mb-8 max-w-md">
        There was an issue authenticating your account. This could be due to an expired link or a technical issue.
      </p>
      <Link href="/auth/login">
        <Button>Back to Login</Button>
      </Link>
    </div>
  )
}

