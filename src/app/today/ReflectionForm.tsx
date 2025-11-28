'use client'

import { submitReflection } from './actions'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from 'react'
import { toast } from 'sonner'
import { Smile, Meh, Frown, Zap, Globe, Lock, Users } from 'lucide-react'

const emotions = [
  { value: 'happy', label: 'Happy', icon: Smile },
  { value: 'neutral', label: 'Neutral', icon: Meh },
  { value: 'sad', label: 'Sad', icon: Frown },
  { value: 'energetic', label: 'Energetic', icon: Zap },
]

export default function ReflectionForm() {
  const [pending, setPending] = useState(false)
  const [energy, setEnergy] = useState(5)
  const [selectedEmotion, setSelectedEmotion] = useState('neutral')
  const [visibility, setVisibility] = useState('private')

  const handleSubmit = async (formData: FormData) => {
    setPending(true)
    formData.append('energy', energy.toString())
    formData.append('emotion', selectedEmotion)
    formData.append('visibility', visibility)
    
    const result = await submitReflection(formData)
    setPending(false)
    
    if (result?.error) {
      toast.error(result.error)
    } else if (result?.success) {
      toast.success('Reflection saved!')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border border-[#E9E9E7] shadow-[0_2px_8px_rgba(0,0,0,0.04)] bg-white rounded-xl overflow-hidden">
      <CardHeader className="bg-stone-50/50 border-b border-stone-100 pb-6 pt-8">
        <CardTitle className="font-serif text-3xl font-medium text-[#37352F]">Daily Reflection</CardTitle>
        <CardDescription className="text-[#787774] text-base mt-1">
          Take a moment to pause and reflect on your day.
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-8 p-8">
          <div className="space-y-3">
            <Label htmlFor="went_well" className="text-[#37352F] font-medium text-base">What went well today?</Label>
            <Textarea
              id="went_well"
              name="went_well"
              placeholder="Highlights, wins, or small moments of joy..."
              className="bg-stone-50/50 border-[#E9E9E7] focus:border-[#37352F]/20 focus:ring-0 min-h-[120px] resize-none text-[#37352F] placeholder:text-stone-400 rounded-lg p-4 transition-colors"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="learned" className="text-[#37352F] font-medium text-base">What did you learn?</Label>
            <Textarea
              id="learned"
              name="learned"
              placeholder="Insights, new skills, or realizations..."
              className="bg-stone-50/50 border-[#E9E9E7] focus:border-[#37352F]/20 focus:ring-0 min-h-[120px] resize-none text-[#37352F] placeholder:text-stone-400 rounded-lg p-4 transition-colors"
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="stuck" className="text-[#37352F] font-medium text-base">What got you stuck?</Label>
            <Textarea
              id="stuck"
              name="stuck"
              placeholder="Challenges, blockers, or things to improve..."
              className="bg-stone-50/50 border-[#E9E9E7] focus:border-[#37352F]/20 focus:ring-0 min-h-[120px] resize-none text-[#37352F] placeholder:text-stone-400 rounded-lg p-4 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-4">
              <Label className="text-[#37352F] font-medium text-base">How did you feel?</Label>
              <div className="flex gap-3">
                {emotions.map((e) => {
                  const Icon = e.icon
                  const isSelected = selectedEmotion === e.value
                  return (
                    <button
                      key={e.value}
                      type="button"
                      onClick={() => setSelectedEmotion(e.value)}
                      className={`p-3 rounded-xl border transition-all duration-200 ${
                        isSelected
                          ? 'bg-[#37352F] text-white border-[#37352F] shadow-md transform scale-105'
                          : 'bg-white text-[#787774] border-[#E9E9E7] hover:border-[#37352F]/30 hover:bg-stone-50'
                      }`}
                      title={e.label}
                    >
                      <Icon className="w-6 h-6" />
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-[#37352F] font-medium text-base">Energy Level: {energy}/10</Label>
              <div className="px-1 py-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#37352F]"
                />
                <div className="flex justify-between text-xs text-[#9B9A97] mt-2 font-medium uppercase tracking-wide">
                  <span>Drained</span>
                  <span>Energized</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 space-y-4">
            <Label className="text-[#37352F] font-medium text-base">Visibility</Label>
            <RadioGroup 
              defaultValue="private" 
              value={visibility} 
              onValueChange={setVisibility}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {[
                { val: 'private', icon: Lock, label: 'Private', sub: 'Only you' },
                { val: 'friends_only', icon: Users, label: 'Friends', sub: 'Your friends' },
                { val: 'public', icon: Globe, label: 'Public', sub: 'Everyone' },
              ].map((opt) => (
                <div key={opt.val}>
                  <RadioGroupItem value={opt.val} id={opt.val} className="peer sr-only" />
                  <Label
                    htmlFor={opt.val}
                    className="flex flex-col items-center justify-center text-center rounded-xl border-2 border-[#E9E9E7] bg-white p-4 hover:bg-stone-50 peer-data-[state=checked]:border-[#37352F] peer-data-[state=checked]:bg-stone-50/50 hover:cursor-pointer transition-all duration-200 h-full"
                  >
                    <opt.icon className="mb-2 h-5 w-5 text-[#787774] peer-data-[state=checked]:text-[#37352F]" />
                    <span className="text-sm font-semibold text-[#37352F]">{opt.label}</span>
                    <span className="text-xs text-[#9B9A97] mt-0.5">{opt.sub}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="p-6 bg-stone-50/50 border-t border-stone-100">
          <Button type="submit" className="w-full bg-[#37352F] hover:bg-[#2F2D28] text-white h-12 text-base font-medium rounded-lg shadow-sm transition-transform active:scale-[0.99]" disabled={pending}>
            {pending ? 'Saving Reflection...' : 'Save Reflection'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
