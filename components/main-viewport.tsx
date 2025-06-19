"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Share2,
  Heart,
  HeartOff,
  Copy,
  RefreshCw,
  Shuffle,
  Send,
  Loader2,
  Sparkles,
  ImageIcon,
  Video,
  Plus,
  FileImage,
  FileVideo,
  Folder,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MainViewportProps {
  currentContent: any
  isGenerating: boolean
  generationProgress: number
  prompt: string
  onPromptChange: (prompt: string) => void
  onGenerate: () => void
  onCancel: () => void
  mediaType: "image" | "video"
  onRegenerate: () => void
  onGenerateVariations: () => void
  onToggleFavorite: () => void
  onDownload: () => void
  onShare: () => void
}

export default function MainViewport({
  currentContent,
  isGenerating,
  generationProgress,
  prompt,
  onPromptChange,
  onGenerate,
  onCancel,
  mediaType,
  onRegenerate,
  onGenerateVariations,
  onToggleFavorite,
  onDownload,
  onShare,
}: MainViewportProps) {
  const [zoom, setZoom] = useState(100)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleZoomIn = () => setZoom(Math.min(zoom + 25, 200))
  const handleZoomOut = () => setZoom(Math.max(zoom - 25, 25))
  const handleResetZoom = () => setZoom(100)

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <FileImage className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Folder className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <FileVideo className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-4 w-px bg-gray-300" />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium min-w-[60px] text-center">{zoom}%</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Export
            </Button>
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-medium">
                A
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                B
              </div>
            </div>
            <Button variant="outline" size="sm">
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Prompt Input Area */}
        <div className="bg-white border-b border-gray-200 p-6">
          <Card className="border-gray-200 shadow-sm">
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <Textarea
                    value={prompt}
                    onChange={(e) => onPromptChange(e.target.value)}
                    placeholder={`Describe your ${mediaType}... (⌘+Enter to generate)`}
                    disabled={isGenerating}
                    className="min-h-[80px] resize-none border-0 focus-visible:ring-0 text-base"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !isGenerating) {
                        e.preventDefault()
                        onGenerate()
                      }
                    }}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled={isGenerating}>
                        <Sparkles className="w-4 h-4 mr-1" />
                        Enhance
                      </Button>
                      <Button variant="outline" size="sm" disabled={isGenerating}>
                        <Shuffle className="w-4 h-4 mr-1" />
                        Random
                      </Button>
                    </div>
                    <span className="text-sm text-gray-500">{prompt.length}/500</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {isGenerating ? (
                    <Button onClick={onCancel} variant="outline" size="lg" className="h-12 w-12 p-0">
                      <Loader2 className="w-5 h-5 animate-spin" />
                    </Button>
                  ) : (
                    <Button
                      onClick={onGenerate}
                      disabled={!prompt.trim()}
                      size="lg"
                      className={cn(
                        "h-12 w-12 p-0",
                        prompt.trim() ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-200 cursor-not-allowed",
                      )}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Generating your {mediaType}...</span>
                    <span className="text-blue-600 font-medium">{Math.round(generationProgress)}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Viewport Area */}
        <div className="flex-1 p-6">
          <div className="h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {isGenerating ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">Creating your masterpiece...</p>
                    <p className="text-sm text-gray-600">This usually takes 10-30 seconds</p>
                  </div>
                </div>
              </div>
            ) : currentContent ? (
              <div className="h-full flex flex-col">
                {/* Content Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {currentContent.type === "image" ? "🖼️ Image" : "🎬 Video"}
                    </Badge>
                    <Badge variant="outline">{currentContent.model}</Badge>
                    <Badge variant="outline">{currentContent.style}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleFavorite}
                      className={cn("text-gray-500", currentContent.isFavorite && "text-red-500")}
                    >
                      {currentContent.isFavorite ? (
                        <Heart className="w-4 h-4 fill-current" />
                      ) : (
                        <HeartOff className="w-4 h-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onDownload}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onShare}>
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Content Display */}
                <div className="flex-1 relative bg-gray-50 flex items-center justify-center">
                  {currentContent.type === "image" ? (
                    <img
                      src={currentContent.url || "/placeholder.svg"}
                      alt={currentContent.prompt}
                      className="max-w-full max-h-full object-contain transition-transform duration-200"
                      style={{ transform: `scale(${zoom / 100})` }}
                    />
                  ) : (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        src={currentContent.url}
                        className="max-w-full max-h-full object-contain"
                        onTimeUpdate={() => {}}
                        onLoadedMetadata={() => {}}
                      />
                      <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={togglePlayPause}
                            className="text-white hover:bg-white/20"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <div className="flex-1 bg-white/30 rounded-full h-1">
                            <div className="bg-white rounded-full h-1 w-1/3" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={toggleMute}
                            className="text-white hover:bg-white/20"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center gap-3">
                    <Button onClick={onRegenerate} className="flex-1">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button variant="outline" onClick={onGenerateVariations} className="flex-1">
                      <Shuffle className="w-4 h-4 mr-2" />
                      Variations
                    </Button>
                    <Button variant="outline" onClick={() => navigator.clipboard.writeText(currentContent.prompt)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Prompt
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                    {mediaType === "image" ? (
                      <ImageIcon className="w-10 h-10 text-gray-400" />
                    ) : (
                      <Video className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-gray-900">Ready to create</p>
                    <p className="text-sm text-gray-600">Enter a prompt above to generate your first {mediaType}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Plus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Inspiration
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Brainwave 2.5</span>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <FileImage className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
