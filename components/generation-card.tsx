"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  Download,
  Copy,
  Shuffle,
  FolderPlus,
  Trash2,
  Play,
  Calendar,
  Sparkles,
  Heart,
  HeartOff,
  Edit,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface GenerationItem {
  id: string
  type: "image" | "video"
  url: string
  prompt: string
  model: string
  style: string
  aspectRatio?: string
  resolution?: string
  duration?: number
  createdAt: Date
  tags: string[]
  isFavorite: boolean
  usageCount: number
  notes?: string
}

interface GenerationCardProps {
  item: GenerationItem
  onView: (item: GenerationItem) => void
  onDownload: (item: GenerationItem) => void
  onCopyPrompt: (item: GenerationItem) => void
  onRemix: (item: GenerationItem) => void
  onAddToCollection: (item: GenerationItem) => void
  onDelete: (item: GenerationItem) => void
  onToggleFavorite: (item: GenerationItem) => void
  isSelected?: boolean
  onSelect?: (item: GenerationItem, selected: boolean) => void
  onEdit: (item: GenerationItem) => void
}

export default function GenerationCard({
  item,
  onView,
  onDownload,
  onCopyPrompt,
  onRemix,
  onAddToCollection,
  onDelete,
  onToggleFavorite,
  isSelected = false,
  onSelect,
  onEdit,
}: GenerationCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const truncatePrompt = (prompt: string, maxLength = 100) => {
    return prompt.length > maxLength ? prompt.substring(0, maxLength) + "..." : prompt
  }

  return (
    <Card
      className={cn(
        "group overflow-hidden border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer",
        isSelected && "ring-2 ring-blue-500 border-blue-500",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onView(item)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-square bg-gray-100">
        <img src={item.url || "/placeholder.svg"} alt={item.prompt} className="w-full h-full object-cover" />

        {/* Type Icon */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
            {item.type === "image" ? "🖼️" : "🎬"}
          </Badge>
        </div>

        {/* Favorite Toggle */}
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white transition-opacity",
            isHovered ? "opacity-100" : "opacity-0",
          )}
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite(item)
          }}
        >
          {item.isFavorite ? (
            <Heart className="w-4 h-4 text-red-500 fill-current" />
          ) : (
            <HeartOff className="w-4 h-4 text-gray-500" />
          )}
        </Button>

        {/* Video Play Button */}
        {item.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
              <Play className="w-5 h-5 text-gray-700 ml-0.5" />
            </div>
          </div>
        )}

        {/* Selection Checkbox */}
        {onSelect && (
          <div className="absolute bottom-2 left-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation()
                onSelect(item, e.target.checked)
              }}
              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black/50 flex items-center justify-center space-x-2 transition-opacity",
            isHovered ? "opacity-100" : "opacity-0",
          )}
        >
          <Button size="sm" variant="secondary" className="bg-white/90 text-gray-900">
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 text-gray-900"
            onClick={(e) => {
              e.stopPropagation()
              onDownload(item)
            }}
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 text-gray-900"
            onClick={(e) => {
              e.stopPropagation()
              onRemix(item)
            }}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 text-gray-900"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(item)
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Prompt */}
        <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{truncatePrompt(item.prompt)}</p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            <span>{item.model}</span>
          </div>
        </div>

        {/* Tags and Style */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
              {item.style}
            </Badge>
            {item.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs border-gray-300 text-gray-600">
                {tag}
              </Badge>
            ))}
            {item.tags.length > 2 && (
              <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                +{item.tags.length - 2}
              </Badge>
            )}
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onView(item)}>
                <Eye className="w-4 h-4 mr-2" />
                View Full
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(item)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCopyPrompt(item)}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Prompt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRemix(item)}>
                <Shuffle className="w-4 h-4 mr-2" />
                Remix Prompt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(item)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAddToCollection(item)}>
                <FolderPlus className="w-4 h-4 mr-2" />
                Add to Collection
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(item)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Usage Count */}
        {item.usageCount > 0 && (
          <div className="text-xs text-gray-500">
            Used {item.usageCount} time{item.usageCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </Card>
  )
}
