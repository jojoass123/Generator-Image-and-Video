"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Download,
  Share2,
  Heart,
  HeartOff,
  Copy,
  Shuffle,
  Play,
  MoreHorizontal,
  Eye,
  Folder,
  Star,
  Clock,
  ImageIcon,
  Video,
  ChevronLeft,
  Calendar,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

interface HistoryItem {
  id: string
  type: "image" | "video"
  url: string
  prompt: string
  model: string
  style: string
  timestamp: Date
  isFavorite: boolean
  tags: string[]
  aspectRatio: string
  resolution?: string
  duration?: number
}

const MOCK_HISTORY: HistoryItem[] = [
  {
    id: "1",
    type: "image",
    url: "/placeholder.svg?height=400&width=400&text=Cyberpunk+City",
    prompt: "A futuristic cyberpunk cityscape at night with neon lights reflecting on wet streets",
    model: "DALL-E 3",
    style: "Realistic",
    timestamp: new Date(2024, 0, 15),
    isFavorite: true,
    tags: ["cyberpunk", "city", "neon"],
    aspectRatio: "1:1",
    resolution: "1024x1024",
  },
  {
    id: "2",
    type: "video",
    url: "/placeholder.svg?height=300&width=400&text=Ocean+Waves",
    prompt: "Peaceful ocean waves crashing on a sandy beach during golden hour",
    model: "Runway ML",
    style: "Cinematic",
    timestamp: new Date(2024, 0, 14),
    isFavorite: false,
    tags: ["ocean", "beach", "waves"],
    aspectRatio: "16:9",
    duration: 5,
  },
  {
    id: "3",
    type: "image",
    url: "/placeholder.svg?height=300&width=300&text=Anime+Character",
    prompt: "Anime character with flowing hair in a magical forest setting",
    model: "Stable Diffusion XL",
    style: "Anime",
    timestamp: new Date(2024, 0, 13),
    isFavorite: false,
    tags: ["anime", "character", "forest"],
    aspectRatio: "1:1",
    resolution: "768x768",
  },
  {
    id: "4",
    type: "image",
    url: "/placeholder.svg?height=500&width=300&text=Abstract+Art",
    prompt: "Abstract geometric patterns with vibrant colors and flowing shapes",
    model: "FLUX Pro",
    style: "Abstract",
    timestamp: new Date(2024, 0, 12),
    isFavorite: true,
    tags: ["abstract", "geometric", "colorful"],
    aspectRatio: "3:4",
    resolution: "768x1024",
  },
]

