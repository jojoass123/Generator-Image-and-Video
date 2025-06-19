"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ImageIcon, Video, Download, Share2, Copy, ChevronLeft, Menu, Play, Film } from "lucide-react"
import Link from "next/link"
import PreferencesPanel, { type GenerationSettings } from "@/components/preferences-panel"
import PromptBuilder from "@/components/prompt-builder"
import GenerationInput from "@/components/generation-input"

interface GeneratedVideo {
  id: string
  url: string
  prompt: string
  timestamp: Date
  settings: GenerationSettings
}

const DEFAULT_SETTINGS: GenerationSettings = {
  mediaType: "video",
  aspectRatio: "16:9",
  model: "auto",
  style: "realistic",
  resolution: "1280x720",
  duration: 5,
  addVoiceover: false,
  addMusic: false,
  musicGenre: "Ambient",
  seed: "",
  promptStrength: [7.5],
  steps: [28],
}

export default function VideoPlayground() {
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS)
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true)
    setCurrentPrompt(prompt)

    // Simulate generation delay (longer for video)
    setTimeout(() => {
      const newVideos: GeneratedVideo[] = Array.from({ length: 2 }, (_, i) => ({
        id: `${Date.now()}-${i}`,
        url: `/placeholder.svg?height=360&width=640&text=Generated+Video+${i + 1}`,
        prompt,
        timestamp: new Date(),
        settings: { ...settings },
      }))

      setGeneratedVideos((prev) => [...newVideos, ...prev])
      setIsGenerating(false)
    }, 8000)
  }

  const handlePromptSelect = (prompt: string) => {
    setCurrentPrompt(prompt)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/explore" className="flex items-center text-gray-600 hover:text-gray-900">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Gallery
              </Link>
              <div className="hidden md:flex items-center space-x-1">
                <Link href="/playground/image">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Image
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="bg-gray-100 text-gray-900">
                  <Video className="w-4 h-4 mr-2" />
                  Video
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-gray-300 text-gray-700">
                Credits: 47
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                className="md:hidden"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Preferences */}
          <div className={`lg:col-span-3 space-y-6 ${isPanelCollapsed ? "hidden lg:block" : ""}`}>
            <PreferencesPanel
              settings={settings}
              onSettingsChange={setSettings}
              isCollapsed={isPanelCollapsed}
              onToggleCollapse={() => setIsPanelCollapsed(!isPanelCollapsed)}
            />
            {!isPanelCollapsed && <PromptBuilder onPromptSelect={handlePromptSelect} />}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Welcome Section */}
            {generatedVideos.length === 0 && !isGenerating && (
              <div className="text-center py-16">
                <div className="mb-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <Film className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">Bring Stories to Life</h1>
                  <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Create stunning videos from text descriptions. Add voiceovers, music, and customize every aspect of
                    your video generation.
                  </p>
                </div>
              </div>
            )}

            {/* Generation Status */}
            {isGenerating && (
              <div className="text-center py-8">
                <Card className="inline-block p-6 border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <p className="font-medium text-gray-900">Generating your video...</p>
                      <p className="text-sm text-gray-600">This may take 1-3 minutes</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Generated Videos */}
            {generatedVideos.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Generated Videos</h2>
                  <Button variant="outline" className="border-gray-300 text-gray-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>

                {generatedVideos
                  .reduce((acc, video, index) => {
                    const groupIndex = Math.floor(index / 2)
                    if (!acc[groupIndex]) {
                      acc[groupIndex] = []
                    }
                    acc[groupIndex].push(video)
                    return acc
                  }, [] as GeneratedVideo[][])
                  .map((group, groupIndex) => (
                    <div key={groupIndex} className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <Film className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 mb-1">{group[0].prompt}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{group[0].settings.model}</span>
                            <span>{group[0].settings.style}</span>
                            <span>{group[0].settings.duration}s</span>
                            <span>{group[0].timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {group.map((video) => (
                          <Card
                            key={video.id}
                            className="overflow-hidden border-gray-200 group hover:shadow-lg transition-shadow"
                          >
                            <div className="relative">
                              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={video.url || "/placeholder.svg"}
                                  alt={video.prompt}
                                  className="w-full aspect-video object-cover"
                                />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <Button size="lg" variant="secondary" className="bg-white/90 text-gray-900">
                                    <Play className="w-6 h-6" />
                                  </Button>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                                  <div className="text-sm text-white bg-black/50 px-2 py-1 rounded">
                                    {video.settings.duration}s • {video.settings.aspectRatio}
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="secondary" className="bg-white/90 text-gray-900">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="secondary" className="bg-white/90 text-gray-900">
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                    <Button size="sm" variant="secondary" className="bg-white/90 text-gray-900">
                                      <Share2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Generation Input - Fixed at bottom */}
            <div className="sticky bottom-6">
              <GenerationInput
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                value={currentPrompt}
                onChange={setCurrentPrompt}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
