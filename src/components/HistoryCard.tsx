'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Smile, Meh, Frown, Zap, Calendar, User, Users, Globe, Lock, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Reflection {
  id: string
  date: string
  went_well: string
  learned: string
  stuck: string
  emotion: string
  energy: number
  is_public: boolean
  visibility: string
  created_at: string
}

const emotionIcons: Record<string, any> = {
  happy: Smile,
  neutral: Meh,
  sad: Frown,
  energetic: Zap,
}

const visibilityIcons: Record<string, any> = {
  private: Lock,
  friends_only: Users,
  public: Globe,
}

export function HistoryCard({ reflection }: { reflection: Reflection }) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const EmotionIcon = emotionIcons[reflection.emotion] || Meh
  const VisibilityIcon = visibilityIcons[reflection.visibility || (reflection.is_public ? 'public' : 'private')] || Lock

  return (
    <Card 
      className={cn(
        "group w-full border border-[#E9E9E7] bg-white shadow-sm transition-all duration-200 overflow-hidden cursor-pointer",
        isExpanded ? "shadow-md ring-1 ring-stone-200" : "hover:bg-stone-50/50 hover:shadow"
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-4">
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center transition-colors shrink-0",
            isExpanded ? "bg-[#37352F] text-white" : "bg-stone-100 text-stone-500"
          )}>
            <span className="font-serif font-bold text-sm">
              {new Date(reflection.date).getDate()}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="font-medium text-[#37352F]">
              {new Date(reflection.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <div className="flex items-center gap-2 text-xs text-[#9B9A97]">
              <div className="flex items-center gap-1">
                <VisibilityIcon className="w-3 h-3" />
                <span className="capitalize">{reflection.visibility?.replace('_', ' ') || 'private'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-2">
            <Badge variant="secondary" className="bg-white text-stone-600 border border-stone-200 font-normal">
              <EmotionIcon className="w-3 h-3 mr-1" />
              {reflection.emotion}
            </Badge>
            <Badge variant="secondary" className="bg-white text-stone-600 border border-stone-200 font-normal">
              Energy: {reflection.energy}
            </Badge>
          </div>
          <div className="text-stone-400">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="p-6 pt-2 border-t border-stone-100 bg-stone-50/30 space-y-6 animate-in slide-in-from-top-2 duration-200">
           {/* Mobile badges */}
           <div className="flex sm:hidden gap-2 mb-4">
            <Badge variant="secondary" className="bg-white text-stone-600 border border-stone-200 font-normal">
              <EmotionIcon className="w-3 h-3 mr-1" />
              {reflection.emotion}
            </Badge>
            <Badge variant="secondary" className="bg-white text-stone-600 border border-stone-200 font-normal">
              Energy: {reflection.energy}
            </Badge>
          </div>

          <div>
            <h4 className="font-semibold text-[#37352F] mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-[#787774]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
              Went Well
            </h4>
            <p className="text-[#37352F] leading-relaxed whitespace-pre-wrap pl-3.5 border-l-2 border-stone-100">
              {reflection.went_well}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-[#37352F] mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-[#787774]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Learned
            </h4>
            <p className="text-[#37352F] leading-relaxed whitespace-pre-wrap pl-3.5 border-l-2 border-stone-100">
              {reflection.learned}
            </p>
          </div>

          {reflection.stuck && (
            <div>
              <h4 className="font-semibold text-[#37352F] mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-[#787774]">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                Stuck Points
              </h4>
              <p className="text-[#37352F] leading-relaxed whitespace-pre-wrap pl-3.5 border-l-2 border-stone-100">
                {reflection.stuck}
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