export default function Redesigned3DHistory() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<"all" | "image" | "video">("all")
  const [selectedCollection, setSelectedCollection] = useState("all")
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [history, setHistory] = useState<HistoryItem[]>(MOCK_HISTORY)

  const filteredHistory = history.filter((item) => {
    const matchesSearch = searchQuery === "" || item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "all" || item.type === selectedType
    const matchesCollection =
      selectedCollection === "all" ||
      (selectedCollection === "favorites" && item.isFavorite) ||
      (selectedCollection === "recent" && new Date().getTime() - item.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000)
    return matchesSearch && matchesType && matchesCollection
  })

  const handleItemClick = (item: HistoryItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleToggleFavorite = (itemId: string) => {
    setHistory((prev) => prev.map((item) => (item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item)))
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 24) return `${diffInHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">My Generations</h2>
            <Link href="/explore">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-600">AI Generation History</p>
        </div>

        {/* Collections */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Collections
          </h3>
          <div className="space-y-1">
            <Button
              variant={selectedCollection === "all" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedCollection("all")}
            >
              All Generations ({history.length})
            </Button>
            <Button
              variant={selectedCollection === "favorites" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedCollection("favorites")}
            >
              <Star className="w-4 h-4 mr-2" />
              Favorites ({history.filter((item) => item.isFavorite).length})
            </Button>
            <Button
              variant={selectedCollection === "recent" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedCollection("recent")}
            >
              <Clock className="w-4 h-4 mr-2" />
              Recent (7)
            </Button>
            <Button
              variant={selectedCollection === "images" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedCollection("images")}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Images ({history.filter((item) => item.type === "image").length})
            </Button>
            <Button
              variant={selectedCollection === "videos" ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => setSelectedCollection("videos")}
            >
              <Video className="w-4 h-4 mr-2" />
              Videos ({history.filter((item) => item.type === "video").length})
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search generations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-8 text-sm bg-gray-50 border-gray-200"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as "all" | "image" | "video")}>
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="all">All ({filteredHistory.length})</TabsTrigger>
                  <TabsTrigger value="image">
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Images
                  </TabsTrigger>
                  <TabsTrigger value="video">
                    <Video className="w-4 h-4 mr-1" />
                    Videos
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="h-4 w-px bg-gray-300" />
              <Button variant="ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-gray-200 rounded-md">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
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

        {/* Content Area */}
        <div className="flex-1 p-6">
          {filteredHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto">
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">No generations found</p>
                  <p className="text-sm text-gray-600">Try adjusting your search or filters</p>
                </div>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {filteredHistory.map((item) => (
                <Card
                  key={item.id}
                  className="group overflow-hidden border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={item.url || "/placeholder.svg"}
                      alt={item.prompt}
                      className="w-full h-full object-cover"
                    />

                    {/* Type Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs">
                        {item.type === "image" ? "🖼️" : "🎬"}
                      </Badge>
                    </div>

                    {/* Favorite Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggleFavorite(item.id)
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

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button size="sm" variant="secondary" className="bg-white/90 text-gray-900">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-white/90 text-gray-900"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log("Download:", item.id)
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
                          navigator.clipboard.writeText(item.prompt)
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-3 space-y-2">
                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                      {item.prompt.length > 60 ? item.prompt.substring(0, 60) + "..." : item.prompt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formatTime(item.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        <span>{item.model}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                        {item.style}
                      </Badge>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHistory.map((item) => (
                <Card
                  key={item.id}
                  className="group p-4 border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.url || "/placeholder.svg"}
                        alt={item.prompt}
                        className="w-full h-full object-cover"
                      />
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{item.prompt}</p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatTime(item.timestamp)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {item.model}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.style}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleToggleFavorite(item.id)
                        }}
                      >
                        {item.isFavorite ? (
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                        ) : (
                          <HeartOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log("Download:", item.id)
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(item.prompt)
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{selectedItem.type === "image" ? "🖼️" : "🎬"}</span>
                    <span>Generated {selectedItem.type}</span>
                    <Badge variant="outline">{selectedItem.model}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleToggleFavorite(selectedItem.id)}>
                      {selectedItem.isFavorite ? (
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
                    {selectedItem.type === "image" ? (
                      <img
                        src={selectedItem.url || "/placeholder.svg"}
                        alt={selectedItem.prompt}
                        className="w-full h-auto max-h-[400px] object-contain"
                      />
                    ) : (
                      <div className="relative">
                        <img
                          src={selectedItem.url || "/placeholder.svg"}
                          alt={selectedItem.prompt}
                          className="w-full aspect-video object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Button size="lg" variant="secondary" className="bg-white/90 text-gray-900">
                            <Play className="w-6 h-6" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Prompt
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Shuffle className="w-4 h-4 mr-2" />
                      Remix
                    </Button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Prompt</h3>
                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedItem.prompt}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Created</h4>
                      <p className="text-sm text-gray-600">{selectedItem.timestamp.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Model</h4>
                      <p className="text-sm text-gray-600">{selectedItem.model}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Style</h4>
                      <p className="text-sm text-gray-600">{selectedItem.style}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Aspect Ratio</h4>
                      <p className="text-sm text-gray-600">{selectedItem.aspectRatio}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex gap-2 flex-wrap">
                      {selectedItem.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-gray-300 text-gray-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                    <Link href="/playground/redesigned-3d" className="flex-1">
                      <Button variant="outline" className="w-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Similar
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
