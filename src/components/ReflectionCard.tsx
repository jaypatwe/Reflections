import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Smile, Meh, Frown, Zap, Calendar, User, Users, Globe, Lock } from 'lucide-react'

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
  profiles?: {
    email: string
    full_name?: string
    username?: string
  }
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

export function ReflectionCard({ reflection }: { reflection: Reflection }) {
  const EmotionIcon = emotionIcons[reflection.emotion] || Meh
  const VisibilityIcon = visibilityIcons[reflection.visibility || (reflection.is_public ? 'public' : 'private')] || Lock

  // Logic: Show Full Name if available, otherwise Username, otherwise Email
  const displayName = reflection.profiles?.full_name || reflection.profiles?.username || reflection.profiles?.email || 'Anonymous'
  const displaySubtext = reflection.profiles?.username ? `@${reflection.profiles.username}` : ''

  return (
    <Card className="group h-auto w-full flex flex-col border border-[#E9E9E7] bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-200 rounded-xl overflow-hidden mb-6 break-inside-avoid">
      <CardHeader className="pb-4 space-y-4 bg-stone-50/50 border-b border-stone-100">
        {/* Author & Date Header */}
        <div className="flex justify-between items-start">
           <div className="flex items-center gap-3">
             <div className="h-9 w-9 rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center text-stone-400 shrink-0">
               <User className="h-5 w-5" />
             </div>
             <div className="flex flex-col min-w-0">
               <span className="text-sm font-semibold text-[#37352F] leading-tight truncate" title={displayName}>
                 {displayName}
               </span>
               <div className="flex items-center gap-1.5 text-[11px] text-[#9B9A97] mt-0.5">
                 <span>
                   {new Date(reflection.date).toLocaleDateString('en-US', {
                     weekday: 'short',
                     month: 'short',
                     day: 'numeric',
                   })}
                 </span>
                 <span>•</span>
                 <div className="flex items-center gap-1">
                   <VisibilityIcon className="w-3 h-3" />
                   <span className="capitalize">{reflection.visibility?.replace('_', ' ') || (reflection.is_public ? 'public' : 'private')}</span>
                 </div>
               </div>
             </div>
           </div>
           
           <div className="flex gap-1.5">
             <Badge variant="secondary" className="bg-white hover:bg-white text-stone-600 border border-stone-200 shadow-sm px-2 py-0.5 h-6 text-[10px] font-medium uppercase tracking-wide">
                <EmotionIcon className="w-3 h-3 mr-1" />
                {reflection.emotion}
             </Badge>
             <Badge variant="secondary" className="bg-white hover:bg-white text-stone-600 border border-stone-200 shadow-sm px-2 py-0.5 h-6 text-[10px] font-medium uppercase tracking-wide">
                Energy: {reflection.energy}
             </Badge>
           </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6 text-sm">
        {/* Went Well - Fluid Height */}
        <div>
          <h4 className="font-semibold text-[#37352F] mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-[#787774]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            Went Well
          </h4>
          <p className="text-[#37352F] leading-relaxed whitespace-pre-wrap pl-3.5 border-l-2 border-stone-100">
            {reflection.went_well}
          </p>
        </div>

        {/* Learned - Fluid Height */}
        <div>
          <h4 className="font-semibold text-[#37352F] mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-[#787774]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Learned
          </h4>
          <p className="text-[#37352F] leading-relaxed whitespace-pre-wrap pl-3.5 border-l-2 border-stone-100">
            {reflection.learned}
          </p>
        </div>

        {/* Stuck - Fluid Height */}
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
    </Card>
  )
}
