"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ImageIcon,
  Video,
  ChevronDown,
  ChevronUp,
  Settings,
  RotateCcw,
  Sparkles,
  Palette,
  Monitor,
  Clock,
  Volume2,
  Sliders,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface GenerationSettings {
  mediaType: "image" | "video"
  aspectRatio: string
  model: string
  style: string
  resolution: string
  duration: number
  addVoiceover: boolean
  addMusic: boolean
  musicGenre: string
  seed: string
  promptStrength: number[]
  steps: number[]
}

interface PreferencesPanelProps {
  settings: GenerationSettings
  onSettingsChange: (settings: GenerationSettings) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const STYLE_PRESETS = [
  { id: "realistic", name: "Realistic", icon: "📸" },
  { id: "anime", name: "Anime", icon: "🎌" },
  { id: "line-art", name: "Line Art", icon: "✏️" },
  { id: "cinematic", name: "Cinematic", icon: "🎬" },
  { id: "dreamlike", name: "Dreamlike", icon: "💭" },
  { id: "surreal", name: "Surreal", icon: "🌀" },
  { id: "3d-render", name: "3D Render", icon: "🎯" },
  { id: "watercolor", name: "Watercolor", icon: "🎨" },
]

const MUSIC_GENRES = ["Ambient", "Cinematic", "Electronic", "Classical", "Jazz", "Rock", "Pop", "Lo-fi"]

export default function PreferencesPanel({
  settings,
  onSettingsChange,
  isCollapsed = false,
  onToggleCollapse,
}: PreferencesPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateSettings = (updates: Partial<GenerationSettings>) => {
    onSettingsChange({ ...settings, ...updates })
  }

  const resetToDefaults = () => {
    const defaults: GenerationSettings = {
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
    onSettingsChange(defaults)
  }

  if (isCollapsed) {
    return (
      <Card className="w-full border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-600" />
              <CardTitle className="text-sm font-medium text-gray-900">Generation Settings</CardTitle>
              <Badge variant="outline" className="text-xs">
                {settings.mediaType === "image" ? "Image" : "Video"}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <CardTitle className="text-lg font-semibold text-gray-900">Generation Settings</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={resetToDefaults} className="text-gray-600">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            {onToggleCollapse && (
              <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="h-8 w-8 p-0">
                <ChevronUp className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Media Type Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Media Type
          </Label>
          <div className="flex gap-2">
            <Button
              variant={settings.mediaType === "image" ? "default" : "outline"}
              size="sm"
              onClick={() => updateSettings({ mediaType: "image" })}
              className="flex-1"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Image
            </Button>
            <Button
              variant={settings.mediaType === "video" ? "default" : "outline"}
              size="sm"
              onClick={() => updateSettings({ mediaType: "video" })}
              className="flex-1"
            >
              <Video className="w-4 h-4 mr-2" />
              Video
            </Button>
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Aspect Ratio
          </Label>
          <Select value={settings.aspectRatio} onValueChange={(value) => updateSettings({ aspectRatio: value })}>
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1:1">Square (1:1)</SelectItem>
              <SelectItem value="9:16">Portrait (9:16)</SelectItem>
              <SelectItem value="16:9">Landscape (16:9)</SelectItem>
              <SelectItem value="21:9">Wide (21:9)</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {settings.aspectRatio === "custom" && (
            <div className="flex gap-2 items-center">
              <Input placeholder="Width" className="flex-1" />
              <span className="text-gray-500">×</span>
              <Input placeholder="Height" className="flex-1" />
            </div>
          )}
        </div>

        {/* Model Selector */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI Model
          </Label>
          <Select value={settings.model} onValueChange={(value) => updateSettings({ model: value })}>
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">🤖 Auto (Recommended)</SelectItem>
              {settings.mediaType === "image" ? (
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

        {/* Style Preset */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Style Preset
          </Label>
          <div className="flex flex-wrap gap-2">
            {STYLE_PRESETS.map((style) => (
              <Button
                key={style.id}
                variant={settings.style === style.id ? "default" : "outline"}
                size="sm"
                onClick={() => updateSettings({ style: style.id })}
                className="text-xs"
              >
                <span className="mr-1">{style.icon}</span>
                {style.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Resolution (Image only) */}
        {settings.mediaType === "image" && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              Resolution
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {["512x512", "768x768", "1024x1024", "2048x2048"].map((res) => (
                <Button
                  key={res}
                  variant={settings.resolution === res ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSettings({ resolution: res })}
                  className="text-xs"
                >
                  {res}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Duration (Video only) */}
        {settings.mediaType === "video" && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Duration: {settings.duration}s
            </Label>
            <Slider
              value={[settings.duration]}
              onValueChange={(value) => updateSettings({ duration: value[0] })}
              max={30}
              min={5}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5s</span>
              <span>15s</span>
              <span>30s</span>
            </div>
          </div>
        )}

        {/* Audio Settings (Video only) */}
        {settings.mediaType === "video" && (
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Audio Settings
            </Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="voiceover" className="text-sm text-gray-700">
                  Add AI Voiceover
                </Label>
                <Switch
                  id="voiceover"
                  checked={settings.addVoiceover}
                  onCheckedChange={(checked) => updateSettings({ addVoiceover: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="music" className="text-sm text-gray-700">
                  Add Background Music
                </Label>
                <Switch
                  id="music"
                  checked={settings.addMusic}
                  onCheckedChange={(checked) => updateSettings({ addMusic: checked })}
                />
              </div>
              {settings.addMusic && (
                <Select value={settings.musicGenre} onValueChange={(value) => updateSettings({ musicGenre: value })}>
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Select music genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {MUSIC_GENRES.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}

        {/* Advanced Options */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Sliders className="w-4 h-4" />
                Advanced Options
              </span>
              <ChevronDown className={cn("w-4 h-4 transition-transform", showAdvanced && "rotate-180")} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label htmlFor="seed" className="text-sm font-medium text-gray-700">
                Seed (for reproducible results)
              </Label>
              <Input
                id="seed"
                placeholder="Leave empty for random"
                value={settings.seed}
                onChange={(e) => updateSettings({ seed: e.target.value })}
                className="bg-white border-gray-300"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Prompt Strength: {settings.promptStrength[0]}</Label>
              <Slider
                value={settings.promptStrength}
                onValueChange={(value) => updateSettings({ promptStrength: value })}
                max={20}
                min={1}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">Generation Steps: {settings.steps[0]}</Label>
              <Slider
                value={settings.steps}
                onValueChange={(value) => updateSettings({ steps: value })}
                max={50}
                min={10}
                step={5}
                className="w-full"
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
