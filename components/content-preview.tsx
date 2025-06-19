"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Share2,
  Heart,
  HeartOff,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  RefreshCw,
  Shuffle,
  Edit3,
  Sparkles,
  Copy,
} from "lucide-react"
import { cn } from "@/lib/utils"

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

interface ContentPreviewProps {
  content: GeneratedContent | null
  isLoading: boolean
  onRegenerate: () => void
  onGenerateVariations: () => void
  onEditPrompt: () => void
  onToggleFavorite: () => void
  onDownload: () => void
  onShare: () => void
}

export default function ContentPreview({
  content,
  isLoading,
  onRegenerate,
  onGenerateVariations,
  onEditPrompt,
  onToggleFavorite,
  onDownload,
  onShare,
}: ContentPreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState([50])
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (isLoading) {
    return (
      <Card className="w-full h-[600px] border-gray-200 shadow-lg bg-white">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-2">
              <p className="font-medium text-gray-900">Creating your masterpiece...</p>
              <p className="text-sm text-gray-600">This usually takes 10-30 seconds</p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  if (!content) {
    return (
      <Card className="w-full h-[600px] border-gray-200 shadow-lg bg-white">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
              <Sparkles className="w-10 h-10 text-gray-400" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-gray-900">Ready to create</p>
              <p className="text-sm text-gray-600">Enter a prompt above to generate your first creation</p>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full border-gray-200 shadow-lg bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {content.type === "image" ? "🖼️ Image" : "🎬 Video"}
            </Badge>
            <Badge variant="outline" className="border-gray-300 text-gray-600">
              {content.model}
            </Badge>
            <Badge variant="outline" className="border-gray-300 text-gray-600">
              {content.style}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleFavorite}
              className={cn("text-gray-500", content.isFavorite && "text-red-500")}
            >
              {content.isFavorite ? <Heart className="w-4 h-4 fill-current" /> : <HeartOff className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onDownload}>
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative bg-gray-50">
        {content.type === "image" ? (
          <div className="relative overflow-hidden" style={{ height: "500px" }}>
            <img
              src={content.url || "/placeholder.svg"}
              alt={content.prompt}
              className="w-full h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoom / 100})` }}
            />
            {/* Image Controls */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg p-2">
              <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoom <= 25}>
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium px-2">{zoom}%</span>
              <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleResetZoom}>
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative" style={{ height: "500px" }}>
            <video
              ref={videoRef}
              src={content.url}
              className="w-full h-full object-contain bg-black"
              onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
            />
            {/* Video Controls */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={togglePlayPause} className="text-white hover:bg-white/20">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-xs text-white">{formatTime(currentTime)}</span>
                  <div className="flex-1 bg-white/30 rounded-full h-1">
                    <div
                      className="bg-white rounded-full h-1 transition-all"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-white">{formatTime(duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={toggleMute} className="text-white hover:bg-white/20">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <div className="w-20">
                    <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Resolution:</span>
            <p className="font-medium text-gray-900">{content.resolution || content.aspectRatio}</p>
          </div>
          <div>
            <span className="text-gray-600">Generation Time:</span>
            <p className="font-medium text-gray-900">{content.generationTime}s</p>
          </div>
          {content.duration && (
            <div>
              <span className="text-gray-600">Duration:</span>
              <p className="font-medium text-gray-900">{content.duration}s</p>
            </div>
          )}
          {content.seed && (
            <div>
              <span className="text-gray-600">Seed:</span>
              <p className="font-medium text-gray-900">{content.seed}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4">
        <div className="flex items-center gap-3 flex-wrap">
          <Button onClick={onRegenerate} className="flex-1 min-w-[120px]">
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
          <Button variant="outline" onClick={onGenerateVariations} className="flex-1 min-w-[120px]">
            <Shuffle className="w-4 h-4 mr-2" />
            Variations
          </Button>
          <Button variant="outline" onClick={onEditPrompt} className="flex-1 min-w-[120px]">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Prompt
          </Button>
          <Button variant="outline" onClick={() => navigator.clipboard.writeText(content.prompt)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Prompt
          </Button>
        </div>
      </div>
    </Card>
  )
}
