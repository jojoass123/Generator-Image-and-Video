"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageIcon, Video, ChevronLeft, Menu, Save } from "lucide-react"
import Link from "next/link"
import EnhancedPromptInput from "@/components/enhanced-prompt-input"
import ContentPreview from "@/components/content-preview"
import GenerationHistoryPanel from "@/components/generation-history-panel"
import PreferencesPanel, { type GenerationSettings } from "@/components/preferences-panel"

interface GeneratedContent {
  id: string
  type: "image" | "video"
  url: string
  prompt: string
  model: string
  style: string
  aspectRatio: string
  resolution?: string
  duration?: number
  generationTime: number
  seed?: string
  isFavorite: boolean
}

interface HistoryItem {
  id: string
  type: "image" | "video"
  url: string
  prompt: string
  model: string
  style: string
  timestamp: Date
  generationTime: number
  isFavorite: boolean
}

const DEFAULT_SETTINGS: GenerationSettings = {
  mediaType: "image",
  aspectRatio: "1:1",
  model: "auto",
  style: "realistic",
  resolution: "1024x1024",
  duration: 5,
  addVoiceover: false,
  addMusic: false,
  musicGenre: "Ambient",
  seed: "",
  promptStrength: [7.5],
  steps: [28],
}

export default function EnhancedPlayground() {
  const [activeTab, setActiveTab] = useState<"image" | "video">("image")
  const [prompt, setPrompt] = useState("")
  const [settings, setSettings] = useState<GenerationSettings>(DEFAULT_SETTINGS)
  const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [selectedHistoryItems, setSelectedHistoryItems] = useState<Set<string>>(new Set())
  const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false)
  const [isSettingsCollapsed, setIsSettingsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Update settings when tab changes
  useEffect(() => {
    setSettings((prev) => ({ ...prev, mediaType: activeTab }))
  }, [activeTab])

  // Simulate generation progress
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setGenerationProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            handleGenerationComplete()
            return 100
          }
          return prev + Math.random() * 15 + 5
        })
      }, 500)
      return () => clearInterval(interval)
    }
  }, [isGenerating])

  const handleGenerate = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setGenerationProgress(0)
    setCurrentContent(null)
  }

  const handleGenerationComplete = () => {
    const newContent: GeneratedContent = {
      id: Date.now().toString(),
      type: activeTab,
      url: `/placeholder.svg?height=512&width=512&text=${activeTab}+Generated`,
      prompt,
      model: settings.model === "auto" ? (activeTab === "image" ? "DALL-E 3" : "Runway ML") : settings.model,
      style: settings.style,
      aspectRatio: settings.aspectRatio,
      resolution: activeTab === "image" ? settings.resolution : undefined,
      duration: activeTab === "video" ? settings.duration : undefined,
      generationTime: Math.floor(Math.random() * 20) + 10,
      seed: settings.seed || Math.random().toString(36).substring(7),
      isFavorite: false,
    }

    const historyItem: HistoryItem = {
      id: newContent.id,
      type: newContent.type,
      url: newContent.url,
      prompt: newContent.prompt,
      model: newContent.model,
      style: newContent.style,
      timestamp: new Date(),
      generationTime: newContent.generationTime,
      isFavorite: false,
    }

    setCurrentContent(newContent)
    setHistory((prev) => [historyItem, ...prev])
    setIsGenerating(false)
    setGenerationProgress(0)
  }

  const handleCancel = () => {
    setIsGenerating(false)
    setGenerationProgress(0)
  }

  const handleRegenerate = () => {
    if (currentContent) {
      handleGenerate()
    }
  }

  const handleGenerateVariations = () => {
    if (currentContent) {
      // Generate variations with slight prompt modifications
      handleGenerate()
    }
  }

  const handleEditPrompt = () => {
    if (currentContent) {
      setPrompt(currentContent.prompt)
    }
  }

  const handleToggleFavorite = () => {
    if (currentContent) {
      setCurrentContent({ ...currentContent, isFavorite: !currentContent.isFavorite })
      setHistory((prev) =>
        prev.map((item) => (item.id === currentContent.id ? { ...item, isFavorite: !item.isFavorite } : item)),
      )
    }
  }

  const handleDownload = () => {
    if (currentContent) {
      console.log("Download:", currentContent.id)
    }
  }

  const handleShare = () => {
    if (currentContent) {
      console.log("Share:", currentContent.id)
    }
  }

  const handleHistoryItemSelect = (item: HistoryItem) => {
    const content: GeneratedContent = {
      id: item.id,
      type: item.type,
      url: item.url,
      prompt: item.prompt,
      model: item.model,
      style: item.style,
      aspectRatio: "1:1", // Default, could be stored in history
      generationTime: item.generationTime,
      isFavorite: item.isFavorite,
    }
    setCurrentContent(content)
    setPrompt(item.prompt)
  }

  const handleCopyPrompt = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.prompt)
    setPrompt(item.prompt)
  }

  const handleRegenerateFromHistory = (item: HistoryItem) => {
    setPrompt(item.prompt)
    handleGenerate()
  }

  const handleRemixFromHistory = (item: HistoryItem) => {
    setPrompt(item.prompt + ", creative variation")
    handleGenerate()
  }

  const handleDownloadFromHistory = (item: HistoryItem) => {
    console.log("Download from history:", item.id)
  }

  const handleDeleteFromHistory = (item: HistoryItem) => {
    setHistory((prev) => prev.filter((h) => h.id !== item.id))
    if (currentContent?.id === item.id) {
      setCurrentContent(null)
    }
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
              <div className="hidden md:block">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "image" | "video")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="image" className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Image
                    </TabsTrigger>
                    <TabsTrigger value="video" className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Video
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-gray-300 text-gray-700">
                Credits: 47
              </Badge>
              <Button variant="outline" size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Preset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
          {/* Left Sidebar - Settings */}
          <div className={`lg:col-span-3 space-y-6 ${isMobileMenuOpen ? "block" : "hidden lg:block"}`}>
            <PreferencesPanel
              settings={settings}
              onSettingsChange={setSettings}
              isCollapsed={isSettingsCollapsed}
              onToggleCollapse={() => setIsSettingsCollapsed(!isSettingsCollapsed)}
            />
            <GenerationHistoryPanel
              history={history}
              isCollapsed={isHistoryCollapsed}
              onToggleCollapse={() => setIsHistoryCollapsed(!isHistoryCollapsed)}
              onSelectItem={handleHistoryItemSelect}
              onCopyPrompt={handleCopyPrompt}
              onRegenerate={handleRegenerateFromHistory}
              onRemix={handleRemixFromHistory}
              onDownload={handleDownloadFromHistory}
              onDelete={handleDeleteFromHistory}
              selectedItems={selectedHistoryItems}
              onSelectItems={setSelectedHistoryItems}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Mobile Tab Selector */}
            <div className="md:hidden">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "image" | "video")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="image" className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Image
                  </TabsTrigger>
                  <TabsTrigger value="video" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Video
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Prompt Input */}
            <EnhancedPromptInput
              value={prompt}
              onChange={setPrompt}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              onCancel={handleCancel}
              mediaType={activeTab}
              generationProgress={generationProgress}
            />

            {/* Content Preview */}
            <ContentPreview
              content={currentContent}
              isLoading={isGenerating}
              onRegenerate={handleRegenerate}
              onGenerateVariations={handleGenerateVariations}
              onEditPrompt={handleEditPrompt}
              onToggleFavorite={handleToggleFavorite}
              onDownload={handleDownload}
              onShare={handleShare}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
