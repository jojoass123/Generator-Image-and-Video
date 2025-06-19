"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, Palette, Camera, Layers, ImageIcon, Video, Sparkles, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface PropertiesPanelProps {
  selectedItem?: any
  mediaType: "image" | "video"
  settings: any
  onSettingsChange: (settings: any) => void
}

const MATERIAL_PRESETS = [
  { id: "metal", name: "Metal", color: "#8B9DC3" },
  { id: "wood", name: "Wood", color: "#D2691E" },
  { id: "plastic", name: "Plastic", color: "#2F2F2F" },
  { id: "glass", name: "Glass", color: "#000000" },
]

const STYLE_PRESETS = [
  { id: "realistic", name: "Realistic", thumbnail: "/placeholder.svg?height=60&width=80&text=Real" },
  { id: "anime", name: "Anime", thumbnail: "/placeholder.svg?height=60&width=80&text=Anime" },
  { id: "cinematic", name: "Cinematic", thumbnail: "/placeholder.svg?height=60&width=80&text=Cinema" },
  { id: "abstract", name: "Abstract", thumbnail: "/placeholder.svg?height=60&width=80&text=Abstract" },
]

export default function PropertiesPanel({ selectedItem, mediaType, settings, onSettingsChange }: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState("design")

  const updateSettings = (key: string, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header Tabs */}
      <div className="border-b border-gray-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 rounded-none h-12">
            <TabsTrigger value="design" className="rounded-none">
              Design
            </TabsTrigger>
            <TabsTrigger value="animation" className="rounded-none">
              Animation
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Materials Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Materials
                <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {MATERIAL_PRESETS.map((material) => (
                  <div
                    key={material.id}
                    className="aspect-square rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
                    style={{ backgroundColor: material.color }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Styles Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Styles
                <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {STYLE_PRESETS.map((style) => (
                  <div
                    key={style.id}
                    className={cn(
                      "relative rounded-lg border-2 cursor-pointer transition-colors overflow-hidden",
                      settings.style === style.id ? "border-blue-500" : "border-gray-200 hover:border-gray-300",
                    )}
                    onClick={() => updateSettings("style", style.id)}
                  >
                    <img
                      src={style.thumbnail || "/placeholder.svg"}
                      alt={style.name}
                      className="w-full aspect-[4/3] object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 text-center">
                      {style.name}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Background Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Background
                <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Color</Label>
                <div className="flex items-center gap-2">
                  <Input value="#F8F7F7" className="w-20 h-8 text-xs" />
                  <span className="text-sm text-gray-500">100%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Camera Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Camera
                <Button variant="ghost" size="sm" className="ml-auto h-6 w-6 p-0">
                  <Plus className="w-3 h-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={settings.cameraType === "isometric" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => updateSettings("cameraType", "isometric")}
                >
                  Isometric
                </Button>
                <Button
                  variant={settings.cameraType === "perspective" ? "default" : "outline"}
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => updateSettings("cameraType", "perspective")}
                >
                  Perspective
                </Button>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Distortion</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-gray-400 h-2 rounded-full" style={{ width: "0%" }} />
                    </div>
                    <span className="text-sm text-gray-500 w-8">0%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generation Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Generation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Media Type */}
              <div className="space-y-2">
                <Label className="text-sm">Media Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={mediaType === "image" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => updateSettings("mediaType", "image")}
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Image
                  </Button>
                  <Button
                    variant={mediaType === "video" ? "default" : "outline"}
                    size="sm"
                    className="flex-1"
                    onClick={() => updateSettings("mediaType", "video")}
                  >
                    <Video className="w-4 h-4 mr-1" />
                    Video
                  </Button>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <Label className="text-sm">Aspect Ratio</Label>
                <Select value={settings.aspectRatio} onValueChange={(value) => updateSettings("aspectRatio", value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">Square (1:1)</SelectItem>
                    <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                    <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                    <SelectItem value="21:9">Wide (21:9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Model */}
              <div className="space-y-2">
                <Label className="text-sm">AI Model</Label>
                <Select value={settings.model} onValueChange={(value) => updateSettings("model", value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">🤖 Auto (Recommended)</SelectItem>
                    {mediaType === "image" ? (
                      <>
                        <SelectItem value="dall-e-3">🎨 DALL·E 3</SelectItem>
                        <SelectItem value="stable-diffusion-xl">🎯 Stable Diffusion XL</SelectItem>
                        <SelectItem value="flux-pro">⚡ FLUX Pro</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="runway-ml">🎬 Runway ML</SelectItem>
                        <SelectItem value="pika-labs">🎭 Pika Labs</SelectItem>
                        <SelectItem value="stable-video">📹 Stable Video</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Resolution (Image) */}
              {mediaType === "image" && (
                <div className="space-y-2">
                  <Label className="text-sm">Resolution</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["512x512", "1024x1024", "1536x1536", "2048x2048"].map((res) => (
                      <Button
                        key={res}
                        variant={settings.resolution === res ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateSettings("resolution", res)}
                        className="text-xs"
                      >
                        {res}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration (Video) */}
              {mediaType === "video" && (
                <div className="space-y-2">
                  <Label className="text-sm">Duration: {settings.duration}s</Label>
                  <Slider
                    value={[settings.duration]}
                    onValueChange={(value) => updateSettings("duration", value[0])}
                    max={30}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                </div>
              )}

              {/* Advanced Settings */}
              <div className="space-y-3 pt-2 border-t border-gray-200">
                <div className="space-y-2">
                  <Label className="text-sm">Prompt Strength: {settings.promptStrength}</Label>
                  <Slider
                    value={[settings.promptStrength]}
                    onValueChange={(value) => updateSettings("promptStrength", value[0])}
                    max={20}
                    min={1}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Steps: {settings.steps}</Label>
                  <Slider
                    value={[settings.steps]}
                    onValueChange={(value) => updateSettings("steps", value[0])}
                    max={50}
                    min={10}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seed" className="text-sm">
                    Seed
                  </Label>
                  <Input
                    id="seed"
                    placeholder="Random"
                    value={settings.seed}
                    onChange={(e) => updateSettings("seed", e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  )
}
