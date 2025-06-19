"use client"

import type React from "react"

import { useState, useEffect } from "react"
import SceneHierarchySidebar from "@/components/scene-hierarchy-sidebar"
import MainViewport from "@/components/main-viewport"
import PropertiesPanel from "@/components/properties-panel"

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

interface SceneItem {
  id: string
  name: string
  type: "camera" | "light" | "object" | "background" | "character" | "generation"
  icon: React.ReactNode
  visible: boolean
  children?: SceneItem[]
  metadata?: {
    model?: string
    style?: string
    timestamp?: Date
    prompt?: string
  }
}

const DEFAULT_SETTINGS = {
  mediaType: "image",
  aspectRatio: "1:1",
  model: "auto",
  style: "realistic",
  resolution: "1024x1024",
  duration: 5,
  cameraType: "perspective",
  promptStrength: 7.5,
  steps: 28,
  seed: "",
}

const MOCK_SCENE_ITEMS: SceneItem[] = [
  {
    id: "camera-1",
    name: "Main Camera",
    type: "camera",
    icon: <div className="w-4 h-4 bg-blue-500 rounded" />,
    visible: true,
  },
  {
    id: "lighting",
    name: "Lighting Setup",
    type: "light",
    icon: <div className="w-4 h-4 bg-yellow-500 rounded" />,
    visible: true,
    children: [
      {
        id: "dome-light",
        name: "Dome Light",
        type: "light",
        icon: <div className="w-4 h-4 bg-yellow-400 rounded" />,
        visible: true,
      },
      {
        id: "key-light",
        name: "Key Light",
        type: "light",
        icon: <div className="w-4 h-4 bg-yellow-400 rounded" />,
        visible: true,
      },
    ],
  },
]

export default function Redesigned3DPlayground() {
  const [activeTab, setActiveTab] = useState<"scene" | "assets" | "history">("scene")
  const [selectedItemId, setSelectedItemId] = useState<string>()
  const [sceneItems, setSceneItems] = useState<SceneItem[]>(MOCK_SCENE_ITEMS)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [currentContent, setCurrentContent] = useState<GeneratedContent | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [prompt, setPrompt] = useState("")

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
      type: settings.mediaType as "image" | "video",
      url: `/placeholder.svg?height=512&width=512&text=${settings.mediaType}+Generated`,
      prompt,
      model: settings.model === "auto" ? (settings.mediaType === "image" ? "DALL-E 3" : "Runway ML") : settings.model,
      style: settings.style,
      aspectRatio: settings.aspectRatio,
      resolution: settings.mediaType === "image" ? settings.resolution : undefined,
      duration: settings.mediaType === "video" ? settings.duration : undefined,
      generationTime: Math.floor(Math.random() * 20) + 10,
      seed: settings.seed || Math.random().toString(36).substring(7),
      isFavorite: false,
    }

    setCurrentContent(newContent)
    setIsGenerating(false)
    setGenerationProgress(0)

    // Add to scene hierarchy
    const newSceneItem: SceneItem = {
      id: newContent.id,
      name: prompt.substring(0, 30) + (prompt.length > 30 ? "..." : ""),
      type: "generation",
      icon: <div className="w-4 h-4 bg-green-500 rounded" />,
      visible: true,
      metadata: {
        model: newContent.model,
        style: newContent.style,
        timestamp: new Date(),
        prompt: newContent.prompt,
      },
    }

    setSceneItems((prev) => {
      const generationsIndex = prev.findIndex((item) => item.id === "generations")
      if (generationsIndex >= 0) {
        const updated = [...prev]
        updated[generationsIndex] = {
          ...updated[generationsIndex],
          children: [newSceneItem, ...(updated[generationsIndex].children || [])],
        }
        return updated
      } else {
        return [
          ...prev,
          {
            id: "generations",
            name: "Generated Content",
            type: "object",
            icon: <div className="w-4 h-4 bg-purple-500 rounded" />,
            visible: true,
            children: [newSceneItem],
          },
        ]
      }
    })
  }

  const handleCancel = () => {
    setIsGenerating(false)
    setGenerationProgress(0)
  }

  const handleItemSelect = (item: SceneItem) => {
    setSelectedItemId(item.id)
    if (item.metadata?.prompt) {
      setPrompt(item.metadata.prompt)
    }
  }

  const handleItemToggle = (itemId: string) => {
    const toggleVisibility = (items: SceneItem[]): SceneItem[] => {
      return items.map((item) => {
        if (item.id === itemId) {
          return { ...item, visible: !item.visible }
        }
        if (item.children) {
          return { ...item, children: toggleVisibility(item.children) }
        }
        return item
      })
    }
    setSceneItems(toggleVisibility(sceneItems))
  }

  const handleRegenerate = () => {
    if (currentContent) {
      handleGenerate()
    }
  }

  const handleGenerateVariations = () => {
    if (currentContent) {
      handleGenerate()
    }
  }

  const handleToggleFavorite = () => {
    if (currentContent) {
      setCurrentContent({ ...currentContent, isFavorite: !currentContent.isFavorite })
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

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Sidebar */}
      <SceneHierarchySidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sceneItems={sceneItems}
        onItemSelect={handleItemSelect}
        onItemToggle={handleItemToggle}
        selectedItemId={selectedItemId}
      />

      {/* Main Viewport */}
      <MainViewport
        currentContent={currentContent}
        isGenerating={isGenerating}
        generationProgress={generationProgress}
        prompt={prompt}
        onPromptChange={setPrompt}
        onGenerate={handleGenerate}
        onCancel={handleCancel}
        mediaType={settings.mediaType as "image" | "video"}
        onRegenerate={handleRegenerate}
        onGenerateVariations={handleGenerateVariations}
        onToggleFavorite={handleToggleFavorite}
        onDownload={handleDownload}
        onShare={handleShare}
      />

      {/* Right Properties Panel */}
      <PropertiesPanel
        selectedItem={selectedItemId}
        mediaType={settings.mediaType as "image" | "video"}
        settings={settings}
        onSettingsChange={setSettings}
      />
    </div>
  )
}
