"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Crop,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Brush,
  Type,
  Download,
  Undo,
  Redo,
  RotateCcw,
  Palette,
  Sliders,
  Sparkles,
  Save,
  X,
  ZoomIn,
  ZoomOut,
  Move,
} from "lucide-react"

interface ImageEditorProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  originalPrompt: string
  onSave: (editedImageUrl: string, changes: any) => void
}

type Tool = "select" | "crop" | "brush" | "text" | "inpaint"
type Filter = "none" | "bw" | "sepia" | "glow" | "sketch" | "blur"

export default function ImageEditor({ isOpen, onClose, imageUrl, originalPrompt, onSave }: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [activeTool, setActiveTool] = useState<Tool>("select")
  const [zoom, setZoom] = useState(100)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Adjustments
  const [brightness, setBrightness] = useState(0)
  const [contrast, setContrast] = useState(0)
  const [saturation, setSaturation] = useState(0)
  const [sharpness, setSharpness] = useState(0)
  const [shadows, setShadows] = useState(0)
  const [highlights, setHighlights] = useState(0)
  const [warmth, setWarmth] = useState(0)

  // Crop settings
  const [cropAspectRatio, setCropAspectRatio] = useState("free")

  // Filter
  const [activeFilter, setActiveFilter] = useState<Filter>("none")

  // Inpainting
  const [inpaintPrompt, setInpaintPrompt] = useState(originalPrompt)
  const [isInpainting, setIsInpainting] = useState(false)

  const tools = [
    { id: "select", icon: Move, label: "Select", shortcut: "V" },
    { id: "crop", icon: Crop, label: "Crop", shortcut: "C" },
    { id: "brush", icon: Brush, label: "Brush", shortcut: "B" },
    { id: "text", icon: Type, label: "Text", shortcut: "T" },
    { id: "inpaint", icon: Sparkles, label: "AI Inpaint", shortcut: "I" },
  ]

  const aspectRatios = [
    { value: "free", label: "Free" },
    { value: "1:1", label: "Square (1:1)" },
    { value: "4:3", label: "Standard (4:3)" },
    { value: "16:9", label: "Widescreen (16:9)" },
    { value: "3:4", label: "Portrait (3:4)" },
    { value: "9:16", label: "Story (9:16)" },
  ]

  const filters = [
    { value: "none", label: "None" },
    { value: "bw", label: "Black & White" },
    { value: "sepia", label: "Sepia" },
    { value: "glow", label: "Glow" },
    { value: "sketch", label: "Sketch" },
    { value: "blur", label: "Dreamlike Blur" },
  ]

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
    }
  }, [historyIndex])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
    }
  }, [historyIndex, history.length])

  const handleRotate = (direction: "cw" | "ccw") => {
    console.log(`Rotate ${direction}`)
    // Implement rotation logic
  }

  const handleFlip = (direction: "horizontal" | "vertical") => {
    console.log(`Flip ${direction}`)
    // Implement flip logic
  }

  const handleInpaint = async () => {
    setIsInpainting(true)
    try {
      // Simulate AI inpainting
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Inpainting with prompt:", inpaintPrompt)
    } finally {
      setIsInpainting(false)
    }
  }

  const handleSave = () => {
    const changes = {
      brightness,
      contrast,
      saturation,
      sharpness,
      shadows,
      highlights,
      warmth,
      filter: activeFilter,
      cropAspectRatio,
    }
    onSave(imageUrl, changes)
    onClose()
  }

  const resetAdjustments = () => {
    setBrightness(0)
    setContrast(0)
    setSaturation(0)
    setSharpness(0)
    setShadows(0)
    setHighlights(0)
    setWarmth(0)
    setActiveFilter("none")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <div className="flex h-full">
          {/* Left Toolbar */}
          <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={activeTool === tool.id ? "default" : "ghost"}
                size="sm"
                className="w-10 h-10 p-0"
                onClick={() => setActiveTool(tool.id as Tool)}
                title={`${tool.label} (${tool.shortcut})`}
              >
                <tool.icon className="w-4 h-4" />
              </Button>
            ))}

            <Separator className="w-8" />

            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0"
              onClick={() => handleRotate("ccw")}
              title="Rotate Left"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0"
              onClick={() => handleRotate("cw")}
              title="Rotate Right"
            >
              <RotateCw className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0"
              onClick={() => handleFlip("horizontal")}
              title="Flip Horizontal"
            >
              <FlipHorizontal className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 p-0"
              onClick={() => handleFlip("vertical")}
              title="Flip Vertical"
            >
              <FlipVertical className="w-4 h-4" />
            </Button>
          </div>

          {/* Main Canvas Area */}
          <div className="flex-1 bg-gray-50 flex flex-col">
            {/* Top Toolbar */}
            <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <DialogHeader className="p-0">
                  <DialogTitle className="text-lg">Image Editor</DialogTitle>
                </DialogHeader>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleUndo} disabled={historyIndex <= 0}>
                    <Undo className="w-4 h-4 mr-1" />
                    Undo
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
                    <Redo className="w-4 h-4 mr-1" />
                    Redo
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(25, zoom - 25))}>
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium w-12 text-center">{zoom}%</span>
                  <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(400, zoom + 25))}>
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <Button variant="outline" size="sm" onClick={resetAdjustments}>
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

            {/* Canvas */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="relative bg-white rounded-lg shadow-lg">
                <canvas
                  ref={canvasRef}
                  className="max-w-full max-h-full"
                  style={{ transform: `scale(${zoom / 100})` }}
                />
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt="Editing"
                  className="max-w-full max-h-full"
                  style={{ transform: `scale(${zoom / 100})` }}
                />
              </div>
            </div>
          </div>

          {/* Right Properties Panel */}
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-6">
              {/* Crop Settings */}
              {activeTool === "crop" && (
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
              )}

              {/* AI Inpainting */}
              {activeTool === "inpaint" && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Inpainting
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Select area to regenerate, then adjust prompt:
                      </label>
                      <Textarea
                        value={inpaintPrompt}
                        onChange={(e) => setInpaintPrompt(e.target.value)}
                        placeholder="Describe what should replace the selected area..."
                        className="min-h-20"
                      />
                    </div>
                    <Button onClick={handleInpaint} disabled={isInpainting} className="w-full">
                      {isInpainting ? "Generating..." : "Apply Inpainting"}
                    </Button>
                  </div>
                </Card>
              )}

              {/* Adjustments */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3 flex items-center">
                  <Sliders className="w-4 h-4 mr-2" />
                  Adjustments
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Brightness</label>
                    <Slider
                      value={[brightness]}
                      onValueChange={(value) => setBrightness(value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{brightness}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Contrast</label>
                    <Slider
                      value={[contrast]}
                      onValueChange={(value) => setContrast(value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{contrast}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Saturation</label>
                    <Slider
                      value={[saturation]}
                      onValueChange={(value) => setSaturation(value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{saturation}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Sharpness</label>
                    <Slider
                      value={[sharpness]}
                      onValueChange={(value) => setSharpness(value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{sharpness}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Shadows</label>
                    <Slider
                      value={[shadows]}
                      onValueChange={(value) => setShadows(value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{shadows}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Highlights</label>
                    <Slider
                      value={[highlights]}
                      onValueChange={(value) => setHighlights(value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{highlights}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Warmth</label>
                    <Slider
                      value={[warmth]}
                      onValueChange={(value) => setWarmth(value[0])}
                      min={-100}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">{warmth}</div>
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
                      onClick={() => setActiveFilter(filter.value as Filter)}
                      className="text-xs"
                    >
                      {filter.label}
                    </Button>
                  ))}
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
                    Download as PNG
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Download as JPG
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Download as WebP
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Send to Playground
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
