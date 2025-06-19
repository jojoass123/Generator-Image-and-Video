"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Shuffle, Copy } from "lucide-react"

const EXAMPLE_PROMPTS = [
  {
    category: "Realistic",
    prompts: [
      "A neon-lit city at night, in watercolor style",
      "Portrait of an elderly man with kind eyes, natural lighting",
      "A cozy coffee shop on a rainy day, warm atmosphere",
      "Mountain landscape at sunrise, dramatic clouds",
    ],
  },
  {
    category: "Creative",
    prompts: [
      "A floating island with waterfalls in the sky",
      "Steampunk robot playing violin in Victorian garden",
      "Crystal cave with bioluminescent plants",
      "Time traveler's workshop filled with clockwork",
    ],
  },
  {
    category: "Artistic",
    prompts: [
      "Abstract representation of music in vibrant colors",
      "Minimalist geometric shapes, Bauhaus style",
      "Impressionist painting of a field of sunflowers",
      "Art nouveau poster design with flowing lines",
    ],
  },
]

interface PromptBuilderProps {
  onPromptSelect: (prompt: string) => void
}

export default function PromptBuilder({ onPromptSelect }: PromptBuilderProps) {
  const [selectedCategory, setSelectedCategory] = useState("Realistic")

  const getRandomPrompt = () => {
    const allPrompts = EXAMPLE_PROMPTS.flatMap((cat) => cat.prompts)
    const randomPrompt = allPrompts[Math.floor(Math.random() * allPrompts.length)]
    onPromptSelect(randomPrompt)
  }

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt)
    onPromptSelect(prompt)
  }

  return (
    <Card className="w-full border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-lg font-semibold text-gray-900">Prompt Inspiration</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={getRandomPrompt} className="text-gray-600">
            <Shuffle className="w-4 h-4 mr-1" />
            Random
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap">
          {EXAMPLE_PROMPTS.map((category) => (
            <Button
              key={category.category}
              variant={selectedCategory === category.category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.category)}
              className="text-xs"
            >
              {category.category}
            </Button>
          ))}
        </div>

        {/* Prompt Examples */}
        <div className="grid gap-2">
          {EXAMPLE_PROMPTS.find((cat) => cat.category === selectedCategory)?.prompts.map((prompt, index) => (
            <div
              key={index}
              className="group flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => copyPrompt(prompt)}
            >
              <span className="text-sm text-gray-700 flex-1">{prompt}</span>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500 text-center pt-2">
          Click any prompt to use it, or use it as inspiration for your own ideas
        </div>
      </CardContent>
    </Card>
  )
}
