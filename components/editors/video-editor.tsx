"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Scissors,
  Crop,
  Type,
  Volume2,
  VolumeX,
  Download,
  Save,
  X,
  Palette,
  Clock,
  ImageIcon,
  Repeat,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoEditorProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  onSave: (editedVideoUrl: string, changes: any) => void
}

type VideoFilter = "none" | "vhs" | "glitch" | "cinematic" | "vintage"

export default function VideoEditor({ isOpen, onClose, videoUrl, onSave }: VideoEditorProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(100)
  const [isMuted, setIsMuted] = useState(false)

  // Editing settings
  const [trimStart, setTrimStart] = useState(0)
  const [trimEnd, setTrimEnd] = useState(100)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [cropAspectRatio, setCropAspectRatio] = useState("original")
  const [activeFilter, setActiveFilter] = useState<VideoFilter>("none")
  const [isLooping, setIsLooping] = useState(false)

  // Text overlay
  const [textOverlay, setTextOverlay] = useState("")
  const [textPosition, setTextPosition] = useState("bottom")
  const [textSize, setTextSize] = useState(24)

  const aspectRatios = [
    { value: "original", label: "Original" },
    { value: "1:1", label: "Square (1:1)" },
    { value: "16:9", label: "Widescreen (16:9)" },
    { value: "9:16", label: "Story (9:16)" },
    { value: "4:3", label: "Standard (4:3)" },
  ]

  const filters = [
    { value: "none", label: "None" },
    { value: "vhs", label: "VHS" },
    { value: "glitch", label: "Glitch" },
    { value: "cinematic", label: "Cinematic" },
    { value: "vintage", label: "Vintage Grain" },
  ]

  const speedOptions = [
    { value: 0.25, label: "0.25x" },
    { value: 0.5, label: "0.5x" },
    { value: 1, label: "1x" },
    { value: 1.5, label: "1.5x" },
    { value: 2, label: "2x" },
  ]

  const textPositions = [
    { value: "top", label: "Top" },
    { value: "center", label: "Center" },
    { value: "bottom", label: "Bottom" },
  ]

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
      setTrimEnd(videoRef.current.duration)
    }
  }

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed)
    if (videoRef.current) {
      videoRef.current.playbackRate = speed
    }
  }

  const exportFrame = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (ctx) {
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        ctx.drawImage(videoRef.current, 0, 0)

        // Create download link
        const link = document.createElement("a")
        link.download = `frame-${Math.floor(currentTime)}.png`
        link.href = canvas.toDataURL()
        link.click()
      }
    }
  }

  const handleSave = () => {
    const changes = {
      trimStart,
      trimEnd,
      playbackSpeed,
      cropAspectRatio,
      filter: activeFilter,
      textOverlay,
      textPosition,
      textSize,
      volume,
      isLooping,
    }
    onSave(videoUrl, changes)
    onClose()
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <div className="flex h-full">
          {/* Main Video Area */}
          <div className="flex-1 bg-gray-900 flex flex-col">
            {/* Top Toolbar */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <DialogHeader className="p-0">
                <DialogTitle className="text-lg">Video Editor</DialogTitle>
              </DialogHeader>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Reset
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Video Player */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="max-w-full max-h-full"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  loop={isLooping}
                />

                {/* Text Overlay Preview */}
                {textOverlay && (
                  <div
                    className={cn(
                      "absolute left-1/2 transform -translate-x-1/2 text-white font-bold px-4 py-2 bg-black/50 rounded",
                      textPosition === "top" && "top-4",
                      textPosition === "center" && "top-1/2 -translate-y-1/2",
                      textPosition === "bottom" && "bottom-4",
                    )}
                    style={{ fontSize: `${textSize}px` }}
                  >
                    {textOverlay}
                  </div>
                )}
              </div>
            </div>

            {/* Video Controls */}
            <div className="bg-white border-t border-gray-200 p-4">
              {/* Timeline */}
              <div className="mb-4">
                <div className="relative">
                  <Slider
                    value={[currentTime]}
                    onValueChange={(value) => handleSeek(value[0])}
                    max={duration}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center justify-center space-x-4">
                <Button variant="ghost" size="sm" onClick={() => handleSeek(Math.max(0, currentTime - 10))}>
                  <SkipBack className="w-4 h-4" />
                </Button>

                <Button variant="ghost" size="lg" onClick={handlePlayPause} className="w-12 h-12">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>

                <Button variant="ghost" size="sm" onClick={() => handleSeek(Math.min(duration, currentTime + 10))}>
                  <SkipForward className="w-4 h-4" />
                </Button>

                <div className="flex items-center space-x-2 ml-8">
                  <Button variant="ghost" size="sm" onClick={toggleMute}>
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Slider
                    value={[volume]}
                    onValueChange={(value) => handleVolumeChange(value[0])}
                    max={100}
                    className="w-20"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Properties Panel */}
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Trim Controls */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Scissors className="w-4 h-4 mr-2" />
                  Trim
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Start Time</label>
                    <Input
                      type="number"
                      value={trimStart}
                      onChange={(e) => setTrimStart(Number(e.target.value))}
                      min={0}
                      max={duration}
                      step={0.1}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">End Time</label>
                    <Input
                      type="number"
                      value={trimEnd}
                      onChange={(e) => setTrimEnd(Number(e.target.value))}
                      min={0}
                      max={duration}
                      step={0.1}
                    />
                  </div>
                </div>
              </Card>

              {/* Crop */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Crop className="w-4 h-4 mr-2" />
                  Crop
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Aspect Ratio</label>
                    <Select value={cropAspectRatio} onValueChange={setCropAspectRatio}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {aspectRatios.map((ratio) => (
                          <SelectItem key={ratio.value} value={ratio.value}>
                            {ratio.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Playback Speed */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Speed
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {speedOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={playbackSpeed === option.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSpeedChange(option.value)}
                      className="text-xs"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Text Overlay */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Type className="w-4 h-4 mr-2" />
                  Text Overlay
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Text</label>
                    <Textarea
                      value={textOverlay}
                      onChange={(e) => setTextOverlay(e.target.value)}
                      placeholder="Enter text to overlay..."
                      className="min-h-16"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Position</label>
                    <Select value={textPosition} onValueChange={setTextPosition}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {textPositions.map((pos) => (
                          <SelectItem key={pos.value} value={pos.value}>
                            {pos.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Size</label>
                    <Slider
                      value={[textSize]}
                      onValueChange={(value) => setTextSize(value[0])}
                      min={12}
                      max={48}
                      step={2}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{textSize}px</div>
                  </div>
                </div>
              </Card>

              {/* Filters */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Palette className="w-4 h-4 mr-2" />
                  Filters
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {filters.map((filter) => (
                    <Button
                      key={filter.value}
                      variant={activeFilter === filter.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(filter.value as VideoFilter)}
                      className="text-xs"
                    >
                      {filter.label}
                    </Button>
                  ))}
                </div>
              </Card>

              {/* Options */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Options</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Loop Video</label>
                    <Button
                      variant={isLooping ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsLooping(!isLooping)}
                    >
                      <Repeat className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Export Options */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Download as MP4
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Download as WebM
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Export as GIF
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={exportFrame}>
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Export Current Frame
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
