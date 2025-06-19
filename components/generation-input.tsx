"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Sparkles, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const ROTATING_PLACEHOLDERS = [
  "A neon-lit city at night, in watercolor style",
  "Portrait of a wise old wizard with glowing eyes",
  "Cozy mountain cabin during a snowstorm",
  "Futuristic robot gardening in a greenhouse",
  "Abstract representation of music in vibrant colors",
]

interface GenerationInputProps {
  onGenerate: (prompt: string) => void
  isGenerating?: boolean
  value?: string
  onChange?: (value: string) => void
}

export default function GenerationInput({
  onGenerate,
  isGenerating = false,
  value = "",
  onChange,
}: GenerationInputProps) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)
  const [prompt, setPrompt] = useState(value)

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Sync with external value
  useEffect(() => {
    setPrompt(value)
  }, [value])

  const handleSubmit = () => {
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setPrompt(newValue)
    onChange?.(newValue)
  }

  return (
    <Card className="w-full border-gray-200 shadow-lg">
      <div className="p-6">
        <div className="space-y-4">
          {/* Input Field */}
          <div className="relative">
            <Textarea
              value={prompt}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={ROTATING_PLACEHOLDERS[currentPlaceholder]}
              disabled={isGenerating}
              className="min-h-[120px] resize-none border-gray-300 focus:border-gray-400 focus:ring-gray-400 text-base leading-relaxed pr-16"
            />
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isGenerating}
              size="lg"
              className={cn(
                "absolute bottom-3 right-3 h-12 w-12 p-0 rounded-full shadow-lg transition-all",
                prompt.trim() && !isGenerating
                  ? "bg-black hover:bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed",
              )}
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>

          {/* Helper Text */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Press Enter to generate, Shift+Enter for new line</span>
            </div>
            <span className="text-xs">{prompt.length}/500</span>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const enhancedPrompt = `${prompt}, highly detailed, professional photography, 8k resolution`
                setPrompt(enhancedPrompt)
                onChange?.(enhancedPrompt)
              }}
              disabled={isGenerating}
              className="text-xs"
            >
              ✨ Enhance Quality
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const artisticPrompt = `${prompt}, artistic style, creative composition, vibrant colors`
                setPrompt(artisticPrompt)
                onChange?.(artisticPrompt)
              }}
              disabled={isGenerating}
              className="text-xs"
            >
              🎨 Make Artistic
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const cinematicPrompt = `${prompt}, cinematic lighting, dramatic composition, film photography`
                setPrompt(cinematicPrompt)
                onChange?.(cinematicPrompt)
              }}
              disabled={isGenerating}
              className="text-xs"
            >
              🎬 Cinematic
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
