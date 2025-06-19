"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Copy,
  Download,
  Share2,
  Shuffle,
  FolderPlus,
  Heart,
  HeartOff,
  Play,
  Pause,
  Calendar,
  Sparkles,
  Settings,
  FileText,
} from "lucide-react"
import type { GenerationItem } from "./generation-card"

interface GenerationModalProps {
  item: GenerationItem | null
  isOpen: boolean
  onClose: () => void
  onDownload: (item: GenerationItem) => void
  onCopyPrompt: (item: GenerationItem) => void
  onRemix: (item: GenerationItem) => void
  onAddToCollection: (item: GenerationItem) => void
  onToggleFavorite: (item: GenerationItem) => void
  onUpdateNotes: (item: GenerationItem, notes: string) => void
}

export default function GenerationModal({
  item,
  isOpen,
  onClose,
  onDownload,
  onCopyPrompt,
  onRemix,
  onAddToCollection,
  onToggleFavorite,
  onUpdateNotes,
}: GenerationModalProps) {
  const [notes, setNotes] = useState(item?.notes || "")
  const [isPlaying, setIsPlaying] = useState(false)

  if (!item) return null

  const handleSaveNotes = () => {
    onUpdateNotes(item, notes)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{item.type === "image" ? "🖼️" : "🎬"}</span>
              <span>Generated {item.type}</span>
              <Badge variant="outline" className="border-gray-300 text-gray-600">
                {item.model}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(item)}
                className="text-gray-500 hover:text-red-500"
              >
                {item.isFavorite ? (
                  <Heart className="w-4 h-4 text-red-500 fill-current" />
                ) : (
                  <HeartOff className="w-4 h-4" />
                )}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
          {/* Media Preview */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              {item.type === "image" ? (
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.prompt}
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              ) : (
                <div className="relative">
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt={item.prompt}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-white/90 text-gray-900"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => onDownload(item)} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" onClick={() => onCopyPrompt(item)} className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Prompt
              </Button>
              <Button variant="outline" onClick={() => onRemix(item)} className="flex-1">
                <Shuffle className="w-4 h-4 mr-2" />
                Remix
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onAddToCollection(item)} className="flex-1">
                <FolderPlus className="w-4 h-4 mr-2" />
                Add to Collection
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Details Panel */}
          <div className="space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 mt-4">
                {/* Prompt */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Prompt
                  </h3>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed">{item.prompt}</p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Created
                    </h4>
                    <p className="text-sm text-gray-600">{formatDate(item.createdAt)}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Model
                    </h4>
                    <p className="text-sm text-gray-600">{item.model}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Tags</h4>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className="border-gray-300 text-gray-600">
                      {item.style}
                    </Badge>
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-gray-300 text-gray-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 mt-4">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Generation Settings
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Style</span>
                    <span className="text-sm font-medium text-gray-900">{item.style}</span>
                  </div>

                  {item.aspectRatio && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Aspect Ratio</span>
                      <span className="text-sm font-medium text-gray-900">{item.aspectRatio}</span>
                    </div>
                  )}

                  {item.resolution && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Resolution</span>
                      <span className="text-sm font-medium text-gray-900">{item.resolution}</span>
                    </div>
                  )}

                  {item.duration && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Duration</span>
                      <span className="text-sm font-medium text-gray-900">{item.duration}s</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-gray-600">Usage Count</span>
                    <span className="text-sm font-medium text-gray-900">{item.usageCount} times</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-4">
                <h3 className="font-medium text-gray-900">Private Notes</h3>
                <div className="space-y-3">
                  <Textarea
                    placeholder="Add your private notes about this generation..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[120px] resize-none border-gray-300 focus:border-gray-400"
                  />
                  <Button onClick={handleSaveNotes} size="sm">
                    Save Notes
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
