"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Send, Loader2, Wand2, Lightbulb, X, Plus, Camera, Film, StopCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PromptSuggestion {
  text: string
  type: "style" | "quality" | "lighting" | "composition"
  category: string
}

interface EnhancedPromptInputProps {
  value: string
  onChange: (value: string) => void
  onGenerate: () => void
  isGenerating: boolean
  onCancel?: () => void
  mediaType: "image" | "video"
  generationProgress?: number
}

const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  { text: "highly detailed", type: "quality", category: "Quality" },
  { text: "8K resolution", type: "quality", category: "Quality" },
  { text: "professional photography", type: "quality", category: "Quality" },
  { text: "cinematic lighting", type: "lighting", category: "Lighting" },
  { text: "golden hour", type: "lighting", category: "Lighting" },
  { text: "dramatic shadows", type: "lighting", category: "Lighting" },
  { text: "rule of thirds", type: "composition", category: "Composition" },
  { text: "wide angle shot", type: "composition", category: "Composition" },
  { text: "photorealistic", type: "style", category: "Style" },
  { text: "artistic style", type: "style", category: "Style" },
  { text: "vibrant colors", type: "style", category: "Style" },
]

const QUICK_ENHANCERS = [
  { label: "✨ Enhance Quality", suffix: ", highly detailed, professional, 8K resolution" },
  { label: "🎨 Make Artistic", suffix: ", artistic style, creative composition, vibrant colors" },
  { label: "🎬 Cinematic", suffix: ", cinematic lighting, dramatic composition, film photography" },
  { label: "📸 Photorealistic", suffix: ", photorealistic, natural lighting, sharp focus" },
]

export default function EnhancedPromptInput({
  value,
  onChange,
  onGenerate,
  isGenerating,
  onCancel,
  mediaType,
  generationProgress = 0,
}: EnhancedPromptInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const wordCount = value.trim().split(/\s+/).filter(Boolean).length
  const charCount = value.length
  const maxChars = 500

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !isGenerating) {
      e.preventDefault()
      onGenerate()
    }
  }

  const addSuggestion = (suggestion: string) => {
    if (!value.toLowerCase().includes(suggestion.toLowerCase())) {
      const newValue = value ? `${value}, ${suggestion}` : suggestion
      onChange(newValue)
      setSelectedSuggestions([...selectedSuggestions, suggestion])
    }
  }

  const removeSuggestion = (suggestion: string) => {
    const newValue = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.toLowerCase() !== suggestion.toLowerCase())
      .join(", ")
    onChange(newValue)
    setSelectedSuggestions(selectedSuggestions.filter((s) => s !== suggestion))
  }

  const applyQuickEnhancer = (enhancer: { label: string; suffix: string }) => {
    const newValue = value + enhancer.suffix
    onChange(newValue)
  }

  const optimizePrompt = () => {
    // AI-powered prompt optimization (mock implementation)
    const optimizedPrompt = `${value}, masterpiece, best quality, ultra-detailed`
    onChange(optimizedPrompt)
  }

  return (
    <Card className="w-full border-gray-200 shadow-lg bg-white">
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {mediaType === "image" ? (
              <Camera className="w-5 h-5 text-blue-600" />
            ) : (
              <Film className="w-5 h-5 text-purple-600" />
            )}
            <h3 className="font-semibold text-gray-900">Describe your {mediaType === "image" ? "image" : "video"}</h3>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={optimizePrompt} disabled={isGenerating}>
              <Wand2 className="w-4 h-4 mr-1" />
              Optimize
            </Button>
            <Popover open={showSuggestions} onOpenChange={setShowSuggestions}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isGenerating}>
                  <Lightbulb className="w-4 h-4 mr-1" />
                  Suggestions
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Enhance your prompt</h4>
                  <div className="space-y-2">
                    {PROMPT_SUGGESTIONS.map((suggestion, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{suggestion.text}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => addSuggestion(suggestion.text)}
                          disabled={value.toLowerCase().includes(suggestion.text.toLowerCase())}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Prompt Input */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Describe your ${mediaType}... (⌘+Enter to generate)`}
            disabled={isGenerating}
            className="min-h-[120px] max-h-[200px] resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base leading-relaxed pr-16"
            maxLength={maxChars}
          />

          {/* Generate Button */}
          <div className="absolute bottom-3 right-3">
            {isGenerating ? (
              <div className="flex items-center gap-2">
                {onCancel && (
                  <Button size="sm" variant="outline" onClick={onCancel}>
                    <StopCircle className="w-4 h-4" />
                  </Button>
                )}
                <div className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">{Math.round(generationProgress)}%</span>
                </div>
              </div>
            ) : (
              <Button
                onClick={onGenerate}
                disabled={!value.trim() || isGenerating}
                size="lg"
                className={cn(
                  "h-12 px-6 rounded-lg shadow-lg transition-all",
                  value.trim()
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed",
                )}
              >
                <Send className="w-5 h-5 mr-2" />
                Generate
              </Button>
            )}
          </div>
        </div>

        {/* Stats and Quick Enhancers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{wordCount} words</span>
            <span>
              {charCount}/{maxChars} characters
            </span>
          </div>
          <div className="flex items-center gap-2">
            {QUICK_ENHANCERS.map((enhancer, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => applyQuickEnhancer(enhancer)}
                disabled={isGenerating}
                className="text-xs"
              >
                {enhancer.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Suggestions */}
        {selectedSuggestions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSuggestions.map((suggestion, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {suggestion}
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => removeSuggestion(suggestion)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Generation Progress */}
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Generating your {mediaType}...</span>
              <span className="text-blue-600 font-medium">{Math.round(generationProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
