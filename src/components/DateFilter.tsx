'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'

export function DateFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentFilter = searchParams.get('date') || ''
  
  const [date, setDate] = useState(currentFilter)

  // Sync state with URL params
  useEffect(() => {
    setDate(currentFilter)
  }, [currentFilter])

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    setDate(newDate)
    if (newDate) {
      router.push(`?date=${newDate}`)
    } else {
      router.push('?')
    }
  }

  const clearFilter = () => {
    setDate('')
    router.push('?')
  }

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <div className="relative flex-1 sm:flex-initial">
        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-stone-400 pointer-events-none" />
        <Input 
          type="date" 
          value={date} 
          onChange={handleDateChange}
          className="pl-9 bg-white border-stone-200 text-[#37352F] h-9 w-full sm:w-[180px]"
        />
      </div>
      {currentFilter && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilter}
          className="text-stone-500 hover:text-stone-900 h-9 px-2"
          title="Clear filter"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}

