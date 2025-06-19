"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  History,
  ChevronDown,
  ChevronUp,
  Play,
  Copy,
  RefreshCw,
  Shuffle,
  Download,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

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

interface GenerationHistoryPanelProps {
  history: HistoryItem[]
  isCollapsed: boolean
  onToggleCollapse: () => void
  onSelectItem: (item: HistoryItem) => void
  onCopyPrompt: (item: HistoryItem) => void
  onRegenerate: (item: HistoryItem) => void
  onRemix: (item: HistoryItem) => void
  onDownload: (item: HistoryItem) => void
  onDelete: (item: HistoryItem) => void
  selectedItems: Set<string>
  onSelectItems: (items: Set<string>) => void
}

export default function GenerationHistoryPanel({
  history,
  isCollapsed,
  onToggleCollapse,
  onSelectItem,
  onCopyPrompt,
  onRegenerate,
  onRemix,
  onDownload,
  onDelete,
  selectedItems,
  onSelectItems,
}: GenerationHistoryPanelProps) {
  const [showBatchActions, setShowBatchActions] = useState(false)

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const truncatePrompt = (prompt: string, maxLength = 60) => {
    return prompt.length > maxLength ? prompt.substring(0, maxLength) + "..." : prompt
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectItems(new Set(history.map((item) => item.id)))
    } else {
      onSelectItems(new Set())
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelection = new Set(selectedItems)
    if (checked) {
      newSelection.add(itemId)
    } else {
      newSelection.delete(itemId)
    }
    onSelectItems(newSelection)
  }

  const handleBatchDownload = () => {
    history.filter((item) => selectedItems.has(item.id)).forEach((item) => onDownload(item))
    onSelectItems(new Set())
  }

  const handleBatchDelete = () => {
    history.filter((item) => selectedItems.has(item.id)).forEach((item) => onDelete(item))
    onSelectItems(new Set())
  }

  if (isCollapsed) {
    return (
      <Card className="w-full border-gray-200 shadow-sm">
        <div className="p-4">
          <Button variant="ghost" onClick={onToggleCollapse} className="w-full justify-between text-left font-medium">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-gray-600" />
              <span>Generation History</span>
              <Badge variant="secondary" className="text-xs">
                {history.length}
              </Badge>
            </div>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="w-full border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">Generation History</h3>
            <Badge variant="secondary" className="text-xs">
              {history.length}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {selectedItems.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBatchActions(!showBatchActions)}
                className="text-blue-600"
              >
                {selectedItems.size} selected
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onToggleCollapse}>
              <ChevronUp className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Batch Actions */}
        {showBatchActions && selectedItems.size > 0 && (
          <div className="mt-3 flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <Button size="sm" variant="outline" onClick={handleBatchDownload}>
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
            <Button size="sm" variant="outline" onClick={handleBatchDelete} className="text-red-600">
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onSelectItems(new Set())}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-4 space-y-3">
          {/* Select All */}
          {history.length > 0 && (
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Checkbox
                checked={selectedItems.size === history.length && history.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Select all</span>
            </div>
          )}

          {/* History Items */}
          {history.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No generations yet</p>
              <p className="text-gray-400 text-xs">Your history will appear here</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer",
                  selectedItems.has(item.id) && "border-blue-500 bg-blue-50",
                )}
                onClick={() => onSelectItem(item)}
              >
                <Checkbox
                  checked={selectedItems.has(item.id)}
                  onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Thumbnail */}
                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.url || "/placeholder.svg"} alt={item.prompt} className="w-full h-full object-cover" />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="absolute top-1 right-1">
                    <Badge variant="secondary" className="text-xs px-1 py-0">
                      {item.type === "image" ? "🖼️" : "🎬"}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <p className="text-sm text-gray-900 line-clamp-2 leading-relaxed">{truncatePrompt(item.prompt)}</p>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{formatTime(item.timestamp)}</span>
                    <Clock className="w-3 h-3" />
                    <span>{item.generationTime}s</span>
                    <Sparkles className="w-3 h-3" />
                    <span>{item.model}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                      {item.style}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      onCopyPrompt(item)
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRegenerate(item)
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemix(item)
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Shuffle className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  )
}
